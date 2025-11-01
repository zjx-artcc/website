import LiveRegistration from "@/components/Live/LiveRegistration";
import { Card, CardContent, Typography } from "@mui/material";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth/auth";

export default async function Page() {
    const session = await getServerSession(authOptions);

    return (
        <Card>
            <CardContent>
                {session &&
                    <LiveRegistration user={session.user} />
                }
                {!session &&
                    <Typography variant="h5" gutterBottom>You must be logged in to view this page.</Typography>
                }
            </CardContent>
        </Card>
    );
}