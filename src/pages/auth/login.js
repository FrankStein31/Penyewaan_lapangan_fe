import { useState } from 'react'
import { Box, Card, TextField, Button, Typography } from '@mui/material'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from 'next/router'

export default function Login() {
    const router = useRouter()
    const { login } = useAuth()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const response = await login({
                email: formData.email,
                password: formData.password
            })
            console.log('Login berhasil:', response)
            router.push('/dashboard')
        } catch (error) {
            console.error('Login failed:', error.response?.data?.message || 'Terjadi kesalahan')
        }
    }

    return (
        <Box sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
        }}>
        <Card sx={{ p: 4, maxWidth: 400, width: '100%' }}>
            <Typography variant="h5" component="h1" sx={{ mb: 4, textAlign: 'center' }}>
            Login
            </Typography>
            <form onSubmit={handleSubmit}>
            <TextField
                fullWidth
                label="Email"
                margin="normal"
                name="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <TextField
                fullWidth
                label="Password"
                margin="normal"
                name="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <Button
                fullWidth
                size="large"
                type="submit"
                variant="contained"
                sx={{ mt: 4 }}
            >
                Login
            </Button>
            </form>
        </Card>
        </Box>
    )
}