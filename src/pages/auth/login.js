import { useState } from 'react';
import { Box, Button, TextField, Typography, Container } from '@mui/material';

export default function Login() {
    const [formData, setFormData] = useState({
    email: '',
    password: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Handle login logic here
    };

    return (
        <Container maxWidth="xs">
        <Box
            sx={{
            mt: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            }}
        >
            <Typography component="h1" variant="h5">
            Login
            </Typography>
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                autoFocus
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
                Login
            </Button>
            </Box>
        </Box>
        </Container>
    );
}