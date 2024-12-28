import EventForm from "@/components/Event/EventForm";
import prisma from "@/lib/db";
import { Card, CardContent, Typography } from "@mui/material";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;

    const event = await prisma.event.findUnique({
        where: {
            id,
        },
    });

    if (!event) {
        notFound();
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>Edit - {event.name}</Typography>
                <EventForm event={event} />
            </CardContent>
        </Card>
    );

}