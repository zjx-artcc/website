'use client';
import React, {useEffect, useState} from 'react';
import {TrainingSessionIndicatorWithAll} from "@/components/TrainingSession/TrainingSessionForm";
import {Lesson, TrainingSessionPerformanceIndicatorCriteria} from "@prisma/client";
import {getData} from "@/actions/trainingSessionPerformanceIndicator";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Tooltip
} from "@mui/material";
import {getDisabledCriteria} from "@/actions/performanceIndicator";
import {AddComment, Edit} from "@mui/icons-material";

export default function TrainingSessionPerformanceIndicatorForm({lesson, onChange}: {
    lesson: Lesson,
    onChange: (data: TrainingSessionIndicatorWithAll) => void
}) {

    const [data, setData] = useState<TrainingSessionIndicatorWithAll>();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [comment, setComment] = useState('');
    const [openCriteria, setOpenCriteria] = useState<TrainingSessionPerformanceIndicatorCriteria>();

    useEffect(() => {
        getData(lesson.id).then((newData) => {
            if (!newData) return;
            setData({
                id: newData.id,
                sessionId: '',
                categories: newData.template.categories.map((category) => ({
                    id: category.id,
                    name: category.name,
                    order: category.order,
                    sessionId: '',
                    criteria: category.criteria.map((criterion) => ({
                        id: criterion.id,
                        order: criterion.order,
                        disabled: false,
                        comments: null,
                        marker: null,
                        categoryId: '',
                        name: criterion.name,
                    })),
                })),
            });
            getDisabledCriteria(lesson.id).then((dc) => {
                if (!dc) return;
                setData((prev) => {
                    if (!prev) return prev;
                    return {
                        ...prev,
                        categories: prev.categories.map((category) => ({
                            ...category,
                            criteria: category.criteria.map((c) => ({
                                ...c,
                                disabled: dc.includes(c.id),
                            })),
                        })),
                    };
                });
            });
        });
    }, [lesson.id]);

    useEffect(() => {
        if (!data) return;
        onChange(data);
    }, [data])

    const handleObserved = (criterion: TrainingSessionPerformanceIndicatorCriteria) => {
        if (criterion.disabled) return;
        setData((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                categories: prev.categories.map((category) => ({
                    ...category,
                    criteria: category.criteria.map((c) => c.id === criterion.id ? {
                        ...c,
                        marker: c.marker === 'OBSERVED' ? null : 'OBSERVED'
                    } : c),
                })),
            };
        });
    }

    const handleSatisfactory = (criterion: TrainingSessionPerformanceIndicatorCriteria) => {
        if (criterion.disabled) return;
        setData((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                categories: prev.categories.map((category) => ({
                    ...category,
                    criteria: category.criteria.map((c) => c.id === criterion.id ? {
                        ...c,
                        marker: c.marker === 'SATISFACTORY' ? null : 'SATISFACTORY'
                    } : c),
                })),
            };
        });
    }

    const handleNeedsImprovement = (criterion: TrainingSessionPerformanceIndicatorCriteria) => {
        if (criterion.disabled) return;
        setData((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                categories: prev.categories.map((category) => ({
                    ...category,
                    criteria: category.criteria.map((c) => c.id === criterion.id ? {
                        ...c,
                        marker: c.marker === 'NEEDS_IMPROVEMENT' ? null : 'NEEDS_IMPROVEMENT'
                    } : c),
                })),
            };
        });
    }

    const handleUnsatisfactory = (criterion: TrainingSessionPerformanceIndicatorCriteria) => {
        if (criterion.disabled) return;
        setData((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                categories: prev.categories.map((category) => ({
                    ...category,
                    criteria: category.criteria.map((c) => c.id === criterion.id ? {
                        ...c,
                        marker: c.marker === 'UNSATISFACTORY' ? null : 'UNSATISFACTORY'
                    } : c),
                })),
            };
        });
    }

    const openDialog = (c: TrainingSessionPerformanceIndicatorCriteria) => {
        if (c.disabled) return;
        setOpenCriteria(c);
        setComment(c.comments || '');
        setDialogOpen(true);
    }

    const saveComment = () => {
        if (openCriteria?.disabled) return;
        setData((prev) => {
            if (!prev) return prev;
            return {
                ...prev,
                categories: prev.categories.map((category) => ({
                    ...category,
                    criteria: category.criteria.map((c) => c.id === openCriteria?.id ? {...c, comments: comment} : c),
                })),
            };
        });
        setDialogOpen(false);
    }

    return (
        <>
            <TableContainer>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Category</TableCell>
                            <TableCell>Criteria</TableCell>
                            <TableCell sx={{textAlign: 'center',}}>Observed</TableCell>
                            <TableCell sx={{textAlign: 'center',}}>Comment</TableCell>
                            <TableCell sx={{textAlign: 'center',}}>Satisfactory</TableCell>
                            <TableCell sx={{textAlign: 'center',}}>Needs Improvement</TableCell>
                            <TableCell sx={{textAlign: 'center',}}>Unsatisfactory</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data?.categories.map((category) => {
                            const {criteria} = category;

                            return criteria.map((criterion, index) => (
                                <TableRow key={criterion.id}>
                                    {index === 0 && <TableCell rowSpan={criteria.length}>{category.name}</TableCell>}
                                    <TableCell sx={{height: 40,}}>{criterion.name}</TableCell>
                                    <TableCell sx={{
                                        border: 1,
                                        cursor: 'pointer',
                                        background: criterion.disabled ? 'rgba(191,191,191,0.2)' : criterion.marker === 'OBSERVED' ? 'rgba(163,55,234,0.2)' : 'inherit',
                                    }} onClick={() => handleObserved(criterion)}></TableCell>
                                    <TableCell sx={{
                                        border: 1,
                                        background: criterion.disabled ? 'rgba(191,191,191,0.2)' : 'inherit',
                                    }}>
                                        <Box
                                            sx={{textAlign: 'center', display: criterion.disabled ? 'none' : 'block',}}>
                                            <Tooltip title={criterion.comments || ''}>
                                                <IconButton size="small" onClick={() => openDialog(criterion)}>
                                                    {criterion.comments ? <Edit fontSize="small"/> :
                                                        <AddComment fontSize="small"/>}
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </TableCell>
                                    <TableCell sx={{
                                        border: 1,
                                        cursor: 'pointer',
                                        background: criterion.disabled ? 'rgba(191,191,191,0.2)' : criterion.marker === 'SATISFACTORY' ? 'rgba(0, 200, 0, 0.2)' : 'inherit',
                                    }} onClick={() => handleSatisfactory(criterion)}></TableCell>
                                    <TableCell sx={{
                                        border: 1,
                                        cursor: 'pointer',
                                        background: criterion.disabled ? 'rgba(191,191,191,0.2)' : criterion.marker === 'NEEDS_IMPROVEMENT' ? 'rgba(244,146,0,0.2)' : 'inherit',
                                    }} onClick={() => handleNeedsImprovement(criterion)}></TableCell>
                                    <TableCell sx={{
                                        border: 1,
                                        cursor: 'pointer',
                                        background: criterion.disabled ? 'rgba(191,191,191,0.2)' : criterion.marker === 'UNSATISFACTORY' ? 'rgba(200, 0, 0, 0.2)' : 'inherit',
                                    }} onClick={() => handleUnsatisfactory(criterion)}></TableCell>
                                </TableRow>
                            ));
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
                <DialogTitle>Add comment</DialogTitle>
                <DialogContent>
                    <DialogContentText>{openCriteria?.name}</DialogContentText>
                    <TextField sx={{my: 2,}} multiline rows={3} fullWidth variant="filled" label="Comment"
                               name="comment" value={comment} onChange={(e) => setComment(e.target.value)}/>
                </DialogContent>
                <DialogActions>
                    <Button color="inherit" onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={() => openCriteria && saveComment()}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}