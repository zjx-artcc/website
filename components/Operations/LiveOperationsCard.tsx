import { Card, CardContent, Stack, Typography } from "@mui/material";
import OperationDataCard from "./OperationDataCard";

export default async function LiveOperationsCard() {
    return (
        <Card>
            <CardContent>
                <Typography variant='h5'>Live Operations</Typography>

                <Stack direction={'row'}>
                    <OperationDataCard
                        icao={'KMCO'}
                        longName='Orlando Intl. Airport'
                        staffing='OFFLINE'
                    />
                </Stack>
            </CardContent>
        </Card>
    )
}