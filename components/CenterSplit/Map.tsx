import 'leaflet/dist/leaflet.css'
import { MapContainer, GeoJSON, TileLayer, AttributionControl, Polygon, } from "react-leaflet"
import { useEffect, useRef, useState } from 'react'
import { Feature, GeoJsonObject, Geometry } from 'geojson'
import { LatLngExpression, Layer } from 'leaflet'
import GeoJsonPolygons from './GeoJsonPolygons'
import { CenterSectors } from '@prisma/client'
import { SectorData } from '@/types/centerSplit.type'

const Map: React.FC<Props> = ({split, editMode, onChange, sectorData, colors}: Props) => {

    return (
        <div>
            <h2>{editMode ? 'edit' : 'no edit'}</h2>
            <MapContainer center={[31, -82.233]} zoom={6} style={{height: 600, width: '100%'}}>
                <TileLayer
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='OpenStreetMap'
                />
                <AttributionControl/>

                <GeoJsonPolygons split={split} sectorData={sectorData} editMode={editMode} onChange={onChange} colors={colors}/>
            </MapContainer>
        </div>
    )
}

export default Map

interface Props {
    split: 'high' | 'low'
    editMode: boolean
    onChange: (sectorId: number) => void
    sectorData: Map<number, SectorData>
    colors: number[]
}