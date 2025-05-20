import { Typography } from "@mui/material"
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"

const EventModeSelector: React.FC = () => {
    return (
        <div className=''>
                <Typography variant='h6'>Event Mode</Typography>
                <p>Until</p>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker/>
                </LocalizationProvider>
            </div>
    )
}

export default EventModeSelector