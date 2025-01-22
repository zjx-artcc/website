import { Alert } from "@mui/material";

export default function ArchivedAlert() {
    return (
        <Alert severity="info">This event is archived and hidden.  In order to unarchive this event, change the start and end dates to the future (if they are not).</Alert>
    );
}