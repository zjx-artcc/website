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