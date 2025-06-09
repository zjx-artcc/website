import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import OperationDataCard from "./OperationDataCard";

export default async function LiveOperationsCard() {
    return (
        <Card>
            <CardContent>
                <Stack direction='column' spacing={2}>
                    <Typography variant='h5'>Live Operations</Typography>

                    <Stack 
                    direction={'row'} 
                    spacing={1} 
                    sx={{overflowX: 'scroll'}}
                    divider={<Divider orientation="vertical" flexItem />}>
                        <OperationDataCard
                            icao={'KMCO'}
                            longName='Orlando Intl. Airport'
                        />
                        <OperationDataCard
                            icao={'KMCO'}
                            longName='Orlando Intl. Airport'
                        />
                        <OperationDataCard
                            icao={'KMCO'}
                            longName='Orlando Intl. Airport'
                        />
                        <OperationDataCard
                            icao={'KMCO'}
                            longName='Orlando Intl. Airport'
                        />
                        <OperationDataCard
                            icao={'KMCO'}
                            longName='Orlando Intl. Airport'
                        />
                        
                    </Stack>
                </Stack>
                
            </CardContent>
        </Card>
    )
}