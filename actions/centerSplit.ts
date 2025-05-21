'use server'

import prisma from "@/lib/db"
import { CenterSectors } from "@prisma/client"
import { getController } from "./vatusa/controller"
import { authOptions } from "@/auth/auth"
import { getServerSession } from "next-auth"
import { SectorData } from "@/types/centerSplit.type"

export const getSplitData = async(): Promise<CenterSectors[]> => {
    return await prisma.centerSectors.findMany({orderBy: {sectorId: 'asc'}})
}

export const updateSplitData = async(sectors: Map<number, SectorData>): Promise<boolean> => {
    const session = await getServerSession(authOptions);

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

export const isEventMode = async() => {
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

    return eventModes.length > 0
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
    const int = position[1] ? parseInt(position[1]) : NaN
    
    if (!isNaN(int)) {
        return int
    } else {
        return undefined
    }
}