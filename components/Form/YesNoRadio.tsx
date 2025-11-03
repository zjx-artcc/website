import { FC } from "react";
import { RadioGroup, FormControlLabel, Radio, FormControl, FormLabel, Typography } from "@mui/material";


export default function YesNoRadio({
    label,
    value,
    onChange,
    required=true,
    descriptionYes = "",
    descriptionNo = "",
}: Props) {
    return (
    <FormControl component="fieldset" required={required}>
        <FormLabel component="legend">{label}</FormLabel>


        <RadioGroup value={value === null ? "" : value ? "true" : "false"} onChange={(e) => onChange(e.target.value === "true")}>
            <FormControlLabel
                value="true"
                control={<Radio/>}
                sx={{ mb: 2 }}
                label={
                    <>
                        <Typography variant="subtitle1">Yes</Typography>
                        <Typography variant="subtitle2">{descriptionYes}</Typography>
                    </>
                }
            />


            <FormControlLabel
                value="false"
                control={<Radio />}
                sx={{ mb: 2 }}
                label={
                    <>
                        <Typography variant="subtitle1">No</Typography>
                        <Typography variant="subtitle2">{descriptionNo}</Typography>
                    </>
                }
            />
        </RadioGroup>
    </FormControl>
    )
}


interface Props {
    label: string;
    value: boolean | null;
    onChange: (value: boolean) => void;
    required?: boolean
    descriptionYes?: string
    descriptionNo?: string
}