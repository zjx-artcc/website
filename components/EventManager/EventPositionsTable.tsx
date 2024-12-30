import { EventPositionWithSolo } from "@/app/admin/events/[id]/manager/page";
import { Chip, IconButton, Stack } from "@mui/material";
import { ButtonGroup } from "@mui/material";
import { getIconForCertificationOption } from "@/lib/certification";
import { formatZuluDate } from "@/lib/date";
import { getRating } from "@/lib/vatsim";
import { TableBody, Tooltip } from "@mui/material";
import { CardContent, Table, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Card } from "@mui/material";
import { DeleteForever, Edit } from "@mui/icons-material";
import Link from "next/link";
import { Event, EventPosition } from "@prisma/client";
import TogglePositionsLockButton from "./TogglePositionsLockButton";
import ForcePositionsToggleSwitch from "./ForcePositionsToggleSwitch";
import EventPositionDeleteButton from "./EventPositionDeleteButton";
import EventPositionEditButton from "./EventPositionEditButton";
import EventPositionPublishButton from "./EventPositionPublishButton";
import EventPositionPublishAllButton from "./EventPositionPublishAllButton";

export default async function EventPositionsTable({ event, positions }: { event: Event, positions: EventPositionWithSolo[] }) {

    const getTimeRectangle = (position: EventPosition, eventStart: Date, start: Date, eventEnd: Date, end: Date) => {
        const totalDuration = eventEnd.getTime() - eventStart.getTime();
        const startOffset = start.getTime() - eventStart.getTime();
        const endOffset = end.getTime() - eventStart.getTime();
    
        const startPercentage = (startOffset / totalDuration) * 100;
        const endPercentage = (endOffset / totalDuration) * 100;
    
        return <div style={{ position: 'relative', height: '20px', backgroundColor: 'cyan', width: '80px' }}>
            <div key={position.id} style={{ position: 'absolute', left: `${startPercentage}%`, width: `${endPercentage - startPercentage}%`, height: '100%', backgroundColor: 'orange' }} />
            </div>;
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>Controller Positions</Typography>
                <Stack direction="row" spacing={2} sx={{ my: 2, }}>
                    <EventPositionPublishAllButton event={event} positions={positions} />
                    <TogglePositionsLockButton event={event} />
                    <ForcePositionsToggleSwitch event={event} />
                </Stack>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Controller</TableCell>
                                <TableCell>Solo?</TableCell>
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
                                    <TableCell>
                                        <Link href={`/admin/controller/${position.user.cid}`} passHref target="_blank">
                                            <Chip
                                                label={`${position.user.firstName} ${position.user.lastName} - ${getRating(position.user.rating)}` || 'Unknown'}
                                                size="small"
                                            />
                                        </Link>
                                    </TableCell>
                                    <TableCell>{position.soloCert ? 
                                    <Stack direction="column" alignItems="center">
                                        <Typography variant="caption">{position.soloCert.position}</Typography>
                                        <Typography variant="caption">{formatZuluDate(position.soloCert.expires)}</Typography>
                                    </Stack>
                                    : ''}</TableCell>
                                    <TableCell>{position.requestedPosition}</TableCell>
                                    <TableCell>
                                        <Tooltip title={`${formatZuluDate(position.requestedStartTime)} - ${formatZuluDate(position.requestedEndTime)}`}>
                                            {getTimeRectangle(position, new Date(event.start), new Date(position.requestedStartTime), new Date(event.end), new Date(position.requestedEndTime))}
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>{position.notes}</TableCell>
                                    <TableCell>{position.finalPosition}</TableCell>
                                    <TableCell>
                                        <Tooltip title={`${formatZuluDate(position.finalStartTime || position.requestedStartTime)} - ${formatZuluDate(position.finalEndTime || position.requestedEndTime)}`}>
                                            {getTimeRectangle(position, new Date(event.start), new Date(position.finalStartTime || position.requestedStartTime), new Date(event.end), new Date(position.finalEndTime || position.requestedEndTime))}
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell>{position.finalNotes}</TableCell>
                                    <TableCell>
                                        <ButtonGroup variant="outlined" color="inherit" size="small">
                                            <EventPositionPublishButton event={event} position={position} />
                                            <EventPositionEditButton event={event} position={position} />
                                            <EventPositionDeleteButton event={event} position={position} />
                                        </ButtonGroup>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
}