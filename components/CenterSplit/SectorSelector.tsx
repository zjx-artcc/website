import { CenterSectors } from "@prisma/client"
import { useEffect, useState } from "react"
import { getActiveSectorId, getColor, getSectorColor } from "@/lib/sector"

const SectorSelector: React.FC<Props> = ({colors, editMode, onChange}: Props) => {
    const List: React.ReactElement[] = []

    if (colors.length > 0) {
        colors.map((data, i) => {
            List.push(
                <button 
                    type='button'
                    disabled={!editMode} 
                    className={'p-2 rounded-md ' + (editMode ? 'hover:border-2 transition' : '')} 
                    style={{backgroundColor: getColor(i)}} key={data + 500} 
                    onClick={() => onChange(data)}
                >
                    ZJX Sector {data}
                </button>
            )   
        })   
    } else {
        List.push(
            <button key={-10}>
                None
            </button>
        )
    }

    return (
        <div className='flex flex-row gap-x-2'>
            {List}
        </div>
    )
}

export default SectorSelector

interface Props {
    onChange: (sectorId: number) => void
    editMode: boolean
    colors: number[]
}