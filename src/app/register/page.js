'use client';

import { useState } from 'react';
import { Box, Container, TextField, Button, Typography, Paper, Link, Alert, Grid } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import NextLink from 'next/link';

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
            console.log('Mengirim data registrasi:', formData);
            await register(formData);
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
        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
                    Registrasi Akun
                </Typography>
                
                {error && (
                    <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                        {error}
                    </Alert>
                )}
                
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
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
                    />
                    
                    <TextField
                        margin="normal"
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
                    />
                    
                    <TextField
                        margin="normal"
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
                    />
                    
                    <TextField
                        margin="normal"
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
                    />
                    
                    <TextField
                        margin="normal"
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
                    />
                    
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2, py: 1.2 }}
                        disabled={loading}
                    >
                        {loading ? 'Loading...' : 'Daftar'}
                    </Button>
                    
                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography variant="body2" component="div">
                            Sudah punya akun?{' '}
                            <Link component={NextLink} href="/login" color="primary">
                                Login
                            </Link>
                        </Typography>
                        <Typography variant="body2" component="div" sx={{ mt: 1 }}>
                            <Link component={NextLink} href="/" color="primary">
                                Kembali ke Beranda
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
} 