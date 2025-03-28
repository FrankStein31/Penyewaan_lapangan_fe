'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { CssBaseline, ThemeProvider, createTheme, CircularProgress } from '@mui/material'
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
    const { user, isAuthenticated, loading, isAdmin } = useAuth()
    const router = useRouter()
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        // Jika tidak sedang loading dan auth sudah dicheck
        if (!loading) {
            if (!isAuthenticated) {
                // Redirect ke login jika tidak terautentikasi
                router.push('/login')
            } else if (!isAdmin()) {
                // Redirect ke dashboard jika bukan admin
                router.push('/dashboard')
            }
            setChecking(false)
        }
    }, [isAuthenticated, loading, router, isAdmin])

    // Tampilkan loading spinner ketika sedang mengecek auth
    if (loading || checking) {
        return (
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                width: '100vw', 
                height: '100vh',
                bgcolor: 'background.default'  
            }}>
                <CircularProgress />
            </Box>
        )
    }

    // Render layout admin jika sudah terautentikasi dan adalah admin
    if (isAuthenticated && isAdmin()) {
        return (
            <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ display: 'flex' }}>
                {children}
            </Box>
            </ThemeProvider>
        )
    }

    // Fallback, jangan render apapun jika tidak memenuhi syarat
    return null
}