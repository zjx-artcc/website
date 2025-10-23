'use server'

import prisma from '@/lib/db';
import { updateSyncTime } from './lib/sync';
import { getPrefixes } from './statisticsPrefixes';
import { getRosteredCids } from './user';
import { getRating } from '@/lib/vatsim';
import { ControllerPosition } from '@prisma/client';
import { User } from 'next-auth';
import { log } from './log';

export async function getAndComputeStats(from: Date, to: Date, user?: User) {
    if (from.getTime() > to.getTime()) {
        return;
    }

    if (user) {
        log("UPDATE", "STATISTICS_MANUAL_UPDATE", `Manual stats update requested by ${user.firstName} ${user.lastName} (${user.cid}) from ${from.toISOString()} to ${to.toISOString()}`);
    } else {
        log("UPDATE", "STATISTICS_AUTO_UPDATE", `Automatic stats update requested by System from ${from.toISOString()} to ${to.toISOString()}`);
    }
    const params: URLSearchParams = new URLSearchParams()

    params.append('from', from.toLocaleDateString())
    params.append('to', to.toLocaleDateString())

    const prefixes = await getPrefixes();
    const cids = await getRosteredCids();

    const sessions: StatsimSession[] = await (await fetch('https://api.statsim.net/api/atcsessions/dates?' + params, {next: {revalidate: 3600}})).json()

    for (let session of sessions) {
        if (isInPrefixes(prefixes, session.callsign) && cids.has(session.vatsimid)) {
            const loggedOnDate = new Date(session.loggedOn)

            const logId = await getLogIdFromCid(session.vatsimid)
            const facilityLevel = getFacilityLevel(session.callsign.substring(session.callsign.length - 3, session.callsign.length))

            if (!logId) {
                continue
            }

            await prisma.controllerPosition.upsert({        
                where: {
                    id: session.id.toString()
                },
                update: {
                    id: session.id.toString(),
                    logId: logId,
                    position: session.callsign,
                    start: session.loggedOn,
                    end: session.loggedOff,
                    active: false,
                    facility: facilityLevel
                },
                create: {
                    id: session.id.toString(),
                    logId: logId,
                    position: session.callsign,
                    start: session.loggedOn,
                    end: session.loggedOff,
                    active: false,
                    facility: facilityLevel
                }
            })
            
            await createAndComputeHours(logId, loggedOnDate.getMonth(), loggedOnDate.getFullYear())
        }
    }

    await updateSyncTime({stats: new Date(),});
}

const getFacilityLevel = (facility: string) => {
    switch (facility) {
        case 'OBS':
            return 0;
        case 'FSS':
            return 1;
        case 'DEL':
            return 2;
        case 'GND':
            return 3;
        case 'TWR':
            return 4;
        case 'APP':
            return 5;
        case 'CTR':
            return 6;
        default:
            return 0;
    }
}

async function createAndComputeHours(logId: string, month: number, year: number) {
    const hours = await getControllerSessionsFromMonth(logId, month, year)

    // Initialize hour variables
    let deliveryHours = 0
    let groundHours = 0
    let towerHours = 0
    let appHours = 0
    let ctrHours = 0

    // Compute hour varialbes
    for (let session of hours) {
        const duration = (session.end.getTime() - session.start.getTime()) / 1000 / 3600

        switch(session.facility) {
            case 2:
                deliveryHours += duration
                break
            case 3:
                groundHours += duration
                break
            case 4:
                towerHours += duration
                break
            case 5:
                appHours += duration
                break
            case 6:
                ctrHours += duration
                break
            default:
                break
        }
    }

    // Total stats
    await updateStatsInDatabase(
        logId, month, year, deliveryHours, groundHours, towerHours, appHours, ctrHours
    )
}

async function getControllerSessionsFromMonth(logId: string, month: number, year: number) {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    const hours: ControllerPosition[] = await prisma.controllerPosition.findMany({
        where: {
            logId: logId,
            start: {
                gte: firstDayOfMonth,
                lte: lastDayOfMonth
            }
        }
    })

    return hours
}

async function updateStatsInDatabase(logId: string, month: number, year: number, deliveryHours: number, groundHours: number, towerHours: number, appHours: number, ctrHours: number) {
    await prisma.controllerLogMonth.upsert({
        create: {
            logId: logId,
            month: month,
            year: year,
            deliveryHours: deliveryHours,
            groundHours: groundHours,
            towerHours: towerHours,
            approachHours: appHours,
            centerHours: ctrHours,
        },
        update: {
            deliveryHours: deliveryHours,
            groundHours: groundHours,
            towerHours: towerHours,
            approachHours: appHours,
            centerHours: ctrHours,
        },
        where: {
            logId_month_year: {
                logId: logId,
                month: month,
                year: year,
            },
        }
    })
}

async function getLogIdFromCid(vatsimid: string) {
    const user = await prisma.user.findFirst({
        select: {
            id: true,
            log: true
        },
        where: {
            cid: vatsimid
        }
    }
    )
    
    if (!user) {
        return null;
    }

    if (!user.log) {
        const log = await prisma.controllerLog.create({
            data: {
                userId: vatsimid
            }
        })

        user.log = log
    }

    return user.log.id
}

export async function getOnlineControllers() {
    const prefixes = await getPrefixes();
    const controllers = await fetchVatsimControllerData()
    const filteredControllers = controllers.filter((controller) => isInPrefixes(prefixes, controller.callsign))
    const sessions: ParsedControllerSession[] = []

    for (let controller of filteredControllers) {
        const user = await prisma.user.findFirst({where: {
            cid: controller.cid.toString()
        }})

        if (!user) {
            sessions.push({
                cid: controller.cid,
                callsign: controller.callsign,
                facility: controller.facility,
                frequency: controller.frequency,
                start: new Date(controller.logon_time),
                firstName: `Unknown User (${controller.cid})`,
                lastName: '',
                controllerRating: 'Unknown Rating'
            })

            continue
        }
        
        sessions.push({
            cid: controller.cid,
            callsign: controller.callsign,
            facility: controller.facility,
            frequency: controller.frequency,
            start: new Date(controller.logon_time),
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            controllerRating: getRating(user.rating)
        })
    }

    return sessions
}

function isInPrefixes(prefixes: Set<string>, callsign: string) {
    return prefixes.has(callsign.substring(0, 3));
}

const fetchVatsimControllerData = async () => {
    const res = await fetch('https://data.vatsim.net/v3/vatsim-data.json', {
        next: {
            revalidate: 120
        }
    });
    const data: VatsimSession[] = (await res.json()).controllers;
    return data.filter((controller) => !controller.frequency.startsWith('199'));
}

interface VatsimSession {
    cid: number,
    callsign: string,
    facility: number,
    frequency: string,
    last_updated: string,
    logon_time: string
}

interface ParsedControllerSession {
    cid: number,
    callsign: string,
    facility: number,
    frequency: string,
    start: Date
    firstName: string
    lastName: string
    controllerRating: string
}

interface StatsimSession {
    id: number,
    callsign: string
    vatsimid: string
    loggedOn: string
    loggedOff: string
}