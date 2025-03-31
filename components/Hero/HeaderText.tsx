import React from 'react';
import {Typography} from "@mui/material";
import {Poppins} from "next/font/google";

const headingFont = Poppins({subsets: ['latin'], weight: ['400']});

export default function HeaderText() {
    return (
        <>
            <Typography {...headingFont.style} variant="h3" sx={{mb: 1}}>Virtual Jacksonville ARTCC</Typography>
            {/*<Typography {...headingFont.style} variant="body1" sx={{mt: 1,}}>Elevating Virtual Excellence</Typography>*/}
        </>
    );
}