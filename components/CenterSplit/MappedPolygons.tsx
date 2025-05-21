import { SectorData } from "@/types/centerSplit.type"
import { Feature, FeatureCollection, GeoJsonProperties, Geometry } from "geojson"
import { JSX} from "react"
import GeoObject from "./GeoObject"

const MappedPolygons = ({splitData, onChange}: Props) => {
    let MappedPolygons: JSX.Element[] = []

    splitData?.features.map((f, i) => {
        if (f.geometry.type === "Polygon" && f.properties?.id && f.properties.id < 100) {
            MappedPolygons.push(
                <GeoObject key={f.properties.id + 'geoobject'} featureData={f as Feature<Geometry, GeoJsonProperties>} sectorId={f.properties.id} onChange={onChange}/>
            )
        } else {
            MappedPolygons.push(
                <GeoObject key={i + 'static'} featureData={f as Feature<Geometry, GeoJsonProperties>}/>
            )
        }
    }) 

    return (
        <>
            {MappedPolygons}
        </>
    )
}

export default MappedPolygons

interface Props {
    splitData: FeatureCollection | undefined
    sectorData: Map<number, SectorData>
    onChange: (sectorId: number, update: () => void) => void
}