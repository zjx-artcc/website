import {Card, CardContent, Grid2, Stack, Typography} from "@mui/material";
import Link from "next/link";
import {GitHub} from "@mui/icons-material";
import {Poppins} from "next/font/google";

const headingFont = Poppins({subsets: ['latin'], weight: ['400']});

export default async function Home() {

    return (
        (<Grid2 container columns={6} spacing={4}>
            <Grid2 size={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h3">Credit Information</Typography>
                        <Typography variant="body2">Full Commit History can be found on <Link
                            href="https://github.com/vZDC-ARTCC/website" target="_blank"
                            style={{color: '#29B6F6', textDecoration: 'none',}}>our public GitHub.</Link></Typography>
                    </CardContent>
                </Card>
            </Grid2>
            <Grid2 size={6}>
                <Card>
                    <CardContent>
                        <Typography variant="h4" gutterBottom>Main Contributors</Typography>
                        <Stack direction="column" spacing={8} sx={{m: 8,}}>
                            <Typography variant="h5" fontWeight="bold" 
                                        letterSpacing={9} {...headingFont.style}>Aneesh Reddy <Link
                                href="https://github.com/beabravedude" target="_blank"
                                style={{color: 'inherit',}}><GitHub fontSize="large"/></Link></Typography>
                            <Typography variant="h5" fontWeight="bold" 
                                        letterSpacing={7} {...headingFont.style}>Carson Berget <Link
                                href="https://github.com/Vainnor" target="_blank" style={{color: 'inherit',}}><GitHub
                                fontSize="medium"/></Link></Typography>
                            <Typography variant="h5" fontWeight="bold" letterSpacing={7} {...headingFont.style}>Harry
                                Xu <Link href="https://github.com/harryxu2626" target="_blank"
                                         style={{color: 'inherit',}}><GitHub fontSize="small"/></Link></Typography>
                            <Typography variant="h5" fontWeight="bold" letterSpacing={7} {...headingFont.style}>Leo
                                Roberts <Link href="https://github.com/monty23monty" target="_blank"
                                              style={{color: 'inherit',}}><GitHub fontSize="small"/></Link></Typography>
                        </Stack>
                    </CardContent>
                </Card>
                <Card sx={{mt: 4}}>
                    <CardContent>
                        <Typography variant="h4" gutterBottom>ZJX Fork Contributors</Typography>
                        <Stack direction="column" spacing={8} sx={{m: 8,}}>
                            <Typography variant="h5" fontWeight="bold" 
                                        letterSpacing={9} {...headingFont.style}>Samuel Valencia <Link
                                href="https://github.com/svalencia014" target="_blank"
                                style={{color: 'inherit',}}><GitHub fontSize="large"/></Link></Typography>
                            <Typography variant="h5" fontWeight="bold" 
                                        letterSpacing={7} {...headingFont.style}>Christopher Mangan<Link
                                href="https://github.com/chrisjm66" target="_blank" style={{color: 'inherit',}}><GitHub
                                fontSize="medium"/></Link></Typography>
                        </Stack>
                    </CardContent>
                </Card>
            </Grid2>
        </Grid2>)
    );
}
