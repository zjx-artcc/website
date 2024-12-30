'use client';

import { togglePositionsLocked } from "@/actions/eventPosition";
import { Button } from "@mui/material";
import { Event } from "@prisma/client";

export default function TogglePositionsLockButton({ event }: { event: Event, }) {
    return (
        <Button variant={event.positionsLocked ? 'contained' : 'outlined'} color={event.positionsLocked ? 'secondary' : 'error'} onClick={() => togglePositionsLocked(event)} disabled={!!event.archived || event.hidden}>{event.positionsLocked ? 'Unlock' : 'Lock' }</Button>
    );
}