import React from 'react';
import {Card, CardContent, Typography} from "@mui/material";
import PerformanceIndicatorForm from "@/components/PerformanceIndicator/PerformanceIndicatorForm";

export default async function Page() {
    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>New Performance Indicator</Typography>
                <PerformanceIndicatorForm/>
            </CardContent>
        </Card>
    );
}