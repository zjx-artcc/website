import prisma from "@/lib/db";
import { Card, CardContent, Typography } from "@mui/material";
import { Event } from "@prisma/client";
import PresetSelectorForm from "./PresetSelectorForm";

export default async function EventPresetSelector({ event }: { event: Event, }) {

    const positionPresets = await prisma.eventPositionPreset.findMany({
        orderBy: {
            name: 'asc',
        },
    });

    return (
        <PresetSelectorForm event={event} presetPositions={positionPresets} />
    )

}