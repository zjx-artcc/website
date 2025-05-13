'use client'
import { Polygon } from "react-leaflet"
import high from '@/public/geojson/high.json'
import low from '@/public/geojson/low.json'
import { JSX, useEffect } from "react"
import { GeoJSON } from "react-leaflet"
import { Feature, GeoJsonObject, Geometry } from "geojson"
import { Layer } from "leaflet"

const GeoJsonPolygons: React.FC<Props> = ({split}: Props) => {
    const MappedPolygons: JSX.Element[] = []
    
    useEffect(() => {
        if (split == 'high') {
            
        }
    }, [split])

    const setMapData = (feature: Feature<Geometry, any>, layer: Layer) => {
        layer.addEventListener('click', (e: L.LeafletEvent) => {
            e.target.setStyle({color: 'red'})
        })

        layer.addEventListener('rightclick', (e: L.LeafletEvent) => {
            e.target.setStyle({color: 'gray'})
        })
    }

    high.features.map((f) => {
        console.log(f)
        if (f.geometry.type === "Polygon") {
            MappedPolygons.push(
                <GeoJSON data={f as GeoJsonObject} key={f.properties.id} style={{color: f.properties.id > 10000 ? 'blue' : 'red'}} onEachFeature={setMapData}>

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