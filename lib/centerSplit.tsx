import { SectorData } from '@/types/centerSplit.type'
import {create} from 'zustand'

const useCenterSplitStore = create<CenterSplitStore>((set) => ({
    sectorData: new Map<number, SectorData>(),
    activeSectors: [] as number[],
    actions: {
        updateSectorData: (data: Map<number, SectorData>) => {
            set({sectorData: data})
        },
        updateActiveSectors: (data: number[]) => {
            set({activeSectors: data})
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
        updateSectorData: (data: Map<number, SectorData>) => void
        updateActiveSectors: (data: number[]) => void
    }
}