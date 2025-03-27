'use client'

import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import Box from '@mui/material/Box'

// Tema Material UI
const theme = createTheme({
    palette: {
        primary: {
        main: '#7367f0',
        },
        background: {
        default: '#f8f7fa',
        },
    },
    shape: {
        borderRadius: 6
    },
    typography: {
        fontFamily: '"Inter", sans-serif',
    }
})

export default function AdminLayout({ children }) {
    return (
        <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ display: 'flex' }}>
            {children}
        </Box>
        </ThemeProvider>
    )
} 