'use client'
import { Typography } from "@mui/material"
import { CenterSectors } from "@prisma/client"
import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"
import SectorSelector from "./SectorSelector"
import { useActiveSectors, useCenterSplitActions, useSectorData } from "@/lib/centerSplit"

const MapComponent = dynamic(() => import('./Map'), {ssr: false})

const SplitViewer: React.FC<Props> = ({canEdit, sectorData}: Props) => {
    const localSectorData = useSectorData()
    const availableSectors = useActiveSectors()
    const {parseInitialSectorData, updateSector} = useCenterSplitActions()

    const [split, setSplit] = useState<'high' | 'low'>('high')
    const [editMode, setEditMode] = useState<boolean>(false)
    const selectedSector = useRef<number | undefined>(undefined)

    const onSectorEdit = (sectorId: number, update: () => void) => {
        const newData = updateSector(sectorId, selectedSector.current)
        update() // callback to ./GeoObject component
    }
    
    const onSectorSelect = (sectorId: number) => {
        selectedSector.current = sectorId
    }

    useEffect(() => {
        parseInitialSectorData(sectorData)
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
                <SectorSelector editMode={editMode} onChange={onSectorSelect}/>
                {canEdit && !editMode ? <button className='p-2 bg-sky-500 mt-2 w-max rounded-md hover:bg-sky-800 transition' type='button' onClick={() => setEditMode(true)}>Edit</button> : ''}
            </div>

            {availableSectors.map((data) => <p>{data}</p>)}
        </div>
    )
}

export default SplitViewer

interface Props {
    canEdit?: boolean
    sectorData: CenterSectors[]
}