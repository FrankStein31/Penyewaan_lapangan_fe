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
    Tabs,
    Tab,
    Grid
} from '@mui/material'
import Sidebar from '@/components/admin/Sidebar'
import Topbar from '@/components/admin/Topbar'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { sessionService, dayService } from '@/services/api'

export default function JadwalPage() {
    const [tabValue, setTabValue] = useState(0)
    const [openSesi, setOpenSesi] = useState(false)
    const [openHari, setOpenHari] = useState(false)
    const [isEditSesi, setIsEditSesi] = useState(false)
    const [isEditHari, setIsEditHari] = useState(false)
    const [selectedSesi, setSelectedSesi] = useState(null)
    const [selectedHari, setSelectedHari] = useState(null)
    const [sesiList, setSesiList] = useState([])
    const [hariList, setHariList] = useState([])
    const [loadingSesi, setLoadingSesi] = useState(true)
    const [loadingHari, setLoadingHari] = useState(true)
    const [errorSesi, setErrorSesi] = useState(null)
    const [errorHari, setErrorHari] = useState(null)
    const [sesiFormData, setSesiFormData] = useState({
        jam_mulai: '07:00',
        jam_selesai: '08:00',
        deskripsi: ''
    })
    const [hariFormData, setHariFormData] = useState({
        nama_hari: ''
    })
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    })

    // Load data saat komponen dimount
    useEffect(() => {
        fetchSesi()
        fetchHari()
    }, [])

    // Menutup snackbar notifikasi
    const handleCloseSnackbar = () => {
        setSnackbar({
            ...snackbar,
            open: false
        })
    }

    // Menampilkan snackbar dengan pesan dan severity
    const showSnackbar = (message, severity = 'success') => {
        setSnackbar({
            open: true,
            message,
            severity
        })
    }

    // Handle perubahan tab
    const handleTabChange = (event, newValue) => {
        setTabValue(newValue)
    }

    // Fungsi untuk mengambil data sesi dari API
    const fetchSesi = async () => {
        try {
            setLoadingSesi(true)
            setErrorSesi(null)
            
            const response = await sessionService.getSessions()
            console.log('Response sesi:', response)
            
            // Pastikan respons mengandung array
            if (response && response.data) {
                // Periksa struktur respons dan ambil array data
                const dataArray = Array.isArray(response.data) 
                    ? response.data 
                    : (response.data.data || [])
                    
                console.log('Data sesi array:', dataArray)
                setSesiList(dataArray)
            } else {
                setSesiList([])
            }
        } catch (err) {
            console.error('Error saat mengambil data sesi:', err)
            // Error 401 sudah ditangani interceptor, hanya tampilkan pesan untuk error lain
            if (!err.response || err.response.status !== 401) {
                setErrorSesi('Gagal memuat data sesi. Silakan coba lagi.')
            }
            setSesiList([]) // Set sebagai array kosong saat error
        } finally {
            setLoadingSesi(false)
        }
    }

    // Fungsi untuk mengambil data hari dari API
    const fetchHari = async () => {
        try {
            setLoadingHari(true)
            setErrorHari(null)
            
            const response = await dayService.getDays()
            console.log('Response hari:', response)
            
            // Pastikan respons mengandung array
            if (response && response.data) {
                // Periksa struktur respons dan ambil array data
                const dataArray = Array.isArray(response.data) 
                    ? response.data 
                    : (response.data.data || [])
                    
                console.log('Data hari array:', dataArray)
                setHariList(dataArray)
            } else {
                setHariList([])
            }
        } catch (err) {
            console.error('Error saat mengambil data hari:', err)
            // Error 401 sudah ditangani interceptor, hanya tampilkan pesan untuk error lain
            if (!err.response || err.response.status !== 401) {
                setErrorHari('Gagal memuat data hari. Silakan coba lagi.')
            }
            setHariList([]) // Set sebagai array kosong saat error
        } finally {
            setLoadingHari(false)
        }
    }

    // Fungsi utilitas untuk menangani format waktu HH:MM:SS menjadi HH:MM
    const formatTime = (timeString) => {
        if (!timeString) return '07:00';
        // Jika format HH:MM:SS, ambil hanya bagian HH:MM
        if (timeString.length > 5) {
            return timeString.substring(0, 5);
        }
        return timeString;
    };
    
    // Fungsi untuk memvalidasi dan memformat waktu yang akan dikirim ke server
    const formatTimeForServer = (timeString) => {
        if (!timeString) return null;
        
        // Cek jika string berisi AM/PM (format 12 jam)
        if (timeString.includes('AM') || timeString.includes('PM')) {
            // Konversi dari 12-jam ke 24-jam format
            const [timePart, ampm] = timeString.split(' ');
            let [hours, minutes] = timePart.split(':');
            
            hours = parseInt(hours);
            
            // Ubah jam 12 AM menjadi 00
            if (hours === 12 && ampm === 'AM') {
                hours = 0;
            }
            // Tambahkan 12 jam jika PM dan bukan 12 PM
            else if (ampm === 'PM' && hours !== 12) {
                hours += 12;
            }
            
            // Format sebagai string H:i (format yang diharapkan backend)
            return `${hours}:${minutes}`;
        }
        
        // Validasi format waktu dengan regex (HH:MM atau HH:MM:SS)
        const timeRegex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])(:([0-5][0-9]))?$/;
        if (!timeRegex.test(timeString)) {
            console.error('Format waktu tidak valid:', timeString);
            return null;
        }
        
        // Konversi ke format H:i (hapus leading zero pada jam jika ada)
        if (timeString.length >= 5) {
            const [hours, minutes] = timeString.substring(0, 5).split(':');
            return `${parseInt(hours)}:${minutes}`;
        } else {
            console.error('Format waktu tidak valid:', timeString);
            return null;
        }
    };

    // Fungsi untuk membuka dialog tambah/edit sesi
    const handleOpenSesi = (sesi = null) => {
        setIsEditSesi(!!sesi);
        setSelectedSesi(sesi);
        
        if (sesi) {
            // Konversi string waktu ke format yang sesuai
            setSesiFormData({
                jam_mulai: formatTime(sesi.jam_mulai),
                jam_selesai: formatTime(sesi.jam_selesai),
                deskripsi: sesi.deskripsi || ''
            });
        } else {
            setSelectedSesi(null);
            setSesiFormData({
                jam_mulai: '07:00',
                jam_selesai: '08:00',
                deskripsi: ''
            });
        }
        
        setOpenSesi(true);
    };

    // Fungsi untuk membuka dialog tambah/edit hari
    const handleOpenHari = (hari = null) => {
        if (hari) {
            setIsEditHari(true)
            setSelectedHari(hari)
            setHariFormData({
                nama_hari: hari.nama_hari || ''
            })
        } else {
            setIsEditHari(false)
            setSelectedHari(null)
            setHariFormData({
                nama_hari: ''
            })
        }
        setOpenHari(true)
    }

    // Fungsi untuk menutup dialog sesi
    const handleCloseSesi = () => {
        setOpenSesi(false)
    }

    // Fungsi untuk menutup dialog hari
    const handleCloseHari = () => {
        setOpenHari(false)
    }

    // Handle perubahan input form sesi
    const handleSesiTimeChange = (e) => {
        const { name, value } = e.target
        setSesiFormData({
            ...sesiFormData,
            [name]: value
        })
    }

    const handleSesiChange = (e) => {
        const { name, value } = e.target
        setSesiFormData({
            ...sesiFormData,
            [name]: value
        })
    }

    // Handle perubahan input form hari
    const handleHariChange = (e) => {
        const { name, value } = e.target
        setHariFormData({
            ...hariFormData,
            [name]: value
        })
    }

    // Fungsi untuk menyimpan data sesi
    const handleSaveSesi = async () => {
        try {
            setLoadingSesi(true);
            
            // Validasi input waktu
            const jamMulai = sesiFormData.jam_mulai?.trim();
            const jamSelesai = sesiFormData.jam_selesai?.trim();
            
            if (!jamMulai || !jamSelesai) {
                showSnackbar('Jam mulai dan jam selesai harus diisi', 'error');
                setLoadingSesi(false);
                return;
            }
            
            // Format jam untuk dikirim ke API menggunakan fungsi validasi
            const formattedJamMulai = formatTimeForServer(jamMulai);
            const formattedJamSelesai = formatTimeForServer(jamSelesai);
            
            if (!formattedJamMulai || !formattedJamSelesai) {
                showSnackbar('Format waktu tidak valid. Gunakan format HH:MM', 'error');
                setLoadingSesi(false);
                return;
            }
            
            // Data yang dikirim ke API
            const formattedData = {
                jam_mulai: formattedJamMulai,
                jam_selesai: formattedJamSelesai,
                deskripsi: sesiFormData.deskripsi || ''
            };
            
            console.log('Data sesi yang dikirim:', formattedData);
            
            let response;
            if (isEditSesi && selectedSesi) {
                console.log('Updating sesi dengan ID:', selectedSesi.id);
                // Update sesi yang ada - memastikan ID ada dan valid
                if (!selectedSesi.id) {
                    throw new Error('ID sesi tidak valid untuk update');
                }
                
                response = await sessionService.update(selectedSesi.id, formattedData);
                showSnackbar('Sesi berhasil diperbarui');
            } else {
                // Tambah sesi baru
                response = await sessionService.create(formattedData);
                showSnackbar('Sesi baru berhasil ditambahkan');
            }
            
            console.log('Response dari server:', response);
            
            // Refresh data dan tutup dialog
            fetchSesi();
            handleCloseSesi();
        } catch (err) {
            console.error('Error saat menyimpan data sesi:', err);
            
            // Tampilkan pesan error yang lebih spesifik dan informasi response untuk debugging
            console.log('Error response:', err.response);
            console.log('Error message:', err.message);
            
            let errorMessage = 'Gagal menyimpan data. Silakan coba lagi.';
            
            if (err.response) {
                console.log('Status code:', err.response.status);
                console.log('Error data:', err.response.data);
                
                if (err.response.status === 400) {
                    errorMessage = 'Format data tidak valid. Pastikan jam mulai dan jam selesai dalam format yang benar (HH:MM)';
                } else if (err.response.data?.message) {
                    errorMessage = err.response.data.message;
                }
            }
            
            showSnackbar(errorMessage, 'error');
        } finally {
            setLoadingSesi(false);
        }
    };

    // Fungsi untuk menyimpan data hari
    const handleSaveHari = async () => {
        try {
            setLoadingHari(true);
            
            // Validasi input
            if (!hariFormData.nama_hari?.trim()) {
                showSnackbar('Nama hari harus diisi', 'error');
                return;
            }
            
            const formData = {
                nama_hari: hariFormData.nama_hari.trim()
            };
            
            console.log('Data hari yang dikirim:', formData);
            
            if (isEditHari && selectedHari) {
                // Update hari yang ada
                await dayService.update(selectedHari.id, formData);
                showSnackbar('Hari berhasil diperbarui');
            } else {
                // Tambah hari baru
                await dayService.create(formData);
                showSnackbar('Hari baru berhasil ditambahkan');
            }
            
            // Refresh data dan tutup dialog
            fetchHari();
            handleCloseHari();
        } catch (err) {
            console.error('Error saat menyimpan data hari:', err);
            showSnackbar(err.response?.data?.message || 'Gagal menyimpan data. Silakan coba lagi.', 'error');
        } finally {
            setLoadingHari(false);
        }
    };

    // Fungsi untuk menghapus sesi
    const handleDeleteSesi = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus sesi ini?')) {
            try {
                await sessionService.delete(id);
                showSnackbar('Sesi berhasil dihapus');
                fetchSesi();
            } catch (err) {
                console.error('Error saat menghapus sesi:', err);
                showSnackbar('Gagal menghapus sesi. Silakan coba lagi.', 'error');
            }
        }
    };

    // Fungsi untuk menghapus hari
    const handleDeleteHari = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus hari ini?')) {
            try {
                await dayService.delete(id);
                showSnackbar('Hari berhasil dihapus');
                fetchHari();
            } catch (err) {
                console.error('Error saat menghapus hari:', err);
                showSnackbar('Gagal menghapus hari. Silakan coba lagi.', 'error');
            }
        }
    };

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
                            Kelola Jadwal
                        </Typography>
                    </Box>

                    <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                        <Tabs value={tabValue} onChange={handleTabChange}>
                            <Tab label="Sesi Waktu" />
                            <Tab label="Hari" />
                        </Tabs>
                    </Box>

                    {/* Tab Panel untuk Sesi Waktu */}
                    {tabValue === 0 && (
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                                <Button 
                                    variant="contained" 
                                    startIcon={<AddIcon />}
                                    onClick={() => handleOpenSesi()}
                                >
                                    Tambah Sesi
                                </Button>
                            </Box>

                            {loadingSesi ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                    <CircularProgress />
                                </Box>
                            ) : errorSesi ? (
                                <Alert severity="error" sx={{ mb: 2 }}>{errorSesi}</Alert>
                            ) : (
                                <TableContainer component={Paper} elevation={0}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Jam Mulai</TableCell>
                                                <TableCell>Jam Selesai</TableCell>
                                                <TableCell>Deskripsi</TableCell>
                                                <TableCell align="right">Aksi</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {sesiList.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={4} align="center">Tidak ada data sesi</TableCell>
                                                </TableRow>
                                            ) : (
                                                sesiList.map((sesi, index) => (
                                                    <TableRow key={sesi.id || `sesi-${index}`}>
                                                        <TableCell>{formatTime(sesi.jam_mulai)}</TableCell>
                                                        <TableCell>{formatTime(sesi.jam_selesai)}</TableCell>
                                                        <TableCell>{sesi.deskripsi || '-'}</TableCell>
                                                        <TableCell align="right">
                                                            <IconButton 
                                                                size="small" 
                                                                color="primary" 
                                                                onClick={() => handleOpenSesi(sesi)}
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                            <IconButton 
                                                                size="small" 
                                                                color="error"
                                                                onClick={() => handleDeleteSesi(sesi.id)}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Box>
                    )}

                    {/* Tab Panel untuk Hari */}
                    {tabValue === 1 && (
                        <Box>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                                <Button 
                                    variant="contained" 
                                    startIcon={<AddIcon />}
                                    onClick={() => handleOpenHari()}
                                >
                                    Tambah Hari
                                </Button>
                            </Box>

                            {loadingHari ? (
                                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                    <CircularProgress />
                                </Box>
                            ) : errorHari ? (
                                <Alert severity="error" sx={{ mb: 2 }}>{errorHari}</Alert>
                            ) : (
                                <TableContainer component={Paper} elevation={0}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Nama Hari</TableCell>
                                                <TableCell align="right">Aksi</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {hariList.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={2} align="center">Tidak ada data hari</TableCell>
                                                </TableRow>
                                            ) : (
                                                hariList.map((hari, index) => (
                                                    <TableRow key={hari.id || `hari-${index}`}>
                                                        <TableCell>{hari.nama_hari}</TableCell>
                                                        <TableCell align="right">
                                                            <IconButton 
                                                                size="small" 
                                                                color="primary" 
                                                                onClick={() => handleOpenHari(hari)}
                                                            >
                                                                <EditIcon fontSize="small" />
                                                            </IconButton>
                                                            <IconButton 
                                                                size="small" 
                                                                color="error"
                                                                onClick={() => handleDeleteHari(hari.id)}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </Box>
                    )}
                </Box>
            </Box>

            {/* Dialog untuk tambah/edit sesi */}
            <Dialog open={openSesi} onClose={handleCloseSesi} maxWidth="sm" fullWidth>
                <DialogTitle>{isEditSesi ? 'Edit Sesi Waktu' : 'Tambah Sesi Waktu Baru'}</DialogTitle>
                <DialogContent>
                    <Box component="form" sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Jam Mulai"
                                    type="time"
                                    name="jam_mulai"
                                    value={sesiFormData.jam_mulai}
                                    onChange={handleSesiTimeChange}
                                    sx={{ width: '100%' }}
                                    InputLabelProps={{ shrink: true }}
                                    inputProps={{ 
                                        step: 300,
                                        pattern: '[0-9]{2}:[0-9]{2}'
                                    }}
                                    helperText="Format: HH:MM (format 24 jam, contoh: 08:00)"
                                    required
                                    error={!sesiFormData.jam_mulai}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    label="Jam Selesai"
                                    type="time"
                                    name="jam_selesai"
                                    value={sesiFormData.jam_selesai}
                                    onChange={handleSesiTimeChange}
                                    sx={{ width: '100%' }}
                                    InputLabelProps={{ shrink: true }}
                                    inputProps={{ 
                                        step: 300,
                                        pattern: '[0-9]{2}:[0-9]{2}'
                                    }}
                                    helperText="Format: HH:MM (format 24 jam, contoh: 09:00)"
                                    required
                                    error={!sesiFormData.jam_selesai}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Deskripsi"
                                    name="deskripsi"
                                    value={sesiFormData.deskripsi}
                                    onChange={handleSesiChange}
                                    placeholder="contoh: Sesi Pagi"
                                    helperText="Masukkan deskripsi sesi (opsional)"
                                />
                            </Grid>
                        </Grid>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseSesi}>Batal</Button>
                    <Button 
                        variant="contained" 
                        onClick={handleSaveSesi}
                        disabled={!sesiFormData.jam_mulai || !sesiFormData.jam_selesai}
                    >
                        {isEditSesi ? 'Simpan Perubahan' : 'Simpan'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Dialog untuk tambah/edit hari */}
            <Dialog open={openHari} onClose={handleCloseHari} maxWidth="sm" fullWidth>
                <DialogTitle>{isEditHari ? 'Edit Hari' : 'Tambah Hari Baru'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Nama Hari"
                            name="nama_hari"
                            value={hariFormData.nama_hari}
                            onChange={handleHariChange}
                            placeholder="contoh: Senin"
                            helperText="Masukkan nama hari"
                            required
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseHari}>Batal</Button>
                    <Button 
                        variant="contained" 
                        onClick={handleSaveHari}
                        disabled={!hariFormData.nama_hari}
                    >
                        {isEditHari ? 'Simpan Perubahan' : 'Simpan'}
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