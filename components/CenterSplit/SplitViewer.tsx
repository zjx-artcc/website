'use client'
import { Typography } from "@mui/material"
import { CenterSectors } from "@prisma/client"
import dynamic from "next/dynamic"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import SectorSelector from "./SectorSelector"
import { useActiveSectors, useCenterSplitActions, useSectorData } from "@/lib/centerSplit"
import { updateSplitData } from "@/actions/centerSplit"
import { toast } from "react-toastify"
import { DateTimePicker, LocalizationProvider, TimePicker } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import EventModeSelector from "./EventModeSelector"

const MapComponent = dynamic(() => import('./Map'), {ssr: false})

const SplitViewer: React.FC<Props> = ({canEdit, sectorData, eventMode, isEventStaff}: Props) => {
    const localSectorData = useSectorData()
    const availableSectors = useActiveSectors()
    const {parseInitialSectorData, updateSector, resetSectors, reparseActiveSectors} = useCenterSplitActions()

    const [split, setSplit] = useState<'high' | 'low'>('high')
    const [editMode, setEditMode] = useState<boolean>(false)
    const editRef = useRef<boolean>(editMode)
    const [selectedSector, setSelectedSector] = useState<number | undefined>(undefined)
    const selectedSectorRef = useRef<number | undefined>(undefined)

    const onSectorEdit = useCallback((sectorId: number, update: () => void) => {
        if (editRef.current) {
            const newData = updateSector(sectorId, selectedSectorRef.current)
            update() // callback to ./GeoObject component
        }
    }, [updateSector])
    
    const onSectorSelect = (sectorId: number | undefined) => {
        setSelectedSector(sectorId)
    }

    const sendSplitUpdate = () => {
        setEditMode(false)
        updateSplitData(localSectorData)
        .then(() => toast.success('Split updated!'))
        .catch((err) => toast.error('Split update failed ' + err))

        reparseActiveSectors()
    }

    const handleEditModeExit = () => {
        setEditMode(false)
        resetSectors()
        reparseActiveSectors()
    }

    useEffect(() => {
        parseInitialSectorData(sectorData)
    }, [parseInitialSectorData, sectorData])

    useMemo(() => {
        editRef.current = editMode
    }, [editMode])

    useMemo(() => {
        selectedSectorRef.current = selectedSector
    }, [selectedSector])

    return (
        <div className="w-full h-full relative">
            <Typography variant="h5">Active Center Split</Typography>
            {eventMode ? <Typography variant='h6'>Event mode is active .</Typography> : ''}

            <div>
                <div className='flex flex-row gap-x-5 mb-5'>
                    <div>
                        <input type='radio' title='High' name='split' value={'high'} defaultChecked={split == 'high'} onClick={() => setSplit('high')}/>
                        <label className='ml-2'>High</label>
                    </div>

                    <div>
                        <input type='radio' title='Low' name='split' value={'low'} defaultChecked={split == 'low'} onClick={() => setSplit('low')}/>
                        <label className='ml-2'>Low</label> 
                    </div>
                </div>
            </div>
        

            <MapComponent split={split} sectorData={localSectorData} onChange={onSectorEdit} colors={availableSectors}/>
            
            <div className='flex flex-col gap-y-2 mt-5'>
                {editMode ? <Typography variant='h6'>Currently Selected: {selectedSector ? `ZJX ${selectedSector}` : 'None'}</Typography> : ''}
                {editMode ? <Typography variant='h6' style={{marginTop: 0}}>Select a sector to edit</Typography> : ''}

                <div className='flex flex-col gap-y-5'>
                    <SectorSelector editMode={editMode} onChange={onSectorSelect}/>
                </div>
                
                {canEdit && !editMode && (!eventMode || (eventMode && isEventStaff)) ? <button className='p-2 bg-sky-500 mt-2 w-max rounded-md hover:bg-sky-800 transition' type='button' onClick={() => setEditMode(true)}>Edit</button> : ''}
                {canEdit && editMode && (!eventMode || (eventMode && isEventStaff)) ? 
                <div className='flex flex-row gap-x-2'>
                    <button className='p-2 bg-sky-500 mt-2 w-max rounded-md hover:bg-sky-800 transition' type='button' onClick={sendSplitUpdate}>Save</button> 
                    <button className='p-2 bg-sky-500 mt-2 w-max rounded-md hover:bg-sky-800 transition' type='button' onClick={handleEditModeExit}>Exit</button> 
                </div>
                : ''}
            </div>
        </div>
    )
}

export default SplitViewer

interface Props {
    canEdit?: boolean
    sectorData: CenterSectors[]
    eventMode: boolean
    isEventStaff?: boolean
}