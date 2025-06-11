'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import UserLayout from '@/components/user/UserLayout';
import { 
    Box, 
    Typography, 
    Grid, 
    Card, 
    CardContent, 
    Button, 
    Divider, 
    Chip,
    Avatar,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    Tabs,
    Tab
} from '@mui/material';
import { bookingService } from '@/services/api';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const { user } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tabValue, setTabValue] = useState(0);
    const router = useRouter();
    const [totalPayment, setTotalPayment] = useState(0);
    const [favoriteField, setFavoriteField] = useState('');
    const [totalHours, setTotalHours] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                console.log('Mencoba fetch data di dashboard...');
                // Fetch bookings data
                const bookingsResponse = await bookingService.getUserBookings();
                console.log('Response dari getUserBookings:', bookingsResponse);
                
                if (bookingsResponse && bookingsResponse.data) {
                    const bookingsData = bookingsResponse.data;
                    console.log('Data booking berhasil didapatkan:', bookingsData);
                    setBookings(bookingsData);
                    
                    // Hitung total pembayaran
                    const total = bookingsData.reduce((sum, booking) => sum + (parseFloat(booking.total_harga) || 0), 0);
                    setTotalPayment(total);
                    
                    // Hitung total jam berdasarkan id_sesi (JSON)
                    const hours = bookingsData.reduce((sum, booking) => {
                        if (booking.id_sesi) {
                            const sesiIds = typeof booking.id_sesi === 'string' ? 
                                JSON.parse(booking.id_sesi) : booking.id_sesi;
                            return sum + (Array.isArray(sesiIds) ? sesiIds.length : 0);
                        }
                        return sum;
                    }, 0);
                    setTotalHours(hours);
                    
                    // Tentukan lapangan favorit berdasarkan frekuensi booking
                    const fieldCounts = {};
                    bookingsData.forEach(booking => {
                        const fieldName = booking.lapangan?.nama || 'Tidak diketahui';
                        fieldCounts[fieldName] = (fieldCounts[fieldName] || 0) + 1;
                    });
                    
                    // Cari lapangan dengan jumlah booking terbanyak
                    let maxCount = 0;
                    let favField = '';
                    Object.entries(fieldCounts).forEach(([field, count]) => {
                        if (count > maxCount) {
                            maxCount = count;
                            favField = field;
                        }
                    });
                    
                    setFavoriteField(favField || 'Belum ada');
                }

                // Mock notifications data
                setNotifications([
                    {
                        id: 1,
                        title: 'Booking dikonfirmasi',
                        message: 'Booking lapangan Basket untuk tanggal 20/05/2023 jam 15:00 telah dikonfirmasi.',
                        time: '2 jam yang lalu',
                        read: false
                    },
                    {
                        id: 2,
                        title: 'Pembayaran diterima',
                        message: 'Pembayaran untuk booking lapangan Futsal telah diterima.',
                        time: '1 hari yang lalu',
                        read: true
                    },
                    {
                        id: 3,
                        title: 'Pengingat jadwal',
                        message: 'Jangan lupa jadwal booking Anda besok pukul 16:00 di lapangan Badminton.',
                        time: '2 hari yang lalu',
                        read: true
                    }
                ]);
            } catch (error) {
                console.error('Error lengkap:', error);
                // Tambahkan penanganan error yang lebih baik
                if (error.response) {
                    // Server memberikan respons dengan status error
                    const statusCode = error.response.status;
                    console.error('Response status:', statusCode);
                    console.error('Response headers:', error.response.headers);
                    console.error('Response data:', error.response.data);
                    
                    if (statusCode === 401) {
                        console.log('Anda belum login atau sesi telah berakhir');
                    } else if (statusCode === 404) {
                        console.log('Endpoint tidak ditemukan. Coba periksa route API.');
                    } else if (statusCode === 500) {
                        console.log('Terjadi kesalahan pada server');
                    }
                } else if (error.request) {
                    // Request dibuat tetapi tidak ada respons
                    console.error('Request yang dikirim:', error.request);
                    console.log('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
                } else {
                    // Error dalam setup request
                    console.log('Gagal memuat data: ' + error.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const formatDate = (dateString) => {
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    const getStatusChip = (status) => {
        const statusMap = {
            'menunggu verifikasi': { label: 'Menunggu', color: 'warning' },
            'diverifikasi': { label: 'Dikonfirmasi', color: 'info' },
            'selesai': { label: 'Selesai', color: 'success' },
            'dibatalkan': { label: 'Dibatalkan', color: 'error' },
            'ditolak': { label: 'Ditolak', color: 'error' }
        };
        
        const statusKey = status?.toLowerCase() || 'menunggu verifikasi';
        const statusConfig = statusMap[statusKey] || { label: status || 'Menunggu', color: 'default' };
        
        return (
            <Chip 
                label={statusConfig.label} 
                color={statusConfig.color} 
                size="small" 
                variant="outlined"
            />
        );
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Format currency 
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    // Format waktu sesi
    const formatSessionTime = (booking) => {
        try {
            if (!booking || !booking.id_sesi) {
                return 'Waktu tidak tersedia';
            }

            const sesiIds = typeof booking.id_sesi === 'string' ? 
                JSON.parse(booking.id_sesi) : booking.id_sesi;

            if (!Array.isArray(sesiIds) || sesiIds.length === 0) {
                return 'Waktu tidak tersedia';
            }

            return `${booking.jam_mulai} - ${booking.jam_selesai}`;
        } catch (error) {
            console.error('Error formatting session time:', error);
            return 'Waktu tidak tersedia';
        }
    };

    const statsItems = [
        {
            icon: <CalendarTodayIcon sx={{ fontSize: 40 }} />,
            title: 'Total Booking',
            value: bookings.length.toString(),
            color: 'primary.main'
        },
        {
            icon: <AccessTimeIcon sx={{ fontSize: 40 }} />,
            title: 'Jam Pemakaian',
            value: `${totalHours}+`,
            color: 'success.main'
        },
        {
            icon: <SportsSoccerIcon sx={{ fontSize: 40 }} />,
            title: 'Lapangan Favorit',
            value: favoriteField,
            color: 'info.main'
        },
        {
            icon: <AccountBalanceWalletIcon sx={{ fontSize: 40 }} />,
            title: 'Total Pembayaran',
            value: formatCurrency(totalPayment),
            color: 'secondary.main'
        }
    ];

    return (
        <UserLayout title="Dashboard">
            {/* Welcome Message */}
            <Card sx={{ mb: 3, overflow: 'hidden' }}>
                <Box sx={{ 
                    p: { xs: 3, md: 4 }, 
                    background: 'linear-gradient(135deg, #7367f0 0%, #9e95f5 100%)',
                    color: 'white'
                }}>
                    <Typography variant="h5" gutterBottom fontWeight="bold">
                        Selamat Datang, {user?.name || 'Pengguna'}!
                    </Typography>
                    <Typography variant="body1">
                        Kelola booking lapangan dan aktivitas olahraga Anda di sini.
                    </Typography>
                </Box>
            </Card>

            {/* Stats Dashboard */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                {statsItems.map((item, index) => (
                    <Grid item xs={6} md={3} key={index}>
                        <Card>
                            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                                <Avatar sx={{ bgcolor: item.color, width: 56, height: 56, mb: 2 }}>
                                    {item.icon}
                                </Avatar>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {item.title}
                                </Typography>
                                <Typography variant="h5" component="div" fontWeight="bold">
                                    {item.value}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Tabs for Bookings and Notifications */}
            <Card>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab label="Booking Anda" />
                    <Tab 
                        label={
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                Notifikasi
                                {notifications.filter(n => !n.read).length > 0 && (
                                    <Chip 
                                        label={notifications.filter(n => !n.read).length} 
                                        color="error" 
                                        size="small" 
                                        sx={{ ml: 1, height: 20, minWidth: 20 }} 
                                    />
                                )}
                            </Box>
                        } 
                    />
                </Tabs>

                <Box sx={{ p: 2 }}>
                    {/* Bookings Tab */}
                    {tabValue === 0 && (
                        <>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6">Daftar Booking</Typography>
                                <Button 
                                    variant="contained" 
                                    onClick={() => router.push('/booking')}
                                    size="small"
                                >
                                    Booking Baru
                                </Button>
                            </Box>

                            {loading ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
                                </Box>
                            ) : bookings.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography variant="body1" color="text.secondary" gutterBottom>
                                        Anda belum memiliki booking lapangan.
                                    </Typography>
                                    <Button 
                                        variant="contained" 
                                        onClick={() => router.push('/booking')}
                                        sx={{ mt: 2 }}
                                    >
                                        Booking Sekarang
                                    </Button>
                                </Box>
                            ) : (
                                <List sx={{ width: '100%' }}>
                                    {bookings.map((booking, index) => (
                                        <div key={booking.id_pemesanan}>
                                            <ListItem 
                                                alignItems="flex-start" 
                                                sx={{ px: 0 }}
                                                secondaryAction={getStatusChip(booking.status)}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                        <SportsSoccerIcon />
                                                    </Avatar>
                                                </ListItemAvatar>
                                                <ListItemText
                                                    primary={
                                                        <Typography variant="subtitle1" fontWeight="medium">
                                                            {booking.lapangan?.nama || 'Lapangan'}
                                                        </Typography>
                                                    }
                                                    secondary={
                                                        <Box component="span" sx={{ display: 'block' }}>
                                                            <Typography component="span" variant="body2" color="text.primary">
                                                                {formatDate(booking.tanggal)}
                                                            </Typography>
                                                            <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                                                                {formatSessionTime(booking)}
                                                            </Typography>
                                                            <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                                                                Total: {formatCurrency(booking.total_harga)}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                />
                                            </ListItem>
                                            {index < bookings.length - 1 && <Divider variant="inset" component="li" />}
                                        </div>
                                    ))}
                                </List>
                            )}
                        </>
                    )}

                    {/* Notifications Tab */}
                    {tabValue === 1 && (
                        <>
                            <Typography variant="h6" sx={{ mb: 2 }}>Notifikasi Terbaru</Typography>
                            <List sx={{ width: '100%' }}>
                                {notifications.map((notification, index) => (
                                    <div key={notification.id}>
                                        <ListItem 
                                            alignItems="flex-start" 
                                            sx={{ 
                                                px: 0,
                                                bgcolor: notification.read ? 'transparent' : 'rgba(0, 0, 0, 0.02)'
                                            }}
                                        >
                                            <ListItemAvatar>
                                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                    <NotificationsIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={
                                                    <Typography variant="subtitle1" fontWeight="medium">
                                                        {notification.title}
                                                        {!notification.read && (
                                                            <Chip 
                                                                label="Baru" 
                                                                color="primary" 
                                                                size="small" 
                                                                variant="outlined"
                                                                sx={{ ml: 1, height: 18 }} 
                                                            />
                                                        )}
                                                    </Typography>
                                                }
                                                secondary={
                                                    <Box component="span" sx={{ display: 'block' }}>
                                                        <Typography component="span" variant="body2" color="text.secondary">
                                                            {notification.message}
                                                        </Typography>
                                                        <Typography component="span" variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                                            {notification.time}
                                                        </Typography>
                                                    </Box>
                                                }
                                            />
                                        </ListItem>
                                        {index < notifications.length - 1 && <Divider variant="inset" component="li" />}
                                    </div>
                                ))}
                            </List>
                        </>
                    )}
                </Box>
            </Card>
        </UserLayout>
    );
}