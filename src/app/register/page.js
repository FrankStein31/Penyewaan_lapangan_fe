'use client';

import { useState } from 'react';
import { 
    Box, 
    Container, 
    TextField, 
    Button, 
    Typography, 
    Paper, 
    Link, 
    Alert,
    ThemeProvider, 
    createTheme 
} from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import NextLink from 'next/link';

// Custom theme for a modern, elegant look
const theme = createTheme({
    palette: {
        primary: {
        main: '#1A73E8', // A modern, softer blue
        },
        background: {
        default: '#F4F6F9', // Light, clean background
        },
    },
    typography: {
        fontFamily: '"Inter", "Helvetica", "Arial", sans-serif',
    },
    components: {
        MuiPaper: {
        styleOverrides: {
            root: {
            borderRadius: 16,
            boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
            },
        },
        },
        MuiTextField: {
        styleOverrides: {
            root: {
            marginBottom: 16,
            '& label.Mui-focused': {
                color: '#1A73E8',
            },
            '& .MuiOutlinedInput-root': {
                borderRadius: 12,
                '&.Mui-focused fieldset': {
                borderColor: '#1A73E8',
                },
            },
            },
        },
        },
        MuiButton: {
        styleOverrides: {
            root: {
            borderRadius: 12,
            textTransform: 'none',
            fontWeight: 600,
            padding: '12px 24px',
            },
        },
        },
        MuiAlert: {
        styleOverrides: {
            root: {
            borderRadius: 12,
            },
        },
        },
    },
});

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: ''
    });
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});
    const { register, loading } = useAuth();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        
        // Reset error untuk field ini
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name) newErrors.name = 'Nama wajib diisi';
        if (!formData.email) newErrors.email = 'Email wajib diisi';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Format email tidak valid';
        
        if (!formData.phone) newErrors.phone = 'Nomor telepon wajib diisi';
        else if (!/^[0-9]{10,13}$/.test(formData.phone)) newErrors.phone = 'Nomor telepon tidak valid';
        
        if (!formData.password) newErrors.password = 'Password wajib diisi';
        else if (formData.password.length < 6) newErrors.password = 'Password minimal 6 karakter';
        
        if (!formData.password_confirmation) newErrors.password_confirmation = 'Konfirmasi password wajib diisi';
        else if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = 'Password dan konfirmasi password tidak cocok';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!validateForm()) return;
        
        try {
            // Data payload untuk dikirim ke backend
            const dataToSend = {
                nama: formData.name,          // Ganti name menjadi nama
                email: formData.email,
                no_hp: formData.phone,        // Ganti phone menjadi no_hp
                password: formData.password,
                password_confirmation: formData.password_confirmation
            };
            
            console.log('Mengirim data registrasi:', dataToSend);
            await register(dataToSend);
            // Redirect akan ditangani oleh AuthContext
        } catch (err) {
            console.error('Error saat registrasi:', err);
            
            if (err.response?.data?.errors) {
                // Handle Laravel validation errors
                const backendErrors = err.response.data.errors;
                const fieldErrors = {};
                
                Object.keys(backendErrors).forEach(key => {
                    // Mapping field dari backend ke frontend
                    const frontendKey = key === 'nama' ? 'name' : (key === 'no_hp' ? 'phone' : key);
                    fieldErrors[frontendKey] = backendErrors[key][0];
                });
                
                setErrors(fieldErrors);
            } else {
                setError(err.response?.data?.message || 'Registrasi gagal. Silahkan coba lagi.');
            }
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box 
                sx={{ 
                    backgroundColor: 'background.default', 
                    minHeight: '100vh', 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 2
                }}
            >
                <Container maxWidth="sm">
                    <Paper 
                        elevation={6} 
                        sx={{ 
                            padding: 4, 
                            display: 'flex', 
                            flexDirection: 'column', 
                            alignItems: 'center' 
                        }}
                    >
                        <Typography 
                            component="h1" 
                            variant="h4" 
                            sx={{ 
                                fontWeight: 700, 
                                color: 'primary.main',
                                mb: 3 
                            }}
                        >
                            Registrasi Akun
                        </Typography>
                        
                        {error && (
                            <Alert 
                                severity="error" 
                                sx={{ 
                                    width: '100%', 
                                    mb: 2 
                                }}
                            >
                                {error}
                            </Alert>
                        )}
                        
                        <Box 
                            component="form" 
                            onSubmit={handleSubmit} 
                            sx={{ 
                                width: '100%' 
                            }}
                        >
                            <TextField
                                required
                                fullWidth
                                id="name"
                                label="Nama Lengkap"
                                name="name"
                                autoComplete="name"
                                autoFocus
                                value={formData.name}
                                onChange={handleChange}
                                error={!!errors.name}
                                helperText={errors.name}
                                sx={{ mb: 2 }}
                            />
                            
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email"
                                name="email"
                                autoComplete="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={!!errors.email}
                                helperText={errors.email}
                                sx={{ mb: 2 }}
                            />
                            
                            <TextField
                                required
                                fullWidth
                                id="phone"
                                label="Nomor Telepon"
                                name="phone"
                                autoComplete="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                error={!!errors.phone}
                                helperText={errors.phone}
                                sx={{ mb: 2 }}
                            />
                            
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                value={formData.password}
                                onChange={handleChange}
                                error={!!errors.password}
                                helperText={errors.password}
                                sx={{ mb: 2 }}
                            />
                            
                            <TextField
                                required
                                fullWidth
                                name="password_confirmation"
                                label="Konfirmasi Password"
                                type="password"
                                id="password_confirmation"
                                autoComplete="new-password"
                                value={formData.password_confirmation}
                                onChange={handleChange}
                                error={!!errors.password_confirmation}
                                helperText={errors.password_confirmation}
                                sx={{ mb: 2 }}
                            />
                            
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ 
                                    mt: 1, 
                                    mb: 3,
                                    boxShadow: 'none',
                                    '&:hover': {
                                        boxShadow: 'none'
                                    }
                                }}
                                disabled={loading}
                            >
                                {loading ? 'Memuat...' : 'Daftar'}
                            </Button>
                            
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="body2" component="div" sx={{ mb: 1 }}>
                                    Sudah punya akun?{' '}
                                    <Link 
                                        component={NextLink} 
                                        href="/login" 
                                        color="primary"
                                        sx={{ 
                                            fontWeight: 600,
                                            textDecoration: 'none',
                                            '&:hover': {
                                                textDecoration: 'underline'
                                            }
                                        }}
                                    >
                                        Login
                                    </Link>
                                </Typography>
                                <Link 
                                    component={NextLink} 
                                    href="/" 
                                    color="primary"
                                    sx={{ 
                                        fontSize: '0.8rem',
                                        fontWeight: 500,
                                        textDecoration: 'none',
                                        '&:hover': {
                                            textDecoration: 'underline'
                                        }
                                    }}
                                >
                                    Kembali ke Beranda
                                </Link>
                            </Box>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </ThemeProvider>
    );
}