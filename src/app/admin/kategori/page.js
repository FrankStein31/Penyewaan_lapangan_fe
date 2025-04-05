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
        setSnackbar({ ...snackbar, open: false })
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
            <div className="flex-1 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <Topbar />
                <div className="pt-16"> {/* Space for fixed Toolbar */}
                    <div className="p-6">
                        {/* Header Section */}
                        <div className="flex flex-col items-start justify-between gap-4 mb-6 sm:flex-row sm:items-center">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-800">Kelola Kategori Lapangan</h1>
                                <p className="mt-1 text-sm text-gray-500">Atur semua kategori lapangan dalam satu tempat</p>
                            </div>
                            <button
                                onClick={() => handleClickOpen()}
                                className="flex items-center px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transform hover:scale-105"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                                Tambah Kategori
                            </button>
                        </div>

                        {/* Loading State */}
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="relative w-16 h-16">
                                    <div className="absolute top-0 w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                                    <div className="absolute top-0 w-16 h-16 border-4 rounded-full border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
                                </div>
                                <p className="mt-4 text-sm text-gray-500">Memuat data kategori...</p>
                            </div>
                        ) : error ? (
                            <div className="mb-6 overflow-hidden border-l-4 border-red-500 rounded-lg bg-gradient-to-r from-red-50 to-red-100">
                                <div className="px-4 py-5 sm:p-6">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-red-800">Terjadi kesalahan</h3>
                                            <div className="mt-2 text-sm text-red-700">
                                                <p>{error}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="overflow-hidden bg-white border border-gray-100 shadow-sm rounded-xl">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">
                                                    ID
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">
                                                    Nama Kategori
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-xs font-semibold tracking-wider text-left text-gray-500 uppercase">
                                                    Deskripsi
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-xs font-semibold tracking-wider text-right text-gray-500 uppercase">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {categories.length > 0 ? (
                                                categories.map((kategori) => (
                                                    <tr key={kategori.id} className="transition-colors duration-200 hover:bg-gray-50">
                                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800">
                                                                {kategori.id}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <div className="flex items-center">
                                                                <div className="flex items-center justify-center flex-shrink-0 w-8 h-8 font-bold text-white rounded-md bg-gradient-to-r from-indigo-500 to-purple-500">
                                                                    {kategori.nama_kategori.charAt(0).toUpperCase()}
                                                                </div>
                                                                <div className="ml-3">
                                                                    <div className="text-sm font-medium text-gray-900">{kategori.nama_kategori}</div>
                                                                </div>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="max-w-md text-sm text-gray-500 truncate">
                                                                {kategori.deskripsi || "Tidak ada deskripsi"}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                                            <div className="flex justify-end gap-2">
                                                                <button
                                                                    onClick={() => handleClickOpen(kategori)}
                                                                    className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                                    </svg>
                                                                </button>
                                                                <button
                                                                    onClick={() => handleDelete(kategori.id)}
                                                                    className="inline-flex items-center p-1.5 border border-transparent rounded-full shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                    </svg>
                                                                </button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan={4} className="px-6 py-12 text-center">
                                                        <div className="flex flex-col items-center">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12 mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                            </svg>
                                                            <p className="font-medium text-gray-500">Tidak ada data kategori</p>
                                                            <p className="mt-1 text-sm text-gray-400">Mulai dengan menambahkan kategori baru</p>
                                                            <button
                                                                onClick={() => handleClickOpen()}
                                                                className="inline-flex items-center px-4 py-2 mt-4 text-sm font-medium text-indigo-600 bg-indigo-100 border border-transparent rounded-md hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                            >
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                                                </svg>
                                                                Tambah Kategori Baru
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Dialog Form */}
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <div className="overflow-hidden bg-white rounded-lg">
                    <div className="px-6 py-4 text-white bg-gradient-to-r from-indigo-600 to-purple-600">
                        <h3 className="text-lg font-semibold">
                            {isEdit ? 'Edit Kategori' : 'Tambah Kategori Baru'}
                        </h3>
                        <p className="mt-1 text-sm text-indigo-100">
                            {isEdit ? 'Perbarui informasi kategori lapangan' : 'Isi detail kategori lapangan baru'}
                        </p>
                    </div>

                    <div className="p-6">
                        <div className="space-y-4">
                            <div>
                                <label htmlFor="nama_kategori" className="block mb-1 text-sm font-medium text-gray-700">
                                    Nama Kategori <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="nama_kategori"
                                    id="nama_kategori"
                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Masukkan nama kategori"
                                    value={formData.nama_kategori}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="deskripsi" className="block mb-1 text-sm font-medium text-gray-700">
                                    Deskripsi
                                </label>
                                <textarea
                                    name="deskripsi"
                                    id="deskripsi"
                                    rows={4}
                                    className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                    placeholder="Masukkan deskripsi kategori"
                                    value={formData.deskripsi}
                                    onChange={handleChange}
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Berikan penjelasan detail tentang kategori ini
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end px-6 py-4 space-x-3 bg-gray-50">
                        <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={handleClose}
                        >
                            Batal
                        </button>
                        <button
                            type="button"
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white border border-transparent rounded-md shadow-sm bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={handleSave}
                        >
                            {isEdit ? (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Simpan Perubahan
                                </>
                            ) : (
                                <>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Simpan
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </Dialog>

            {/* Snackbar untuk notifikasi */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <div className={`
              rounded-lg shadow-lg px-4 py-3 border-l-4 flex items-center
              ${snackbar.severity === 'success' ? 'bg-green-50 border-green-500 text-green-800' :
                        snackbar.severity === 'error' ? 'bg-red-50 border-red-500 text-red-800' :
                            snackbar.severity === 'warning' ? 'bg-yellow-50 border-yellow-500 text-yellow-800' :
                                'bg-blue-50 border-blue-500 text-blue-800'}
            `}>
                    <div className="mr-3">
                        {snackbar.severity === 'success' && (
                            <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                        {snackbar.severity === 'error' && (
                            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                        {snackbar.severity === 'warning' && (
                            <svg className="w-5 h-5 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                            </svg>
                        )}
                        {snackbar.severity === 'info' && (
                            <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                    </div>
                    <div>
                        <p className="font-medium">{snackbar.message}</p>
                    </div>
                    <button
                        onClick={handleCloseSnackbar}
                        className="ml-auto"
                    >
                        <svg className="w-4 h-4 opacity-50 hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </Snackbar>
        </>
    )
} 