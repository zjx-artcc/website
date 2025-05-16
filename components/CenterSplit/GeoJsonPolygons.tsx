'use client'
import high from '@/public/geojson/high.json'
import low from '@/public/geojson/low.json'
import { JSX, useEffect, useMemo, useState, useRef } from "react"
import { GeoJSON } from "react-leaflet"
import { Feature, FeatureCollection, GeoJsonObject, Geometry } from "geojson"
import { Layer } from "leaflet"
import { getActiveSectorId, getSectorColor } from '@/lib/sector'
import { SectorData } from '@/types/centerSplit.type'

const GeoJsonPolygons: React.FC<Props> = ({split, editMode, onChange, sectorData, colors}: Props) => {
    const [splitData, setSplitData] = useState<FeatureCollection | undefined>(undefined)
    const [localColors, setLocalColors] = useState<Map<number, string>>(new Map())

    const editModeRef = useRef(editMode)
    useEffect(() => {
        editModeRef.current = editMode
        console.log(editModeRef.current)
    }, [editMode])

    const MappedPolygons: JSX.Element[] = []

    useEffect(() => {
        if (split == 'high') {
            setSplitData(high as FeatureCollection)
        }
        else {
            setSplitData(low as FeatureCollection)
        }
    }, [split])

    useEffect(() => {
        const newColors = new Map(localColors)

        for (let sector of sectorData) {
            newColors.set(sector[0], getSectorColor(colors, sector[1].activeSectorId))
        }

        setLocalColors(newColors)
    }, [colors, sectorData])

    const setMapData = (feature: Feature<Geometry, any>, layer: Layer) => {
        layer.addEventListener('click', (e: L.LeafletEvent) => {
            if (editModeRef.current) {
                console.log('click event 2')
                
                onChange(feature.properties.id)
            }
        })
       //layer.bindPopup((feature.properties.id ? feature.properties.id.toString() : 'none') + (feature.properties.sector_name ? feature.properties.sector_name : ''))
    }
        
    splitData?.features.map((f) => {
        if (f.geometry.type === "Polygon" && f.properties?.id && f.properties.id < 100) {
            const activeSectorId = sectorData.get(f.properties.id)?.activeSectorId

            MappedPolygons.push(
                <GeoJSON data={f as GeoJsonObject} key={f.properties?.id} style={{color: localColors.get(f.properties.id) || 'gray'}} onEachFeature={setMapData}/>
            )
        } else {
            MappedPolygons.push(
                <GeoJSON data={f as GeoJsonObject} key={f.properties?.id} style={{color: 'gray'}}/>
            )
        }
    })

    return (
        <>
            {MappedPolygons}
        </>
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