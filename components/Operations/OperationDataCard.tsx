import { Card, CardContent, Stack, Typography } from "@mui/material";

export default function OperationDataCard({icao, longName, staffing}: Props) {
    return (
        <Card variant='outlined' sx={{width: 200, borderRadius: 2}}>
            <CardContent>
                <Stack direction={'column'} spacing={1} justifyContent={'center'} alignItems={'center'}>
                    <Stack>
                        <Stack direction='row' spacing={2} justifyContent={'center'} alignItems={'center'}>
                            
                            <Typography fontWeight={600} variant='h6'>{icao}</Typography>

                            
                            <Typography variant='body1' sx={{backgroundColor: 'green', padding: '5px', borderRadius: 1}}>VFR</Typography>
                        </Stack>
                        <Typography variant='body2'>{longName}</Typography>
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

interface Props {
    icao: string
    longName: string
    staffing?: string

}