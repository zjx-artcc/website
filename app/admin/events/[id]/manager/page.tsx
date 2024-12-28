import ArchiveToggleButton from "@/components/EventManager/ArchiveToggleButton";
import ToggleVisibilityButton from "@/components/EventManager/ToggleVisibilityButton";
import { getIconForCertificationOption } from "@/lib/certification";
import { formatZuluDate } from "@/lib/date";
import prisma from "@/lib/db";
import { getRating } from "@/lib/vatsim";
import { CalendarMonth, Edit, Info } from "@mui/icons-material";
import { Box, Button, ButtonGroup, Card, CardContent, Divider, Grid2, IconButton, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from "@mui/material";
import { EventPosition, SoloCertification, User } from "@prisma/client";
import Link from "next/link";
import { notFound } from "next/navigation";
import { start } from "repl";

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

    const getDuration = (start: Date, end: Date, days?: boolean) => {
        const diff = end.getTime() - start.getTime();
        const hours = Math.floor(diff / 1000 / 60 / 60);
        const minutes = Math.floor(diff / 1000 / 60) % 60;
        if (days) {
            return hours / 24 + minutes / 60 / 24;
        }
        return hours + minutes / 60;
    }

    type EventPositionWithSolo = EventPosition & { 
        soloCert: SoloCertification | null | undefined,
        user: User | null | undefined,
    };

    const positions: EventPositionWithSolo[] = await Promise.all(event.positions.map(async (position) => {
        if (!position.user) {
            return { ...position, soloCert: undefined, user: undefined };
        }
        const soloCert = await getSoloCertification(position.user);
        return { ...position, soloCert };
    }));

    return (
        <Stack spacing={2}>
            <Card>
                <CardContent>
                    {event.archived && <Typography variant="body2" fontWeight="bold" color="warning" textAlign="center" sx={{ py: 0.5, border: 2, }} gutterBottom>ARCHIVED</Typography>}
                    {event.hidden && !event.archived && <Typography variant="body2" fontWeight="bold" color="error" textAlign="center" sx={{ py: 0.5, border: 2, }} gutterBottom>HIDDEN</Typography>}
                    <Typography variant="body2">Event Manager - <b>{event.type}</b></Typography>
                    <Typography variant="h4">{event.name}</Typography>
                    <Typography>START &nbsp;{formatZuluDate(event.start)} (IN {getDuration(new Date(), event.start, true).toFixed(2)} days)</Typography>
                    <Typography>END &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{formatZuluDate(event.end)} (+{getDuration(event.start, event.end).toFixed(2)} hours)</Typography>
                    <Divider sx={{ my: 2, }} />
                    <ButtonGroup variant="outlined" color="inherit" size="large">
                        <Tooltip title={event.hidden ? 'You must show the event to view information.' : 'Event Information Page'}>
                            <Link href={event.hidden ? '' : `/events/${event.id}`} passHref>
                                <IconButton disabled={event.hidden}>
                                    <Info />
                                </IconButton>
                            </Link>
                        </Tooltip>
                        <Tooltip title="Edit Event">
                            <Link href={`/admin/events/${event.id}`} passHref>
                                <IconButton>
                                    <Edit />
                                </IconButton>
                            </Link>
                        </Tooltip>
                    </ButtonGroup>
                    <Divider sx={{ my: 2, }} />
                    <Stack direction="row" spacing={2}>
                        <ToggleVisibilityButton event={event} />
                        <ArchiveToggleButton event={event} />
                    </Stack>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <Typography variant="h6">Positions & Requests</Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Controller</TableCell>
                                    <TableCell>Solo (if applicable)</TableCell>
                                    <TableCell>Requested Position</TableCell>
                                    <TableCell>Requested Time</TableCell>
                                    <TableCell>Notes</TableCell>
                                    <TableCell>Final Position</TableCell>
                                    <TableCell>Final Time</TableCell>
                                    <TableCell>Final Notes</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {positions.map((position) => position.user && (
                                    <TableRow key={position.id}>
                                        <TableCell>{position.user?.firstName} {position.user?.lastName} ({getRating(position.user?.rating || 0)})</TableCell>
                                        <TableCell>{position.soloCert ? 
                                        <Tooltip title={`${position.soloCert.position} (E: ${formatZuluDate(position.soloCert.expires)})`}>
                                            <>
                                                {getIconForCertificationOption('SOLO')}
                                            </>
                                        </Tooltip>
                                        : ''}</TableCell>
                                        <TableCell>{position.requestedPosition}</TableCell>
                                        <TableCell>
                                            <Tooltip title={`${formatZuluDate(position.requestedStartTime)} - ${formatZuluDate(position.requestedEndTime)}`}>
                                                <div style={{ position: 'relative', height: '50px', backgroundColor: 'lightblue', width: '100%' }}>
                                                    {positions.map((position) => {
                                                        const { startPercentage, endPercentage } = getTimeRectangle(new Date(event.start), new Date(position.requestedStartTime), new Date(event.end), new Date(position.requestedEndTime));
                                                        return (
                                                            <div key={position.id} style={{ position: 'absolute', left: `${startPercentage}%`, width: `${endPercentage - startPercentage}%`, height: '100%', backgroundColor: 'darkblue' }} />
                                                        );
                                                    })}
                                                </div>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>{position.notes}</TableCell>
                                        <TableCell>{position.finalPosition}</TableCell>
                                        <TableCell>
                                            <Tooltip title={`${formatZuluDate(position.finalStartTime || position.requestedStartTime)} - ${formatZuluDate(position.finalEndTime || position.requestedEndTime)}`}>
                                                <div style={{ position: 'relative', height: '50px', backgroundColor: 'lightblue', width: '100%' }}>
                                                    {positions.map((position) => {
                                                        const { startPercentage, endPercentage } = getTimeRectangle(new Date(event.start), new Date(position.finalStartTime || position.requestedStartTime), new Date(event.end), new Date(position.finalEndTime || position.requestedEndTime));
                                                        return (
                                                            <div key={position.id} style={{ position: 'absolute', left: `${startPercentage}%`, width: `${endPercentage - startPercentage}%`, height: '100%', backgroundColor: 'darkblue' }} />
                                                        );
                                                    })}
                                                </div>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell>{position.finalNotes}</TableCell>
                                        <TableCell>
                                            <ButtonGroup variant="outlined" color="inherit" size="small">
                                                <Tooltip title="Edit Position">
                                                    <Link href={`/admin/events/${event.id}/positions/${position.id}`} passHref>
                                                        <IconButton>
                                                            <Edit />
                                                        </IconButton>
                                                    </Link>
                                                </Tooltip>
                                            </ButtonGroup>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
        </Stack>
    );

}

const getTimeRectangle = (eventStart: Date, start: Date, eventEnd: Date, end: Date) => {
    const totalDuration = eventEnd.getTime() - eventStart.getTime();
    const startOffset = start.getTime() - eventStart.getTime();
    const endOffset = end.getTime() - eventStart.getTime();

    const startPercentage = (startOffset / totalDuration) * 100;
    const endPercentage = (endOffset / totalDuration) * 100;

    return { startPercentage, endPercentage };
};

const getSoloCertification = async (user: User) => {
    return prisma.soloCertification.findFirst({
        where: {
            userId: user.id,
        },
    });
}