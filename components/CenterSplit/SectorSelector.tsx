import { CenterSectors } from "@prisma/client"
import { useEffect, useState } from "react"

const SectorSelector: React.FC<Props> = ({sectorData, onChange}: Props) => {

    

    return (
        <div>
            <SectorMap sectors={sectorData}/>
        </div>
    )
}

const SectorMap = ({sectors}: {sectors: CenterSectors[]}) => {
    const List: React.ReactElement[] = []

    if (sectors.length > 0) {
        sectors.map((data) => {
            List.push(
                <button key={data.activeCenterName}>
                    {data.activeCenterName}
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
        <>
            {List}
        </>
    )
}

export default SectorSelector

interface Props {
    sectorData: CenterSectors[]
    onChange: (sectorId: number) => void
}