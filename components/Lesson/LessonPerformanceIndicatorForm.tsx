'use client';
import React, {useEffect, useState} from 'react';
import {
    Lesson,
    PerformanceIndicatorCriteria,
    PerformanceIndicatorCriteriaCategory,
    PerformanceIndicatorTemplate
} from "@prisma/client";
import Form from "next/form";
import {
    Autocomplete,
    Box,
    CircularProgress,
    FormControl,
    FormControlLabel,
    FormGroup,
    Switch,
    TextField,
    Typography
} from "@mui/material";
import {
    fetchAllPerformanceIndicators,
    getDisabledCriteria,
    getLessonPerformanceIndicator
} from "@/actions/performanceIndicator";
import {getCriteria} from "@/actions/performanceIndicatorCriteria";
import FormSaveButton from "@/components/Form/FormSaveButton";
import {updateLessonIndicator} from "@/actions/lesson";
import {toast} from "react-toastify";

type CriteriaWithCategory = PerformanceIndicatorCriteria & { category: PerformanceIndicatorCriteriaCategory, };

export default function LessonPerformanceIndicatorForm({lesson}: { lesson: Lesson, }) {

    const [performanceIndicators, setPerformanceIndicators] = useState<PerformanceIndicatorTemplate[]>();
    const [availableCriteria, setAvailableCriteria] = useState<CriteriaWithCategory[]>([]);
    const [disabledCriteria, setDisabledCriteria] = useState<string[]>([]);
    const [selectedPerformanceIndicator, setSelectedPerformanceIndicator] = useState<PerformanceIndicatorTemplate>();

    useEffect(() => {
        fetchAllPerformanceIndicators().then((pis) => {
            setPerformanceIndicators(pis);
            getLessonPerformanceIndicator(lesson.id).then((lpi) => {
                setSelectedPerformanceIndicator(pis.find((pi) => pi.id === lpi?.templateId));
            });
        });
    }, [lesson]);

    useEffect(() => {
        if (selectedPerformanceIndicator) {
            getCriteria(selectedPerformanceIndicator.id).then(setAvailableCriteria);
            getDisabledCriteria(lesson.id).then((criteria) => {
                setDisabledCriteria(criteria || []);
            });
        }
    }, [selectedPerformanceIndicator]);

    const handleSubmit = async () => {
        const performanceIndicatorId = selectedPerformanceIndicator?.id;
        await updateLessonIndicator(lesson.id, performanceIndicatorId, disabledCriteria);

        toast.success('Performance Indicator updated.');
    }

    if (!performanceIndicators) {
        return <CircularProgress/>;
    }

    const toggleCriteriaVisibility = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, checked} = event.target;
        if (checked) {
            setDisabledCriteria(disabledCriteria.filter((c) => c !== name));
        } else {
            setDisabledCriteria([...disabledCriteria, name]);
        }
    }

    return (
        <Form action={handleSubmit}>
            <Autocomplete
                options={performanceIndicators}
                getOptionLabel={(option) => `${option.name}`}
                value={selectedPerformanceIndicator || null}
                onChange={(event, newValue) => {
                    setSelectedPerformanceIndicator(newValue || undefined);
                }}
                renderInput={(params) => <TextField {...params} label="Performance Indicator" variant="filled"/>}
                sx={{mb: 2,}}
            />
            {selectedPerformanceIndicator &&
                <FormControl component="fieldset" variant="standard">
                    <Typography variant="subtitle2">Enabled Criteria:</Typography>
                    <FormGroup>
                        {availableCriteria.map((c) => (
                            <FormControlLabel
                                key={c.id}
                                control={<Switch checked={!disabledCriteria.includes(c.id)}
                                                 onChange={toggleCriteriaVisibility} name={c.id}/>}
                                label={`${c.category.name} - ${c.name}`}
                            />
                        ))}
                    </FormGroup>
                </FormControl>
            }
            <br/>
            <Box sx={{mt: 2,}}>
                <FormSaveButton/>
            </Box>
        </Form>
    );

}