'use client'
import high from '@/public/geojson/high.json'
import low from '@/public/geojson/low.json'
import { JSX, useEffect, useState } from "react"
import { GeoJSON } from "react-leaflet"
import { Feature, FeatureCollection, GeoJsonObject, Geometry } from "geojson"
import { Layer } from "leaflet"

const GeoJsonPolygons: React.FC<Props> = ({split}: Props) => {
    const MappedPolygons: JSX.Element[] = []
    const [splitData, setSplitData] = useState<FeatureCollection | undefined>(undefined)

    useEffect(() => {
        if (split == 'high') {
            setSplitData(high as FeatureCollection)
        }
        else {
            setSplitData(low as FeatureCollection)
        }
    }, [split])

    const setMapData = (feature: Feature<Geometry, any>, layer: Layer) => {
        /*layer.addEventListener('click', (e: L.LeafletEvent) => {
            e.target.setStyle({color: 'red'})
        })*/
       layer.bindPopup((feature.properties.id ? feature.properties.id.toString() : 'none') + (feature.properties.sector_name ? feature.properties.sector_name : ''))
    }

    splitData?.features.map((f) => {
        if (f.geometry.type === "Polygon") {
            MappedPolygons.push(
                <GeoJSON data={f as GeoJsonObject} key={f.properties?.id} style={{color: f.properties?.id > 10000 ? 'blue' : 'red'}} onEachFeature={setMapData}>

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
}