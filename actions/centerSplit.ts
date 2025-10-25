'use server'

import prisma from "@/lib/db"
import { CenterSectors } from "@prisma/client"
import { authOptions } from "@/auth/auth"
import { getServerSession, Session } from "next-auth"
import { SectorData } from "@/types/centerSplit.type"
import { ParsedControllerSession } from './statistics'

export const getSplitData = async(): Promise<CenterSectors[]> => {
    return await prisma.centerSectors.findMany({orderBy: {sectorId: 'asc'}})
}

export const updateSplitData = async(sectors: Map<number, SectorData>): Promise<boolean> => {
    const session = await getServerSession(authOptions);

    if ((await isEventMode()).eventMode && !(await canEditEvent())) {
        return false
    }

    if ((session?.user.rating && session?.user.rating >= 5) || session?.user.roles.includes('STAFF') ) {
        sectors.forEach(async(data, key) => {
            if (key < 100) {

                await prisma.centerSectors.upsert({
                    create: {
                        sectorId: key,
                        activeSectorId: data.activeSectorId || null
                    },
                    update: {
                        activeSectorId: data.activeSectorId || null
                    },
                    where: {
                        sectorId: key
                    }
                })
            } 
        })
    }

    return true
}

export const canEditEvent = async(): Promise<boolean> => {
    const session = await getServerSession(authOptions)

    const data = process.env.NODE_ENV == 'development' || session && (session.user.rating >= 2 && ((session.user.roles.includes('CONTROLLER')) || session.user.roles.includes('EVENT_STAFF') || session.user.staffPositions.includes('AWM') || session.user.staffPositions.includes('WM')))
    return data ? true : false
}

export const isEventMode = async(): Promise<EventModeData> => {
    // cleans up eventmodes
    await prisma.eventMode.deleteMany({
        where: {
            until: {
                lt: new Date()
            }
        }
    })

    const eventModes = await prisma.eventMode.findMany({
        where: {
            until: {
                gte: new Date()
            }
        }
    })

    return {
        eventMode: eventModes.length > 0,
        eventModeUntil: eventModes.length > 0 ? eventModes[0].until : undefined
    }
}

export const setEventMode = async(enabled: boolean, until: Date | undefined) => {
    //remove current eventmodes
    await prisma.eventMode.deleteMany()

    if (enabled && until) {
        const eventModes = await prisma.eventMode.create({
            data: {
                until: until
            }
        })
    }
}

export const setAllSectors = async(sectorId: number | undefined | null) => {
    await prisma.centerSectors.updateMany({
        data: {
            activeSectorId: sectorId
        }
    })
}

export const getCenterSectorId = async(position: string): Promise<number | undefined> => {
    const split = position.split('_')
    const int = split[1] ? parseInt(split[1].substring(0, 2)) : NaN

    if (!isNaN(int)) {
        return int
    } else {
        return undefined
    }
}

export async function clearCenterSectorsIfInactive(controllerSesisons: ParsedControllerSession[]) {
    const eventModeActive = isEventMode()
    let centersOnline = false

    for (let session of controllerSesisons) {
        if (session.callsign.endsWith('CTR')) {
            centersOnline = true
        }
    }

    if (!centersOnline && !(await eventModeActive).eventMode) {
        await prisma.centerSectors.updateMany({
            data: {
                activeSectorId: null
            }
        })
    }
}

interface EventModeData {
    eventMode: boolean
    eventModeUntil: Date | undefined
}