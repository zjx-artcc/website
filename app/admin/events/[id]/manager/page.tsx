import EventControls from "@/components/EventManager/EventControls";
import EventPositionsTable from "@/components/EventManager/EventPositionsTable";
import prisma from "@/lib/db";
import { Alert, Stack } from "@mui/material";
import { EventPosition, SoloCertification, User } from "@prisma/client";
import { notFound } from "next/navigation";

export type EventPositionWithSolo = EventPosition & { 
    soloCert: SoloCertification | null | undefined,
    user: User | null | undefined,
};

export default async function Page({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params;

    const event = await prisma.event.findUnique({
        where: {
            id,
        },
        include: {
            positions: {
                include: {
                    user: true,
                }
            },
        },
    });

    if (!event) {
        notFound();
    }

    const positions: EventPositionWithSolo[] = await Promise.all(event.positions.map(async (position) => {
        if (!position.user) {
            return { ...position, soloCert: undefined, user: undefined };
        }
        const soloCert = await getSoloCertification(position.user);
        return { ...position, soloCert };
    }));

    return (
        <Stack spacing={2}>
            { event.archived && <Alert severity="info">This event is archived and hidden.  In order to unarchive this event, change the start and end dates to the future (if they are not).</Alert> }
            { event.hidden && !event.archived && <Alert severity="warning">This event is hidden.  In order to show this event, change the visibility.</Alert> }
            <EventControls event={event} />
            <EventPositionsTable event={event} positions={positions} />
        </Stack>
    );

}

const getSoloCertification = async (user: User) => {
    return prisma.soloCertification.findFirst({
        where: {
            userId: user.id,
        },
    });
}