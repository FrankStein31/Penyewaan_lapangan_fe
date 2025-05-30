// src/app/User/payments/page.js
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import UserLayout from '@/components/user/UserLayout'
import { Box, Typography, Card, CardContent, Grid, Button, Tab, Tabs, Divider, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Avatar } from '@mui/material'
import { formatDate, formatCurrency } from '@/lib/utils'
import PaymentStatusBadge from '@/components/user/PaymentStatusBadge'
import SkeletonLoader from '@/components/common/SkeletonLoader'
import EmptyState from '@/components/common/EmptyState'
import { paymentService } from '@/services/api'
import ReceiptIcon from '@mui/icons-material/Receipt'
import HistoryIcon from '@mui/icons-material/History'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import CloudDownloadIcon from '@mui/icons-material/CloudDownload'
import InfoIcon from '@mui/icons-material/Info'
import PersonIcon from '@mui/icons-material/Person'

export default function PaymentsPage() {
  const { user } = useAuth()
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [tabValue, setTabValue] = useState(0)
  const [detailDialog, setDetailDialog] = useState({
    open: false,
    payment: null
  })
  const [uploadDialog, setUploadDialog] = useState({
    open: false,
    payment: null,
    file: null,
    notes: ''
  })

  useEffect(() => {
    fetchPayments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchPayments = async () => {
    setLoading(true)
    try {
      const data = await paymentService.getAll()
      setPayments(Array.isArray(data) ? data : [])
      setError(null)
    } catch (err) {
      setError('Gagal memuat data pembayaran. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (event, newValue) => setTabValue(newValue)
  const handleOpenDetailDialog = (payment) => setDetailDialog({ open: true, payment })
  const handleCloseDetailDialog = () => setDetailDialog({ open: false, payment: null })
  const handleOpenUploadDialog = (payment) => setUploadDialog({ open: true, payment, file: null, notes: '' })
  const handleCloseUploadDialog = () => setUploadDialog({ open: false, payment: null, file: null, notes: '' })
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadDialog({ ...uploadDialog, file: e.target.files[0] })
    }
  }
  const handleNotesChange = (e) => setUploadDialog({ ...uploadDialog, notes: e.target.value })

  const handleUploadPaymentProof = async () => {
    if (!uploadDialog.file) {
      alert('Mohon pilih file bukti pembayaran')
      return
    }
    
    try {
      // Tambahkan loading state
      setLoading(true)
      
      const formData = new FormData()
      formData.append('bukti_pembayaran', uploadDialog.file)
      formData.append('catatan', uploadDialog.notes)
      formData.append('id_pembayaran', uploadDialog.payment.id)
      
      // Tambahkan ID sebagai path parameter untuk memastikan endpoint benar
      // Ini memberikan alternatif endpoint /payments/{id}/proof
      const response = await paymentService.uploadPaymentProof(formData);
      
      console.log('Upload success:', response)
      alert('Bukti pembayaran berhasil diunggah')
      handleCloseUploadDialog()
      fetchPayments() // Refresh data
    } catch (err) {
      console.error('Error uploading payment proof:', err)
      
      // Tampilkan pesan error yang lebih spesifik
      let errorMessage = 'Gagal mengunggah bukti pembayaran. ';
      if (err.response) {
        if (err.response.status === 404) {
          errorMessage += 'Endpoint tidak ditemukan. Silakan hubungi admin.';
        } else if (err.response.status === 422) {
          errorMessage += 'Data tidak valid. Periksa format file.';
        } else if (err.response.data && err.response.data.message) {
          errorMessage += err.response.data.message;
        }
      }
      
      alert(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const STATUS = {
    WAITING: 'menunggu verifikasi',
    UNPAID: 'belum dibayar',
    REJECTED: 'ditolak',
    VERIFIED: 'diverifikasi'
  }

  // Statistik
  const totalWaiting = payments.filter(p => p.status === STATUS.WAITING || p.status === STATUS.UNPAID).length
  const totalPaid = payments.filter(p => p.status === STATUS.VERIFIED).reduce((sum, item) => sum + (item.amount || 0), 0)

  // Filter tab
  const filteredPayments = payments.filter(payment => {
    if (tabValue === 0) return true
    if (tabValue === 1) return payment.status === STATUS.WAITING || payment.status === STATUS.UNPAID
    if (tabValue === 2) return payment.status === STATUS.VERIFIED
    if (tabValue === 3) return payment.status === STATUS.REJECTED
    return true
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
    <UserLayout title="Manajemen Pembayaran">
      <Grid
        container
        spacing={2}
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
          gap: 2,
        }}
      >
        <Grid>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ bgcolor: 'primary.main', p: 1, borderRadius: 1, color: 'white', mr: 2 }}>
                  <ReceiptIcon />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Pembayaran
                  </Typography>
                  <Typography variant="h6">
                    {payments.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ bgcolor: 'warning.main', p: 1, borderRadius: 1, color: 'white', mr: 2 }}>
                  <HistoryIcon />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Menunggu Pembayaran/Verifikasi
                  </Typography>
                  <Typography variant="h6">
                    {totalWaiting}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ bgcolor: 'success.main', p: 1, borderRadius: 1, color: 'white', mr: 2 }}>
                  <AccountBalanceWalletIcon />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Dibayar
                  </Typography>
                  <Typography variant="h6">
                    {formatCurrency(totalPaid)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Semua" />
            <Tab label="Menunggu Verifikasi" />
            <Tab label="Sudah Dibayar" />
            <Tab label="Ditolak" />
          </Tabs>
        </Box>

        <CardContent>
          {filteredPayments.length === 0 ? (
            <EmptyState
              title="Tidak ada data pembayaran"
              message="Belum ada data pembayaran yang tersedia."
            />
          ) : (
            <Box>
              {filteredPayments.map((payment, idx) => (
                <Box key={payment.id ?? `payment-${idx}`}>
                  <Card sx={{ mb: 0, border: 1, borderColor: 'divider', boxShadow: 'none', borderRadius: 2 }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box>
                          <Typography variant="subtitle1" fontWeight="medium">
                            Booking #{payment.booking_id || '000000'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatDate(payment.date)}
                          </Typography>
                        </Box>
                        <PaymentStatusBadge status={payment.status} />
                      </Box>
                      <Grid container spacing={2}>
                        <Grid xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Jumlah Pembayaran
                          </Typography>
                          <Typography variant="h6" color="primary.main" fontWeight="bold">
                            {formatCurrency(payment.amount)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Metode: {payment.method || 'Transfer Bank'}
                          </Typography>
                        </Grid>
                        <Grid xs={12} sm={6}>
                          <Typography variant="body2" color="text.secondary">
                            Booking Lapangan
                          </Typography>
                          <Typography variant="body1">
                            {payment.field_name || 'Lapangan A'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {payment.schedule || 'Jadwal tidak tersedia'}
                          </Typography>
                        </Grid>
                        <Grid xs={12} sm={6} sx={{ mt: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 28, height: 28, bgcolor: 'grey.200', color: 'primary.main' }}>
                              <PersonIcon />
                            </Avatar>
                            <Typography variant="body2" color="text.secondary">
                              {payment.user_name || '-'}
                            </Typography>
                          </Box>
                        </Grid>
                      </Grid>
                      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Button
                          size="small"
                          startIcon={<InfoIcon />}
                          onClick={() => handleOpenDetailDialog(payment)}
                          sx={{ mr: 1 }}
                        >
                          Detail
                        </Button>
                        {(payment.status === STATUS.WAITING || payment.status === STATUS.UNPAID) && (
                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            onClick={() => handleOpenUploadDialog(payment)}
                          >
                            Upload Bukti
                          </Button>
                        )}
                        {payment.status === STATUS.VERIFIED && (
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<CloudDownloadIcon />}
                          >
                            Invoice
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                  {idx < filteredPayments.length - 1 && <Divider sx={{ my: 2 }} />}
                </Box>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Dialog Detail */}
      <Dialog
        open={detailDialog.open}
        onClose={handleCloseDetailDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Detail Pembayaran
        </DialogTitle>
        <DialogContent dividers>
          {detailDialog.payment && (
            <Grid
              container
              spacing={2}
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                gap: 2,
              }}
            >
              <Grid>
                <Typography variant="body2" color="text.secondary">
                  ID Pembayaran
                </Typography>
                <Typography variant="body1" gutterBottom>
                  #{detailDialog.payment.id}
                </Typography>
              </Grid>
              <Grid>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <PaymentStatusBadge status={detailDialog.payment.status} />
              </Grid>
              <Grid>
                <Typography variant="body2" color="text.secondary">
                  Tanggal Pembayaran
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {formatDate(detailDialog.payment.date)}
                </Typography>
              </Grid>
              <Grid>
                <Typography variant="body2" color="text.secondary">
                  Metode Pembayaran
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {detailDialog.payment.method || 'Transfer Bank'}
                </Typography>
              </Grid>
              <Grid xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Jumlah Pembayaran
                </Typography>
                <Typography variant="h6" color="primary.main" fontWeight="bold" gutterBottom>
                  {formatCurrency(detailDialog.payment.amount)}
                </Typography>
              </Grid>
              <Grid xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Detail Booking
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {detailDialog.payment.field_name || 'Lapangan A'}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {detailDialog.payment.schedule || 'Jadwal tidak tersedia'}
                </Typography>
              </Grid>
              <Grid xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar sx={{ width: 28, height: 28, bgcolor: 'grey.200', color: 'primary.main' }}>
                    <PersonIcon />
                  </Avatar>
                  <Typography variant="body2" color="text.secondary">
                    {detailDialog.payment.user_name || '-'}
                  </Typography>
                </Box>
              </Grid>
              {(detailDialog.payment.status === STATUS.VERIFIED || detailDialog.payment.status === STATUS.WAITING) && detailDialog.payment.bukti_transfer && (
                <Grid xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Bukti Pembayaran
                  </Typography>
                  <Box sx={{ mt: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
                    <img
                      src={detailDialog.payment.bukti_transfer}
                      alt="Bukti Pembayaran"
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                  </Box>
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailDialog}>Tutup</Button>
          {detailDialog.payment && detailDialog.payment.status === STATUS.VERIFIED && (
            <Button variant="contained" startIcon={<CloudDownloadIcon />}>
              Download Invoice
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* Dialog Upload */}
      <Dialog
        open={uploadDialog.open}
        onClose={handleCloseUploadDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Upload Bukti Pembayaran
        </DialogTitle>
        <DialogContent dividers>
          {uploadDialog.payment && (
            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Detail Pembayaran
              </Typography>

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    ID Pembayaran
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    #{uploadDialog.payment.id}
                  </Typography>
                </Grid>
                <Grid xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    Jumlah
                  </Typography>
                  <Typography variant="body1" fontWeight="medium" gutterBottom>
                    {formatCurrency(uploadDialog.payment.amount)}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="subtitle1" gutterBottom>
                Informasi Rekening
              </Typography>

              <Box sx={{ mb: 3, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
                <Typography variant="body2" gutterBottom>
                  Silakan transfer sesuai jumlah yang tertera ke rekening berikut:
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  Bank BCA: 123456789
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  Atas Nama: PT Sport Center
                </Typography>
              </Box>

              <Typography variant="subtitle1" gutterBottom>
                Upload Bukti Transfer
              </Typography>

              <Box sx={{ mb: 3 }}>
                <input
                  accept="image/*"
                  id="upload-payment-proof"
                  type="file"
                  hidden
                  onChange={handleFileChange}
                />
                <label htmlFor="upload-payment-proof">
                  <Button
                    variant="outlined"
                    component="span"
                    sx={{ mb: 2 }}
                  >
                    Pilih File
                  </Button>
                </label>

                <Typography variant="body2" color="text.secondary">
                  {uploadDialog.file ? uploadDialog.file.name : 'Belum ada file dipilih'}
                </Typography>

                {uploadDialog.file && (
                  <Box sx={{ mt: 2, maxWidth: '100%', maxHeight: 200, overflow: 'hidden' }}>
                    <img
                      src={URL.createObjectURL(uploadDialog.file)}
                      alt="Preview"
                      style={{ maxWidth: '100%', maxHeight: 200, objectFit: 'contain' }}
                    />
                  </Box>
                )}
              </Box>

              <TextField
                fullWidth
                label="Catatan (opsional)"
                value={uploadDialog.notes}
                onChange={handleNotesChange}
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUploadDialog}>Batal</Button>
          <Button
            variant="contained"
            onClick={handleUploadPaymentProof}
            disabled={!uploadDialog.file}
          >
            Upload Bukti Pembayaran
          </Button>
        </DialogActions>
      </Dialog>
    </UserLayout>
  )
}