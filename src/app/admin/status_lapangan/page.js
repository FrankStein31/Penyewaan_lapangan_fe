// src/app/admin/status_lapangan/page.js
'use client'

import { useState, useEffect } from 'react'
import Sidebar from '@/components/admin/Sidebar'
import Topbar from '@/components/admin/Topbar'
import { fieldService } from '@/services/api'

export default function StatusLapanganPage() {
    const [lapanganData, setLapanganData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [refresh, setRefresh] = useState(false)

    // Fetch data from API
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const response = await fieldService.getAll()

                if (response && response.data) {
                    const data = Array.isArray(response.data) ? response.data : response.data.data
                    setLapanganData(data || [])
                } else {
                    setLapanganData([])
                }
                setError(null)
            } catch (err) {
                console.error('Error fetching data:', err)
                setError('Gagal memuat data lapangan. Silakan coba lagi.')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [refresh])

    // Function to get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 'tersedia':
                return 'bg-green-100 text-green-800'
            case 'dipesan':
                return 'bg-blue-100 text-blue-800'
            case 'perbaikan':
                return 'bg-yellow-100 text-yellow-800'
            case 'tidak tersedia':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    // Function to translate status
    const translateStatus = (status) => {
        switch (status) {
            case 'tersedia':
                return 'Tersedia'
            case 'dipesan':
                return 'Dipesan'
            case 'perbaikan':
                return 'Perbaikan'
            case 'tidak tersedia':
                return 'Tidak Tersedia'
            default:
                return status
        }
    }

    // Count status summary
    const statusSummary = {
        tersedia: lapanganData.filter(item => item.status === 'tersedia').length,
        dipesan: lapanganData.filter(item => item.status === 'dipesan').length,
        perbaikan: lapanganData.filter(item => item.status === 'perbaikan').length,
        tidakTersedia: lapanganData.filter(item => item.status === 'tidak tersedia').length
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <Topbar />
                <main className="flex-1 pt-20 overflow-auto">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">Status Lapangan</h1>
                        <button
                            onClick={() => setRefresh(!refresh)}
                            className="flex items-center px-4 py-2 text-white transition bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                            </svg>
                            Refresh
                        </button>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex justify-center p-8">
                            <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="flex items-center p-4 mb-6 text-red-700 bg-red-100 border border-red-200 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {error}
                        </div>
                    )}

                    {/* Status Summary Cards */}
                    <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2 lg:grid-cols-4">
                        <div className="p-6 bg-white rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-3 mr-4 bg-green-100 rounded-full">
                                    <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Tersedia</p>
                                    <p className="text-2xl font-semibold">{statusSummary.tersedia} Lapangan</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-3 mr-4 bg-blue-100 rounded-full">
                                    <div className="w-6 h-6 bg-blue-500 rounded-full"></div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Dipesan</p>
                                    <p className="text-2xl font-semibold">{statusSummary.dipesan} Lapangan</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-3 mr-4 bg-yellow-100 rounded-full">
                                    <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Perbaikan</p>
                                    <p className="text-2xl font-semibold">{statusSummary.perbaikan} Lapangan</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-6 bg-white rounded-lg shadow">
                            <div className="flex items-center">
                                <div className="p-3 mr-4 bg-red-100 rounded-full">
                                    <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Tidak Tersedia</p>
                                    <p className="text-2xl font-semibold">{statusSummary.tidakTersedia} Lapangan</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Lapangan Table */}
                    {!loading && !error && (
                        <div className="overflow-hidden bg-white rounded-lg shadow">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                Nama Lapangan
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                Kategori
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                Status
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                Terakhir Digunakan
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {lapanganData.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-4 text-sm text-center text-gray-500">
                                                    Tidak ada data lapangan
                                                </td>
                                            </tr>
                                        ) : (
                                            lapanganData.map((lapangan) => (
                                                <tr key={lapangan.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <div className="flex items-center justify-center flex-shrink-0 w-10 h-10 font-bold text-white bg-orange-500 rounded-full">
                                                                {lapangan.nama.charAt(0)}
                                                            </div>
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">{lapangan.nama}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                        {lapangan.kategori?.nama_kategori || '-'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(lapangan.status)}`}>
                                                            {translateStatus(lapangan.status)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                        {lapangan.updated_at ? new Date(lapangan.updated_at).toLocaleString('id-ID') : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                                        <button className="mr-3 text-blue-600 hover:text-blue-900">Edit</button>
                                                        <button className="text-red-600 hover:text-red-900">Hapus</button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}