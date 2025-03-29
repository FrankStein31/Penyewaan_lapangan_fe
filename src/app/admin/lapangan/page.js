'use client'

import { useState, useEffect, useRef } from 'react'
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Toolbar,
  Button,
  IconButton,
  Avatar,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  FormHelperText,
  Snackbar,
  Checkbox,
  FormGroup,
  FormControlLabel,
  ListItemText,
  CardMedia,
  Input
} from '@mui/material'
import Sidebar from '@/components/admin/Sidebar'
import Topbar from '@/components/admin/Topbar'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import ImageIcon from '@mui/icons-material/Image'
import { fieldService, categoryService, facilityService } from '@/services/api'

export default function LapanganPage() {
  const [open, setOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedLapangan, setSelectedLapangan] = useState(null)
  
  const [lapangan, setLapangan] = useState([])
  const [kategori, setKategori] = useState([])
  const [fasilitas, setFasilitas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  const [formData, setFormData] = useState({
    nama: '',
    kapasitas: 0,
    deskripsi: '',
    harga: 0,
    kategori_id: '',
    fasilitas: [],
    status: 'tersedia',
    foto: null
  })

  const [fotoPreview, setFotoPreview] = useState('')
  const fileInputRef = useRef(null)

  useEffect(() => {
    fetchLapangan()
    fetchKategori()
    fetchFasilitas()
  }, [])

  // Fetch lapangan dari API
  const fetchLapangan = async () => {
    try {
      setLoading(true)
      const response = await fieldService.getAll()
      console.log('Data lapangan:', response.data)
      
      if (response && response.data) {
        // Ambil data dari respons API sesuai struktur
        const data = Array.isArray(response.data) ? response.data : response.data.data
        setLapangan(data || [])
      } else {
        setLapangan([])
      }
      setError(null)
    } catch (err) {
      console.error('Error fetching lapangan:', err)
      setError('Gagal memuat data lapangan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  // Fetch kategori lapangan dari API
  const fetchKategori = async () => {
    try {
      const response = await categoryService.getAll()
      if (response && response.data) {
        const data = Array.isArray(response.data) ? response.data : response.data.data
        setKategori(data || [])
      }
    } catch (err) {
      console.error('Error fetching kategori:', err)
    }
  }

  // Fetch fasilitas dari API
  const fetchFasilitas = async () => {
    try {
      const response = await facilityService.getAll()
      if (response && response.data) {
        const data = Array.isArray(response.data) ? response.data : response.data.data
        setFasilitas(data || [])
      }
    } catch (err) {
      console.error('Error fetching fasilitas:', err)
    }
  }

  const handleClickOpen = (lapangan = null) => {
    if (lapangan) {
      setIsEdit(true)
      setSelectedLapangan(lapangan)
      
      // Fill form data with selected lapangan
      setFormData({
        nama: lapangan.nama || '',
        kapasitas: lapangan.kapasitas || 0,
        deskripsi: lapangan.deskripsi || '',
        harga: lapangan.harga || 0,
        kategori_id: lapangan.kategori_id || '',
        fasilitas: lapangan.fasilitas ? lapangan.fasilitas.map(f => f.id) : [],
        status: lapangan.status || 'tersedia',
        foto: null // Reset foto input
      })
      
      // Set preview jika ada foto
      if (lapangan.foto) {
        // Tentukan URL foto dari API
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
        const fotoUrl = `${baseUrl}/storage/${lapangan.foto}`
        setFotoPreview(fotoUrl)
      } else {
        setFotoPreview('')
      }
    } else {
      setIsEdit(false)
      setSelectedLapangan(null)
      // Reset form data
      setFormData({
        nama: '',
        kapasitas: 0,
        deskripsi: '',
        harga: 0,
        kategori_id: '',
        fasilitas: [],
        status: 'tersedia',
        foto: null
      })
      setFotoPreview('')
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedLapangan(null)
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleFasilitasChange = (event) => {
    const { value } = event.target
    setFormData({
      ...formData,
      fasilitas: value
    })
  }

  const handleSnackbarClose = () => {
    setSnackbar({...snackbar, open: false})
  }

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    })
  }

  const handleFotoChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setFormData({
        ...formData,
        foto: file
      })
      
      // Buat preview URL untuk tampilan
      const reader = new FileReader()
      reader.onload = () => {
        setFotoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      
      // Validate required fields
      if (!formData.nama || !formData.kategori_id) {
        showSnackbar('Nama lapangan dan kategori harus diisi', 'error')
        setLoading(false)
        return
      }

      // Gunakan FormData untuk mengirim data dan file
      const formDataObj = new FormData()
      formDataObj.append('nama', formData.nama)
      formDataObj.append('kapasitas', parseInt(formData.kapasitas))
      formDataObj.append('deskripsi', formData.deskripsi)
      formDataObj.append('harga', parseFloat(formData.harga))
      formDataObj.append('kategori_id', formData.kategori_id)
      formDataObj.append('status', formData.status)
      
      // Tambahkan fasilitas sebagai array
      formData.fasilitas.forEach((fasilitasId, index) => {
        formDataObj.append(`fasilitas[${index}]`, fasilitasId)
      })
      
      // Tambahkan foto jika ada
      if (formData.foto) {
        formDataObj.append('foto', formData.foto)
      }

      console.log('Data yang akan dikirim:', formData)

      let response
      if (isEdit && selectedLapangan) {
        // Untuk edit, tambahkan method PUT ke formData
        formDataObj.append('_method', 'PUT')
        response = await fieldService.update(selectedLapangan.id, formDataObj)
        showSnackbar('Lapangan berhasil diperbarui')
      } else {
        response = await fieldService.create(formDataObj)
        showSnackbar('Lapangan baru berhasil ditambahkan')
      }

      // Refresh data
      fetchLapangan()
      handleClose()
    } catch (err) {
      console.error('Error saving lapangan:', err)
      showSnackbar(err.response?.data?.message || 'Gagal menyimpan data', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus lapangan ini?')) {
      try {
        setLoading(true)
        await fieldService.delete(id)
        showSnackbar('Lapangan berhasil dihapus')
        // Refresh data
        fetchLapangan()
      } catch (err) {
        console.error('Error deleting lapangan:', err)
        showSnackbar('Gagal menghapus lapangan', 'error')
      } finally {
        setLoading(false)
      }
    }
  }

  // Format currency for display
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' })
      .format(value)
      .replace(/\s/g, '')
  }

  // Fungsi untuk mendapatkan URL foto yang valid
  const getFotoUrl = (fotoPath) => {
    if (!fotoPath) return null
    
    // Jika path sudah berupa URL lengkap, gunakan langsung
    if (fotoPath.startsWith('http')) {
      return fotoPath
    }
    
    // Jika tidak, gabungkan dengan base URL
    // Perbaikan: gunakan URL langsung ke storage publik tanpa /api/
    const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'
    const baseUrl = baseApiUrl.replace('/api', '') // Hapus /api dari URL
    
    return `${baseUrl}/storage/${fotoPath}`
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
              Kelola Lapangan
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => handleClickOpen()}
            >
              Tambah Lapangan
            </Button>
          </Box>
          
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
          )}

          {!loading && !error && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
              {lapangan.length === 0 ? (
                <Alert severity="info" sx={{ width: '100%' }}>Belum ada data lapangan. Silakan tambahkan lapangan baru.</Alert>
              ) : (
                lapangan.map(item => (
                  <Box 
                    key={item.id} 
                    sx={{ 
                      flexGrow: 1, 
                      flexBasis: { 
                        xs: '100%', 
                        sm: 'calc(50% - 24px)', 
                        md: 'calc(33.333% - 24px)' 
                      } 
                    }}
                  >
                    <Card elevation={0} sx={{ height: '100%' }}>
                      {item.foto ? (
                        <CardMedia
                          component="img"
                          height="160"
                          image={getFotoUrl(item.foto)}
                          alt={item.nama}
                          sx={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <Box 
                          sx={{ 
                            height: 160, 
                            backgroundColor: '#f0f0f0',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <ImageIcon sx={{ fontSize: 60, color: '#aaa' }} />
                          <Typography variant="h5" sx={{ fontWeight: 600, position: 'absolute', bottom: 10, color: '#333' }}>
                            {item.nama}
                          </Typography>
                          <Chip 
                            label={item.status === 'tersedia' ? 'Tersedia' : 'Tidak Tersedia'} 
                            size="small"
                            sx={{ 
                              position: 'absolute', 
                              top: 12, 
                              right: 12,
                              backgroundColor: item.status === 'tersedia' ? '#28c76f' : '#ea5455',
                              color: 'white'
                            }} 
                          />
                        </Box>
                      )}
                      <CardContent>
                        <Typography variant="h6" component="div" sx={{ fontWeight: 600, mb: 1 }}>
                          {item.nama}
                        </Typography>
                        <Typography variant="subtitle1" component="div" sx={{ fontWeight: 600 }}>
                          Kategori: {item.kategori?.nama_kategori || '-'}
                        </Typography>
                        <Typography variant="body2" component="div" color="text.secondary" sx={{ mb: 1 }}>
                          Kapasitas: {item.kapasitas} orang
                        </Typography>
                        <Typography variant="body2" component="div" color="text.secondary" sx={{ mb: 1 }}>
                          {item.deskripsi || 'Tidak ada deskripsi'}
                        </Typography>
                        <Typography variant="subtitle1" component="div" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                          {formatCurrency(item.harga)}/jam
                        </Typography>
                        
                        {item.fasilitas && item.fasilitas.length > 0 && (
                          <>
                            <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>
                              Fasilitas:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                              {item.fasilitas.map(fasilitas => (
                                <Chip 
                                  key={fasilitas.id}
                                  label={fasilitas.nama_fasilitas} 
                                  size="small"
                                  sx={{ 
                                    backgroundColor: 'primary.light',
                                    color: 'primary.dark'
                                  }} 
                                />
                              ))}
                            </Box>
                          </>
                        )}
                        
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleClickOpen(item)}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                          <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDelete(item.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Card>
                  </Box>
                ))
              )}
            </Box>
          )}
        </Box>
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{isEdit ? 'Edit Lapangan' : 'Tambah Lapangan Baru'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Nama Lapangan"
              name="nama"
              variant="outlined"
              value={formData.nama}
              onChange={handleChange}
              required
              error={!formData.nama}
              helperText={!formData.nama ? 'Nama lapangan harus diisi' : ''}
            />
            
            <FormControl fullWidth required error={!formData.kategori_id}>
              <InputLabel>Kategori Lapangan</InputLabel>
              <Select
                name="kategori_id"
                value={formData.kategori_id}
                label="Kategori Lapangan"
                onChange={handleChange}
              >
                {kategori.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.nama_kategori}
                  </MenuItem>
                ))}
              </Select>
              {!formData.kategori_id && <FormHelperText>Kategori lapangan harus dipilih</FormHelperText>}
            </FormControl>
            
            <TextField
              fullWidth
              label="Kapasitas"
              name="kapasitas"
              variant="outlined"
              type="number"
              value={formData.kapasitas}
              onChange={handleChange}
              InputProps={{ inputProps: { min: 0 } }}
            />
            
            <TextField
              fullWidth
              label="Harga per Jam"
              name="harga"
              variant="outlined"
              type="number"
              value={formData.harga}
              onChange={handleChange}
              InputProps={{ inputProps: { min: 0 } }}
            />
            
            <TextField
              fullWidth
              label="Deskripsi"
              name="deskripsi"
              variant="outlined"
              multiline
              rows={3}
              value={formData.deskripsi}
              onChange={handleChange}
            />
            
            <FormControl fullWidth>
              <InputLabel>Fasilitas</InputLabel>
              <Select
                multiple
                name="fasilitas"
                value={formData.fasilitas}
                label="Fasilitas"
                onChange={handleFasilitasChange}
                renderValue={(selected) => {
                  const selectedFasilitasNames = selected.map(id => {
                    const found = fasilitas.find(f => f.id === id)
                    return found ? found.nama_fasilitas : ''
                  }).filter(Boolean)
                  return selectedFasilitasNames.join(', ')
                }}
              >
                {fasilitas.map(item => (
                  <MenuItem key={item.id} value={item.id}>
                    <Checkbox checked={formData.fasilitas.indexOf(item.id) > -1} />
                    <ListItemText primary={item.nama_fasilitas} />
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>Pilih satu atau lebih fasilitas</FormHelperText>
            </FormControl>
            
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                label="Status"
                onChange={handleChange}
              >
                <MenuItem value="tersedia">Tersedia</MenuItem>
                <MenuItem value="tidak tersedia">Tidak Tersedia</MenuItem>
              </Select>
            </FormControl>
            
            {/* Form upload foto */}
            <Box>
              <Typography variant="subtitle2" gutterBottom>
                Foto Lapangan
              </Typography>
              
              {fotoPreview && (
                <Box sx={{ mb: 2, position: 'relative', width: '100%', maxWidth: 300 }}>
                  <CardMedia 
                    component="img"
                    src={fotoPreview} 
                    alt="Preview" 
                    sx={{ 
                      width: '100%', 
                      height: 200, 
                      objectFit: 'cover', 
                      borderRadius: '8px' 
                    }} 
                  />
                  <IconButton 
                    sx={{ 
                      position: 'absolute', 
                      top: 8, 
                      right: 8, 
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      color: 'white',
                      '&:hover': { backgroundColor: 'rgba(0,0,0,0.7)' }
                    }}
                    onClick={() => {
                      setFotoPreview('')
                      setFormData({...formData, foto: null})
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ''
                      }
                    }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              )}
              
              <Button
                variant="outlined"
                startIcon={<PhotoCameraIcon />}
                component="label"
                sx={{ mt: fotoPreview ? 0 : 2 }}
              >
                {fotoPreview ? 'Ganti Foto' : 'Upload Foto'}
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFotoChange}
                />
              </Button>
              <FormHelperText>Format: JPG, PNG, JPEG. Maksimal 2MB</FormHelperText>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Batal</Button>
          <Button variant="contained" onClick={handleSave}>
            {isEdit ? 'Simpan Perubahan' : 'Simpan'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
} 