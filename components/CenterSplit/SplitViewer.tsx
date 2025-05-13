'use client'
import { Typography } from "@mui/material"
import dynamic from "next/dynamic"

const Map = dynamic(() => import('./Map'), {ssr: false})

const SplitViewer: React.FC = () => {

    return (
        <div className="w-full h-full border-5">
            <Typography variant="h5">Active Center Split</Typography>
            <Map split='high'/>
        </div>
    )
}

export default SplitViewer