'use server'

import prisma from "@/lib/db"
import { SplitSector } from "@/types/centerSplit.type"
import { CenterSectors } from "@prisma/client"

export const getSplitData = async(): Promise<CenterSectors[]> => {
    return await prisma.centerSectors.findMany({orderBy: {sectorId: 'asc'}})
    const sectors: CenterSectors[] = await prisma.centerSectors.findMany({
        orderBy: {
            sectorId: 'asc'
        }
    })

    const parsedSectors: SplitSector[] = []

    sectors.map((data) => {
        if (data.activeSectorId && !parsedSectors[data.activeSectorId]) {
            parsedSectors.push({
                activeSectorId: data.activeSectorId,
                ownedSectors: [data.sectorId]
            })
        }

        parsedSectors[parsedSectors.length - 1].ownedSectors.push(data.sectorId)
    })

    return parsedSectors
}