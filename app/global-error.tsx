'use client';
import React, { useEffect } from 'react';
import {AppRouterCacheProvider} from "@mui/material-nextjs/v13-appRouter";
import theme from "@/theme/theme";
import {CssBaseline, ThemeProvider} from "@mui/material";
import {GoogleTagManager} from "@next/third-parties/google";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import {ToastContainer} from "react-toastify";
import ErrorCard from "@/components/Error/ErrorCard";
import InitColorSchemeScript from "@mui/system/InitColorSchemeScript";
import {Poppins} from "next/font/google";

import * as Sentry from "@sentry/nextjs";

const googleAnalyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

const poppins = Poppins({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-poppins',
});

function GlobalError({error}: { error: Error & { digest?: string } }) {
    
    useEffect(() => {
        Sentry.captureException(error);
    }, [error])

    return (
        <html lang="en" suppressHydrationWarning>
        <body className={poppins.variable}>
        <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <GoogleTagManager gtmId={googleAnalyticsId || ''}/>
                <InitColorSchemeScript attribute="class" defaultMode="system"/>
                <div>
                    <Navbar/>
                    <ErrorCard heading="Unexpected Error" message={error.message}/>
                    <Footer/>
                    <ToastContainer/>
                </div>
            </ThemeProvider>
        </AppRouterCacheProvider>
        </body>
        </html>
    );
}

export default GlobalError;