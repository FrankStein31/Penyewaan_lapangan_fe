// File: app/booking/history/page.js

'use client';

import { useEffect, useState } from 'react';
import UserLayout from '@/components/user/UserLayout';
import { bookingService } from '@/services/api';
import { 
    Box, 
    Typography, 
    Tab, 
    Tabs, 
    Card, 
    CardContent, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper, 
    Chip,
    CircularProgress,
    Alert
} from '@mui/material';

export default function HistoryPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                console.log('Mencoba fetch data booking...');
                const response = await bookingService.getUserBookings();
                console.log('Response dari server:', response);
                
                if (response && response.data && response.data.data) {
                    console.log('Data booking berhasil diambil:', response.data.data);
                    setBookings(response.data.data);
                } else {
                    console.log('Data kosong atau format tidak sesuai');
                    setBookings([]);
                }
                setError(null);
            } catch (err) {
                console.error('Error lengkap:', err);
                
                if (err.response) {
                    const statusCode = err.response.status;
                    console.error('Response status:', statusCode);
                    console.error('Response headers:', err.response.headers);
                    console.error('Response data:', err.response.data);
                    
                    let errorMsg = `Error server (${statusCode})`;
                    
                    if (err.response.data && err.response.data.message) {
                        errorMsg = err.response.data.message;
                    }
                    
                    if (statusCode === 401) {
                        errorMsg = 'Anda belum login atau sesi telah berakhir';
                    } else if (statusCode === 404) {
                        errorMsg = 'Endpoint tidak ditemukan. Coba periksa route API.';
                    } else if (statusCode === 500) {
                        errorMsg = 'Terjadi kesalahan pada server';
                    }
                    
                    setError(errorMsg);
                } else if (err.request) {
                    console.error('Request yang dikirim:', err.request);
                    setError('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
                } else {
                    setError('Gagal memuat data: ' + err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    // Filter bookings berdasarkan status
    const activeBookings = bookings.filter(booking => 
        !['selesai', 'ditolak', 'dibatalkan'].includes(booking.status?.toLowerCase())
    );
    
    const historyBookings = bookings.filter(booking => 
        ['selesai', 'ditolak', 'dibatalkan'].includes(booking.status?.toLowerCase())
    );

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    };

    const getStatusChip = (status) => {
        const statusMap = {
            'menunggu verifikasi': { label: 'Menunggu', color: 'warning' },
            'diverifikasi': { label: 'Dikonfirmasi', color: 'info' },
            'selesai': { label: 'Selesai', color: 'success' },
            'dibatalkan': { label: 'Dibatalkan', color: 'error' },
            'ditolak': { label: 'Ditolak', color: 'error' },
            'pending': { label: 'Menunggu', color: 'warning' },
            'confirmed': { label: 'Dikonfirmasi', color: 'info' },
            'completed': { label: 'Selesai', color: 'success' },
            'cancelled': { label: 'Dibatalkan', color: 'error' },
            'rejected': { label: 'Ditolak', color: 'error' }
        };
        
        const statusKey = status?.toLowerCase() || 'pending';
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

    // Format waktu sesi
    const formatSessionTime = (booking) => {
        if (booking?.jam_mulai && booking?.jam_selesai) {
            return `${booking.jam_mulai} - ${booking.jam_selesai}`;
        }
        
        // Jika ada sesi_data
        if (booking?.sesi_data && booking.sesi_data.length > 0) {
            // Jika hanya 1 sesi
            if (booking.sesi_data.length === 1) {
                const sesi = booking.sesi_data[0];
                return `${sesi.jam_mulai} - ${sesi.jam_selesai}`;
            }
            
            // Jika banyak sesi, tampilkan range
            const jamMulai = booking.sesi_data[0]?.jam_mulai;
            const jamSelesai = booking.sesi_data[booking.sesi_data.length - 1]?.jam_selesai;
            return `${jamMulai} - ${jamSelesai}`;
        }
        
        return 'Waktu tidak tersedia';
    };

    const renderBookingTable = (bookingList) => {
        return (
            <TableContainer component={Paper} sx={{ mt: 3 }} elevation={2}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Lapangan</TableCell>
                            <TableCell>Tanggal</TableCell>
                            <TableCell>Waktu</TableCell>
                            <TableCell>Total</TableCell>
                            <TableCell>Status</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookingList.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    Tidak ada data booking
                                </TableCell>
                            </TableRow>
                        ) : (
                            bookingList.map((booking) => (
                                <TableRow key={booking.id_pemesanan}>
                                    <TableCell>{booking.lapangan?.nama || 'Lapangan'}</TableCell>
                                    <TableCell>{formatDate(booking.tanggal)}</TableCell>
                                    <TableCell>{formatSessionTime(booking)}</TableCell>
                                    <TableCell>
                                        {new Intl.NumberFormat('id-ID', {
                                            style: 'currency',
                                            currency: 'IDR',
                                            minimumFractionDigits: 0
                                        }).format(booking.total_harga || 0)}
                                    </TableCell>
                                    <TableCell>{getStatusChip(booking.status)}</TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    return (
        <UserLayout title="Riwayat Booking">
            <Card>
                <CardContent sx={{ p: 0 }}>
                    <Tabs 
                        value={tabValue} 
                        onChange={handleTabChange}
                        variant="fullWidth" 
                        sx={{ borderBottom: 1, borderColor: 'divider' }}
                    >
                        <Tab label="Sedang Berlangsung" />
                        <Tab label="Riwayat" />
                    </Tabs>

                    <Box sx={{ p: 2 }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : error ? (
                            <Alert severity="error">{error}</Alert>
                        ) : (
                            <div>
                                {tabValue === 0 && (
                                    <div>
                                        <Typography variant="h6" gutterBottom>
                                            Booking Sedang Berlangsung
                                        </Typography>
                                        {renderBookingTable(activeBookings)}
                                    </div>
                                )}

                                {tabValue === 1 && (
                                    <div>
                                        <Typography variant="h6" gutterBottom>
                                            Riwayat Booking
                                        </Typography>
                                        {renderBookingTable(historyBookings)}
                                    </div>
                                )}
                            </div>
                        )}
                    </Box>
                </CardContent>
            </Card>
        </UserLayout>
    );
}
