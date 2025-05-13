import 'leaflet/dist/leaflet.css'
import { MapContainer, GeoJSON, TileLayer, AttributionControl, Polygon, } from "react-leaflet"
import { useEffect, useRef, useState } from 'react'
import { Feature, GeoJsonObject, Geometry } from 'geojson'
import { LatLngExpression, Layer } from 'leaflet'
import GeoJsonPolygons from './GeoJsonPolygons'

const Map: React.FC<Props> = ({split}: Props) => {
    const mapGeoData = (feature: Feature<Geometry, any>, layer: Layer) => {
        layer.bindPopup(feature.id ? feature.id.toString() : 'none')
        feature.properties.color = 'green'
        
    }
    return (
        <MapContainer center={[31, -82.233]} zoom={6} style={{height: 600, width: '100%'}}>
            <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='OpenStreetMap'
            />
            <AttributionControl/>

            <GeoJsonPolygons split={split}/>
        </MapContainer>
    )
}

export default Map

interface Props {
    split: 'high' | 'low'
}