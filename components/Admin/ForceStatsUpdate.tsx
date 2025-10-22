'use client'
import { getAndComputeStats } from '@/actions/statistics';
import { Button, Grid2, Stack } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { User } from 'next-auth';
import { useState } from 'react';
import { toast } from 'react-toastify';

export default function ForceStatsUpdate({user}: {user: User}) {
    const [startDate, setStartDate] = useState(dayjs(new Date().getTime() - 86400000))
    const [endDate, setEndDate] = useState(dayjs(new Date()))

    const handleClick = async() => {
        if (startDate.isAfter(endDate)) {
            toast.error('Invalid date selection')
            return
        }

        await getAndComputeStats(startDate.toDate(), endDate.toDate(), user);

        toast('Completed!')
    }

    return (
        <Stack spacing={2}>
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale='en'>
                <DatePicker value={startDate} onChange={(e) => setStartDate(e!)} label='from'/>
                <DatePicker value={endDate} onChange={(e) => setEndDate(e!)} label='to'/>
            </LocalizationProvider>

            <Button onClick={handleClick}>
                Update
            </Button>
        </Stack>
    )
}