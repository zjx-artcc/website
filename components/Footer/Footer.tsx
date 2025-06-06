import React from 'react';
import {AppBar, Box, Container, Stack, Toolbar, Tooltip, Typography} from "@mui/material";
import Logo from "@/components/Logo/Logo";
import vatusa from "@/public/img/vatusa.png";
import vatsim from "@/public/img/vatsim.png";
import Image from "next/image";
import Link from "next/link";
import getConfig from "next/config";

const DEV_MODE = process.env['DEV_MODE'] === 'true';

export default function Footer() {

    const { publicRuntimeConfig } = getConfig();

    return (
        <AppBar position="static" sx={{marginTop: 20}} color="secondary">
            <Toolbar>
                <Container maxWidth="md" sx={{padding: 5,}}>
                    <Typography textAlign="center">&copy; 2025 Virtual Jacksonville Air Route Traffic Control Center, All
                        Rights Reserved.</Typography>
                    <Typography textAlign="center" sx={{marginTop: 1,}}>A sub-division of VATUSA, a division of the
                        VATSIM network.</Typography>
                    <Typography textAlign="center" fontWeight={700} sx={{marginTop: 2,}}>NOT FOR REAL WORLD
                        USE
                    </Typography>
                    <Stack direction={{xs: 'column', lg: 'row',}} spacing={5} justifyContent="center"
                           alignItems="center" sx={{marginTop: 3,}}>
                        <Link href="https://www.vatusa.net/" target="_blank">
                            <Image src={vatusa} alt="VATUSA" height={50}/>
                        </Link>
                        <Logo/>
                        <Link href="https://www.vatsim.net/" target="_blank">
                            <Image src={vatsim} alt="VATSIM" height={50}/>
                        </Link>
                    </Stack>
                    <Tooltip title={`Developed by ${publicRuntimeConfig?.author}`}>
                        <Box sx={{mt: 2, textAlign: 'center',}}>
                            <Link href="/changelog" style={{color: 'inherit',textDecoration: 'none'}}>
                                {DEV_MODE &&
                                    <Typography variant="subtitle2" color="limegreen">Development Build</Typography>}
                                {!DEV_MODE && <Typography>v{publicRuntimeConfig?.version}</Typography>}
                            </Link>
                        </Box>
                    </Tooltip>
                    <Stack direction="row" spacing={1} sx={{mt: 2,}} justifyContent="center">
                        <Tooltip title={'vZJX Privacy Policy'}>
                            <Link href="/privacy" style={{color: 'inherit',}}>
                                <Typography textAlign="center">Privacy</Typography>
                            </Link>
                        </Tooltip>
                        <Typography>|</Typography>
                        <Tooltip title={'vZJX Website Public Repository'}>
                            <Link href="https://github.com/zjx-artcc/website" style={{color: 'inherit',}}>
                                <Typography textAlign="center">GitHub</Typography>
                            </Link>
                        </Tooltip>
                        <Typography>|</Typography>
                        <Tooltip title={'License'}>
                            <Link href="/license" style={{color: 'inherit',}}>
                                <Typography textAlign="center">License</Typography>
                            </Link>
                        </Tooltip>
                        <Typography>|</Typography>
                        <Tooltip title={'Credits'}>
                            <Link href="/credits" style={{color: 'inherit',}}>
                                <Typography textAlign="center">Credits</Typography>
                            </Link>
                        </Tooltip>
                    </Stack>
                </Container>
            </Toolbar>
        </AppBar>
    );
}