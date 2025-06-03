'use client';
import React, {useState} from 'react';
import {Button, MenuItem, Select, SelectChangeEvent} from "@mui/material";
import {toast} from "react-toastify";
import {submitTrainingAssignmentRequest} from "@/actions/trainingAssignmentRequest";
import { getRating } from '@/lib/vatsim';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth/auth';

export default async function AssignedTrainerRequestButton() {
    const session = await getServerSession(authOptions);
    const rating = session?.user.rating

    const [loading, setLoading] = useState(false);
    const [ratingRequest, setRatingRequest] = useState<string>('')

    const submit = async () => {
        setLoading(true);

        const {errors,} = await submitTrainingAssignmentRequest(ratingRequest);

        if (errors) {
            toast(errors.join(' '), {type: 'error',});
            setLoading(false);
            return;
        }

        toast('Your training assignment request has been submitted!', {type: 'success',});
        setLoading(false);
    }

    return (
        <div>
            <Button variant="contained" size="small" onClick={submit} disabled={loading}>Request Training
                        Assignment</Button>
            <Select
                label='Training Type'
                onChange={(e: SelectChangeEvent<string>) => setRatingRequest(e.target.value)}
            >
                {rating == 1 ? <MenuItem value={'S1'}>S1</MenuItem> : ''}
                {rating == 2 ?  <MenuItem value={'S2'}>S2</MenuItem> : ''}
                {rating == 3 ? <MenuItem value={'S3'}>S3</MenuItem> : ''}
                {rating == 4  ? <MenuItem value={'C1'}>C1</MenuItem> : ''}
                {rating && rating >= 1 ? <MenuItem value={'MCO GND'}>Orlando Ground</MenuItem> : ''}
                {rating && rating >= 2 ? <MenuItem value={'MCO TWR'}>Orlando Tower</MenuItem> : ''}
                {rating && rating >= 3 ? <MenuItem value={'F11'}>F11 - Central Florida Tracon</MenuItem> : ''}
            </Select>
        </div>
    );
}