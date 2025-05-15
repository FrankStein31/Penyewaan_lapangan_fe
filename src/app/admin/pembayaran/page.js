'use client'

import { useState, useEffect } from 'react'
import { paymentService } from '@/services/api'
import Sidebar from '@/components/admin/Sidebar'
import Topbar from '@/components/admin/Topbar'
import { FaCheckCircle, FaTimesCircle, FaSyncAlt, FaMoneyBillWave, FaSearch } from 'react-icons/fa'

export default function PembayaranAdmin() {
    const [payments, setPayments] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [refresh, setRefresh] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

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
        switch (status) {
            case 'settlement':
                return (
                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-green-800 bg-green-100 border border-green-200 rounded-full">
                        <FaCheckCircle className="mr-1.5" /> Berhasil
                    </span>
                )
            case 'pending':
                return (
                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-yellow-800 bg-yellow-100 border border-yellow-200 rounded-full">
                        <FaSyncAlt className="mr-1.5 animate-spin" /> Pending
                    </span>
                )
            case 'expire':
            case 'deny':
            case 'cancel':
                return (
                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-red-800 bg-red-100 border border-red-200 rounded-full">
                        <FaTimesCircle className="mr-1.5" /> Gagal
                    </span>
                )
            default:
                return (
                    <span className="inline-flex items-center px-3 py-1 text-xs font-medium text-gray-800 bg-gray-100 border border-gray-200 rounded-full">
                        {status}
                    </span>
                )
        }
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount)
    }

    const filteredPayments = payments.filter(payment =>
        payment.transaction_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.booking_id?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <Topbar />
                <main className="flex-1 pt-20 pb-10 overflow-auto">
                    <div className="w-full px-4">
                        <div className="overflow-hidden bg-white shadow-md">
                            <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
                                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                                    <div className="flex items-center">
                                        <FaMoneyBillWave className="mr-3 text-xl text-blue-600" />
                                        <h1 className="text-xl font-bold text-gray-800">Manajemen Pembayaran</h1>
                                    </div>
                                    <div className="flex items-center w-full gap-4 md:w-auto">
                                        <div className="relative w-full md:w-64">
                                            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                <FaSearch className="text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                className="block w-full py-2 pl-10 pr-3 leading-5 placeholder-gray-500 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                                placeholder="Cari ID transaksi..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                            />
                                        </div>
                                        <button
                                            onClick={handleRefresh}
                                            className="flex items-center px-4 py-2 text-white transition-colors duration-200 bg-blue-600 rounded-md shadow-sm hover:bg-blue-700 whitespace-nowrap"
                                        >
                                            <FaSyncAlt className={`mr-2 ${loading ? 'animate-spin' : ''}`} />
                                            Refresh
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="flex items-center p-4 mx-4 my-4 text-red-700 bg-red-100 border border-red-200 rounded-lg">
                                    <FaTimesCircle className="flex-shrink-0 mr-2" />
                                    <span>{error}</span>
                                </div>
                            )}

                            {loading ? (
                                <div className="flex justify-center p-12">
                                    <div className="w-12 h-12 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
                                </div>
                            ) : (
                                <div className="w-full overflow-x-auto">
                                    <table className="w-full divide-y divide-gray-200">
                                        <thead>
                                            <tr className="bg-gray-50">
                                                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    ID Transaksi
                                                </th>
                                                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Booking ID
                                                </th>
                                                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Metode
                                                </th>
                                                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Jumlah
                                                </th>
                                                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Tanggal
                                                </th>
                                                <th className="px-4 py-3.5 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {filteredPayments.length > 0 ? (
                                                filteredPayments.map((payment) => (
                                                    <tr key={payment.id} className="transition-colors duration-150 hover:bg-gray-50">
                                                        <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                            {payment.transaction_id || '-'}
                                                        </td>
                                                        <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                                                            {payment.booking_id}
                                                        </td>
                                                        <td className="px-4 py-4 text-sm text-gray-600 capitalize whitespace-nowrap">
                                                            {payment.payment_type || '-'}
                                                        </td>
                                                        <td className="px-4 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                            {formatCurrency(payment.amount)}
                                                        </td>
                                                        <td className="px-4 py-4 whitespace-nowrap">
                                                            {getStatusBadge(payment.status)}
                                                        </td>
                                                        <td className="px-4 py-4 text-sm text-gray-600 whitespace-nowrap">
                                                            {new Date(payment.created_at).toLocaleString('id-ID', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </td>
                                                        <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">
                                                            {payment.status === 'pending' ? (
                                                                <button
                                                                    onClick={() => handleVerifyPayment(payment.id)}
                                                                    className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-50 transition-colors duration-200"
                                                                >
                                                                    <FaCheckCircle className="mr-1.5" /> Verifikasi
                                                                </button>
                                                            ) : (
                                                                <span className="text-gray-400">-</span>
                                                            )}
                                                        </td>
                                                    </tr>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="7" className="px-4 py-12 text-base text-center text-gray-500 bg-gray-50">
                                                        {searchTerm ? (
                                                            <div className="flex flex-col items-center">
                                                                <FaSearch className="mb-3 text-4xl text-gray-400" />
                                                                <p>Tidak ada data transaksi dengan kata kunci &quot;{searchTerm}&quot;</p>
                                                                <button
                                                                    onClick={() => setSearchTerm('')}
                                                                    className="mt-2 text-blue-600 hover:text-blue-800"
                                                                >
                                                                    Reset pencarian
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <div className="flex flex-col items-center">
                                                                <FaMoneyBillWave className="mb-3 text-4xl text-gray-400" />
                                                                <p>Tidak ada data pembayaran saat ini</p>
                                                            </div>
                                                        )}
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