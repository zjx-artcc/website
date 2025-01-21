import EventPositionPresetForm from "@/components/EventPositionPreset/EventPositionPresetForm";
import prisma from "@/lib/db";
import { Card, CardContent, Typography } from "@mui/material";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string, }>}) {

    const { id } = await params;

    const positionPreset = await prisma.eventPositionPreset.findUnique({
        where: {
            id,
        },
    });

    if (!positionPreset) {
        notFound();
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>Edit - {positionPreset.name}</Typography>
                <EventPositionPresetForm positionPreset={positionPreset} />
            </CardContent>
        </Card>
    );
}