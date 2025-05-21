import { Card, Typography } from "@mui/material"
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { Dayjs } from "dayjs"
import { useRef, useState } from "react"
import { unknown } from "zod"

const EventModeSelector: React.FC = () => {
    const [value, setValue] = useState<Dayjs | null>()
    return (
        <Card className='flex flex-col w-max'>
            <Typography variant='h6'>Event Mode</Typography>
            <p>Until</p>

            <div className='flex flex-row gap-x-5'>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker value={value} onChange={(e) => setValue(e)}/>
                </LocalizationProvider>

                <button className='p-2 w-max bg-sky-500 rounded-md'>
                    Clear
                </button>
            </div>
        </Card>
    )
}

export default EventModeSelector