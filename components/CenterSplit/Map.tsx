import 'leaflet/dist/leaflet.css'
import { MapContainer, GeoJSON, TileLayer, AttributionControl, } from "react-leaflet"
import high from '@/public/geojson/high.json'
import { useRef } from 'react'
import { GeoJsonObject } from 'geojson'

const Map: React.FC = () => {
    const data = useRef<GeoJsonObject>(high as GeoJsonObject)

    return (
        <MapContainer center={[31, -82.233]} zoom={6} style={{height: 600, width: '100%'}}>
            <TileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='OpenStreetMap'
            />
            <AttributionControl/>
            <GeoJSON data={data.current}/>
        </MapContainer>
    )
}

export default Map