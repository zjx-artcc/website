import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Box, Card, CardContent, List, Typography } from "@mui/material";

export default function MenuWrapper({ title, subheadings, children }: { title: string, subheadings: string[], children: React.ReactNode }) {
    return (
        <>
            <Box sx={{ display: { xs: 'none', lg: 'inherit', }}}>
                <Card>
                    <CardContent>
                        <Typography variant="h6" textAlign="center">{title}</Typography>
                        { subheadings.map((subheading, idx) => (
                            <Typography key={idx} variant="subtitle2" textAlign="center">{subheading}</Typography>
                        ))}
                        <List>
                            {children}
                        </List>
                    </CardContent>
                </Card>
            </Box>
            <Box sx={{ display: { lg: 'none', }}}>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Box>
                            <Typography variant="h6" textAlign="center">{title}</Typography>
                            { subheadings.map((subheading, idx) => (
                                <Typography key={idx} variant="subtitle2">{subheading}</Typography>
                            ))}
                        </Box>
                        
                    </AccordionSummary>
                    <AccordionDetails>
                        <List disablePadding>
                            {children}
                        </List>
                    </AccordionDetails>
                </Accordion>
            </Box>
        </>
    );
}