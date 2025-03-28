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
    Snackbar,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip
} from '@mui/material'
import Sidebar from '@/components/admin/Sidebar'
import Topbar from '@/components/admin/Topbar'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { userService } from '@/services/api'

export default function PelangganPage() {
    const [open, setOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [selectedUser, setSelectedUser] = useState(null)
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [formData, setFormData] = useState({
        nama: '',
        email: '',
        no_hp: '',
        password: '',
        role: 'user'
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

    // Mengambil data pengguna saat komponen dimuat
    useEffect(() => {
        fetchUsers()
    }, [])

    // Fungsi untuk mengambil data pengguna
    const fetchUsers = async () => {
        try {
        setLoading(true)
        const response = await userService.getAll()
        if (response?.data) {
            // Handle kemungkinan struktur data yang berbeda
            const usersData = Array.isArray(response.data) 
            ? response.data 
            : response.data.data || []
            setUsers(usersData)
        }
        } catch (err) {
        console.error('Error saat mengambil data pengguna:', err)
        setError('Gagal memuat data pengguna. Silakan coba lagi nanti.')
        } finally {
        setLoading(false)
        }
    }

    // Fungsi untuk membuka dialog tambah/edit
    const handleClickOpen = (user = null) => {
        if (user) {
        setIsEdit(true)
        setSelectedUser(user)
        setFormData({
            nama: user.nama || user.name || '',
            email: user.email || '',
            no_hp: user.no_hp || user.phone || '',
            role: user.role || 'user',
            password: '' // Password field kosong saat edit
        })
        } else {
        setIsEdit(false)
        setSelectedUser(null)
        setFormData({
            nama: '',
            email: '',
            no_hp: '',
            password: '',
            role: 'user'
        })
        }
        setOpen(true)
    }

    // Fungsi untuk menutup dialog
    const handleClose = () => {
        setOpen(false)
        setSelectedUser(null)
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
        if (!formData.nama || !formData.email || !formData.no_hp) {
            showSnackbar('Nama, email, dan nomor telepon wajib diisi', 'error')
            return
        }

        // Validasi email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
            showSnackbar('Format email tidak valid', 'error')
            return
        }

        // Validasi password jika tambah baru
        if (!isEdit && !formData.password) {
            showSnackbar('Password wajib diisi untuk pengguna baru', 'error')
            return
        }

        const userData = { ...formData }
        
        // Jika password kosong dan edit mode, hapus field password
        if (isEdit && !userData.password) {
            delete userData.password
        }

        if (isEdit && selectedUser) {
            // Update pengguna
            await userService.update(selectedUser.id, userData)
            showSnackbar('Data pengguna berhasil diperbarui')
        } else {
            // Tambah pengguna baru
            await userService.create(userData)
            showSnackbar('Pengguna baru berhasil ditambahkan')
        }
        
        // Refresh data pengguna
        fetchUsers()
        handleClose()
        } catch (err) {
        console.error('Error saat menyimpan data:', err)
        showSnackbar(err.response?.data?.message || 'Gagal menyimpan data. Silakan coba lagi.', 'error')
        }
    }

    // Fungsi untuk menghapus pengguna
    const handleDelete = async (id) => {
        if (window.confirm('Anda yakin ingin menghapus pengguna ini?')) {
        try {
            await userService.delete(id)
            showSnackbar('Pengguna berhasil dihapus')
            // Refresh data pengguna
            fetchUsers()
        } catch (err) {
            console.error('Error saat menghapus data:', err)
            showSnackbar(err.response?.data?.message || 'Gagal menghapus data. Silakan coba lagi.', 'error')
        }
        }
    }

    // Helper function untuk menampilkan chip role
    const getRoleChip = (role) => {
        if (role === 'admin') {
        return <Chip label="Admin" size="small" color="primary" />
        } else {
        return <Chip label="Pelanggan" size="small" color="success" />
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
                Kelola Pengguna
                </Typography>
                <Button 
                variant="contained" 
                startIcon={<AddIcon />}
                onClick={() => handleClickOpen()}
                >
                Tambah Pengguna
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
                <Table sx={{ minWidth: 650 }} aria-label="tabel pengguna">
                    <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Nama</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>No. Telepon</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Aksi</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {users.length > 0 ? (
                        users.map((user) => (
                        <TableRow key={user.id}>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>{user.nama || user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.no_hp || user.phone}</TableCell>
                            <TableCell>{getRoleChip(user.role)}</TableCell>
                            <TableCell>
                            <IconButton color="primary" onClick={() => handleClickOpen(user)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton color="error" onClick={() => handleDelete(user.id)}>
                                <DeleteIcon />
                            </IconButton>
                            </TableCell>
                        </TableRow>
                        ))
                    ) : (
                        <TableRow>
                        <TableCell colSpan={6} align="center">Tidak ada data pengguna</TableCell>
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
            <DialogTitle>{isEdit ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</DialogTitle>
            <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                <TextField
                fullWidth
                label="Nama Lengkap"
                name="nama"
                variant="outlined"
                value={formData.nama}
                onChange={handleChange}
                required
                />
                <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                variant="outlined"
                value={formData.email}
                onChange={handleChange}
                required
                />
                <TextField
                fullWidth
                label="Nomor Telepon"
                name="no_hp"
                variant="outlined"
                value={formData.no_hp}
                onChange={handleChange}
                required
                />
                <TextField
                fullWidth
                label={isEdit ? "Password (kosongkan jika tidak diganti)" : "Password"}
                name="password"
                type="password"
                variant="outlined"
                value={formData.password}
                onChange={handleChange}
                required={!isEdit}
                />
                <FormControl fullWidth>
                <InputLabel id="role-label">Role</InputLabel>
                <Select
                    labelId="role-label"
                    id="role"
                    name="role"
                    value={formData.role}
                    label="Role"
                    onChange={handleChange}
                >
                    <MenuItem value="user">Pelanggan</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                </Select>
                </FormControl>
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