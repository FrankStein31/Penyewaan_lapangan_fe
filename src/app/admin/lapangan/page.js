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
    setSnackbar({ ...snackbar, open: false })
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
      <div className="flex-1 min-h-screen bg-gray-50">
        <Topbar />
        <div className="pt-16"> {/* Space for fixed Toolbar */}
          <div className="p-6">
            {/* Header Section */}
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Kelola Lapangan</h1>
              <button
                onClick={() => handleClickOpen()}
                className="flex items-center px-4 py-2 text-white transition-colors bg-indigo-600 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Tambah Lapangan
              </button>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center p-8">
                <div className="w-12 h-12 border-t-2 border-b-2 border-indigo-500 rounded-full animate-spin"></div>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="px-4 py-3 mb-6 text-red-700 border border-red-200 rounded-lg bg-red-50">
                <div className="flex">
                  <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              </div>
            )}

            {/* Court Cards Grid */}
            {!loading && !error && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {lapangan.length === 0 ? (
                  <div className="px-4 py-3 text-blue-700 border border-blue-200 rounded-lg col-span-full bg-blue-50">
                    <div className="flex">
                      <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
                      </svg>
                      <span>Belum ada data lapangan. Silakan tambahkan lapangan baru.</span>
                    </div>
                  </div>
                ) : (
                  lapangan.map(item => (
                    <div key={item.id} className="group">
                      <div className="h-full overflow-hidden transition-shadow duration-300 bg-white border border-gray-100 shadow-sm rounded-xl hover:shadow-lg">
                        {/* Card Image */}
                        {item.foto ? (
                          <div className="relative h-48">
                            <img
                              src={getFotoUrl(item.foto)}
                              alt={item.nama}
                              className="object-cover w-full h-full"
                            />
                            <div className="absolute top-3 right-3">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${item.status === 'tersedia'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                                }`}>
                                {item.status === 'tersedia' ? 'Tersedia' : 'Tidak Tersedia'}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="relative flex items-center justify-center h-48 bg-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <h3 className="absolute text-lg font-semibold text-gray-800 bottom-3 left-3">
                              {item.nama}
                            </h3>
                            <div className="absolute top-3 right-3">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${item.status === 'tersedia'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                                }`}>
                                {item.status === 'tersedia' ? 'Tersedia' : 'Tidak Tersedia'}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Card Content */}
                        <div className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="mb-1 text-lg font-semibold text-gray-800">{item.nama}</h3>
                              <p className="text-sm font-medium text-gray-700">
                                Kategori: {item.kategori?.nama_kategori || '-'}
                              </p>
                            </div>
                            <p className="text-lg font-bold text-indigo-600">
                              {formatCurrency(item.harga)}<span className="text-sm font-normal text-gray-500">/jam</span>
                            </p>
                          </div>

                          <div className="mt-3 space-y-2">
                            <p className="flex items-center text-sm text-gray-600">
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              Kapasitas: {item.kapasitas} orang
                            </p>

                            <p className="text-sm text-gray-600">
                              {item.deskripsi || 'Tidak ada deskripsi'}
                            </p>
                          </div>

                          {/* Facilities */}
                          {item.fasilitas && item.fasilitas.length > 0 && (
                            <div className="mt-4">
                              <p className="mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                                Fasilitas
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {item.fasilitas.map(fasilitas => (
                                  <span
                                    key={fasilitas.id}
                                    className="inline-flex items-center px-2 py-1 text-xs font-medium text-indigo-700 rounded-md bg-indigo-50"
                                  >
                                    {fasilitas.nama_fasilitas}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Actions */}
                          <div className="flex justify-end pt-3 mt-4 space-x-2 border-t border-gray-100">
                            <button
                              onClick={() => handleClickOpen(item)}
                              className="p-1.5 rounded-lg text-indigo-600 hover:bg-indigo-50 transition"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => handleDelete(item.id)}
                              className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>
          <div className="text-xl font-bold">
            {isEdit ? 'Edit Lapangan' : 'Tambah Lapangan Baru'}
          </div>
        </DialogTitle>
        <DialogContent>
          <div className="flex flex-col gap-4 pt-4">
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
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
            </div>

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
            <div className="mt-2">
              <h3 className="mb-2 text-sm font-medium text-gray-700">
                Foto Lapangan
              </h3>

              {fotoPreview && (
                <div className="relative w-full max-w-md mb-4">
                  <img
                    src={fotoPreview}
                    alt="Preview"
                    className="object-cover w-full h-48 rounded-lg shadow-sm"
                  />
                  <button
                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1.5 rounded-full hover:bg-opacity-70 transition"
                    onClick={() => {
                      setFotoPreview('')
                      setFormData({ ...formData, foto: null })
                      if (fileInputRef.current) {
                        fileInputRef.current.value = ''
                      }
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}

              <div>
                <button
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  onClick={() => {
                    if (fileInputRef.current) {
                      fileInputRef.current.click()
                    }
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {fotoPreview ? 'Ganti Foto' : 'Upload Foto'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFotoChange}
                />
                <p className="mt-1 text-xs text-gray-500">Format: JPG, PNG, JPEG. Maksimal 2MB</p>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <div className="flex justify-end gap-3 p-4">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isEdit ? 'Simpan Perubahan' : 'Simpan'}
            </button>
          </div>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          className={`${snackbar.severity === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
            snackbar.severity === 'error' ? 'bg-red-50 text-red-800 border border-red-200' :
              snackbar.severity === 'warning' ? 'bg-yellow-50 text-yellow-800 border border-yellow-200' :
                'bg-blue-50 text-blue-800 border border-blue-200'
            } shadow-lg`}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
} 