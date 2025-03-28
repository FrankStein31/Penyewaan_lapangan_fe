'use client'

import { useState, useEffect } from 'react'
import { 
    Box, 
    Card, 
    CardContent, 
    Typography, 
    Toolbar,
    Button,
    IconButton,
    Chip,
    Divider,
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
import { categoryService } from '@/services/api'

export default function KategoriLapanganPage() {
    const [open, setOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [selectedKategori, setSelectedKategori] = useState(null)
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [formData, setFormData] = useState({
        nama_kategori: '',
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

    // Mengambil data kategori saat komponen dimuat
    useEffect(() => {
        fetchCategories()
    }, [])

    // Fungsi untuk mengambil data kategori
    const fetchCategories = async () => {
        try {
            setLoading(true)
            setError(null)
            
            const response = await categoryService.getAll()
            console.log('Response kategori:', response)
            
            if (response?.data) {
                // Handle kemungkinan struktur data yang berbeda
                const categoriesData = Array.isArray(response.data) 
                    ? response.data 
                    : response.data.data || []
                
                console.log('Data kategori array:', categoriesData)
                setCategories(categoriesData)
            } else {
                setCategories([])
            }
        } catch (err) {
            console.error('Error saat mengambil data kategori:', err)
            setError('Gagal memuat data kategori. Silakan coba lagi.')
            setCategories([]) // Set sebagai array kosong saat error
        } finally {
            setLoading(false)
        }
    }

    // Fungsi untuk membuka dialog tambah/edit
    const handleClickOpen = (kategori = null) => {
        if (kategori) {
        setIsEdit(true)
        setSelectedKategori(kategori)
        setFormData({
            nama_kategori: kategori.nama_kategori || '',
            deskripsi: kategori.deskripsi || ''
        })
        } else {
        setIsEdit(false)
        setSelectedKategori(null)
        setFormData({
            nama_kategori: '',
            deskripsi: ''
        })
        }
        setOpen(true)
    }

    // Fungsi untuk menutup dialog
    const handleClose = () => {
        setOpen(false)
        setSelectedKategori(null)
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
            if (!formData.nama_kategori.trim()) {
                showSnackbar('Nama kategori harus diisi', 'error')
                return
            }
            
            const dataToSend = {
                nama_kategori: formData.nama_kategori.trim(),
                deskripsi: formData.deskripsi.trim()
            }
            
            if (isEdit && selectedKategori) {
                // Update kategori
                await categoryService.update(selectedKategori.id, dataToSend)
                showSnackbar('Kategori berhasil diperbarui')
            } else {
                // Tambah kategori baru
                await categoryService.create(dataToSend)
                showSnackbar('Kategori baru berhasil ditambahkan')
            }
            
            // Refresh data kategori
            fetchCategories()
            handleClose()
        } catch (err) {
            console.error('Error saat menyimpan data:', err)
            showSnackbar(err.response?.data?.message || 'Gagal menyimpan data. Silakan coba lagi.', 'error')
        }
    }

    // Fungsi untuk menghapus kategori
    const handleDelete = async (id) => {
        if (window.confirm('Anda yakin ingin menghapus kategori ini?')) {
            try {
                await categoryService.delete(id)
                showSnackbar('Kategori berhasil dihapus')
                // Refresh data kategori
                fetchCategories()
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
                Kelola Kategori Lapangan
                </Typography>
                <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => handleClickOpen()}
                >
                Tambah Kategori
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
                <Table sx={{ minWidth: 650 }} aria-label="tabel kategori lapangan">
                    <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Nama Kategori</TableCell>
                        <TableCell>Deskripsi</TableCell>
                        <TableCell>Aksi</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {categories.length > 0 ? (
                        categories.map((kategori) => (
                        <TableRow key={kategori.id}>
                            <TableCell>{kategori.id}</TableCell>
                            <TableCell>{kategori.nama_kategori}</TableCell>
                            <TableCell>{kategori.deskripsi}</TableCell>
                            <TableCell>
                            <IconButton color="primary" onClick={() => handleClickOpen(kategori)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleDelete(kategori.id)}>
                                <DeleteIcon />
                            </IconButton>
                            </TableCell>
                        </TableRow>
                        ))
                    ) : (
                        <TableRow>
                        <TableCell colSpan={4} align="center">Tidak ada data kategori</TableCell>
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
            <DialogTitle>{isEdit ? 'Edit Kategori' : 'Tambah Kategori Baru'}</DialogTitle>
            <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                fullWidth
                label="Nama Kategori"
                name="nama_kategori"
                variant="outlined"
                value={formData.nama_kategori}
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