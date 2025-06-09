'use client';
import React, {useState} from 'react';
import {Button, InputLabel, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {toast} from "react-toastify";
import {submitTrainingAssignmentRequest} from "@/actions/trainingAssignmentRequest";
import { getRating } from '@/lib/vatsim';

export default function AssignedTrainerRequestButton({rating}: Props) {
    const [loading, setLoading] = useState(false);
    const [ratingRequest, setRatingRequest] = useState<string | undefined>('')

    const submit = async () => {
        if (ratingRequest) {
            console.log(ratingRequest);
            setLoading(true);

            const {errors} = await submitTrainingAssignmentRequest(ratingRequest)

            if (errors) {
                toast(errors.join(' '), {type: 'error',});
                setLoading(false);
                return;
            }

            toast('Your training assignment request has been submitted!', {type: 'success',});
            setLoading(false);   
        } else {
            toast.error('Must input training assignment type.')
        }
    }

    return (
        <div className='flex flex-col gap-y-5'>
            <div>
                <InputLabel>Training Type</InputLabel>
                <Select
                    onChange={(e: SelectChangeEvent<string>) => setRatingRequest(e.target.value)}
                    value={ratingRequest}
                >
                    {rating >= 1 ? <MenuItem value={'S1'}>S1</MenuItem> : undefined}
                    {rating >= 2 ?  <MenuItem value={'S2'}>S2</MenuItem> : undefined}
                    {rating >= 3 ? <MenuItem value={'S3'}>S3</MenuItem> : undefined}
                    {rating >= 4  ? <MenuItem value={'C1'}>C1</MenuItem> : undefined}
                    {rating && rating >= 1 ? <MenuItem value={'MCO GND'}>Orlando Ground</MenuItem> : undefined}
                    {rating && rating >= 2 ? <MenuItem value={'MCO TWR'}>Orlando Tower</MenuItem> :undefined}
                    {rating && rating >= 3 ? <MenuItem value={'F11'}>F11 - Central Florida Tracon</MenuItem> : undefined}
                </Select>
            </div>
            

            <Button variant="contained" size="small" onClick={submit} disabled={loading}>Request Training Assignment</Button>
        </div>
    );
}

interface Props {
    rating: number
}