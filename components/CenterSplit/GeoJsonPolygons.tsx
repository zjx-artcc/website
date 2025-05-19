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

const GeoJsonPolygons: React.FC<Props> = ({split, editMode, onChange, sectorData, colors}: Props) => {
    const [splitData, setSplitData] = useState<FeatureCollection | undefined>(undefined)

    useEffect(() => {
        if (split == 'high') {
            setSplitData(high as FeatureCollection)
        }
        else {
            setSplitData(low as FeatureCollection)
        }
    }, [split])
        
    return (
        <MappedPolygons
        splitData={splitData}
        editMode={editMode}
        onChange={onChange}
        sectorData={sectorData}
        />
    )
}

export default GeoJsonPolygons

interface Props {
    split: 'high' | 'low'
    editMode: boolean
    onChange: (sectorId: number) => void
    sectorData: Map<number, SectorData>
    colors: number[]
}