import React from 'react';
import Image from "next/image";
import bg from "@/public/img/home-bg.jpg";
import {Box} from "@mui/material";

export default function BackgroundImage() {
    return (
        <Box sx={{zIndex: -10, overflow: 'hidden'}}>
            <Image src={bg} alt="vZJX" fill style={{position: 'absolute', opacity: 0.3, filter: 'blur(1px)'}}/>
            <Image src={bg} alt="vZJX" fill style={{position: 'absolute', top: '100%', opacity: 0.3, filter: 'blur(1px)'}}/>
        </Box>
    );
}