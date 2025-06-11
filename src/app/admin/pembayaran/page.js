'use client'

import { useState, useEffect } from 'react'
import { Search, RefreshCw, CreditCard, CheckCircle, XCircle, Clock, AlertCircle, Download } from 'lucide-react'
import Sidebar from '@/components/admin/Sidebar'
import Topbar from '@/components/admin/Topbar'
import { paymentService } from '@/services/api'
import { toast } from 'react-hot-toast'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

export default function PembayaranAdmin() {
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')

    const fetchPayments = async () => {
        try {
            setLoading(true)
            setError(null)
            const response = await paymentService.getAll()
            console.log('Response pembayaran:', response)
            
            // Pastikan data adalah array
            const paymentsData = Array.isArray(response?.data) ? response.data : 
                               Array.isArray(response?.data?.data) ? response.data.data : [];
            
            console.log('Data pembayaran yang akan diset:', paymentsData)
            setPayments(paymentsData)
        } catch (err) {
            console.error('Error fetching payments:', err)
            setError('Gagal memuat data pembayaran')
            toast.error('Gagal memuat data pembayaran')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPayments()
    }, [])

    const handleRefresh = () => {
        fetchPayments()
    }

    const getStatusBadge = (status) => {
        const configs = {
            diverifikasi: {
                icon: CheckCircle,
                text: 'Diverifikasi',
                className: 'bg-emerald-50 text-emerald-700 border-emerald-200'
            },
            pending: {
                icon: Clock,
                text: 'Pending',
                className: 'bg-amber-50 text-amber-700 border-amber-200'
            },
            ditolak: {
                icon: XCircle,
                text: 'Ditolak',
                className: 'bg-red-50 text-red-700 border-red-200'
            }
        }

        const config = configs[status] || {
            icon: AlertCircle,
            text: status,
            className: 'bg-gray-50 text-gray-700 border-gray-200'
        }

        const Icon = config.icon

        return (
            <span className={`inline-flex items-center px-3 py-1.5 text-xs font-medium border rounded-full ${config.className}`}>
                <Icon className="w-3 h-3 mr-1.5" />
                {config.text}
            </span>
        )
    }

    const formatDate = (dateString) => {
        const date = new Date(dateString)
        return {
            date: date.toLocaleDateString('id-ID', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }),
            time: date.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit'
            })
        }
    }

    const formatCurrency = (amount) => {
        if (!amount) return 'Rp 0'
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount)
    }

    const filteredPayments = Array.isArray(payments) ? payments.filter(payment => {
        const matchesSearch = 
            payment?.id_pemesanan?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment?.metode?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === 'all' || payment?.status === statusFilter

        return matchesSearch && matchesStatus
    }) : []

    const handleExportPDF = () => {
        try {
            const doc = new jsPDF()
            
            // Add title
            doc.setFontSize(16)
            doc.text('Laporan Pembayaran', 14, 15)
            
            // Add date
            doc.setFontSize(10)
            doc.text(`Tanggal: ${new Date().toLocaleDateString('id-ID')}`, 14, 25)
            
            // Define the table columns
            const tableColumn = ["ID", "Pemesanan", "Metode", "Total", "Status", "Tanggal"]
            
            // Define the table rows
            const tableRows = filteredPayments.map(payment => [
                payment.id_pembayaran,
                payment.id_pemesanan,
                payment.metode,
                formatCurrency(payment.total_bayar),
                payment.status,
                new Date(payment.created_at).toLocaleDateString('id-ID')
            ])
            
            // Generate the table
            doc.autoTable({
                head: [tableColumn],
                body: tableRows,
                startY: 35,
                styles: { fontSize: 8, cellPadding: 2 },
                headStyles: { fillColor: [63, 103, 240] },
                alternateRowStyles: { fillColor: [245, 247, 250] }
            })
            
            // Save the PDF
            doc.save('laporan-pembayaran.pdf')
            toast.success('Laporan berhasil diexport')
        } catch (error) {
            console.error('Error exporting PDF:', error)
            toast.error('Gagal mengexport laporan')
        }
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <Topbar />

                <main className="flex-1 pt-16 pb-10 overflow-auto">
                    {/* Header */}
                    <div className="bg-white border-b border-gray-200 shadow-sm">
                        <div className="px-6 py-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl">
                                        <CreditCard className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div className="ml-4">
                                        <h1 className="text-2xl font-bold text-gray-900">Manajemen Pembayaran</h1>
                                        <p className="text-sm text-gray-600">Kelola dan pantau semua transaksi pembayaran</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={handleRefresh}
                                        disabled={loading}
                                        className="flex items-center px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                                        Refresh
                                    </button>
                                    <button
                                        onClick={handleExportPDF}
                                        className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Export PDF
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-6">
                        {/* Filters */}
                        <div className="p-6 mb-6 bg-white border border-gray-200 rounded-xl">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                                    <div className="relative">
                                        <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                                        <input
                                            type="text"
                                            placeholder="Cari ID pemesanan..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 pr-4 py-2.5 w-full md:w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="all">Semua Status</option>
                                        <option value="diverifikasi">Diverifikasi</option>
                                        <option value="pending">Pending</option>
                                        <option value="ditolak">Ditolak</option>
                                    </select>
                                </div>

                                <div className="text-sm text-gray-600">
                                    Menampilkan {filteredPayments.length} dari {payments.length} transaksi
                                </div>
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-center p-4 mb-6 text-red-700 border border-red-200 rounded-lg bg-red-50">
                                <AlertCircle className="flex-shrink-0 w-5 h-5 mr-3" />
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Table */}
                        <div className="overflow-hidden bg-white border border-gray-200 rounded-xl">
                            {loading ? (
                                <div className="flex items-center justify-center py-20">
                                    <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
                                </div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="border-b border-gray-200 bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                                                    ID Pemesanan
                                                </th>
                                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                                                    Metode
                                                </th>
                                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                                                    Total Bayar
                                                </th>
                                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                                                    Status
                                                </th>
                                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                                                    Tanggal
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {filteredPayments.length > 0 ? (
                                                filteredPayments.map((payment) => {
                                                    const dateTime = formatDate(payment.created_at)
                                                    return (
                                                        <tr key={payment.id_pembayaran} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4">
                                                                <span className="font-medium text-gray-900">
                                                                    #{payment.id_pemesanan}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className="capitalize text-gray-900">
                                                                    {payment.metode}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className="font-medium text-gray-900">
                                                                    {formatCurrency(payment.total_bayar)}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {getStatusBadge(payment.status)}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <div className="flex flex-col">
                                                                    <span className="text-sm font-medium text-gray-900">
                                                                        {dateTime.date}
                                                                    </span>
                                                                    <span className="text-xs text-gray-500">
                                                                        {dateTime.time}
                                                                    </span>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-20 text-center">
                                                        <div className="flex flex-col items-center">
                                                            {searchTerm || statusFilter !== 'all' ? (
                                                                <>
                                                                    <Search className="w-12 h-12 mb-4 text-gray-400" />
                                                                    <p className="mb-2 text-gray-600">
                                                                        Tidak ada transaksi yang sesuai dengan filter
                                                                    </p>
                                                                    <button
                                                                        onClick={() => {
                                                                            setSearchTerm('')
                                                                            setStatusFilter('all')
                                                                        }}
                                                                        className="text-sm text-blue-600 hover:text-blue-800"
                                                                    >
                                                                        Reset filter
                                                                    </button>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <CreditCard className="w-12 h-12 mb-4 text-gray-400" />
                                                                    <p className="text-gray-600">
                                                                        Belum ada data pembayaran
                                                                    </p>
                                                                </>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}