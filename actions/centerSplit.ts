'use server'

import prisma from "@/lib/db"
import { SplitSector } from "@/types/centerSplit.type"
import { CenterSectors } from "@prisma/client"

export const getSplitData = async(): Promise<CenterSectors[]> => {
    return await prisma.centerSectors.findMany({orderBy: {activeCenterName: 'asc'}})
    const sectors: CenterSectors[] = await prisma.centerSectors.findMany({
        orderBy: {
            activeCenterName: 'desc'
        }
    })
    const parsedSectors: SplitSector[] = []

    sectors.map((data) => {
        console.log(parsedSectors)
        if (parsedSectors.length == 0 || parsedSectors[parsedSectors.length - 1].vatsimSectorName != data.activeCenterName) {
            parsedSectors.push({
                vatsimSectorName: data.activeCenterName,
                ownedSectors: []
            })
        }

        parsedSectors[parsedSectors.length - 1].ownedSectors.push(data.sectorId)
    })

    return parsedSectors
}
