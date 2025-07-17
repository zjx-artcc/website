import { getAirportWeather } from "@/actions/operations";
import { Card, CardContent, Stack, Typography } from "@mui/material";

export default async function OperationDataCard({icao, longName, staffing}: Props) {
    const weatherData = await getAirportWeather(icao)
    const bgColor = {
        'VFR': 'bg-green-700',
        'MVFR': 'bg-blue-700',
        'IFR': 'bg-red-700',
        'LIFR': 'bg-fuchsia-700',
        '': 'bg-gray-300'
    }

    if (weatherData) {
        return (
            <Card variant='outlined' sx={{width: 200, borderRadius: 2}}>
                <CardContent>
                    <Stack direction={'column'} spacing={1} justifyContent={'center'} alignItems={'center'}>
                        <Stack>
                            <Stack direction='row' spacing={2} justifyContent={'center'} alignItems={'center'}>
                                
                                <Typography fontWeight={600} variant='h6'>{icao}</Typography>

                                
                                <Typography variant='body1' className={bgColor[weatherData.flight_category]} sx={{padding: '5px', textAlign: 'center', borderRadius: 1, width: '50px'}}>{weatherData.flight_category}</Typography>
                            </Stack>
                            <Typography variant='body2' sx={{textAlign: 'center'}}>{longName}</Typography>
                        </Stack>

                        <Stack direction='row' spacing={2} justifyContent={'space-evenly'} alignItems={'center'}>
                            {staffing ? 
                            <Typography textAlign={'center'} sx={{width: '100px', backgroundColor: '#3E8BCB', padding: '5px', borderRadius: 1}}>{staffing}</Typography>
                            : <Typography textAlign={'center'} sx={{width: '100px', backgroundColor: '#005982', padding: '5px', borderRadius: 1}}>OFFLINE</Typography>}
                            
                            
                        </Stack>
                    </Stack>
                </CardContent>
                
            </Card>
        )
    }
}

interface Props {
    icao: string
    longName: string
    staffing?: string

}