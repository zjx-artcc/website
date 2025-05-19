import { SectorData } from "@/types/centerSplit.type"
import { Feature, GeoJsonObject, GeoJsonProperties, Geometry } from "geojson"
import MappedPolygons from "./MappedPolygons"
import SectorSelector from "./SectorSelector"
import { GeoJSON } from "react-leaflet"
import { Layer, GeoJSON as GeoType } from "leaflet"
import { useEffect, useRef } from "react"
import { useSectorData } from "@/lib/centerSplit"

const GeoObject: React.FC<Props> = ({featureData, sectorId, onChange}: Props) => {
    const geoJsonRef = useRef<GeoType<any, Geometry>>(null)
    const sectorData = useSectorData()

    const updateLocalRef = () => {
        console.log('trigg')
        if (geoJsonRef.current && sectorId) {
            geoJsonRef.current.clearLayers();
            geoJsonRef.current.addData(featureData);
            geoJsonRef.current.setStyle({color: sectorData.get(sectorId)?.color})
        }
    }
    
    const setMapData = (feature: Feature<Geometry, any>, layer: Layer) => {
        layer.addEventListener('click', (e: L.LeafletEvent) => {       
            if (onChange) {
        console.log('ran')
                onChange(feature.properties.id, updateLocalRef)
            }
        })
        //layer.bindPopup((feature.properties.id ? feature.properties.id.toString() : 'none') + (feature.properties.sector_name ? feature.properties.sector_name : ''))
    }

    const setRef = (layer: GeoType<any, Geometry>) => {
        geoJsonRef.current = layer
    }

    if (sectorId && featureData.geometry.type === "Polygon" && featureData.properties?.id && featureData.properties.id < 100) {
            console.log('ran 1')
            return (
                <GeoJSON ref={setRef} data={featureData as GeoJsonObject} key={featureData.id} style={{color: sectorData.get(sectorId)?.color || 'gray'}} onEachFeature={setMapData}/>
            )

        } else {
            return (
                <GeoJSON data={featureData as GeoJsonObject} key={featureData.id} style={{color: 'gray'}}/>
            )
        }
}

export default GeoObject

interface Props {
    featureData: Feature<Geometry, GeoJsonProperties>
    sectorId?: number
    onChange?: (sectorId: number, update: () => void) => void
}