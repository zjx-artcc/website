import EventForm from "@/components/Event/EventForm";
import { Card, CardContent, Typography } from "@mui/material";

export default async function Page() {
    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>New Event</Typography>
                <EventForm />
            </CardContent>
        </Card>
    );
}