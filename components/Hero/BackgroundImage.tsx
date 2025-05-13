import React from 'react';
import Image from "next/image";
import bg from "@/public/img/bg2.jpg";
import {Box} from "@mui/material";
import logo from '@/public/img/logo_large.png'
import Link from 'next/link';

export default function BackgroundImage() {
    return (
        <div style={{position: 'relative'}}>
            <Image src={bg} alt='background' style={{width: '100%', height: '200px', objectFit: 'cover', position: 'initial', margin: 0}}/>
            <Link href='/'>
                <Image src={logo} alt='logo' style={{height: '100px', objectFit: 'contain', position: 'absolute', zIndex: '50', left: 0, top: 50}}/>   
            </Link>
        </div>
    );
}