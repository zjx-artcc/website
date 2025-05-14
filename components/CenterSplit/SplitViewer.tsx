'use client'
import { SplitSector } from "@/types/centerSplit.type"
import { Typography } from "@mui/material"
import { CenterSectors } from "@prisma/client"
import dynamic from "next/dynamic"
import { useEffect, useState } from "react"
import SectorSelector from "./SectorSelector"

const Map = dynamic(() => import('./Map'), {ssr: false})

const SplitViewer: React.FC<Props> = ({canEdit, sectorData}: Props) => {
    const [split, setSplit] = useState<'high' | 'low'>('high')
    const [editMode, setEditMode] = useState<boolean>(false)
    const [localSectorData, setLocalSectorData] = useState<CenterSectors[]>([])
    const [selectedSector, setSelectedSector] = useState<number>(-1)
    const [sectorColors, setSectorColors] = useState<string[]>([])

    const onSectorEdit = (sectorId: number) => {
        const copy = [...localSectorData]

    }

    useEffect(() => {
        setLocalSectorData(sectorData)
    })
    
    useEffect(() => {
        let uniqueSectors: string[] = []

        if (sectorData) {
            sectorData.map((data) => {
                if (uniqueSectors.indexOf(data.activeCenterName) == -1) {
                    setSectorColors([...sectorColors, data.activeCenterName])
                }
            })
        } else {
            setSectorColors([])
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
                

            <Map split={split} sectorData={localSectorData} editMode={editMode} onChange={onSectorEdit} colors={sectorColors}/>

            {canEdit ? <button className='p-2 bg-sky-500 mt-2' type='button' onClick={() => setEditMode(true)}>Edit</button> : ''}
            <SectorSelector sectorData={localSectorData} onChange={() => console.log('hi')}/>
        </div>
    )
}

export default SplitViewer

interface Props {
    canEdit?: boolean
    sectorData: CenterSectors[]
}