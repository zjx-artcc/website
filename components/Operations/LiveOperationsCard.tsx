import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import OperationDataCard from "./OperationDataCard";

export default async function LiveOperationsCard() {
    return (
        <Card>
            <CardContent>
                <Stack direction='column' spacing={2} sx={{overflowX: 'auto', position: 'relative'}}>
                    <Typography variant='h5' position={'sticky'} sx={{left: 2}}>Live Operations</Typography>

                    <Stack 
                    direction={'row'} 
                    spacing={1} 
                    sx={{width: 'max-content'}}
                    divider={<Divider orientation="vertical" flexItem />}>
                        <OperationDataCard
                            icao={'KMCO'}
                            longName='Orlando Intl. Airport'
                        />
                        <OperationDataCard
                            icao={'KJAX'}
                            longName='Jacksonville Intl. Airport'
                        />
                        <OperationDataCard
                            icao={'KSFB'}
                            longName='Sanford Intl. Airport'
                        />
                        <OperationDataCard
                            icao={'KDAB'}
                            longName='Daytona Beach Intl. Airport'
                        />
                        <OperationDataCard
                            icao={'KPNS'}
                            longName='Pensacola Airport'
                        />
                        <OperationDataCard
                            icao={'KTLH'}
                            longName='Tallahassee Airport'
                        />
                        <OperationDataCard
                            icao={'KSAV'}
                            longName='Savannah Airport'
                        />
                        <OperationDataCard
                            icao={'KMYR'}
                            longName='Myrtle Beach Airport'
                        />
                        
                    </Stack>
                </Stack>
                
            </CardContent>
        </Card>
    )
}