import { SectorData } from "@/types/centerSplit.type"
import { CenterSectors } from "@prisma/client"

export const parseInitialSectorData = (sectorData: CenterSectors[]): {newData: Map<number, SectorData>, availableSectors: number[]} => {
    const uniqueSectors: number[] = []
    const localData: Map<number, SectorData> = new Map<number, SectorData>()

    sectorData.map((data) => {
            // add to uniqueSectors
            if (data.activeSectorId && uniqueSectors.indexOf(data.activeSectorId) == -1) {
                uniqueSectors.push(data.activeSectorId)
            }

            localData.set(data.sectorId, {
                color: getSectorColor(uniqueSectors, data.activeSectorId || undefined),
                activeSectorId: data.activeSectorId || undefined
            })
    })

    return {
        newData: localData,
        availableSectors: uniqueSectors
    }
}

export const updateSector = (sectorData: Map<number, SectorData>,availableSectors: number[], sectorId: number, activeSectorId: number | undefined): Map<number, SectorData> => {
    sectorData.set(sectorId, {
        activeSectorId: activeSectorId,
        color: getSectorColor(availableSectors, activeSectorId)
    })

    return sectorData

}

export const getSectorColor = (colors: number[], id: number | undefined): string => {
    if (!id) {
        return 'gray'
    }

    const color = COLORS[colors.indexOf(id)]
    if (color) {
        return color
    } else {
        return 'gray'
    }
}

export const getActiveSectorId = (sectorData: CenterSectors[], sectorId: number): number | undefined => {
    let activeSector: number | undefined = undefined

    sectorData.map((data) => {
        if (data.sectorId == sectorId) {
            activeSector = data.activeSectorId || undefined
            return
        }
    })

    return activeSector
}

export const getColor = (i: number) => {
    return COLORS[i]
}

const COLORS = [
    'red',
    'green',
    'blue',
    'orange',
    'purple',
    'blue',
    'green',
    'yellow',
    'aquamarine'
]