'use client';
import { Autocomplete, Button, Grid2, TextField, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Event, EventPosition } from "@prisma/client";
import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import Form from "next/form";
import { useState } from "react";
import FormSaveButton from "../Form/FormSaveButton";
import { Add, Delete } from "@mui/icons-material";
import { deleteEventPosition, saveEventPosition } from "@/actions/eventPosition";
import { toast } from "react-toastify";

export default function EventPositionRequestForm({ event, eventPosition }: { event: Event, eventPosition?: EventPosition | null, }) {

    dayjs.extend(utc);

    const [position, setPosition] = useState(eventPosition?.requestedPosition || '');
    const [start, setStart] = useState<Dayjs | null>(dayjs.utc(eventPosition?.requestedStartTime || event.start));
    const [end, setEnd] = useState<Dayjs | null>(dayjs.utc(eventPosition?.requestedEndTime || event.end));
    const [notes, setNotes] = useState(eventPosition?.notes || '');

    const handleSubmit = async (formData: FormData) => {

        if (eventPosition || event.positionsLocked) return;

        formData.set('eventId', event.id);
        formData.set('requestedPosition', position);
        formData.set('requestedStartTime', start!.toISOString());
        formData.set('requestedEndTime', end!.toISOString());
        formData.set('notes', notes);

        const { errors } = await saveEventPosition(event, formData);

        if (errors) {
            toast.error(errors.map((error) => error.message).join('.  '));
            return;
        }

        toast.success('Position requested successfully!');

    }

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
           <Form action={handleSubmit}>
                <Grid2 container columns={6} spacing={2}>
                    <Grid2 size={{ xs: 6, md: 2, }}>
                        <Autocomplete
                            disabled={!!eventPosition || event.positionsLocked}
                            freeSolo
                            fullWidth
                            options={event.presetPositions}
                            renderInput={(params) => <TextField {...params} variant="filled" label="Requested Position" />}
                            inputValue={position}
                            onInputChange={(e, value) => setPosition(value)}
                        />
                    </Grid2>
                    <Grid2 size={{ xs: 6, sm: 3, md: 2, }}>
                        <DateTimePicker sx={{ width: '100%', }} disabled={!!eventPosition || event.positionsLocked} disablePast minDateTime={dayjs.utc(event.start)} maxDateTime={dayjs.utc(event.end)} name="start" label="Requested Start" value={start} onChange={setStart} />
                    </Grid2>
                    <Grid2 size={{ xs: 6, sm: 3, md: 2, }}>
                        <DateTimePicker sx={{ width: '100%', }} disabled={!!eventPosition || event.positionsLocked} disablePast minDateTime={dayjs.utc(event.start)} maxDateTime={dayjs.utc(event.end)} name="end" label="Requested End" value={end} onChange={setEnd} />
                    </Grid2>
                    <Grid2 size={6}>
                        <TextField variant="filled" fullWidth multiline rows={4} disabled={!!eventPosition || event.positionsLocked} name="notes" label="Notes (optional)" value={notes} onChange={(e) => setNotes(e.target.value)} />
                    </Grid2>
                    <Grid2 size={6}>
                        { !eventPosition && !event.positionsLocked && <FormSaveButton text="Request" icon={<Add />} /> }
                        { eventPosition && !event.positionsLocked && <Button type="button" variant="contained" color="error" startIcon={<Delete />} onClick={() => deleteEventPosition(event, eventPosition.id)}>Delete</Button> }
                        { event.positionsLocked && <Typography sx={{ mt: 2, }}>Positions are locked for this event.</Typography> }
                        <Typography sx={{ mt: 2, }}>You will recieve an email once your final position and time has been published.</Typography>
                    </Grid2>
                </Grid2>
            </Form> 
        </LocalizationProvider>
    )
}