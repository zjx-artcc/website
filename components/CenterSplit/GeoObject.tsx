import { SectorData } from "@/types/centerSplit.type"
import { Feature, GeoJsonObject, GeoJsonProperties, Geometry } from "geojson"
import MappedPolygons from "./MappedPolygons"
import SectorSelector from "./SectorSelector"
import { GeoJSON } from "react-leaflet"
import { Layer, GeoJSON as GeoType } from "leaflet"
import { useEffect, useRef } from "react"

const GeoObject: React.FC<Props> = ({featureData, sectorData, onChange}: Props) => {
    const geoJsonRef = useRef<GeoType<any, Geometry> | null>(null)
    useEffect(() => {
        if (geoJsonRef.current) {
            geoJsonRef.current.clearLayers();
            geoJsonRef.current.addData(featureData);
        }
    }, [sectorData])
    
    const setMapData = (feature: Feature<Geometry, any>, layer: Layer) => {
        layer.addEventListener('click', (e: L.LeafletEvent) => {       
            if (onChange) {
                onChange(feature.properties.id)
            }
        })
        //layer.bindPopup((feature.properties.id ? feature.properties.id.toString() : 'none') + (feature.properties.sector_name ? feature.properties.sector_name : ''))
    }

    if (featureData.geometry.type === "Polygon" && featureData.properties?.id && featureData.properties.id < 100) {
            console.log('ran 1')
            return (
                <GeoJSON ref={(l) => geoJsonRef.current = l} data={featureData as GeoJsonObject} key={featureData.id} style={{color: sectorData?.color || 'gray'}} onEachFeature={setMapData}/>
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
    sectorData?: SectorData | undefined
    onChange?: (sectorId: number) => void
}