'use client';

import { useTheme } from "@emotion/react";
import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Autocomplete, Box, Button, Chip, FormControl, FormControlLabel, FormLabel, Grid2, Radio, RadioGroup, Stack, TextField, ToggleButton, ToggleButtonGroup, Typography } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Event, EventType } from "@prisma/client";
import MarkdownEditor from "@uiw/react-markdown-editor";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import Form from "next/form";
import { useState } from "react";
import FormSaveButton from "../Form/FormSaveButton";
import { upsertEvent } from "@/actions/event";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function EventForm({ event }: { event?: Event, }) {
    
    const theme = useTheme();
    const router = useRouter();

    const [open, setOpen] = useState<number>(0);
    const [bannerUploadType, setBannerUploadType] = useState<'file' | 'url'>('file');

    const [name, setName] = useState<string>(event?.name || '');
    const [type, setType] = useState<EventType | undefined>(event?.type);
    const [bannerUrl, setBannerUrl] = useState<string>('');
    const [description, setDescription] = useState<string>(event?.description || '');
    const [featuredFields, setFeaturedFields] = useState<string[]>(event?.featuredFields || []);

    const handleSubmit = async (formData: FormData) => {

        formData.set('name', name);
        formData.set('type', type || EventType.SINGLE);
        formData.set('bannerUrl', bannerUrl);
        formData.set('description', description);
        formData.set('featuredFields', JSON.stringify(featuredFields));

        const {event: newEvent, errors} = await upsertEvent(formData);

        if (errors) {
            toast.error(errors.map((error) => error.message).join('.  '));
            return false;
        }

        if (event) {
            toast.success('Event updated successfully.');
        } else {
            toast.success('Event created successfully.');
            router.push(`/admin/events/${newEvent.id}/manager`);

            setDescription('');
            setFeaturedFields([]);
            setBannerUploadType('file');
        }
    }

    const handleOpen = (panel: number) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setOpen(isExpanded ? panel : -1);
    }

    dayjs.extend(utc);

    const NextButton = 
        <Stack direction="row" justifyContent="end" spacing={1}>
            <Button type="button" color="inherit" onClick={() => setOpen((prev) => prev - 1)} disabled={open <= 0}>Back</Button>
            <Button type="button" variant="contained" color="inherit" onClick={() => setOpen((prev) => prev + 1)}>Next</Button>
        </Stack>
    

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="en">
            <Form action={handleSubmit}>
                <input type="hidden" name="id" value={event?.id || ''} />
                <Box sx={{ my: 2, }}>
                    <Accordion expanded={open === 0} onChange={handleOpen(0)}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="h6">Basic Information</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Grid2 container columns={2} spacing={2}>
                                <Grid2 size={2}>
                                    <TextField fullWidth variant="filled" name="name" label="Event Name" value={name} onChange={(e) => setName(e.target.value)} />
                                </Grid2>
                                <Grid2 size={1}>
                                    <DateTimePicker sx={{ width: '100%', }} name="start" label="Start" defaultValue={dayjs.utc(event?.start || new Date())} />
                                </Grid2>
                                <Grid2 size={1}>
                                    <DateTimePicker sx={{ width: '100%', }} name="end" label="End" defaultValue={dayjs.utc(event?.end || new Date())} />
                                </Grid2>
                                <Grid2 size={2}>
                                    {NextButton}
                                </Grid2>
                            </Grid2>
                        </AccordionDetails>
                    </Accordion>

                    <Accordion expanded={open === 1} onChange={handleOpen(1)}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="h6">Event Type</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <FormControl fullWidth>
                                <RadioGroup value={type} onChange={(e, v) => setType(v as EventType)}>
                                    {Object.keys(EventType).map((type) => (
                                        <FormControlLabel sx={{ mb: 2, }} key={type} value={type} control={<Radio />} label={(
                                            <>
                                                <Typography variant="subtitle1">{type}</Typography>
                                                <Typography variant="subtitle2">{getDescription(type as EventType)}</Typography>
                                            </>
                                        )} />
                                    ))}
                                </RadioGroup>
                            </FormControl>
                            {NextButton}                        
                        </AccordionDetails>
                    </Accordion>

                    <Accordion expanded={open === 2} onChange={handleOpen(2)}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="h6">Description</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Box sx={{ mb: 2, }} data-color-mode={(theme as any).palette.mode}>
                                <MarkdownEditor
                                    enableScroll={false}
                                    
                                    minHeight="400px"
                                    value={description}
                                    onChange={(d) => setDescription(d)}
                                />
                            </Box>
                            {NextButton}
                        </AccordionDetails>
                    </Accordion>

                    <Accordion expanded={open === 3} onChange={handleOpen(3)}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="h6">Banner Image or URL</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <ToggleButtonGroup
                                    fullWidth
                                    color="primary"
                                    value={bannerUploadType}
                                    exclusive
                                    sx={{ mb: 1, }}
                                    onChange={(event, value) => setBannerUploadType(value)}
                                >
                                    <ToggleButton value="file">File</ToggleButton>
                                    <ToggleButton value="url">URL</ToggleButton>
                            </ToggleButtonGroup>
                            <Box sx={{ height: 100, mb: 2, }}>
                                {bannerUploadType === "file" ?
                                    <input type="file"                                 
                                    accept="image/*" 
                                    name="bannerImage" /> :
                                    <TextField variant="filled" type="url" fullWidth value={bannerUrl} label="Image URL" onChange={(e) => setBannerUrl(e.target.value)}/>}
                            </Box>
                            {NextButton}                        
                        </AccordionDetails>
                    </Accordion>

                    <Accordion expanded={open === 4} onChange={handleOpen(4)}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="h6">Featured Fields</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Autocomplete
                                sx={{mb: 2,}}
                                multiple
                                options={[]}
                                value={featuredFields}
                                freeSolo
                                renderTags={(value: readonly string[], getTagProps) =>
                                    value.map((option: string, index: number) => {
                                        const {key, ...tagProps} = getTagProps({index});
                                        return (
                                            <Chip variant="filled" label={option} key={key} {...tagProps} />
                                        );
                                    })
                                }
                                onChange={(event, value) => {
                                    setFeaturedFields(value.map((v) => v.toUpperCase()));
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        name="featuredFields"
                                        variant="filled"
                                        helperText="Fields that are featured on the event page."
                                        label="Airports (ICAO or IATA)"
                                        placeholder="ICAO or IATA codes only (type and press ENTER after each one)"
                                    />
                                )}
                            />
                            {NextButton}                        
                        </AccordionDetails>
                    </Accordion>

                    <Accordion expanded={open === 5} onChange={handleOpen(5)}>
                        <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="h6">Important Event Information</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <ul>
                                <li>
                                    <Typography gutterBottom>By default, when an event is created, it is hidden from the calendar or list view.</Typography>
                                </li>
                                <li>
                                    <Typography gutterBottom>This event will be archived, not deleted, <b>24 hours</b> after the published end date.  This can be reverted through the event manager.</Typography>
                                </li>
                                <li>
                                    <Typography gutterBottom>Create, publish, modify, and delete positions through the Event Manager, which you will be redirected to after submission.</Typography>
                                </li>
                                <li>
                                    <Typography gutterBottom>Editing this event later on will have no impact on the Event Manager, since it only deals with positions.</Typography>
                                </li>
                                <li>
                                    <Typography gutterBottom>You can un-hide this event from the events manager among other common tasks.</Typography>
                                </li>
                                <li>
                                    <Typography gutterBottom fontWeight="bold">You will be notified of any errors in your submission after you submit the form.  All changes will be saved as long as you dont leave this page or refresh.</Typography>
                                </li>
                            </ul>
                            {NextButton}                        
                        </AccordionDetails>
                    </Accordion>
                </Box>
                <FormSaveButton text={event ? 'Update' : 'Create'} />
            </Form>
        </LocalizationProvider>
    );
}

const getDescription = (type: EventType) => {
    switch (type) {
        case EventType.SINGLE:
            return 'An event consisting of only one primary ARTCC: this one.';
        case EventType.SINGLE_SUPPORT:
            return 'An event consisting of only one primary ARTCC, which this ARTCC is supporting';
        case EventType.MULTIPLE:
            return 'An event consisting of multiple primary ARTCCs.  This ARTCC is one of the primary ARTCCs.';
        case EventType.MULTIPLE_SUPPORT:
            return 'An event consisting of multiple primary ARTCCs.  This ARTCC is supporting one or more of the primary ARTCCs.';
        case EventType.GROUP_FLIGHT:
            return 'A group flight event requested by a third party.';
        case EventType.TRAINING:
            return 'A training event or session involving one or more students.';
        default:
            return '';
    }
}