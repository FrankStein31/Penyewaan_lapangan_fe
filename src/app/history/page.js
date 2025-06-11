// File: app/booking/history/page.js

'use client';

import { useEffect, useState, useCallback } from 'react';
import UserLayout from '@/components/user/UserLayout';
import { bookingService, sesiService } from '@/services/api';
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
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [detailDialogOpen, setDetailDialogOpen] = useState(false);
    const [paymentDialog, setPaymentDialog] = useState({
        open: false,
        payment: null,
        processing: false,
        error: null,
        snapEmbedded: false
    });
    const [sesiData, setSesiData] = useState({});

    useEffect(() => {
        const fetchSesiData = async (sesiIds) => {
            try {
                const response = await sesiService.getByIds(sesiIds);
                if (response.success && response.data) {
                    const sesiMap = {};
                    response.data.forEach(sesi => {
                        sesiMap[sesi.id_sesi] = sesi;
                    });
                    setSesiData(prevData => ({ ...prevData, ...sesiMap }));
                }
            } catch (error) {
                console.error('Error fetching sesi data:', error);
            }
        };

        const fetchBookings = async () => {
            try {
                setLoading(true);
                console.log('Mencoba fetch data booking...');
                const response = await bookingService.getUserBookings();
                console.log('Response dari server:', response);
                
                if (response && response.data) {
                    console.log('Data booking berhasil diambil:', response.data);
                    setBookings(response.data);

                    // Kumpulkan semua ID sesi dari semua booking
                    const allSesiIds = response.data.reduce((ids, booking) => {
                        if (booking.id_sesi) {
                            const sesiIds = typeof booking.id_sesi === 'string' 
                                ? JSON.parse(booking.id_sesi) 
                                : booking.id_sesi;
                            return [...ids, ...sesiIds];
                        }
                        return ids;
                    }, []);

                    // Ambil data sesi jika ada ID sesi
                    if (allSesiIds.length > 0) {
                        await fetchSesiData(allSesiIds);
                    }
                } else {
                    console.log('Data kosong atau format tidak sesuai');
                    setBookings([]);
                }
                setError(null);
            } catch (err) {
                console.error('Error lengkap:', err);
                handleError(err);
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
        try {
            // Pastikan booking dan id_sesi ada
            if (!booking || !booking.id_sesi) {
                return 'Waktu tidak tersedia';
            }

            // Parse id_sesi jika dalam bentuk string
            const sesiIds = typeof booking.id_sesi === 'string' 
                ? JSON.parse(booking.id_sesi) 
                : booking.id_sesi;

            // Pastikan sesiIds adalah array dan tidak kosong
            if (!Array.isArray(sesiIds) || sesiIds.length === 0) {
                return 'Waktu tidak tersedia';
            }

            // Urutkan ID sesi
            const sortedSesiIds = [...sesiIds].sort((a, b) => a - b);

            // Ambil data sesi dari state
            const sesiList = sortedSesiIds.map(id => sesiData[id]).filter(Boolean);

            if (sesiList.length === 0) {
                return 'Waktu tidak tersedia';
            }

            // Urutkan sesi berdasarkan jam mulai
            sesiList.sort((a, b) => a.jam_mulai.localeCompare(b.jam_mulai));

            // Jika hanya ada 1 sesi
            if (sesiList.length === 1) {
                return `${sesiList[0].jam_mulai} - ${sesiList[0].jam_selesai}`;
            }

            // Jika ada multiple sesi, tampilkan range dari sesi pertama sampai terakhir
            return `${sesiList[0].jam_mulai} - ${sesiList[sesiList.length - 1].jam_selesai}`;
        } catch (error) {
            console.error('Error formatting session time:', error);
            return 'Waktu tidak tersedia';
        }
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
            const response = await bookingService.getPaymentToken(booking.id_pemesanan);
            const token = response.data.snap_token;
            
            window.snap.pay(token, {
                onSuccess: async (result) => {
                    console.log('Payment success:', result);
                    try {
                        // Update status pembayaran dan booking
                        await bookingService.updatePaymentStatus(booking.id_pemesanan, {
                            status: 'diverifikasi',
                            payment_status: 'diverifikasi',
                            transaction_status: result.transaction_status,
                            transaction_id: result.transaction_id,
                            payment_type: result.payment_type,
                            paid_at: new Date().toISOString()
                        });

                        setSuccess('Pembayaran berhasil! Status booking telah diperbarui.');
                        // Refresh data booking
                        fetchBookings();
                    } catch (err) {
                        console.error('Error updating payment status:', err);
                        setError('Pembayaran berhasil tetapi gagal memperbarui status. Silakan hubungi admin.');
                    }
                },
                onPending: async (result) => {
                    console.log('Payment pending:', result);
                    setSuccess('Pembayaran sedang diproses. Status booking akan diperbarui dalam beberapa saat.');
                    // Tetap refresh data untuk mendapatkan status terbaru
                    fetchBookings();
                },
                onError: (result) => {
                    console.error('Payment error:', result);
                    setError('Pembayaran gagal. Silakan coba lagi.');
                },
                onClose: () => {
                    console.log('Snap popup closed');
                    // Refresh data untuk mendapatkan status terbaru
                    fetchBookings();
                }
            });
        } catch (err) {
            console.error('Error getting payment token:', err);
            setError('Gagal memulai pembayaran. Silakan coba lagi.');
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
                                        {booking.status === 'diverifikasi' && !booking.pembayaran && (
                                            <Button
                                                variant="contained"
                                                size="small"
                                                onClick={() => handlePayNow(booking)}
                                                sx={{ ml: 1 }}
                                            >
                                                Bayar
                                            </Button>
                                        )}
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

    // Fungsi untuk mengkonversi booking ke payment format
    const convertBookingToPayment = useCallback((booking) => {
        console.log('Converting booking:', booking);
        
        // Hitung status pembayaran berdasarkan status booking dan pembayaran
        let paymentStatus = 'pending';
        let transactionStatus = 'pending';

        // Ambil data pembayaran jika ada
        const pembayaran = booking.pembayaran && booking.pembayaran.length > 0 ? booking.pembayaran[0] : null;

        if (pembayaran) {
            paymentStatus = pembayaran.status;
            transactionStatus = pembayaran.transaction_status || 'pending';
        }

        // Update status berdasarkan status booking
        if (booking.status === 'diverifikasi' || booking.status === 'selesai') {
            paymentStatus = 'paid';
            transactionStatus = 'settlement';
        } else if (booking.status === 'ditolak' || booking.status === 'dibatalkan') {
            paymentStatus = 'cancelled';
            transactionStatus = 'cancel';
        } else if (booking.status === 'expired') {
            paymentStatus = 'expired';
            transactionStatus = 'expire';
        }

        // Format waktu sesi
        const sesi = booking.sesi || [];
        sesi.sort((a, b) => a.jam_mulai.localeCompare(b.jam_mulai));
        const waktuMulai = sesi.length > 0 ? sesi[0].jam_mulai : "-";
        const waktuSelesai = sesi.length > 0 ? sesi[sesi.length - 1].jam_selesai : "-";

        const converted = {
            id: booking.id_pemesanan,
            booking_id: booking.id_pemesanan,
            amount: parseFloat(booking.total_harga),
            status: paymentStatus,
            transaction_status: transactionStatus,
            booking_status: booking.status,
            payment_type: pembayaran ? pembayaran.payment_type : 'midtrans',
            snap_token: pembayaran ? pembayaran.snap_token : null,
            transaction_id: pembayaran ? pembayaran.transaction_id : null,
            date: booking.created_at,
            due_date: booking.due_date || null,
            field_name: booking.lapangan?.nama || 'Lapangan',
            schedule: `${formatDate(booking.tanggal)} - ${waktuMulai} - ${waktuSelesai}`,
            schedule_date: booking.tanggal,
            schedule_time: `${waktuMulai} - ${waktuSelesai}`,
            method: pembayaran ? pembayaran.metode || 'Midtrans Payment Gateway' : 'Midtrans Payment Gateway',
            customer_name: booking.nama_pelanggan,
            customer_email: booking.email,
            customer_phone: booking.no_hp,
            notes: booking.catatan || null,
            sessions: sesi,
            paid_at: pembayaran ? pembayaran.paid_at : null,
            total_harga: booking.total_harga
        };

        console.log('Converted payment object:', converted);
        return converted;
    }, []);

    // Fungsi untuk mengambil data pembayaran
    const fetchPayments = async () => {
        try {
            setLoading(true);
            setError(null);

            // Ambil data booking untuk user yang sedang login
            const response = await bookingService.getUserBookings();
            console.log('Bookings response:', response);

            let bookingsData = [];
            if (response && response.data) {
                if (Array.isArray(response.data)) {
                    bookingsData = response.data;
                } else if (response.data.data && Array.isArray(response.data.data)) {
                    bookingsData = response.data.data;
                }
            }

            console.log('User bookings before conversion:', bookingsData);

            // Konversi booking ke format payment
            const formattedPayments = bookingsData.map(booking => {
                const converted = convertBookingToPayment(booking);
                console.log('Converted booking:', converted);
                return converted;
            });

            // Urutkan berdasarkan tanggal terbaru
            formattedPayments.sort((a, b) => new Date(b.date) - new Date(a.date));

            console.log('Final formatted payments:', formattedPayments);
            setPayments(formattedPayments);
        } catch (err) {
            console.error('Error fetching payments:', err);
            setError('Gagal memuat data pembayaran. Silakan coba lagi.');
            setPayments([]);
        } finally {
            setLoading(false);
        }
    };

    // Effect untuk memuat data saat komponen pertama kali dimuat
    useEffect(() => {
        fetchPayments();
    }, []);

    // Handle error function
    const handleError = (err) => {
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
