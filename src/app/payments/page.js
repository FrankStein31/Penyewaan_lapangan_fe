// src/app/User/payments/page.js
'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import UserLayout from '@/components/user/UserLayout'
import { Box, Typography, Card, CardContent, Grid, Button, Tab, Tabs, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material'
import Sidebar from '@/components/user/Sidebar'
import Topbar from '@/components/user/Topbar'
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
  }, [])

    const fetchPayments = async () => {
    setLoading(true)
    try {
      const response = await paymentService.getUserPayments()
      console.log('Data pembayaran:', response.data)
      
      if (response && response.data) {
        setPayments(response.data)
      } else {
        setPayments([])
      }
        setError(null)
      } catch (err) {
      console.error('Error fetching payments:', err)
        setError('Gagal memuat data pembayaran. Silakan coba lagi.')
      } finally {
        setLoading(false)
      }
    }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleOpenDetailDialog = (payment) => {
    setDetailDialog({
      open: true,
      payment
    })
  }

  const handleCloseDetailDialog = () => {
    setDetailDialog({
      open: false,
      payment: null
    })
  }

  const handleOpenUploadDialog = (payment) => {
    setUploadDialog({
      open: true,
      payment,
      file: null,
      notes: ''
    })
  }

  const handleCloseUploadDialog = () => {
    setUploadDialog({
      open: false,
      payment: null,
      file: null,
      notes: ''
    })
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setUploadDialog({
        ...uploadDialog,
        file: e.target.files[0]
      })
    }
  }

  const handleNotesChange = (e) => {
    setUploadDialog({
      ...uploadDialog,
      notes: e.target.value
    })
  }

  const handleUploadPaymentProof = async () => {
    if (!uploadDialog.file) {
      alert('Mohon pilih file bukti pembayaran')
      return
    }

    try {
      const formData = new FormData()
      formData.append('bukti_pembayaran', uploadDialog.file)
      formData.append('catatan', uploadDialog.notes)
      formData.append('id_pembayaran', uploadDialog.payment.id)

      await paymentService.uploadPaymentProof(formData)
      
      alert('Bukti pembayaran berhasil diunggah')
      handleCloseUploadDialog()
    fetchPayments()
    } catch (err) {
      console.error('Error uploading payment proof:', err)
      alert('Gagal mengunggah bukti pembayaran. Silakan coba lagi.')
    }
  }

  const filteredPayments = payments.filter(payment => {
    if (tabValue === 0) return true
    if (tabValue === 1) return payment.status === 'pending'
    if (tabValue === 2) return payment.status === 'paid'
    return true
  })

  return (
    <UserLayout title="Pembayaran">
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
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
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ bgcolor: 'warning.main', p: 1, borderRadius: 1, color: 'white', mr: 2 }}>
                  <HistoryIcon />
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Menunggu Pembayaran
                  </Typography>
                  <Typography variant="h6">
                    {payments.filter(p => p.status === 'pending').length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
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
                    {formatCurrency(payments.filter(p => p.status === 'paid').reduce((sum, item) => sum + item.amount, 0))}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Semua" />
            <Tab label="Menunggu Pembayaran" />
            <Tab label="Sudah Dibayar" />
          </Tabs>
        </Box>

        <CardContent>
          {loading ? (
            <SkeletonLoader count={3} />
          ) : error ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography color="error">{error}</Typography>
              <Button variant="outlined" onClick={fetchPayments} sx={{ mt: 2 }}>
                Coba Lagi
              </Button>
            </Box>
          ) : filteredPayments.length === 0 ? (
            <EmptyState
              title="Tidak ada data pembayaran" 
              message="Belum ada data pembayaran yang tersedia."
            />
          ) : (
            <Box>
              {filteredPayments.map((payment) => (
                <Card key={payment.id} sx={{ mb: 2, border: 1, borderColor: 'divider', boxShadow: 'none' }}>
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
                      <Grid item xs={12} sm={6}>
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
                      <Grid item xs={12} sm={6}>
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
                      
                      {payment.status === 'pending' && (
                        <Button
                          variant="contained"
                          size="small"
                          color="primary"
                          onClick={() => handleOpenUploadDialog(payment)}
                        >
                          Upload Bukti
                        </Button>
                      )}
                      
                      {payment.status === 'paid' && (
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
              ))}
            </Box>
          )}
        </CardContent>
      </Card>

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
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  ID Pembayaran
                </Typography>
                <Typography variant="body1" gutterBottom>
                  #{detailDialog.payment.id}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <PaymentStatusBadge status={detailDialog.payment.status} />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Tanggal Pembayaran
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {formatDate(detailDialog.payment.date)}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="body2" color="text.secondary">
                  Metode Pembayaran
                </Typography>
                <Typography variant="body1" gutterBottom>
                  {detailDialog.payment.method || 'Transfer Bank'}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  Jumlah Pembayaran
                </Typography>
                <Typography variant="h6" color="primary.main" fontWeight="bold" gutterBottom>
                  {formatCurrency(detailDialog.payment.amount)}
                </Typography>
              </Grid>
              <Grid item xs={12}>
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
              
              {detailDialog.payment.status === 'paid' && (
                <Grid item xs={12}>
                  <Typography variant="body2" color="text.secondary">
                    Bukti Pembayaran
                  </Typography>
                  <Box sx={{ mt: 1, border: '1px solid', borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
                    <img 
                      src="/sample-payment-proof.jpg" 
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
          {detailDialog.payment && detailDialog.payment.status === 'paid' && (
            <Button variant="contained" startIcon={<CloudDownloadIcon />}>
              Download Invoice
            </Button>
          )}
        </DialogActions>
      </Dialog>

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
                <Grid item xs={6}>
                  <Typography variant="body2" color="text.secondary">
                    ID Pembayaran
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    #{uploadDialog.payment.id}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
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