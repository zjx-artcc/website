import { CenterSectors } from "@prisma/client"
import { useEffect, useState } from "react"
import { getActiveSectorId, getColor, getSectorColor } from "@/lib/sector"

const SectorSelector: React.FC<Props> = ({colors, editMode, onChange}: Props) => {
    useEffect(() => {
        colors.map((e) => console.log(e))
    })
    return (
        <div>
            <SectorMap colors={colors} editMode={editMode} onChange={onChange}/>
        </div>
    )
}

const SectorMap = ({colors, editMode, onChange}: Props) => {
    const List: React.ReactElement[] = []

    if (colors.length > 0) {
        colors.map((data, i) => {
            List.push(
                <button disabled={!editMode} className={`p-2 rounded-md hover:border-2 transition`} style={{backgroundColor: getColor(i)}} key={data} onClick={() => onChange(data)}>
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