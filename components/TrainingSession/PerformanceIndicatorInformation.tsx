import React from 'react';
import {TrainingSessionIndicatorWithAll} from "@/components/TrainingSession/TrainingSessionForm";
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from "@mui/material";
import PerformanceIndicatorCommentDialog from "@/components/TrainingSession/PerformanceIndicatorCommentDialog";

export default function PerformanceIndicatorInformation({performanceIndicator}: {
    performanceIndicator: TrainingSessionIndicatorWithAll
}) {
    return (
        <TableContainer>
            <Table size="small">
                <TableHead>
                    <TableRow>
                        <TableCell>Category</TableCell>
                        <TableCell>Criteria</TableCell>
                        <TableCell sx={{textAlign: 'center',}}>Observed</TableCell>
                        <TableCell sx={{textAlign: 'center',}}>Not Observed</TableCell>
                        <TableCell sx={{textAlign: 'center',}}>Comment</TableCell>
                        <TableCell sx={{textAlign: 'center',}}>Satisfactory</TableCell>
                        <TableCell sx={{textAlign: 'center',}}>Needs Improvement</TableCell>
                        <TableCell sx={{textAlign: 'center',}}>Unsatisfactory</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {performanceIndicator.categories.map((category) => {
                        const {criteria} = category;

                        return criteria.map((criterion, index) => (
                            <TableRow key={criterion.id}>
                                {index === 0 && <TableCell rowSpan={criteria.length}>{category.name}</TableCell>}
                                <TableCell sx={{height: 40,}}>{criterion.name}</TableCell>
                                <TableCell sx={{
                                    border: 1,
                                    background: criterion.marker === 'OBSERVED' ? 'rgba(163,55,234,0.2)' : 'inherit',
                                }}></TableCell>
                                <TableCell sx={{
                                    border: 1,
                                    background: criterion.marker === 'NOT_OBSERVED' ? 'rgba(201,155,230,0.2)' : 'inherit',
                                }}></TableCell>
                                <TableCell sx={{
                                    border: 1,
                                    textAlign: 'center',
                                }}>
                                    {criterion.comments &&
                                        <PerformanceIndicatorCommentDialog criteria={criterion}/>
                                    }
                                </TableCell>
                                <TableCell sx={{
                                    border: 1,
                                    background: criterion.marker === 'SATISFACTORY' ? 'rgba(0, 200, 0, 0.2)' : 'inherit',
                                }}></TableCell>
                                <TableCell sx={{
                                    border: 1,
                                    background: criterion.marker === 'NEEDS_IMPROVEMENT' ? 'rgba(244,146,0,0.2)' : 'inherit',
                                }}></TableCell>
                                <TableCell sx={{
                                    border: 1,
                                    background: criterion.marker === 'UNSATISFACTORY' ? 'rgba(200, 0, 0, 0.2)' : 'inherit',
                                }}></TableCell>
                            </TableRow>
                        ));
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}