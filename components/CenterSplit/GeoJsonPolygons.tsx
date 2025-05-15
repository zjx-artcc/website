'use client'
import high from '@/public/geojson/high.json'
import low from '@/public/geojson/low.json'
import { JSX, useEffect, useMemo, useState } from "react"
import { GeoJSON } from "react-leaflet"
import { Feature, FeatureCollection, GeoJsonObject, Geometry } from "geojson"
import { Layer } from "leaflet"
import { CenterSectors } from '@prisma/client'
import { getActiveSectorId, getSectorColor } from '@/lib/sector'

const GeoJsonPolygons: React.FC<Props> = ({split, editMode, onChange, sectorData, colors}: Props) => {
    const MappedPolygons: JSX.Element[] = []
    const [splitData, setSplitData] = useState<FeatureCollection | undefined>(undefined)
    const [uniqueSectors, setUniqueSectors] = useState<string[]>([])

    useMemo(() => {
        if (split == 'high') {
            setSplitData(high as FeatureCollection)
        }
        else {
            setSplitData(low as FeatureCollection)
        }
    }, [split])

    useEffect(() => {

    })
    

    const setMapData = (feature: Feature<Geometry, any>, layer: Layer) => {
        layer.addEventListener('click', (e: L.LeafletEvent) => {
            if (editMode) {
                layer.addEventListener('click', () => {
                    onChange(feature.properties.id)
                })
            }
        })
       //layer.bindPopup((feature.properties.id ? feature.properties.id.toString() : 'none') + (feature.properties.sector_name ? feature.properties.sector_name : ''))
    }

    splitData?.features.map((f) => {
        if (f.geometry.type === "Polygon" && f.properties?.id && f.properties.id < 100) {
            const activeSectorId = getActiveSectorId(sectorData, f.properties?.id)
            console.log(`A: ${activeSectorId} S: ${f.properties?.id}`)

            MappedPolygons.push(
                <GeoJSON data={f as GeoJsonObject} key={f.properties?.id} style={{color: getSectorColor(colors, activeSectorId)}} onEachFeature={setMapData}>

                </GeoJSON>
            )
        }
    })
    
        console.log(MappedPolygons.length)
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
    sectorData: CenterSectors[]
    colors: number[]
}