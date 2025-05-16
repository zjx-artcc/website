'use server'

import prisma from "@/lib/db"
import { CenterSectors } from "@prisma/client"

export const getSplitData = async(): Promise<CenterSectors[]> => {
    return await prisma.centerSectors.findMany({orderBy: {sectorId: 'asc'}})
}