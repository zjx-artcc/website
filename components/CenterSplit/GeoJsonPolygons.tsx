'use client'
import high from '@/public/geojson/high.json'
import low from '@/public/geojson/low.json'
import { JSX, useEffect, useMemo, useState, useRef } from "react"
import { GeoJSON } from "react-leaflet"
import { Feature, FeatureCollection, GeoJsonObject, Geometry } from "geojson"
import { Layer } from "leaflet"
import { getActiveSectorId, getSectorColor } from '@/lib/sector'
import { SectorData } from '@/types/centerSplit.type'
import MappedPolygons from './MappedPolygons'

const GeoJsonPolygons: React.FC<Props> = ({split, onChange, sectorData, colors}: Props) => {
    const [splitData, setSplitData] = useState<FeatureCollection | undefined>(undefined)
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (split == 'high') {
            setSplitData(high as FeatureCollection)
        }
        else {
            setSplitData(low as FeatureCollection)
        }

        setCount(c => c + 1)
    }, [split])
        
    return (
        <MappedPolygons
        splitData={splitData}
        onChange={onChange}
        sectorData={sectorData}
        key={count}
        />
    )
}

export default GeoJsonPolygons

interface Props {
    split: 'high' | 'low'
    onChange: (sectorId: number, update: () => void) => void
    sectorData: Map<number, SectorData>
    colors: number[]
}