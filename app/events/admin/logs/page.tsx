import React from 'react';
import {Card, CardContent, Typography} from "@mui/material";
import LogTable from "@/components/Logs/LogTable";
import {EVENT_ONLY_LOG_MODELS} from "@/lib/log";

export default async function Page() {

    return (
        <Card>
            <CardContent>
                <Typography variant="h5">Logs</Typography>
                <LogTable onlyModels={EVENT_ONLY_LOG_MODELS}/>
            </CardContent>
        </Card>
    );
}