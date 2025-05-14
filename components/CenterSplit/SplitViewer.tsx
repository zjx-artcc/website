'use client'
import { Typography } from "@mui/material"
import dynamic from "next/dynamic"
import { useState } from "react"

const Map = dynamic(() => import('./Map'), {ssr: false})

const SplitViewer: React.FC<Props> = ({canEdit}: Props) => {
    const [split, setSplit] = useState<'high' | 'low'>('high')
    return (
        <div className="w-full h-full">
            <Typography variant="h5">Active Center Split</Typography>

            <div className='flex flex-row gap-x-5'>
                <div>
                    <input type='radio' title='High' name='split' value={'high'} checked={split == 'high'} onClick={() => setSplit('high')}/>
                    <label className='ml-2'>High</label>
                </div>

                <div>
                    <input type='radio' title='Low' name='split' value={'low'} checked={split == 'low'} onClick={() => setSplit('low')}/>
                    <label className='ml-2'>Low</label> 
                </div>
            </div>
                

            <Map split={split}/>

            {canEdit ? <button className='p-2 bg-sky-500 mt-2' type='button'>Edit</button> : ''}
        </div>
    )
}

export default SplitViewer

interface Props {
    canEdit?: boolean
}