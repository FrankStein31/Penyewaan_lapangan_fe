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
    Alert,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid
} from '@mui/material';

export default function HistoryPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);

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
        // Gunakan Date constructor untuk parsing tanggal
        const date = new Date(dateString);
        // Pastikan tanggal valid
        if (isNaN(date.getTime())) return '-';
        
        // Format tanggal ke lokal Indonesia
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
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

    const handleOpenDetail = (booking) => {
        setSelectedBooking(booking);
        setDetailDialogOpen(true);
    };

    const handleCloseDetail = () => {
        setSelectedBooking(null);
        setDetailDialogOpen(false);
    };

    const handlePayNow = async (booking) => {
        try {
            const { token } = await bookingService.getPaymentToken(booking.id_pemesanan);
            
            window.snap.pay(token, {
                onSuccess: async (result) => {
                    await bookingService.checkPaymentStatus(booking.id_pemesanan);
                    showSnackbar('Pembayaran berhasil', 'success');
                    fetchBookings();
                },
                onPending: (result) => {
                    showSnackbar('Menunggu pembayaran', 'info');
                },
                onError: (result) => {
                    showSnackbar('Pembayaran gagal', 'error');
                },
                onClose: () => {
                    showSnackbar('Pembayaran dibatalkan', 'warning');
                }
            });
        } catch (error) {
            console.error('Error getting payment token:', error);
            showSnackbar('Gagal memulai pembayaran', 'error');
        }
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
                            <TableCell>Aksi</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {bookingList.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
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
                                    <TableCell>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleOpenDetail(booking)}
                                        >
                                            Detail
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    // Dialog Detail Transaksi
    const DetailDialog = ({ booking, open, onClose }) => {
        if (!booking) return null;

        return (
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
                <DialogTitle>Detail Pemesanan</DialogTitle>
                <DialogContent>
                    <Box sx={{ p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Informasi Booking
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="body2" color="text.secondary">
                                    ID Pemesanan
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    #{booking.id_pemesanan}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body2" color="text.secondary">
                                    Status
                                </Typography>
                                <Box sx={{ mt: 1 }}>
                                    {getStatusChip(booking.status)}
                                </Box>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body2" color="text.secondary">
                                    Lapangan
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {booking.lapangan?.nama || 'Lapangan'}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">
                                    Tanggal
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {formatDate(booking.tanggal)}
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">
                                    Waktu
                                </Typography>
                                <Typography variant="body1" gutterBottom>
                                    {formatSessionTime(booking)}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body2" color="text.secondary">
                                    Total Harga
                                </Typography>
                                <Typography variant="h6" color="primary" gutterBottom>
                                    {new Intl.NumberFormat('id-ID', {
                                        style: 'currency',
                                        currency: 'IDR',
                                        minimumFractionDigits: 0
                                    }).format(booking.total_harga || 0)}
                                </Typography>
                            </Grid>
                        </Grid>

                        {booking.status === 'diverifikasi' && !booking.pembayaran && (
                            <Box sx={{ mt: 3 }}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    onClick={() => handlePayNow(booking)}
                                >
                                    Bayar Sekarang
                                </Button>
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose}>Tutup</Button>
                </DialogActions>
            </Dialog>
        );
    };

    return (
        <UserLayout title="Riwayat Booking">
            <Box sx={{ width: '100%', p: 3 }}>
                <Paper sx={{ width: '100%', mb: 2 }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        variant="fullWidth"
                    >
                        <Tab label="Sedang Berlangsung" />
                        <Tab label="Riwayat" />
                    </Tabs>

                    {loading ? (
                        <Box sx={{ p: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : error ? (
                        <Box sx={{ p: 3 }}>
                            <Alert severity="error">{error}</Alert>
                        </Box>
                    ) : (
                        <Box sx={{ p: 3 }}>
                            {tabValue === 0 ? (
                                renderBookingTable(activeBookings)
                            ) : (
                                renderBookingTable(historyBookings)
                            )}
                        </Box>
                    )}
                </Paper>

                <DetailDialog
                    booking={selectedBooking}
                    open={detailDialogOpen}
                    onClose={handleCloseDetail}
                />
            </Box>
        </UserLayout>
    );
}
