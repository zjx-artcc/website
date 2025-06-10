import {ReactNode} from "react";
import type {Metadata} from "next";
import {AppRouterCacheProvider} from "@mui/material-nextjs/v14-appRouter";
import {Poppins} from 'next/font/google';
import {Container, CssBaseline, ThemeProvider} from "@mui/material";
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/700.css';
import './globals.css';
import 'react-toastify/dist/ReactToastify.css';
import theme from "@/theme/theme";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";
import {ToastContainer} from "react-toastify";
import {GoogleTagManager} from "@next/third-parties/google";
import InitColorSchemeScript from "@mui/system/InitColorSchemeScript";
import BroadcastViewer from "@/components/BroadcastViewer/BroadcastViewer";
import {getServerSession} from "next-auth";
import {authOptions} from "@/auth/auth";

import * as Sentry from "@sentry/nextjs";

export const metadata: Metadata = {
    title: "Virtual Jacksonville ARTCC",
    description: "The Virtual Jacksonville ARTCC is a community of pilots and air traffic controllers on VATSIM who come together to enjoy the art of flight simulation.",
    other: {
        ...Sentry.getTraceData(),
    }
};

const googleAnalyticsId = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

const poppins = Poppins({
    weight: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
    variable: '--font-poppins',
});

export default async function RootLayout({
  children,
}: Readonly<{
    children: ReactNode;
}>) {

    const session = await getServerSession(authOptions);

  return (
      <html lang="en" suppressHydrationWarning>
      <body className={poppins.variable}>
    <AppRouterCacheProvider>
        <ThemeProvider theme={theme}>
            <CssBaseline/>
            <GoogleTagManager gtmId={googleAnalyticsId || ''}/>
            <InitColorSchemeScript attribute="class" defaultMode="system"/>
            <div>
                {session?.user && <BroadcastViewer user={session.user}/>}
                <Navbar/>
                <Container maxWidth="xl" sx={{marginTop: 2,}}>
                    {children}
                </Container>
                <Footer/>
                <ToastContainer theme="dark"/>
            </div>
        </ThemeProvider>
    </AppRouterCacheProvider>
    </body>
    </html>
  );
}
