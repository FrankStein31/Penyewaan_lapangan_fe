'use client'

import { useState, useEffect } from 'react'
import { 
    Box, 
    Typography, 
    Toolbar,
    Button,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Alert,
    Snackbar
} from '@mui/material'
import Sidebar from '@/components/admin/Sidebar'
import Topbar from '@/components/admin/Topbar'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { facilityService } from '@/services/api'

export default function FasilitasPage() {
    const [open, setOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [selectedFasilitas, setSelectedFasilitas] = useState(null)
    const [fasilitas, setFasilitas] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [formData, setFormData] = useState({
        nama_fasilitas: '',
        deskripsi: ''
    })
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    })

    // Fungsi untuk menutup snackbar
    const handleCloseSnackbar = () => {
        setSnackbar({...snackbar, open: false})
    }

    // Fungsi untuk menampilkan snackbar
    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({
        open: true,
        message,
        severity
        })
    }

    // Mengambil data fasilitas saat komponen dimuat
    useEffect(() => {
        fetchFasilitas()
    }, [])

    // Fungsi untuk mengambil data fasilitas
    const fetchFasilitas = async () => {
        try {
            setLoading(true)
            setError(null)
            
            const response = await facilityService.getAll()
            console.log('Response fasilitas:', response)
            
            if (response?.data) {
                // Handle kemungkinan struktur data yang berbeda
                const fasilitasData = Array.isArray(response.data) 
                    ? response.data 
                    : response.data.data || []
                
                console.log('Data fasilitas array:', fasilitasData)
                setFasilitas(fasilitasData)
            } else {
                setFasilitas([])
            }
        } catch (err) {
            console.error('Error saat mengambil data fasilitas:', err)
            setError('Gagal memuat data fasilitas. Silakan coba lagi.')
            setFasilitas([]) // Set sebagai array kosong saat error
        } finally {
            setLoading(false)
        }
    }

    // Fungsi untuk membuka dialog tambah/edit
    const handleClickOpen = (fasilitasItem = null) => {
        if (fasilitasItem) {
        setIsEdit(true)
        setSelectedFasilitas(fasilitasItem)
        setFormData({
            nama_fasilitas: fasilitasItem.nama_fasilitas || '',
            deskripsi: fasilitasItem.deskripsi || ''
        })
        } else {
        setIsEdit(false)
        setSelectedFasilitas(null)
        setFormData({
            nama_fasilitas: '',
            deskripsi: ''
        })
        }
        setOpen(true)
    }

    // Fungsi untuk menutup dialog
    const handleClose = () => {
        setOpen(false)
        setSelectedFasilitas(null)
    }

    // Handle perubahan input form
    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prevState => ({
        ...prevState,
        [name]: value
        }))
    }

    // Fungsi untuk menyimpan data (tambah/edit)
    const handleSave = async () => {
        try {
            // Validasi input
            if (!formData.nama_fasilitas.trim()) {
                showSnackbar('Nama fasilitas harus diisi', 'error')
                return
            }
            
            const dataToSend = {
                nama_fasilitas: formData.nama_fasilitas.trim(),
                deskripsi: formData.deskripsi.trim()
            }
            
            if (isEdit && selectedFasilitas) {
                // Update fasilitas
                await facilityService.update(selectedFasilitas.id, dataToSend)
                showSnackbar('Fasilitas berhasil diperbarui')
            } else {
                // Tambah fasilitas baru
                await facilityService.create(dataToSend)
                showSnackbar('Fasilitas baru berhasil ditambahkan')
            }
            
            // Refresh data fasilitas
            fetchFasilitas()
            handleClose()
        } catch (err) {
            console.error('Error saat menyimpan data:', err)
            showSnackbar(err.response?.data?.message || 'Gagal menyimpan data. Silakan coba lagi.', 'error')
        }
    }

    // Fungsi untuk menghapus fasilitas
    const handleDelete = async (id) => {
        if (window.confirm('Anda yakin ingin menghapus fasilitas ini?')) {
            try {
                await facilityService.delete(id)
                showSnackbar('Fasilitas berhasil dihapus')
                // Refresh data fasilitas
                fetchFasilitas()
            } catch (err) {
                console.error('Error saat menghapus data:', err)
                showSnackbar(err.response?.data?.message || 'Gagal menghapus data. Silakan coba lagi.', 'error')
            }
        }
    }

    return (
        <>
        <Sidebar />
        <Box
            component="main"
            sx={{
            backgroundColor: 'background.default',
            flexGrow: 1,
            minHeight: '100vh',
            overflow: 'auto',
            }}
        >
            <Topbar />
            <Toolbar />
            <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
                Kelola Fasilitas
                </Typography>
                <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => handleClickOpen()}
                >
                Tambah Fasilitas
                </Button>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
            ) : (
                <TableContainer component={Paper} elevation={0}>
                <Table sx={{ minWidth: 650 }} aria-label="tabel fasilitas">
                    <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Nama Fasilitas</TableCell>
                        <TableCell>Deskripsi</TableCell>
                        <TableCell>Aksi</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {fasilitas.length > 0 ? (
                        fasilitas.map((item) => (
                        <TableRow key={item.id}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.nama_fasilitas}</TableCell>
                            <TableCell>{item.deskripsi}</TableCell>
                            <TableCell>
                            <IconButton color="primary" onClick={() => handleClickOpen(item)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleDelete(item.id)}>
                                <DeleteIcon />
                            </IconButton>
                            </TableCell>
                        </TableRow>
                        ))
                    ) : (
                        <TableRow>
                        <TableCell colSpan={4} align="center">Tidak ada data fasilitas</TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
                </TableContainer>
            )}
            </Box>
        </Box>

        {/* Dialog Form */}
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>{isEdit ? 'Edit Fasilitas' : 'Tambah Fasilitas Baru'}</DialogTitle>
            <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                fullWidth
                label="Nama Fasilitas"
                name="nama_fasilitas"
                variant="outlined"
                value={formData.nama_fasilitas}
                onChange={handleChange}
                required
                />
                <TextField
                fullWidth
                label="Deskripsi"
                name="deskripsi"
                variant="outlined"
                value={formData.deskripsi}
                onChange={handleChange}
                multiline
                rows={4}
                />
            </Box>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose}>Batal</Button>
            <Button variant="contained" onClick={handleSave}>
                {isEdit ? 'Simpan Perubahan' : 'Simpan'}
            </Button>
            </DialogActions>
        </Dialog>

        {/* Snackbar untuk notifikasi */}
        <Snackbar 
            open={snackbar.open} 
            autoHideDuration={6000} 
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
            <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
            </Alert>
        </Snackbar>
        </>
    )
} 