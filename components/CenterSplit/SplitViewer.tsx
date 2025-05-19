'use client'
import { SectorData } from "@/types/centerSplit.type"
import { Typography } from "@mui/material"
import { CenterSectors } from "@prisma/client"
import dynamic from "next/dynamic"
import { useEffect, useMemo, useRef, useState } from "react"
import SectorSelector from "./SectorSelector"
import { parseInitialSectorData, updateSector } from "@/lib/sector"

const MapComponent = dynamic(() => import('./Map'), {ssr: false})

const SplitViewer: React.FC<Props> = ({canEdit, sectorData}: Props) => {
    const [split, setSplit] = useState<'high' | 'low'>('high')
    const [editMode, setEditMode] = useState<boolean>(false)
    const [localSectorData, setLocalSectorData] = useState<Map<number, SectorData>>(new Map())
    const [availableSectors, setAvailableSectors] = useState<number[]>([])
    const selectedSector = useRef<number | undefined>(undefined)

    const onSectorEdit = (sectorId: number) => {
        console.log('func call')
        const newData = updateSector(localSectorData, availableSectors, sectorId, selectedSector.current)
        setLocalSectorData(newData)
        console.log('state updated')

    }
    
    const onSectorSelect = (sectorId: number) => {
        console.log('sector select - ' + sectorId)
        selectedSector.current = sectorId
    }

    useEffect(() => {
        const {newData, availableSectors} = parseInitialSectorData(sectorData)
        setLocalSectorData(newData)
        setAvailableSectors(availableSectors)
    }, [])

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
                

            <MapComponent split={split} sectorData={localSectorData} editMode={editMode} onChange={onSectorEdit} colors={availableSectors}/>
            
            <div className='flex flex-col gap-y-2 mt-5'>
                {editMode ? 'Select a sector to edit' : ''}
                <SectorSelector colors={availableSectors} editMode={editMode} onChange={onSectorSelect}/>
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