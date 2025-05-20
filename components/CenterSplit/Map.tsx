import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer } from "react-leaflet"
import GeoJsonPolygons from './GeoJsonPolygons'
import { SectorData } from '@/types/centerSplit.type'

const Map: React.FC<Props> = ({split, editMode, onChange, sectorData, colors}: Props) => {
    return (
        <div>
            <MapContainer center={[31, -82.233]} zoom={6} style={{height: 600, width: '100%'}}>
                <TileLayer
                url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='OpenStreetMap'
                />

                <GeoJsonPolygons split={split} sectorData={sectorData} editMode={editMode} onChange={onChange} colors={colors}/>
            </MapContainer>
        </div>
    )
}

export default Map

interface Props {
    split: 'high' | 'low'
    editMode: boolean
    onChange: (sectorId: number, update: () => void) => void
    sectorData: Map<number, SectorData>
    colors: number[]
}