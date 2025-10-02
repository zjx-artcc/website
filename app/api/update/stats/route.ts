import prisma from "@/lib/db";
import {revalidatePath} from "next/cache";
import {User} from "next-auth";
import {ControllerLogMonth} from "@prisma/client";
import {updateSyncTime} from "@/actions/lib/sync";
import { isEventMode, setAllSectors, getCenterSectorId } from "@/actions/centerSplit";
import { number } from "zod";
import { getPrefixes } from '@/actions/statisticsPrefixes';
import { getRosteredCids } from '@/actions/user';

export const dynamic = 'force-dynamic';

export async function GET() {
    const prefixes = await getPrefixes();
    const cids = await getRosteredCids();

    const params: URLSearchParams = new URLSearchParams()
    params.append('from', new Date(Date.now() - 86400000).toLocaleDateString())
    params.append('to', new Date(Date.now()).toLocaleDateString())

    const sessions: StatsimSession[] = await (await fetch('https://api.statsim.net/api/atcsessions/dates?' + params, {next: {revalidate: 3600}})).json()
    console.log(prefixes)
    console.log(cids)
    for (let session of sessions) {
        if (prefixes?.indexOf(session.callsign.substring(0, 2)) != -1 && cids.indexOf(session.vatsimid) != -1) {
            console.log(session)
            console.log('add')
            await prisma.controllerPosition.upsert({
                create: {
                    id: session.id.toString(),
                    logId: session.id.toString(),
                    position: session.callsign,
                    start: session.loggedOn,
                    end: session.loggedOff,
                    active: false,
                    facility: getFacilityLevel(session.callsign.substring(session.callsign.length - 4, session.callsign.length - 1))
                },
                update: {
                    id: session.id.toString(),
                    logId: session.id.toString(),
                    position: session.callsign,
                    start: session.loggedOn,
                    end: session.loggedOff,
                    active: false,
                    facility: getFacilityLevel(session.callsign.substring(session.callsign.length - 4, session.callsign.length - 1))
                },
                where: {
                    id: session.id.toString()
                }
            })
        }
    }

    

    /*
    const currentCenterControllers = await prisma.controllerPosition.findMany({where: {facility: 6, active: true}})

     Update center split
    if (!(await isEventMode()).eventMode) {
        if (currentCenterControllers.length == 0) {
            await setAllSectors(null)
        } else {
            // check if current controllers have same sectorid (good for students/ins)
            let uniqueIds: number[] = []

            currentCenterControllers.map(async(data, i) => {
                const position = await getCenterSectorId(data.position)

                console.log(position)

                if (position && uniqueIds.indexOf(position) == -1) {
                    console.log('pushed ' + position)
                    uniqueIds.push(position)
                }
            })

            console.log(uniqueIds.length)
            if (uniqueIds.length == 1) {
                await setAllSectors(uniqueIds[0])
            }
        }
    }*/

    await updateSyncTime({stats: new Date(),});

    revalidatePath('/', 'layout');

    return Response.json({ok: true,});
}

const fetchVatsimControllerData = async () => {
    const res = await fetch('https://data.vatsim.net/v3/vatsim-data.json', {
        cache: "no-store",
    });
    const data: {
        cid: number,
        callsign: string,
        facility: number,
        frequency: string,
        last_updated: string,
        logon_time: string,
    }[] = (await res.json()).controllers;
    return data.filter((controller) => !controller.frequency.startsWith('199'));
}

const getHoursControlledSinceLastUpdate = (now: Date, then: Date) => {
    return (now.getTime() - then.getTime()) / 1000 / 60 / 60;
}

const addHours = async (controller: User, facility: string, hours: number, prevLogMonth?: ControllerLogMonth,) => {

    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();

    await prisma.controllerLogMonth.upsert({
        create: {
            month,
            year,
            deliveryHours: facility === 'DEL' ? hours : 0,
            groundHours: facility === 'GND' ? hours : 0,
            towerHours: facility === 'TWR' ? hours : 0,
            approachHours: facility === 'APP' ? hours : 0,
            centerHours: facility === 'CTR' ? hours : 0,
            log: {
                connectOrCreate: {
                    create: {
                        userId: controller.id,
                    },
                    where: {
                        userId: controller.id,
                    },
                },
            },
        },
        update: {
            deliveryHours: (prevLogMonth?.deliveryHours || 0) + (facility === 'DEL' ? hours : 0),
            groundHours: (prevLogMonth?.groundHours || 0) + (facility === 'GND' ? hours : 0),
            towerHours: (prevLogMonth?.towerHours || 0) + (facility === 'TWR' ? hours : 0),
            approachHours: (prevLogMonth?.approachHours || 0) + (facility === 'APP' ? hours : 0),
            centerHours: (prevLogMonth?.centerHours || 0) + (facility === 'CTR' ? hours : 0),
        },
        where: {
            logId_month_year: {
                logId: prevLogMonth?.logId || '',
                month,
                year,
            },
        },
    });
}

const getFacilityType = (facility: number) => {
    switch (facility) {
        case 0:
            return 'OBS';
        case 1:
            return 'FSS';
        case 2:
            return 'DEL';
        case 3:
            return 'GND';
        case 4:
            return 'TWR';
        case 5:
            return 'APP';
        case 6:
            return 'CTR';
        default:
            return 'UNK';
    }
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
            return 6;
        case 'CTR':
            return 7;
        default:
            return 0;
    }
}

interface StatsimSession {
    id: number,
    callsign: string
    vatsimid: string
    loggedOn: string
    loggedOff: string
}