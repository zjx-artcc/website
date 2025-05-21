import { CenterSectors } from "@prisma/client"

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
    'darkmagenta',
    'aquamarine',
    'darkslategray',
    'deeppink',
    'sienna'
]