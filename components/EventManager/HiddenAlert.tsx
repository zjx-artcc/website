import { Alert } from "@mui/material";

export default function HiddenAlert() {
    return (
        <Alert severity="warning">This event is hidden.  In order to show this event, change the visibility.</Alert>
    );
}