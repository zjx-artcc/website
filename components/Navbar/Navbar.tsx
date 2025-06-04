import React from 'react';
import {AppBar, Box, Stack, Toolbar} from "@mui/material";
import ColorModeSwitcher from "@/components/Navbar/ColorModeSwitcher";
import NavButtons from "@/components/Navbar/NavButtons";
import LoginButton from "@/components/Navbar/LoginButton";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";
import RootSidebar from "@/components/Sidebar/RootSidebar";
import AppPickerMenu from "@/components/AppPicker/AppPickerMenu";
import BackgroundImage from '../Hero/BackgroundImage';

export default async function Navbar() {

    const session = await getServerSession(authOptions);

    return (
        <>
            <BackgroundImage/>
            <AppBar position='sticky' color="secondary" sx={{borderBottom: 2, borderBottomColor: 'secondary'}}>
                
                <Toolbar style={{backgroundColor: '#0080c2'}}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <RootSidebar session={session}/>
                        <Box sx={{display: {xs: 'none', xl: 'flex',},}}>
                            <NavButtons/>
                        </Box>
                    </Stack>
                    <span style={{flexGrow: 1,}}></span>
                    <Box>
                        <ColorModeSwitcher/>
                        <AppPickerMenu/>
                        <Box sx={{display: {xs: 'none', sm: 'inline-block',},}}>
                            <LoginButton session={session}/>
                        </Box>
                    </Box>
                </Toolbar>
            </AppBar>
        </>
        
    );
}