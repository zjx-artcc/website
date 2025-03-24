import React from 'react';
import Image from "next/image";
import bg from "@/public/img/home-bg.jpg";
import {Box} from "@mui/material";

export default function BackgroundImage() {
    return (
        <Box sx={{zIndex: -10, overflow: 'hidden', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0}}>
            <Image src={bg} alt="vZDC" fill style={{opacity: 0.3, filter: 'blur(1px)'}}/>
        </Box>
    );
}