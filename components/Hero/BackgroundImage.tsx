import React from 'react';
import Image from "next/image";
import bg from "@/public/img/bg3.jpg";
import {Box} from "@mui/material";
import logo from '@/public/img/logo_large.png'
import Link from 'next/link';

export default function BackgroundImage() {
    return (
        <div style={{position: 'relative', margin: 0, height: '200px'}}>
            <Image src={bg} alt='background' style={{width: '100%', height: '100%', objectFit: 'cover', position: 'initial', margin: 0, objectPosition: '50% 54%'}}/>
            <Link href='/' style={{position: 'absolute', left: 50, top: 50}}>
                <Image src={logo} alt='logo' style={{height: '100px', objectFit: 'contain', zIndex: '50', width: 'max-content'}}/>   
            </Link>
        </div>
    );
}