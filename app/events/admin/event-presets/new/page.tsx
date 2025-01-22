import EventPositionPresetForm from "@/components/EventPositionPreset/EventPositionPresetForm";
import { Card, CardContent, Typography } from "@mui/material";

export default async function Page() {
    return (
        <Card>
            <CardContent>
                <Typography variant="h5" gutterBottom>New Event Position Preset</Typography>
                <EventPositionPresetForm />
            </CardContent>
        </Card>
    );
}