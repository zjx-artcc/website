import { SectorData } from '@/types/centerSplit.type'
import { CenterSectors } from '@prisma/client'
import {create} from 'zustand'
import { getSectorColor } from './sector'

const useCenterSplitStore = create<CenterSplitStore>((set) => ({
    sectorData: new Map<number, SectorData>(),
    activeSectors: [] as number[],
    actions: {
        addSector: (id: number) => {
            set((state) => {
                console.log(state.activeSectors)
                return {
                    activeSectors: [...state.activeSectors, id]
                }
            })
        },

        parseInitialSectorData: (sectorData: CenterSectors[]) => {
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
        
            set(() => ({
                sectorData: localData,
                activeSectors: uniqueSectors
            }))
        },

        updateSector: (sectorId: number, activeSectorId: number | undefined) => {
            set((state) => {
                const copy = new Map(state.sectorData)
                copy.set(sectorId, {
                    activeSectorId: activeSectorId,
                    color: getSectorColor(state.activeSectors, activeSectorId)
                })

                return {
                    sectorData: copy
                }
            })
        }
    }
}))

export const useSectorData = () => useCenterSplitStore((state) => state.sectorData)
export const useActiveSectors = () => useCenterSplitStore((state) => state.activeSectors)
export const useCenterSplitActions = () => useCenterSplitStore((state) => state.actions)

interface CenterSplitStore {
    sectorData: Map<number, SectorData>
    activeSectors: number[]
    actions: {
        parseInitialSectorData: (sectorData: CenterSectors[]) => void
        updateSector: (sectorId: number, activeSectorId: number | undefined) => void
        addSector: (id: number) => void
    }
}