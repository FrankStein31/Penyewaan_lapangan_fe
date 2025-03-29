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
import { useRouter } from 'next/navigation';
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
  },
});

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email dan password harus diisi');
      return;
    }

    try {
      await login(email, password);
      // Redirect akan ditangani oleh AuthContext
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Silahkan coba lagi.');
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
        <Container maxWidth="xs">
          <Paper 
            elevation={6} 
            sx={{ 
              padding: 4, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              gap: 2
            }}
          >
            <Typography 
              component="h1" 
              variant="h4" 
              sx={{ 
                fontWeight: 700, 
                color: 'primary.main',
                mb: 2 
              }}
            >
              Masuk
            </Typography>
            
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  width: '100%', 
                  borderRadius: 2 
                }}
              >
                {error}
              </Alert>
            )}
            
            <Box 
              component="form" 
              onSubmit={handleSubmit} 
              sx={{ 
                width: '100%', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 2 
              }}
            >
              <TextField
                fullWidth
                id="email"
                label="Email"
                variant="outlined"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                autoFocus
              />
              <TextField
                fullWidth
                id="password"
                label="Password"
                variant="outlined"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{ 
                  mt: 1,
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: 'none'
                  }
                }}
              >
                {loading ? 'Memuat...' : 'Masuk'}
              </Button>
            </Box>
            
            <Box 
              sx={{ 
                textAlign: 'center', 
                width: '100%', 
                mt: 2 
              }}
            >
              <Typography variant="body2" sx={{ mb: 1 }}>
                Belum punya akun?{' '}
                <Link 
                  component={NextLink} 
                  href="/register" 
                  color="primary"
                  sx={{ 
                    fontWeight: 600,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }}
                >
                  Daftar Sekarang
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
          </Paper>
        </Container>
      </Box>
    </ThemeProvider>
  );
}