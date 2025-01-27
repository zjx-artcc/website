'use client';
import { toggleManualPositionOpen } from "@/actions/eventPosition";
import { FormControlLabel } from "@mui/material";

import { Switch } from "@mui/material";
import { Event } from "@prisma/client";

export default function ForcePositionsToggleSwitch({ event }: { event: Event }) {
    return (
        <FormControlLabel
            control={
                <Switch
                    checked={event.manualPositionsOpen}
                    disabled={!!event.archived}
                    onChange={async () => toggleManualPositionOpen(event)}
                />
            }
            label="Force Positions Lock Setting? (no auto close)"
        />
    );
}