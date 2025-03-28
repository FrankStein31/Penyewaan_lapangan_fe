'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
    Container,
    Typography,
    Box,
    Paper,
    Grid,
    Button,
    Card,
    CardContent,
    Divider,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemText,
    Chip,
    CircularProgress,
    Alert
} from '@mui/material';
import { Person, CalendarMonth, History } from '@mui/icons-material';
import { bookingService } from '@/services/api';

export default function CustomerDashboard() {
    const { user, loading: authLoading, isAuthenticated } = useAuth();
    const router = useRouter();
    
    const [activeTab, setActiveTab] = useState(0);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    useEffect(() => {
        // Redirect if not authenticated
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);
    
    useEffect(() => {
        const fetchBookings = async () => {
            if (!isAuthenticated || !user) return;
            
            try {
                setLoading(true);
                setError('');
                
                const response = await bookingService.getUserBookings();
                if (response && response.data) {
                    setBookings(Array.isArray(response.data) ? response.data : []);
                } else {
                    setBookings([]);
                }
            } catch (error) {
                console.error('Error fetching bookings:', error);
                setError('Gagal memuat data pesanan. Silakan coba lagi nanti.');
                setBookings([]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchBookings();
    }, [isAuthenticated, user]);
    
    const handleChangeTab = (event, newValue) => {
        setActiveTab(newValue);
    };
    
    // Filter bookings based on active tab
    const filteredBookings = bookings.filter(booking => {
        if (!booking) return false;
        
        const bookingDate = new Date(booking.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (activeTab === 0) {
            // Upcoming bookings
            return bookingDate >= today;
        } else {
            // Past bookings
            return bookingDate < today;
        }
    });
    
    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'menunggu pembayaran':
                return 'warning';
            case 'dikonfirmasi':
                return 'success';
            case 'dibatalkan':
                return 'error';
            default:
                return 'default';
        }
    };
    
    if (authLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }
    
    if (!isAuthenticated) {
        return null;
    }
    
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Dashboard Pelanggan
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                {/* User Profile Section */}
                <Box sx={{ width: { xs: '100%', md: '30%' } }}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                            <Box
                                sx={{
                                    width: 100,
                                    height: 100,
                                    bgcolor: 'primary.main',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    mb: 2
                                }}
                            >
                                <Person sx={{ fontSize: 50, color: 'white' }} />
                            </Box>
                            <Typography variant="h5" component="div" gutterBottom>
                                {user?.name || 'Pelanggan'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {user?.email || ''}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {user?.phone || user?.no_hp || ''}
                            </Typography>
                        </Box>
                        <Divider sx={{ mb: 3 }} />
                        <Box>
                            <Button 
                                fullWidth 
                                variant="contained" 
                                color="primary" 
                                onClick={() => router.push('/booking')}
                                sx={{ mb: 2 }}
                            >
                                Pesan Lapangan
                            </Button>
                        </Box>
                    </Paper>
                </Box>

                {/* Bookings Section */}
                <Box sx={{ width: { xs: '100%', md: '70%' } }}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h5" component="div" gutterBottom>
                            Daftar Pesanan Anda
                        </Typography>
                        
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                            <Tabs value={activeTab} onChange={handleChangeTab}>
                                <Tab label="Pesanan Mendatang" icon={<CalendarMonth />} iconPosition="start" />
                                <Tab label="Riwayat Pesanan" icon={<History />} iconPosition="start" />
                            </Tabs>
                        </Box>
                        
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : error ? (
                            <Alert severity="error">{error}</Alert>
                        ) : filteredBookings.length === 0 ? (
                            <Alert severity="info">
                                {activeTab === 0 ? 'Anda belum memiliki pesanan mendatang' : 'Tidak ada riwayat pesanan'}
                            </Alert>
                        ) : (
                            <List>
                                {filteredBookings.map((booking, index) => (
                                    <Box key={booking?.id || index}>
                                        <ListItem 
                                            alignItems="flex-start" 
                                            sx={{ 
                                                flexDirection: { xs: 'column', sm: 'row' },
                                                alignItems: { xs: 'flex-start', sm: 'center' }
                                            }}
                                        >
                                            <ListItemText
                                                primary={
                                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                                        <Typography variant="subtitle1">
                                                            {booking?.field?.name || 'Lapangan'}
                                                        </Typography>
                                                        <Chip 
                                                            label={booking?.status || 'Menunggu Pembayaran'} 
                                                            size="small" 
                                                            color={getStatusColor(booking?.status)}
                                                        />
                                                    </Box>
                                                }
                                                secondary={
                                                    <Box component="span" sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, mt: 0.5 }}>
                                                        <Typography component="span" variant="body2" color="textSecondary">
                                                            {booking?.session?.start_time || ''} - {booking?.session?.end_time || ''}
                                                        </Typography>
                                                        <Typography 
                                                            component="span"
                                                            variant="body2" 
                                                            color="textSecondary" 
                                                            sx={{ ml: { xs: 0, sm: 2 } }}
                                                        >
                                                            {new Date(booking?.date).toLocaleDateString('id-ID', {
                                                                weekday: 'long',
                                                                year: 'numeric',
                                                                month: 'long',
                                                                day: 'numeric'
                                                            })}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                        
                                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1, mb: 2 }}>
                                            {booking?.status?.toLowerCase() === 'menunggu pembayaran' && (
                                                <Button 
                                                    variant="contained" 
                                                    color="primary" 
                                                    size="small"
                                                    onClick={() => router.push(`/payment/${booking.id}`)}
                                                >
                                                    Bayar Sekarang
                                                </Button>
                                            )}
                                            
                                            <Button 
                                                variant="outlined" 
                                                size="small" 
                                                sx={{ ml: 1 }}
                                                onClick={() => router.push(`/booking-detail/${booking.id}`)}
                                            >
                                                Detail
                                            </Button>
                                        </Box>
                                        
                                        {index < filteredBookings.length - 1 && <Divider />}
                                    </Box>
                                ))}
                            </List>
                        )}
                    </Paper>
                </Box>
            </Box>
        </Container>
    );
} 