'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import UserLayout from '@/components/user/UserLayout'
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
  Divider,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress
} from '@mui/material'
import { formatDate, formatCurrency, formatDateTime } from '@/lib/utils'
import SkeletonLoader from '@/components/common/SkeletonLoader'
import EmptyState from '@/components/common/EmptyState'
import { bookingService, paymentService } from '@/services/api'
import {
  Receipt as ReceiptIcon,
  History as HistoryIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  Info as InfoIcon,
  CheckCircle as CheckCircleIcon,
  PendingActions as PendingActionsIcon,
  AccessTime as AccessTimeIcon,
  LocationOn as LocationOnIcon,
  CalendarToday as CalendarTodayIcon,
  Payment as PaymentIcon,
  CreditCard as CreditCardIcon,
  QrCode as QrCodeIcon,
  Money as MoneyIcon,
  Security as SecurityIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Close as CloseIcon
} from '@mui/icons-material'


export default function PaymentsPage() {
  const { user } = useAuth()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [tabValue, setTabValue] = useState(0)
  const [detailDialog, setDetailDialog] = useState({
    open: false,
    payment: null
  })
  const [paymentDialog, setPaymentDialog] = useState({
    open: false,
    payment: null,
    processing: false,
    error: null,
    snapEmbedded: false
  })

  // Load Midtrans Snap script
  useEffect(() => {
    if (typeof window === 'undefined' || window.snap) return

    const scriptId = 'midtrans-snap-script'
    if (document.getElementById(scriptId)) return

    const script = document.createElement('script')
    script.id = scriptId
    // Use staging for development, production for live
    script.src = process.env.NEXT_PUBLIC_MIDTRANS_SNAP_URL || 'https://app.stg.midtrans.com/snap/snap.js'
    script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || 'SET_YOUR_CLIENT_KEY_HERE')
    script.async = true

    script.onload = () => {
      console.log('Midtrans script loaded successfully')
    }

    script.onerror = () => {
      console.error('Failed to load Midtrans script')
      setError('Gagal memuat sistem pembayaran. Silakan refresh halaman.')
    }

    document.head.appendChild(script)

    return () => {
      const scriptElement = document.getElementById(scriptId)
      if (scriptElement) {
        document.head.removeChild(scriptElement)
      }
    }
  }, [])

  // Fungsi untuk mengkonversi booking ke payment format
  const convertBookingToPayment = useCallback((booking) => {
    console.log('Converting booking:', booking);
    
    // Hitung status pembayaran berdasarkan status booking
    let paymentStatus = 'pending'
    let transactionStatus = 'pending'

    if (booking.status === 'diverifikasi' || booking.status === 'selesai') {
      paymentStatus = 'paid'
      transactionStatus = 'settlement'
    } else if (booking.status === 'ditolak' || booking.status === 'dibatalkan') {
      paymentStatus = 'cancelled'
      transactionStatus = 'cancel'
    } else if (booking.status === 'expired') {
      paymentStatus = 'expired'
      transactionStatus = 'expire'
    }

    // Format waktu sesi
    const sesi = booking.sesi || []
    sesi.sort((a, b) => a.jam_mulai.localeCompare(b.jam_mulai))
    const waktuMulai = sesi.length > 0 ? sesi[0].jam_mulai : "-"
    const waktuSelesai = sesi.length > 0 ? sesi[sesi.length - 1].jam_selesai : "-"

    // Ambil data pembayaran jika ada
    const pembayaran = booking.pembayaran && booking.pembayaran.length > 0 ? booking.pembayaran[0] : null

    const converted = {
      id: booking.id_pemesanan,
      booking_id: booking.id_pemesanan,
      amount: parseFloat(booking.total_harga),
      status: pembayaran ? pembayaran.status : paymentStatus,
      transaction_status: pembayaran ? pembayaran.transaction_status : transactionStatus,
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
      method: 'Midtrans Payment Gateway',
      customer_name: booking.nama_pelanggan,
      customer_email: booking.email,
      customer_phone: booking.no_hp,
      notes: booking.catatan || null,
      sessions: sesi,
      paid_at: pembayaran ? pembayaran.paid_at : null
    };

    console.log('Converted payment object:', converted);
    return converted;
  }, [])

  // Fungsi untuk mengambil data pembayaran dari booking
  const fetchPayments = useCallback(async () => {
    if (!user) return

    try {
      setLoading(true)
      setError(null)

      // Ambil data booking untuk user yang sedang login
      const response = await bookingService.getUserBookings()
      console.log('Bookings response:', response)

      let bookingsData = []
      if (response && response.data) {
        if (Array.isArray(response.data)) {
          bookingsData = response.data
        } else if (response.data.data && Array.isArray(response.data.data)) {
          bookingsData = response.data.data
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
      formattedPayments.sort((a, b) => new Date(b.date) - new Date(a.date))

      console.log('Final formatted payments:', formattedPayments);
      setPayments(formattedPayments)
    } catch (err) {
      console.error('Error fetching payments:', err)
      setError('Gagal memuat data pembayaran. Silakan coba lagi.')
      setPayments([])
    } finally {
      setLoading(false)
    }
  }, [user, convertBookingToPayment])

  // Effect untuk memuat data saat komponen pertama kali dimuat
  useEffect(() => {
    fetchPayments()
  }, [fetchPayments])

  // Handler untuk perubahan tab
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  // Handler untuk membuka dialog detail
  const handleOpenDetailDialog = (payment) => {
    setDetailDialog({
      open: true,
      payment
    })
  }

  // Handler untuk menutup dialog detail
  const handleCloseDetailDialog = () => {
    setDetailDialog({
      open: false,
      payment: null
    })
  }

  // Handler untuk membuka dialog pembayaran
  const handleOpenPaymentDialog = (payment) => {
    setPaymentDialog({
      open: true,
      payment,
      processing: false,
      error: null,
      snapEmbedded: false
    });
  };

  // Handler untuk menutup dialog pembayaran
  const handleClosePaymentDialog = () => {
    setPaymentDialog({
      open: false,
      payment: null,
      processing: false,
      error: null,
      snapEmbedded: false
    })
  }

  // Handler untuk melanjutkan pembayaran dari detail dialog
  const handleContinuePayment = () => {
    if (detailDialog.payment) {
      handleCloseDetailDialog()
      handleOpenPaymentDialog(detailDialog.payment)
    }
  }

  // Handler untuk memproses pembayaran dengan Midtrans (Popup)
  const handleProcessPayment = async () => {
    if (!paymentDialog.payment) {
      console.error('No payment data available');
      return;
    }

    try {
      setPaymentDialog(prev => ({
        ...prev,
        processing: true,
        error: null
      }))

      // Log data pembayaran untuk debugging
      console.log('Payment Dialog Data:', paymentDialog.payment);

      // Validasi data pembayaran
      if (!paymentDialog.payment.id_pemesanan && !paymentDialog.payment.booking_id) {
        throw new Error('ID Pemesanan tidak ditemukan');
      }

      if (!paymentDialog.payment.total_harga && !paymentDialog.payment.amount) {
        throw new Error('Total pembayaran tidak valid');
      }

      // Siapkan data pembayaran
      const paymentData = {
        booking_id: paymentDialog.payment.id_pemesanan || paymentDialog.payment.booking_id,
        amount: parseInt(paymentDialog.payment.total_harga || paymentDialog.payment.amount || 0),
        customer_details: {
          first_name: paymentDialog.payment.customer_name || user?.name || 'Customer',
          email: paymentDialog.payment.customer_email || user?.email || 'customer@example.com',
          phone: paymentDialog.payment.customer_phone || user?.phone || '08123456789'
        }
      }

      console.log('Sending payment data:', paymentData);

      // Call API untuk membuat transaksi Midtrans
      const response = await paymentService.createMidtransTransaction(paymentData)
      console.log('Response from backend:', response);

      if (!response?.data?.data?.snap_token) {
        throw new Error('Tidak mendapatkan snap token dari server');
      }

      // Pastikan snap sudah terload
      if (!window.snap) {
        throw new Error('Payment gateway is not ready. Please refresh the page.')
      }

      // Set processing selesai
      setPaymentDialog(prev => ({
        ...prev,
        processing: false
      }))

      // Buka Snap popup
      window.snap.pay(response.data.data.snap_token, {
        onSuccess: async function (result) {
          console.log('Payment success:', result);
          try {
            // Update status pembayaran dan booking
            const updateResponse = await bookingService.updatePaymentStatus(paymentDialog.payment.booking_id, {
              status: 'diverifikasi',
              payment_status: 'diverifikasi',
              transaction_status: result.transaction_status,
              transaction_id: result.transaction_id,
              payment_type: result.payment_type,
              paid_at: new Date().toISOString()
            });

            if (updateResponse.success) {
              setSuccess('Pembayaran berhasil! Status booking telah diperbarui.');
            } else {
              throw new Error('Gagal mengupdate status');
            }
          } catch (err) {
            console.error('Error updating payment status:', err);
            setError('Pembayaran berhasil tetapi gagal memperbarui status. Silakan hubungi admin.');
          } finally {
            handleClosePaymentDialog();
            fetchPayments(); // Refresh data
          }
        },
        onPending: function (result) {
          console.log('Payment pending:', result)
          setSuccess('Pembayaran sedang diproses. Silakan cek status pembayaran secara berkala.')
          handleClosePaymentDialog()
          fetchPayments()
        },
        onError: function (result) {
          console.error('Payment error:', result)
          setError('Terjadi kesalahan saat memproses pembayaran. Silakan coba lagi.')
          handleClosePaymentDialog()
        },
        onClose: function () {
          console.log('Payment popup closed')
          handleClosePaymentDialog()
          fetchPayments()
        }
      })

    } catch (err) {
      console.error('Error processing payment:', err)
      setPaymentDialog(prev => ({
        ...prev,
        processing: false,
        error: err.response?.data?.message || err.message || 'Gagal memproses pembayaran. Silakan coba lagi.'
      }))
    }
  }

  // Fungsi untuk mendapatkan warna status yang lebih detail
  const getPaymentStatusColor = (status, transactionStatus, bookingStatus) => {
    switch (transactionStatus) {
      case 'settlement':
      case 'capture':
        return bookingStatus === 'selesai' ? 'success' : 'info'
      case 'pending':
        return 'warning'
      case 'deny':
      case 'cancel':
      case 'expire':
        return 'error'
      case 'failure':
        return 'error'
      default:
        return bookingStatus === 'menunggu verifikasi' ? 'warning' : 'default'
    }
  }

  // Fungsi untuk mendapatkan label status yang lebih detail
  const getPaymentStatusLabel = (status, transactionStatus, bookingStatus) => {
    switch (transactionStatus) {
      case 'settlement':
      case 'capture':
        return bookingStatus === 'selesai' ? 'Selesai' : 'Pembayaran Berhasil'
      case 'pending':
        return 'Menunggu Pembayaran'
      case 'deny':
        return 'Pembayaran Ditolak'
      case 'cancel':
        return 'Pembayaran Dibatalkan'
      case 'expire':
        return 'Pembayaran Kedaluwarsa'
      case 'failure':
        return 'Pembayaran Gagal'
      default:
        switch (bookingStatus) {
          case 'menunggu verifikasi':
            return 'Menunggu Verifikasi'
          case 'diverifikasi':
            return 'Pembayaran Diverifikasi'
          case 'selesai':
            return 'Selesai'
          case 'ditolak':
            return 'Ditolak'
          case 'dibatalkan':
            return 'Dibatalkan'
          default:
            return status === 'paid' ? 'Sudah Dibayar' : 'Menunggu Pembayaran'
        }
    }
  }

  // Fungsi untuk cek apakah bisa melakukan pembayaran
  const canMakePayment = (payment) => {
    if (!payment) return false; // tambahkan validasi awal

    return payment.status === 'pending' &&
      (payment.transaction_status === 'pending' || !payment.transaction_status) &&
      payment.booking_status !== 'ditolak' &&
      payment.booking_status !== 'dibatalkan' &&
      payment.booking_status !== 'expired' &&
      (!payment.due_date || new Date(payment.due_date) > new Date())
  }

  // Filter pembayaran berdasarkan tab yang dipilih
  const filteredPayments = payments.filter(payment => {
    switch (tabValue) {
      case 1: // Menunggu Pembayaran
        return payment.status === 'pending' || payment.transaction_status === 'pending'
      case 2: // Sudah Dibayar
        return payment.status === 'paid' ||
          payment.transaction_status === 'settlement' ||
          payment.transaction_status === 'capture' ||
          payment.booking_status === 'diverifikasi' ||
          payment.booking_status === 'selesai'
      case 3: // Gagal/Dibatalkan
        return payment.status === 'cancelled' ||
          payment.status === 'expired' ||
          payment.transaction_status === 'cancel' ||
          payment.transaction_status === 'deny' ||
          payment.transaction_status === 'expire' ||
          payment.transaction_status === 'failure' ||
          payment.booking_status === 'ditolak' ||
          payment.booking_status === 'dibatalkan'
      default: // Semua
        return true
    }
  })

  if (loading) {
    return (
      <UserLayout title="Manajemen Pembayaran">
        <SkeletonLoader count={3} />
      </UserLayout>
    )
  }

  if (error) {
    return (
      <UserLayout title="Manajemen Pembayaran">
        <Box sx={{ p: 2, textAlign: 'center' }}>
          <Typography color="error">{error}</Typography>
          <Button variant="outlined" onClick={fetchPayments} sx={{ mt: 2 }}>
            Coba Lagi
          </Button>
        </Box>
      </UserLayout>
    )
  }

  return (
    <UserLayout title="Pembayaran">
      {/* Success Alert */}
      {success && (
        <Alert
          severity="success"
          sx={{ mb: 3 }}
          onClose={() => setSuccess(null)}
          action={
            <Button color="inherit" size="small" onClick={() => setSuccess(null)}>
              TUTUP
            </Button>
          }
        >
          {success}
        </Alert>
      )}

      {/* Error Alert */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() => setError(null)}
          action={
            <Button color="inherit" size="small" onClick={() => setError(null)}>
              TUTUP
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Payment Info Card */}
      <Card sx={{ mb: 3, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PaymentIcon sx={{ mr: 2, fontSize: 32 }} />
            <Box>
              <Typography variant="h6" gutterBottom>
                Pembayaran Mudah & Aman
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.9 }}>
                Powered by Midtrans - Metode pembayaran lengkap dan terpercaya
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CreditCardIcon sx={{ mr: 1, opacity: 0.8 }} />
                <Typography variant="body2">Kartu Kredit/Debit</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <QrCodeIcon sx={{ mr: 1, opacity: 0.8 }} />
                <Typography variant="body2">QRIS & E-Wallet</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <MoneyIcon sx={{ mr: 1, opacity: 0.8 }} />
                <Typography variant="body2">Virtual Account</Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Payment List */}
      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
            aria-label="payment tabs"
          >
            <Tab
              label="Semua"
              icon={<HistoryIcon />}
              iconPosition="start"
            />
            <Tab
              label="Menunggu Pembayaran"
              icon={<PendingActionsIcon />}
              iconPosition="start"
            />
            <Tab
              label="Sudah Dibayar"
              icon={<CheckCircleIcon />}
              iconPosition="start"
            />
            <Tab
              label="Gagal/Dibatalkan"
              icon={<InfoIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Box>

        <CardContent>
          {loading ? (
            <SkeletonLoader count={5} />
          ) : error && payments.length === 0 ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography color="error" gutterBottom>{error}</Typography>
              <Button
                variant="outlined"
                onClick={fetchPayments}
                sx={{ mt: 2 }}
                startIcon={<PendingActionsIcon />}
              >
                Coba Lagi
              </Button>
            </Box>
          ) : filteredPayments.length === 0 ? (
            <EmptyState
              icon={<ReceiptIcon sx={{ fontSize: 60 }} />}
              title="Tidak ada data pembayaran"
              message={tabValue === 0 ?
                "Anda belum memiliki riwayat pembayaran" :
                tabValue === 1 ?
                  "Tidak ada pembayaran yang menunggu" :
                  tabValue === 2 ?
                    "Belum ada pembayaran yang berhasil" :
                    "Tidak ada pembayaran yang gagal/dibatalkan"}
            />
          ) : (
            <Box>
              {filteredPayments.map((payment, index) => (
                <Card
                  key={payment.id ?? `payment-${index}`}  // fallback kalau id-nya null
                  sx={{
                    mb: 2,
                    border: 1,
                    borderColor: canMakePayment(payment) ? 'warning.main' : 'divider',
                    boxShadow: canMakePayment(payment) ? 2 : 'none',
                    '&:hover': {
                      boxShadow: 2,
                    },
                  }}
                >
                  <CardContent>
                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 2
                    }}>
                      <Box>
                        <Typography variant="subtitle1" fontWeight="medium">
                          Booking #{payment.booking_id}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {/* {formatDateTime(payment.date)} */}
                        </Typography>
                        {payment.due_date && new Date(payment.due_date) < new Date() && payment.status === 'pending' && (
                          <Typography variant="caption" color="error.main" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
                            Jatuh tempo: {formatDate(payment.due_date)}
                          </Typography>
                        )}
                        {payment.paid_at && (
                          <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                            <CheckCircleIcon fontSize="small" sx={{ mr: 0.5 }} />
                            Dibayar: {formatDateTime(payment.paid_at)}
                          </Typography>
                        )}
                      </Box>
                      <Chip
                        label={getPaymentStatusLabel(payment.status, payment.transaction_status, payment.booking_status)}
                        color={getPaymentStatusColor(payment.status, payment.transaction_status, payment.booking_status)}
                        size="small"
                        variant="outlined"
                      />
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Jumlah Pembayaran
                        </Typography>
                        <Typography variant="h6" color="primary.main" fontWeight="bold">
                          {formatCurrency(payment.amount)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <PaymentIcon fontSize="small" color="action" />
                          {payment.method}
                        </Typography>
                        {payment.transaction_id && (
                          <Typography variant="caption" color="text.secondary">
                            ID Transaksi: {payment.transaction_id}
                          </Typography>
                        )}
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="body2" color="text.secondary">
                          Detail Booking
                        </Typography>
                        <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <LocationOnIcon fontSize="small" color="action" />
                          {payment.field_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <CalendarTodayIcon fontSize="small" color="action" />
                          {formatDate(payment.schedule_date)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTimeIcon fontSize="small" color="action" />
                          {payment.schedule_time}
                        </Typography>
                      </Grid>
                    </Grid>

                    {payment.notes && (
                      <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Catatan:
                        </Typography>
                        <Typography variant="body2">
                          {payment.notes}
                        </Typography>
                      </Box>
                    )}

                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      mt: 2,
                      gap: 1
                    }}>
                      <Button
                        size="small"
                        startIcon={<InfoIcon />}
                        onClick={() => handleOpenDetailDialog(payment)}
                      >
                        Detail
                      </Button>

                      {canMakePayment(payment) && (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => handleOpenPaymentDialog(payment)}
                          startIcon={<PaymentIcon />}
                          sx={{
                            ml: 1,
                            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                            '&:hover': {
                              background: 'linear-gradient(45deg, #1976D2 30%, #0097A7 90%)',
                            }
                          }}
                        >
                          Bayar Sekarang
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Payment Detail Dialog */}
      <Dialog
        open={detailDialog.open}
        onClose={handleCloseDetailDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          display: 'flex',
          alignItems: 'center'
        }}>
          <ReceiptIcon sx={{ mr: 1 }} />
          Detail Pembayaran
        </DialogTitle>
        <DialogContent dividers>
          {detailDialog.payment && (
            <Grid container spacing={3}>
              {/* Payment Status */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" gutterBottom>
                      Status Pembayaran
                    </Typography>
                    <Chip
                      label={getPaymentStatusLabel(
                        detailDialog.payment.status,
                        detailDialog.payment.transaction_status,
                        detailDialog.payment.booking_status
                      )}
                      color={getPaymentStatusColor(
                        detailDialog.payment.status,
                        detailDialog.payment.transaction_status,
                        detailDialog.payment.booking_status
                      )}
                      variant="filled"
                    />
                  </Box>
                </Paper>
              </Grid>

              {/* Booking Information */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom color="primary">
                  Informasi Booking
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <ReceiptIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="ID Booking"
                      secondary={`#${detailDialog.payment.booking_id}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <LocationOnIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Lapangan"
                      secondary={detailDialog.payment.field_name}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <CalendarTodayIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Tanggal & Waktu"
                      secondary={`${formatDate(detailDialog.payment.schedule_date)} - ${detailDialog.payment.schedule_time}`}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <AccountBalanceWalletIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Total Pembayaran"
                      secondary={formatCurrency(detailDialog.payment.amount)}
                      secondaryTypographyProps={{
                        color: 'primary.main',
                        fontWeight: 'bold',
                        fontSize: '1.1rem'
                      }}
                    />
                  </ListItem>
                </List>
              </Grid>

              {/* Customer Information */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom color="primary">
                  Informasi Pelanggan
                </Typography>
                <List dense>
                  <ListItem>
                    <ListItemIcon>
                      <PersonIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Nama"
                      secondary={detailDialog.payment.customer_name}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <EmailIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Email"
                      secondary={detailDialog.payment.customer_email}
                    />
                  </ListItem>
                  <ListItem>
                    <ListItemIcon>
                      <PhoneIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Nomor Telepon"
                      secondary={detailDialog.payment.customer_phone}
                    />
                  </ListItem>
                  {/* Payment Method */}
                  <ListItem>
                    <ListItemIcon>
                      <PaymentIcon />
                    </ListItemIcon>
                    <ListItemText
                      primary="Metode Pembayaran"
                      secondary={detailDialog.payment.method}
                    />
                  </ListItem>
                </List>
              </Grid>

              {/* Payment Timeline */}
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom color="primary">
                  Timeline Pembayaran
                </Typography>
                <Paper sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Created */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <CheckCircleIcon color="success" />
                        <Divider orientation="vertical" flexItem sx={{ my: 1 }} />
                      </Box>
                      <Box>
                        <Typography variant="subtitle2">Pesanan Dibuat</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {formatDateTime(detailDialog.payment.date)}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Due Date */}
                    {detailDialog.payment.due_date && (
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <AccessTimeIcon color={
                            new Date(detailDialog.payment.due_date) < new Date() &&
                              detailDialog.payment.status === 'pending' ?
                              'error' : 'warning'
                          } />
                          <Divider orientation="vertical" flexItem sx={{ my: 1 }} />
                        </Box>
                        <Box>
                          <Typography variant="subtitle2">
                            Batas Waktu Pembayaran
                          </Typography>
                          <Typography variant="body2" color={
                            new Date(detailDialog.payment.due_date) < new Date() &&
                              detailDialog.payment.status === 'pending' ?
                              'error' : 'text.secondary'
                          }>
                            {formatDateTime(detailDialog.payment.due_date)}
                            {new Date(detailDialog.payment.due_date) < new Date() &&
                              detailDialog.payment.status === 'pending' && (
                                <Typography variant="caption" color="error" sx={{ ml: 1 }}>
                                  (Telah lewat batas waktu)
                                </Typography>
                              )}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {/* Paid At */}
                    {detailDialog.payment.paid_at && (
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <CheckCircleIcon color="success" />
                          <Divider orientation="vertical" flexItem sx={{ my: 1 }} />
                        </Box>
                        <Box>
                          <Typography variant="subtitle2">Pembayaran Berhasil</Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatDateTime(detailDialog.payment.paid_at)}
                          </Typography>
                        </Box>
                      </Box>
                    )}

                    {/* Current Status */}
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {detailDialog.payment.status === 'paid' ? (
                          <CheckCircleIcon color="success" />
                        ) : detailDialog.payment.status === 'pending' ? (
                          <PendingActionsIcon color="warning" />
                        ) : (
                          <InfoIcon color="error" />
                        )}
                      </Box>
                      <Box>
                        <Typography variant="subtitle2">Status Saat Ini</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {getPaymentStatusLabel(
                            detailDialog.payment.status,
                            detailDialog.payment.transaction_status,
                            detailDialog.payment.booking_status
                          )}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              {/* Session Details */}
              {detailDialog.payment.sessions && detailDialog.payment.sessions.length > 0 && (
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom color="primary">
                    Detail Sesi
                  </Typography>
                  <Paper sx={{ p: 2 }}>
                    <List dense>
                      {detailDialog.payment.sessions.map((session, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <AccessTimeIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={`Sesi ${index + 1}`}
                            secondary={`${session.jam_mulai} - ${session.jam_selesai} (${session.durasi} menit)`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
              )}

              {/* Transaction ID */}
              {detailDialog.payment.transaction_id && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    <strong>ID Transaksi:</strong> {detailDialog.payment.transaction_id}
                  </Typography>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDetailDialog}
            startIcon={<CloseIcon />}
          >
            Tutup
          </Button>
          {canMakePayment(detailDialog.payment) && (
            <Button
              variant="contained"
              onClick={handleContinuePayment}
              startIcon={<PaymentIcon />}
              sx={{
                background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1976D2 30%, #0097A7 90%)',
                }
              }}
            >
              Lanjutkan Pembayaran
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Payment Dialog */}
      <Dialog
        open={paymentDialog.open}
        onClose={handleClosePaymentDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          display: 'flex',
          alignItems: 'center'
        }}>
          <PaymentIcon sx={{ mr: 1 }} />
          Proses Pembayaran
        </DialogTitle>
        <DialogContent dividers>
          {paymentDialog.processing ? (
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 300
            }}>
              <CircularProgress size={60} thickness={4} sx={{ mb: 3 }} />
              <Typography variant="h6" gutterBottom>
                Menyiapkan Pembayaran...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Harap tunggu sebentar
              </Typography>
            </Box>
          ) : paymentDialog.error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {paymentDialog.error}
            </Alert>
          ) : (
            <Box>
              {paymentDialog.payment && (
                <Box sx={{ mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Ringkasan Pembayaran
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        ID Booking
                      </Typography>
                      <Typography variant="body1">
                        #{paymentDialog.payment.booking_id}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Total Pembayaran
                      </Typography>
                      <Typography variant="h6" color="primary.main">
                        {formatCurrency(paymentDialog.payment.amount)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Lapangan
                      </Typography>
                      <Typography variant="body1">
                        {paymentDialog.payment.field_name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Tanggal & Waktu
                      </Typography>
                      <Typography variant="body1">
                        {formatDate(paymentDialog.payment.schedule_date)} - {paymentDialog.payment.schedule_time}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}

              <Typography variant="subtitle1" gutterBottom>
                Pilih Metode Pembayaran
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Pembayaran aman melalui Midtrans
              </Typography>

              {/* Midtrans Snap Container */}
              <Box
                id="snap-container"
                sx={{
                  minHeight: 400,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  p: 2
                }}
              >
                {!paymentDialog.snapEmbedded && (
                  <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: 300
                  }}>
                    <SecurityIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Sistem Pembayaran Sedang Dimuat
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Harap tunggu sebentar...
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClosePaymentDialog}
            startIcon={<CloseIcon />}
            disabled={paymentDialog.processing}
          >
            Batal
          </Button>
          {!paymentDialog.snapEmbedded && !paymentDialog.processing && !paymentDialog.error && (
            <Button
              variant="contained"
              onClick={handleProcessPayment}
              startIcon={<PaymentIcon />}
              sx={{
                background: 'linear-gradient(45deg, #4CAF50 30%, #8BC34A 90%)',
                boxShadow: '0 3px 5px 2px rgba(76, 175, 80, .3)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #388E3C 30%, #689F38 90%)',
                }
              }}
            >
              Proses Pembayaran
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </UserLayout>
  )
}