import React from 'react';
import {Container} from "@mui/material";
import {Metadata} from "next";

export const metadata: Metadata = {
    title: 'Incidents | vZJX',
    description: 'vZJX incidents page',
};

export default async function Layout({children}: { children: React.ReactNode }) {
    return (
        <Container maxWidth="md">
            {children}
        </Container>
    );
}