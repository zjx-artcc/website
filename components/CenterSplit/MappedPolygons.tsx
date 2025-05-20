import { SectorData } from "@/types/centerSplit.type"
import { Feature, FeatureCollection, GeoJsonObject, GeoJsonProperties, Geometry } from "geojson"
import { Layer } from "leaflet"
import { JSX, useEffect, useMemo, useRef } from "react"
import { GeoJSON } from "react-leaflet"
import GeoObject from "./GeoObject"
import { useSectorData } from "@/lib/centerSplit"

const MappedPolygons = ({splitData, onChange, editMode}: Props) => {
    let MappedPolygons: JSX.Element[] = []

    const sectorData = useSectorData()

    splitData?.features.map((f, i) => {
        if (f.geometry.type === "Polygon" && f.properties?.id && f.properties.id < 100) {
            const sector = sectorData.get(f.properties.id)

            MappedPolygons.push(
                <GeoObject featureData={f as Feature<Geometry, GeoJsonProperties>} sectorId={f.properties.id} onChange={onChange}/>
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
    onChange: (sectorId: number, update: () => void) => void
}