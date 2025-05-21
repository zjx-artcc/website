'use client'
import { isEventMode, setEventMode } from "@/actions/centerSplit"
import { InfoRounded, Label } from "@mui/icons-material"
import { Card, CardContent, FormControlLabel, IconButton, Switch, Tooltip, Typography } from "@mui/material"
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs, { Dayjs } from "dayjs"
import utc from "dayjs/plugin/utc"
import { totalmem } from "os"
dayjs.extend(utc)
import { useState } from "react"
import { toast } from "react-toastify"

const EventModeSelector: React.FC<Props> = ({eventMode, eventModeUntil}: Props) => {
    const [value, setValue] = useState<Dayjs | null>(eventModeUntil ? dayjs(eventModeUntil) : null)
    const [enabled, setEnabled] = useState<boolean>(eventMode)

    const handleSave = async() => {
        if (enabled && value) {
            await setEventMode(enabled, value.toDate())
            toast.success('Updated!')
            window.location.reload()
        } else if (enabled && !value) {
            toast.error('Must input end time.')
        } else {
            await setEventMode(false, undefined)
            toast.success('Updated!')
        }
    }

    return (
        <Card className='flex flex-col w-max'>
            <CardContent>
                <div className='flex flex-row items-center justify-start'>
                    <Typography variant='h6'>Event Mode</Typography>
                    <Tooltip title='Event mode is only to available to event staff and will disable the automatic features of the website to determine center splits and airport operations.'>
                        <IconButton>
                            <InfoRounded/>
                        </IconButton>
                    </Tooltip>
                </div>
                
                <FormControlLabel control={<Switch checked={enabled} onClick={() => setEnabled(!enabled)} />} label='Enabled'/>
                
                <div hidden={!enabled} className='mt-5 flex flex-col gap-y-5'>
                    <div>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateTimePicker 
                            timezone={'UTC'} 
                            ampm={false}
                            value={value}
                            onChange={(e) => setValue(e ? e.utc() : null)}
                            label={'Enabled Until (UTC)'}/>
                        </LocalizationProvider>
                    </div>
                </div>

                <div className='flex gap-x-2 mt-2'>
                    <button className='p-2 w-max bg-sky-500 rounded-md' onClick={() => handleSave()}>
                        Save
                    </button>
                </div>
            </CardContent>
        </Card>
    )
}

export default EventModeSelector

interface Props {
    eventMode: boolean
    eventModeUntil: Date | undefined
}