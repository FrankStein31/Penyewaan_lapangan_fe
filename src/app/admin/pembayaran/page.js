'use client'

import { useState, useEffect } from 'react'
import { Search, RefreshCw, CreditCard, CheckCircle, XCircle, Clock, AlertCircle, Filter, Download, Eye, Calendar } from 'lucide-react'
import Sidebar from '@/components/admin/Sidebar'
import Topbar from '@/components/admin/Topbar'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Mock service untuk demo
const paymentService = {
    getAll: () => Promise.resolve({
        data: {
            data: [
                {
                    id: 1,
                    transaction_id: 'TXN-001-2024',
                    booking_id: 'BK-001',
                    payment_type: 'credit_card',
                    amount: 250000,
                    status: 'settlement',
                    created_at: '2024-01-15T10:30:00Z',
                    bank: 'BCA',
                    va_number: '1234567890'
                },
                {
                    id: 2,
                    transaction_id: 'TXN-002-2024',
                    booking_id: 'BK-002',
                    payment_type: 'bank_transfer',
                    amount: 500000,
                    status: 'pending',
                    created_at: '2024-01-15T11:30:00Z',
                    bank: 'Mandiri',
                    va_number: '0987654321'
                },
                {
                    id: 3,
                    transaction_id: 'TXN-003-2024',
                    booking_id: 'BK-003',
                    payment_type: 'e_wallet',
                    amount: 150000,
                    status: 'expire',
                    created_at: '2024-01-15T09:30:00Z',
                    bank: 'GoPay',
                    va_number: null
                }
            ]
        }
    }),
    verify: (id) => Promise.resolve({ success: true })
}

const handleExportToPDF = () => {
    const input = document.getElementById('export-content');
    if (!input) return alert("Konten tidak ditemukan");

    html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('laporan.pdf');
    });
};

