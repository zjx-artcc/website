import { authOptions } from "@/auth/auth";
import { Typography } from "@mui/material";
import { getServerSession } from "next-auth";

const Page = async() => {
    const session = await getServerSession(authOptions);

    if (!session || !session.user.roles.some(r => ["STAFF"].includes(r))) {
        return (
            <Typography variant="h5" textAlign="center">You do not have access to this page.</Typography>
        );
    }

    return (
        <Typography variant='h1'>Manage Operations</Typography>
    )
}

export default Page