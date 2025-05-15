'use client'
import { SplitSector } from "@/types/centerSplit.type"
import { Typography } from "@mui/material"
import { CenterSectors } from "@prisma/client"
import dynamic from "next/dynamic"
import { useEffect, useMemo, useState } from "react"
import SectorSelector from "./SectorSelector"

const Map = dynamic(() => import('./Map'), {ssr: false})

const SplitViewer: React.FC<Props> = ({canEdit, sectorData}: Props) => {
    const [split, setSplit] = useState<'high' | 'low'>('high')
    const [editMode, setEditMode] = useState<boolean>(false)
    const [localSectorData, setLocalSectorData] = useState<CenterSectors[]>([])
    const [selectedSector, setSelectedSector] = useState<number>(-1)
    const [sectorColors, setSectorColors] = useState<number[]>([])

    const onSectorEdit = (sectorId: number) => {
        const copy = [...localSectorData]
        
    }
    
    const onSectorSelect = (sectorId: number) => {
        setSelectedSector(sectorId)
    }

    useEffect(() => {
        setLocalSectorData(sectorData)
    })

    useMemo(() => {
        // adds unique sectors to an array for coloring each sector into the SplitSelector and GeoJSON components
        if (localSectorData) {
            const uniqueColors = Array.from(
                new Set(
                    localSectorData
                        .filter(data => data.activeSectorId)
                        .map(data => data.activeSectorId)
                )
            );
            setSectorColors(uniqueColors as number[]);
        } else {
            setSectorColors([]);
        }
    }, [localSectorData])

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
                

            <Map split={split} sectorData={localSectorData} editMode={editMode} onChange={onSectorEdit} colors={sectorColors}/>
            
            <div className='flex flex-col gap-y-2 mt-5'>
                {editMode ? 'Select a sector to edit' : ''}
                <SectorSelector colors={sectorColors} editMode={editMode} onChange={() => console.log('hi')}/>
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