export default function PembayaranAdmin() {
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [refresh, setRefresh] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [selectedPayment, setSelectedPayment] = useState(null)

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                setLoading(true)
                setError(null)
                const response = await paymentService.getAll()
                setPayments(response?.data?.data || [])
            } catch (err) {
                console.error('Error fetching payments:', err)
                setError('Gagal memuat data pembayaran')
            } finally {
                setLoading(false)
            }
        }

        fetchPayments()
    }, [refresh])

    const handleRefresh = () => {
        setRefresh(!refresh)
    }

    const handleVerifyPayment = async (paymentId) => {
        try {
            await paymentService.verify(paymentId)
            setRefresh(!refresh)
        } catch (err) {
            console.error('Error verifying payment:', err)
            setError('Gagal memverifikasi pembayaran')
        }
    }

    const getStatusBadge = (status) => {
        const configs = {
            settlement: {
                icon: CheckCircle,
                text: 'Berhasil',
                className: 'bg-emerald-50 text-emerald-700 border-emerald-200'
            },
            pending: {
                icon: Clock,
                text: 'Pending',
                className: 'bg-amber-50 text-amber-700 border-amber-200'
            },
            expire: {
                icon: XCircle,
                text: 'Kedaluwarsa',
                className: 'bg-red-50 text-red-700 border-red-200'
            },
            deny: {
                icon: XCircle,
                text: 'Ditolak',
                className: 'bg-red-50 text-red-700 border-red-200'
            },
            cancel: {
                icon: XCircle,
                text: 'Dibatalkan',
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

    const getPaymentMethodBadge = (type, bank) => {
        const configs = {
            credit_card: { text: 'Kartu Kredit', className: 'bg-blue-50 text-blue-700 border-blue-200' },
            bank_transfer: { text: 'Transfer Bank', className: 'bg-purple-50 text-purple-700 border-purple-200' },
            e_wallet: { text: 'E-Wallet', className: 'bg-green-50 text-green-700 border-green-200' }
        }

        const config = configs[type] || { text: type, className: 'bg-gray-50 text-gray-700 border-gray-200' }

        return (
            <div className="flex flex-col gap-1">
                <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium border rounded-md ${config.className}`}>
                    {config.text}
                </span>
                {bank && (
                    <span className="text-xs text-gray-500">{bank}</span>
                )}
            </div>
        )
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount)
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

    const filteredPayments = payments.filter(payment => {
        const matchesSearch =
            payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.booking_id?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesStatus = statusFilter === 'all' || payment.status === statusFilter

        return matchesSearch && matchesStatus
    })

    const getStatsSummary = () => {
        const total = payments.length
        const settled = payments.filter(p => p.status === 'settlement').length
        const pending = payments.filter(p => p.status === 'pending').length
        const failed = payments.filter(p => ['expire', 'deny', 'cancel'].includes(p.status)).length
        const totalAmount = payments
            .filter(p => p.status === 'settlement')
            .reduce((sum, p) => sum + p.amount, 0)

        return { total, settled, pending, failed, totalAmount }
    }

    const stats = getStatsSummary()

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
                                        onClick={handleExportToPDF}
                                        className="flex items-center px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Export
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-6">

                        {/* Filters and Search */}
                        <div className="p-6 mb-6 bg-white border border-gray-200 rounded-xl">
                            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                                <div className="flex flex-col gap-4 md:flex-row md:items-center">
                                    <div className="relative">
                                        <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                                        <input
                                            type="text"
                                            placeholder="Cari ID transaksi atau booking..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-10 pr-4 py-2.5 w-full md:w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="relative">
                                        <Filter className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                                        <select
                                            value={statusFilter}
                                            onChange={(e) => setStatusFilter(e.target.value)}
                                            className="pl-10 pr-8 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                                        >
                                            <option value="all">Semua Status</option>
                                            <option value="settlement">Berhasil</option>
                                            <option value="pending">Pending</option>
                                            <option value="expire">Kedaluwarsa</option>
                                            <option value="deny">Ditolak</option>
                                            <option value="cancel">Dibatalkan</option>
                                        </select>
                                    </div>
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
                                                    Transaksi
                                                </th>
                                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                                                    Metode Pembayaran
                                                </th>
                                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                                                    Jumlah
                                                </th>
                                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                                                    Status
                                                </th>
                                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                                                    Tanggal
                                                </th>
                                                <th className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-600 uppercase">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {filteredPayments.length > 0 ? (
                                                filteredPayments.map((payment) => {
                                                    const dateTime = formatDate(payment.created_at)
                                                    return (
                                                        <tr key={payment.id} className="transition-colors hover:bg-gray-50">
                                                            <td className="px-6 py-4">
                                                                <div className="flex flex-col">
                                                                    <span className="font-semibold text-gray-900">
                                                                        {payment.transaction_id || '-'}
                                                                    </span>
                                                                    <span className="text-sm text-gray-500">
                                                                        Booking: {payment.booking_id}
                                                                    </span>
                                                                    {payment.va_number && (
                                                                        <span className="text-xs text-gray-400">
                                                                            VA: {payment.va_number}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                {getPaymentMethodBadge(payment.payment_type, payment.bank)}
                                                            </td>
                                                            <td className="px-6 py-4">
                                                                <span className="font-semibold text-gray-900">
                                                                    {formatCurrency(payment.amount)}
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
                                                            <td className="px-6 py-4">
                                                                <div className="flex gap-2">
                                                                    <button
                                                                        onClick={() => setSelectedPayment(payment)}
                                                                        className="flex items-center px-3 py-1.5 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                                                                    >
                                                                        <Eye className="w-4 h-4 mr-1" />
                                                                        Detail
                                                                    </button>
                                                                    {payment.status === 'pending' && (
                                                                        <button
                                                                            onClick={() => handleVerifyPayment(payment.id)}
                                                                            className="flex items-center px-3 py-1.5 text-sm text-white bg-emerald-600 rounded-md hover:bg-emerald-700 transition-colors"
                                                                        >
                                                                            <CheckCircle className="w-4 h-4 mr-1" />
                                                                            Verifikasi
                                                                        </button>
                                                                    )}
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="px-6 py-20 text-center">
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

            {/* Detail Modal */}
            {selectedPayment && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                    <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold text-gray-900">Detail Pembayaran</h2>
                                <button
                                    onClick={() => setSelectedPayment(null)}
                                    className="p-2 text-gray-400 rounded-lg hover:text-gray-600"
                                >
                                    <XCircle className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        ID Transaksi
                                    </label>
                                    <p className="p-2 font-mono text-gray-900 rounded bg-gray-50">
                                        {selectedPayment.transaction_id}
                                    </p>
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        Booking ID
                                    </label>
                                    <p className="p-2 font-mono text-gray-900 rounded bg-gray-50">
                                        {selectedPayment.booking_id}
                                    </p>
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        Jumlah Pembayaran
                                    </label>
                                    <p className="text-lg font-bold text-gray-900">
                                        {formatCurrency(selectedPayment.amount)}
                                    </p>
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        Status
                                    </label>
                                    {getStatusBadge(selectedPayment.status)}
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        Metode Pembayaran
                                    </label>
                                    {getPaymentMethodBadge(selectedPayment.payment_type, selectedPayment.bank)}
                                </div>
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700">
                                        Tanggal Transaksi
                                    </label>
                                    <p className="text-gray-900">
                                        {new Date(selectedPayment.created_at).toLocaleString('id-ID')}
                                    </p>
                                </div>
                                {selectedPayment.va_number && (
                                    <div className="md:col-span-2">
                                        <label className="block mb-1 text-sm font-medium text-gray-700">
                                            Virtual Account
                                        </label>
                                        <p className="p-2 font-mono text-gray-900 rounded bg-gray-50">
                                            {selectedPayment.va_number}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}