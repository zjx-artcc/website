import EventForm from "@/components/Event/EventForm";
import ArchivedAlert from "@/components/EventManager/ArchivedAlert";
import ArchiveToggleButton from "@/components/EventManager/ArchiveToggleButton";
import HiddenAlert from "@/components/EventManager/HiddenAlert";
import ToggleVisibilityButton from "@/components/EventManager/ToggleVisibilityButton";
import prisma from "@/lib/db";
import { OpenInNew } from "@mui/icons-material";
import { Button, Card, CardContent, Stack, Typography } from "@mui/material";
import Link from "next/link";
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
        <>
            { event.archived && <ArchivedAlert /> }
            { event.hidden && !event.archived && <HiddenAlert /> }
            <Card>
                <CardContent>
                    <Typography variant="h5" gutterBottom>Edit - {event.name}</Typography>
                    <Stack direction="row" spacing={1}>
                        <Link href={`/events/admin/events/${event.id}/manager`} target="_blank">
                            <Button variant="contained" endIcon={<OpenInNew />}>Manager</Button>
                        </Link>
                        <ToggleVisibilityButton event={event} />
                        <ArchiveToggleButton event={event} />
                    </Stack>
                    <EventForm event={event} />
                </CardContent>
            </Card>
        </>
    );

}