import React from 'react';
import {User} from "next-auth";
import {
    Card,
    CardContent,
    Typography
} from "@mui/material";

export default async function EventSignupCard({user}: { user: User, }) {

    return (
        <Card sx={{height: '100%',}}>
            <CardContent>
                <Typography variant="h6" sx={{mb: 1,}}>Event Signups</Typography>
            </CardContent>
        </Card>
    );
}