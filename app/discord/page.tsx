import {Button, Card, CardContent, Stack, Typography} from '@mui/material';
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import {Error} from "@mui/icons-material";
import LinkDiscordButton from '@/components/Profile/LinkDiscordButton';


export default async function Page() {

    const session = await getServerSession(authOptions);

    return (
        <Stack direction="column" spacing={2}>
            <Card>
                <CardContent>
                    <Typography variant="h5">Discord Information</Typography>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <Typography variant="h6">Our Discord Server is open to all VATSIM members.</Typography>
                    <Typography variant="body1" sx={{my: 1,}}>Join our Discord server to get the latest information on
                        events, training, and more!</Typography>
                    {session && <Button variant="contained" size="large" href='https://discord.gg/MuMR4wZeqT'>Join
                        Discord</Button>}
                    {!session &&
                        <Typography sx={{display: 'flex', alignItems: 'center', gap: 1,}}><Error color="error"/> Login
                            to access Discord</Typography>}

                    <div className='mt-5'>
                        {session?.user ? <LinkDiscordButton user={session.user}/> : ''}
                    </div>
                </CardContent>
            </Card>
        </Stack>
    );
}