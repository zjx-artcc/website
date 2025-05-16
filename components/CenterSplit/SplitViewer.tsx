'use client'
import { SectorData } from "@/types/centerSplit.type"
import { Typography } from "@mui/material"
import { CenterSectors } from "@prisma/client"
import dynamic from "next/dynamic"
import { useEffect, useMemo, useRef, useState } from "react"
import SectorSelector from "./SectorSelector"

const MapComponent = dynamic(() => import('./Map'), {ssr: false})

const SplitViewer: React.FC<Props> = ({canEdit, sectorData}: Props) => {
    const [split, setSplit] = useState<'high' | 'low'>('high')
    const [editMode, setEditMode] = useState<boolean>(false)
    const [localSectorData, setLocalSectorData] = useState<Map<number, SectorData>>(new Map())
    const selectedSector = useRef<number | undefined>(undefined)
    const [sectorColors, setSectorColors] = useState<number[]>([])

    const onSectorEdit = (sectorId: number) => {
        const copy = new Map(Array.from(localSectorData))
        
        if (selectedSector.current) {
            copy.set(sectorId, {
                activeSectorId: selectedSector.current
            })
        }

        setLocalSectorData(copy)
        console.log(sectorId)
        console.log(localSectorData.get(sectorId)?.activeSectorId)
    }
    
    const onSectorSelect = (sectorId: number) => {
        console.log('sector select - ' + sectorId)
        selectedSector.current = sectorId
    }

    useMemo(() => {
        console.log('memo')
        const newMap = new Map(localSectorData)

        sectorData.map((data) => {
            newMap.set(data.sectorId, {
                activeSectorId: data.activeSectorId || undefined
            })
        })

        setLocalSectorData(newMap)
    }, [])

    useMemo(() => {
        console.log('memo - colors')

        // adds unique sectors to an array for coloring each sector into the SplitSelector and GeoJSON components
        if (localSectorData) {
            const activeSectors: number[] = []

            localSectorData.forEach((data, sectorId) => {
                if (data.activeSectorId && activeSectors.indexOf(data.activeSectorId) == -1) {
                    activeSectors.push(data.activeSectorId)
                }
            })

            setSectorColors(activeSectors)
        } else {
            setSectorColors([]);
        }
    }, [sectorData])

    return (
        <div className="w-full h-full">
            <Typography variant="h5">Active Center Split</Typography>

            <div className='flex flex-row gap-x-5'>
                <div>
                    <input type='radio' title='High' name='split' value={'high'} defaultChecked={split == 'high'} onClick={() => setSplit('high')}/>
                    <label className='ml-2'>High</label>
                </div>

                <div>
                    <input type='radio' title='Low' name='split' value={'low'} defaultChecked={split == 'low'} onClick={() => setSplit('low')}/>
                    <label className='ml-2'>Low</label> 
                </div>
            </div>
                

            <MapComponent split={split} sectorData={localSectorData} editMode={editMode} onChange={onSectorEdit} colors={sectorColors}/>
            
            <div className='flex flex-col gap-y-2 mt-5'>
                {editMode ? 'Select a sector to edit' : ''}
                <SectorSelector colors={sectorColors} editMode={editMode} onChange={onSectorSelect}/>
                {canEdit && !editMode ? <button className='p-2 bg-sky-500 mt-2 w-max rounded-md hover:bg-sky-800 transition' type='button' onClick={() => setEditMode(true)}>Edit</button> : ''}
            </div>
        </div>
    )
}

export default SplitViewer

interface Props {
    canEdit?: boolean
    sectorData: CenterSectors[]
}