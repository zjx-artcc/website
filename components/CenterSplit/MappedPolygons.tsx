import { SectorData } from "@/types/centerSplit.type"
import { Feature, FeatureCollection, GeoJsonObject, GeoJsonProperties, Geometry } from "geojson"
import { Layer } from "leaflet"
import { JSX, useEffect, useMemo, useRef } from "react"
import { GeoJSON } from "react-leaflet"
import GeoObject from "./GeoObject"

const MappedPolygons = ({splitData, sectorData, onChange, editMode}: Props) => {
    let MappedPolygons: JSX.Element[] = []

    splitData?.features.map((f, i) => {
        if (f.geometry.type === "Polygon" && f.properties?.id && f.properties.id < 100) {
            console.log('ran 1')
            const sector = sectorData.get(f.properties.id)

            MappedPolygons.push(
                <GeoObject featureData={f as Feature<Geometry, GeoJsonProperties>} sectorData={sector} onChange={onChange}/>
            )
        } else {
            MappedPolygons.push(
                <GeoObject featureData={f as Feature<Geometry, GeoJsonProperties>}/>
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
    editMode: boolean
    onChange: (sectorId: number) => void
}