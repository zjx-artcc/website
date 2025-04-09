// components/Feedback/FeedbackForm.tsx
"use client";
import React, {useState} from 'react';
import {User} from "next-auth";
import {Autocomplete, Box, Grid2, Rating, TextField, Typography} from "@mui/material";
import {toast} from "react-toastify";
import {submitFeedback} from "@/actions/feedback";
import {useRouter} from "next/navigation";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import FeedbackFormSubmitButton from "@/components/Feedback/FeedbackFormSubmitButton";
import {checkCaptcha} from "@/lib/captcha";

const groupedPositions = [
    {
        group: 'Center', options: [
            'JAX_30_CTR',
            'JAX_P_CTR',
            'JAX_C_CTR',
            'JAX_A_CTR',
            'JAX_CTR',
        ]
    },
    {
        group: 'Approach/Departure', options:
            [
                'F11_APP',
                'JAX_APP',
                'MYR_APP',
                'DAB_APP',
                'SAV_APP',
                'PNS_APP',
                'TLH_APP',
                'CHS_APP',
            ]
    },
    {
        group: 'Tower', options: [
            'MCO_TWR',
            'JAX_TWR',
            'DAB_TWR',
            'MYR_TWR',
            'SAV_TWR',
            'TLH_TWR',
            'CHS_TWR',
        ]
    },
    {
        group: 'Ground', options: [
            'MCO_GND',
            'JAX_GND',
            'DAB_GND',
            'SAV_GND',
            'PNS_GND',
            'TLH_GND',
            'CHS_GND',
        ]
    },
    {
        group: 'Delivery', options: [
            'MCO_DEL',
            'JAX_DEL',
            'DAB_DEL',
            'SAV_DEL',
            'PNS_DEL',
            'TLH_DEL',
            'CHS_DEL',
        ]
    },
];

export default function FeedbackForm({controllers, user}: { controllers: User[], user: User }) {

    const router = useRouter();
    const {executeRecaptcha,} = useGoogleReCaptcha();
    const [controller, setController] = useState('');
    const [controllerPosition, setControllerPosition] = useState('');

    const handleSubmit = async (formData: FormData) => {

        const recaptchaToken = await executeRecaptcha?.('submit_feedback');
        await checkCaptcha(recaptchaToken);

        const {errors} = await submitFeedback(formData);
        if (errors) {
            toast(errors.map((e) => e.message).join('.  '), {type: 'error'});
            return;
        }
        router.push('/feedback/success');
    }

    return (
        (<Box sx={{mt: 2,}}>
            <form action={handleSubmit}>
                <input type="hidden" name="pilotId" value={user.id}/>
                <input type="hidden" name="controllerId" value={controller}/>
                <input type="hidden" name="controllerPosition" value={controllerPosition}/>
                <Grid2 container columns={2} spacing={2}>
                    <Grid2
                        size={{
                            xs: 2,
                            sm: 1
                        }}>
                        <TextField fullWidth variant="filled" name="pilotName" label="Your Name"
                                   defaultValue={user.fullName} disabled/>
                    </Grid2>
                    <Grid2
                        size={{
                            xs: 2,
                            sm: 1
                        }}>
                        <TextField fullWidth variant="filled" name="pilotEmail" label="Your Email"
                                   defaultValue={user.email} disabled/>
                    </Grid2>
                    <Grid2
                        size={{
                            xs: 2,
                            sm: 1
                        }}>
                        <TextField fullWidth variant="filled" name="pilotCid" label="Your VATSIM CID"
                                   defaultValue={user.cid} disabled/>
                    </Grid2>
                    <Grid2
                        size={{
                            xs: 2,
                            sm: 1
                        }}>
                        <TextField fullWidth variant="filled" name="pilotCallsign" label="Your Callsign*"/>
                    </Grid2>
                    <Grid2
                        size={{
                            xs: 2,
                            sm: 1
                        }}>
                        <Autocomplete
                            fullWidth
                            options={controllers}
                            getOptionLabel={(option) => `${option.firstName} ${option.lastName} (${option.cid})`}
                            value={controllers.find((u) => u.id === controller) || null}
                            onChange={(event, newValue) => {
                                setController(newValue ? newValue.id : '');
                            }}
                            renderInput={(params) => <TextField {...params} required label="Controller"/>}
                        />
                    </Grid2>
                    <Grid2
                        size={{
                            xs: 2,
                            sm: 1
                        }}>
                        <Autocomplete
                            freeSolo
                            fullWidth
                            options={groupedPositions.flatMap(group => group.options)}
                            groupBy={(option) => groupedPositions.find(group => group.options.includes(option))?.group || ''}
                            value={controllerPosition}
                            onChange={(event, newValue) => {
                                setControllerPosition(newValue || '');
                            }}
                            onInputChange={(event, newInputValue) => {
                                setControllerPosition(newInputValue);
                            }}
                            renderInput={(params) => <TextField {...params}
                                                                helperText="You can pick from the selections OR type in a custom position."
                                                                label="Position Staffed" required/>}
                        />
                    </Grid2>
                    <Grid2 size={2}>
                        <Typography component="legend">Rating*</Typography>
                        <Rating
                            name="rating"
                            defaultValue={4}
                        />
                    </Grid2>
                    <Grid2 size={2}>
                        <TextField fullWidth multiline rows={5} variant="filled" name="comments"
                                   label="Additional Comments"/>
                    </Grid2>
                    <Grid2 size={2}>
                        <FeedbackFormSubmitButton/>
                    </Grid2>
                </Grid2>
            </form>
        </Box>)
    );
}