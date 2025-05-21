'use client';
import {createTheme} from '@mui/material/styles';

const theme = createTheme({
    colorSchemes: {
        light: {
            palette: {
                mode: "light",
                background: {
                    default: '#e2fbff'
                },
                primary: {
                    main: '#3E8BCB',
                    contrastText: '#EDEDF5',
                },
                secondary: {
                    main: '#00a6f4',
                    contrastText: '#EDEDF5',
                },
            },
        },
        dark: {
            palette: {
                mode: "dark",
                background: {
                    default: '#000a1d'
                },
                primary: {
                    main: '#3E8BCB',
                    contrastText: '#EDEDF5',
                },
                secondary: {
                    main: '#00a6f4',
                    contrastText: '#EDEDF5',
                },
            }
        },
    },
    cssVariables: {
        colorSchemeSelector: 'class',
    },
    typography: {
        fontFamily: 'var(--font-poppins)',
    },
    palette: {
        mode: 'dark',
        background: {
            default: '#000a1d'
        },
        primary: {
            main: '#3E8BCB',
            contrastText: '#EDEDF5',
        },
        secondary: {
            main: '#00a6f4',
            contrastText: '#EDEDF5',
        }
    }
});

export default theme;