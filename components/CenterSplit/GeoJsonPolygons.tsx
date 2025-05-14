'use client'
import high from '@/public/geojson/high.json'
import low from '@/public/geojson/low.json'
import { JSX, useEffect, useState } from "react"
import { GeoJSON } from "react-leaflet"
import { Feature, FeatureCollection, GeoJsonObject, Geometry } from "geojson"
import { Layer } from "leaflet"
import { CenterSectors } from '@prisma/client'
import { SplitSector } from '@/types/centerSplit.type'
import { COLORS } from '@/lib/sector'

const GeoJsonPolygons: React.FC<Props> = ({split, editMode, onChange, sectorData, colors}: Props) => {
    const MappedPolygons: JSX.Element[] = []
    const [splitData, setSplitData] = useState<FeatureCollection | undefined>(undefined)
    const [uniqueSectors, setUniqueSectors] = useState<string[]>([])

    useEffect(() => {
        if (split == 'high') {
            setSplitData(high as FeatureCollection)
        }
        else {
            setSplitData(low as FeatureCollection)
        }
    }, [split])

    useEffect(() => {

    })
    const getSectorColor = (id: number): string => {
        const color = COLORS[colors.indexOf(`JAX_${id}_CTR`)]
        if (color) {
            return color
        } else {
            return 'yellow'
        }
    }

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
        if (f.geometry.type === "Polygon") {
            MappedPolygons.push(
                <GeoJSON data={f as GeoJsonObject} key={f.properties?.id} style={{color: getSectorColor(f.properties?.id)}} onEachFeature={setMapData}>

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
    colors: string[]
}