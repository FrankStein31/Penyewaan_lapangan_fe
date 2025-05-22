'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { CssBaseline, ThemeProvider, createTheme, CircularProgress, Box } from '@mui/material'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

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

export default function UserLayout({ children, title = "Dashboard" }) {
    const { user, isAuthenticated, loading } = useAuth()
    const router = useRouter()
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        // Jika tidak sedang loading dan auth sudah dicheck
        if (!loading) {
            if (!isAuthenticated) {
                // Redirect ke login jika tidak terautentikasi
                console.log('User not authenticated, redirecting to login');
                router.replace('/login');
            }
            setChecking(false);
        }
    }, [isAuthenticated, loading, router]);

    // Tambahan pengecekan validitas token saat komponen dimount
    useEffect(() => {
        // Verifikasi token dengan server
        const verifyToken = async () => {
            try {
                // Coba akses endpoint yang memerlukan user privileges
                if (isAuthenticated) {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/user`, {
                        method: 'GET',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        }
                    });

                    if (!response.ok) {
                        throw new Error('Token tidak valid atau kadaluarsa');
                    }
                }
            } catch (error) {
                console.error('Error verifikasi user token:', error);
                // Force logout dan redirect ke login
                if (typeof window !== 'undefined') {
                    window.location.href = '/login';
                }
            }
        };
        if (!loading && isAuthenticated) {
            verifyToken();
        }
    }, [isAuthenticated, loading]);

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

    // Render layout user jika sudah terautentikasi
    if (isAuthenticated) {
        return (
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Box sx={{ display: 'flex' }}>
                    <Sidebar />
                    <Box sx={{ flexGrow: 1, bgcolor: 'background.default', minHeight: '100vh' }}>
                        <Topbar title={title} />
                        <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
                            {children}
                        </Box>
                    </Box>
                </Box>
            </ThemeProvider>
        )
    }

    // Fallback, jangan render apapun jika tidak memenuhi syarat
    return null
} 