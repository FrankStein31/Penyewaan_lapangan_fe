'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
    ArrowUpward as ArrowUpwardIcon,
    Person as PersonIcon,
    CalendarToday as CalendarTodayIcon,
    SportsBasketball as SportsBasketballIcon,
    AttachMoney as AttachMoneyIcon
} from '@mui/icons-material'
import Sidebar from '@/components/admin/Sidebar'
import Topbar from '@/components/admin/Topbar'
import { fieldService, userService, bookingService, paymentService } from '@/services/api'

const safeToString = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    if (typeof value === 'object') {
        try {
            return JSON.stringify(value);
        } catch (e) {
            return '[Object]';
        }
    }
    return String(value);
};

export default function AdminDashboard() {
    const { user, isAuthenticated, isAdmin } = useAuth()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [dashboardData, setDashboardData] = useState({
        totalBookings: 0,
        totalCustomers: 0,
        totalFields: 0,
        totalRevenue: 0,
        bookingsByFieldType: [],
        recentBookings: []
    })

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true)
                setError(null)

                const usersResponse = await userService.getAll()
                let users = []
                if (usersResponse && usersResponse.data) {
                    if (Array.isArray(usersResponse.data)) {
                        users = usersResponse.data
                    } else if (usersResponse.data.data && Array.isArray(usersResponse.data.data)) {
                        users = usersResponse.data.data
                    }
                }

                const customers = users.filter(user => user.role === 'customer' || user.role === 'pelanggan')

                const fieldsResponse = await fieldService.getAll()
                let fields = []
                if (fieldsResponse && fieldsResponse.data) {
                    if (Array.isArray(fieldsResponse.data)) {
                        fields = fieldsResponse.data
                    } else if (fieldsResponse.data.data && Array.isArray(fieldsResponse.data.data)) {
                        fields = fieldsResponse.data.data
                    }
                }

                const bookingsResponse = await bookingService.getAll()
                let bookings = []
                if (bookingsResponse && bookingsResponse.data) {
                    if (Array.isArray(bookingsResponse.data)) {
                        bookings = bookingsResponse.data
                    } else if (bookingsResponse.data.data && Array.isArray(bookingsResponse.data.data)) {
                        bookings = bookingsResponse.data.data
                    }
                }

                const paymentsResponse = await paymentService.getAll()
                let payments = []
                if (paymentsResponse && paymentsResponse.data) {
                    if (Array.isArray(paymentsResponse.data)) {
                        payments = paymentsResponse.data
                    } else if (paymentsResponse.data.data && Array.isArray(paymentsResponse.data.data)) {
                        payments = paymentsResponse.data.data
                    }
                }

                const totalRevenue = payments.reduce((total, payment) => {
                    return total + (payment.amount || payment.jumlah || 0)
                }, 0)

                const bookingsByFieldType = [];
                const bookingsByCategory = {};

                fields.forEach(field => {
                    const categoryObj = field.kategori;
                    const categoryName = typeof categoryObj === 'object' && categoryObj !== null
                        ? (categoryObj.nama_kategori || categoryObj.name || 'Lainnya')
                        : (categoryObj || field.jenis || 'Lainnya');

                    if (!bookingsByCategory[categoryName]) {
                        bookingsByCategory[categoryName] = {
                            kategoriName: categoryName,
                            jumlah: 0
                        };
                    }

                    const fieldBookings = bookings.filter(booking =>
                        booking.id_lapangan === field.id || booking.field_id === field.id
                    );

                    bookingsByCategory[categoryName].jumlah += fieldBookings.length;
                });

                Object.values(bookingsByCategory).forEach(item => {
                    bookingsByFieldType.push(item);
                });

                const recentBookings = bookings
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .slice(0, 5)
                    .map(booking => {
                        const customer = users.find(u => u.id === booking.id_user || u.id === booking.user_id) || {};
                        const field = fields.find(f => f.id === booking.id_lapangan || f.id === booking.field_id) || {};

                        return {
                            id: booking.id,
                            name: customer.name || customer.nama || 'Pelanggan',
                            field: field.name || field.nama || 'Lapangan',
                            time: booking.jam || `${booking.sesi?.jam_mulai || ''} - ${booking.sesi?.jam_selesai || ''}`,
                            date: booking.tanggal ? new Date(booking.tanggal).toLocaleDateString('id-ID', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            }) : '-',
                            status: booking.status || 'Menunggu',
                        };
                    });

                setDashboardData({
                    totalBookings: bookings.length,
                    totalCustomers: customers.length,
                    totalFields: fields.length,
                    totalRevenue: totalRevenue,
                    bookingsByFieldType: bookingsByFieldType,
                    recentBookings: recentBookings
                });

            } catch (error) {
                // Tambahkan log detail error dari response jika ada
                if (error.response) {
                    console.error('Error mengambil data dashboard:', error.response.data || error.message);
                    setError(
                        error.response.data?.message ||
                        error.response.data?.error ||
                        'Gagal mendapatkan data dashboard (500)'
                    );
                } else {
                    console.error('Error mengambil data dashboard:', error);
                    setError('Gagal mendapatkan data dashboard');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const getCategoryColor = (category) => {
        const colors = {
            'Basket': 'bg-purple-500',
            'Futsal': 'bg-cyan-400',
            'Badminton': 'bg-red-500',
            'Tenis': 'bg-green-500',
            'Bulu Tangkis': 'bg-red-500',
            'Sepak Bola': 'bg-cyan-400',
            'Voli': 'bg-red-500',
            'Lainnya': 'bg-orange-400'
        }

        if (colors[category]) return colors[category]

        for (const key in colors) {
            if (category.toLowerCase().includes(key.toLowerCase())) {
                return colors[key]
            }
        }

        return 'bg-purple-500'
    }

    const getStatusColor = (status) => {
        const statusColors = {
            'Selesai': 'bg-green-500',
            'Dikonfirmasi': 'bg-purple-500',
            'Ditolak': 'bg-red-500',
            'Menunggu': 'bg-orange-400',
            'Dibatalkan': 'bg-red-500',
            'pending': 'bg-orange-400',
            'confirmed': 'bg-purple-500',
            'completed': 'bg-green-500',
            'cancelled': 'bg-red-500',
            'rejected': 'bg-red-500'
        }

        return statusColors[status] || 'bg-purple-500'
    }

    const getStatusTextColor = (status) => {
        const statusColors = {
            'Selesai': 'text-green-500',
            'Dikonfirmasi': 'text-purple-500',
            'Ditolak': 'text-red-500',
            'Menunggu': 'text-orange-400',
            'Dibatalkan': 'text-red-500',
            'pending': 'text-orange-400',
            'confirmed': 'text-purple-500',
            'completed': 'text-green-500',
            'cancelled': 'text-red-500',
            'rejected': 'text-red-500'
        }

        return statusColors[status] || 'text-purple-500'
    }

    function formatNumber(number) {
        if (number >= 1000000) {
            return (number / 1000000).toFixed(1) + ' jt'
        } else if (number >= 1000) {
            return (number / 1000).toFixed(1) + ' rb'
        }
        return number.toString()
    }

    if (error) {
        return (
            <div className="flex h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Topbar />
                    <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-red-500 text-lg mb-2">{error}</p>
                            <p className="text-gray-600">Silakan refresh halaman atau coba lagi nanti.</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="flex h-screen bg-gray-50">
                <Sidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Topbar />
                    <div className="flex-1 overflow-auto p-4 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
                    </div>
                </div>
            </div>
        )
    }

    const stats = [
        {
            title: 'Total Booking',
            value: dashboardData.totalBookings,
            icon: <CalendarTodayIcon />,
            color: 'text-purple-500',
            bgColor: 'bg-purple-100',
            iconColor: 'bg-purple-500',
            change: '+12%'
        },
        {
            title: 'Total Pelanggan',
            value: dashboardData.totalCustomers,
            icon: <PersonIcon />,
            color: 'text-cyan-400',
            bgColor: 'bg-cyan-100',
            iconColor: 'bg-cyan-400',
            change: '+8%'
        },
        {
            title: 'Lapangan Aktif',
            value: dashboardData.totalFields,
            icon: <SportsBasketballIcon />,
            color: 'text-red-500',
            bgColor: 'bg-red-100',
            iconColor: 'bg-red-500',
            change: '+0%'
        },
        {
            title: 'Pendapatan',
            value: `Rp ${formatNumber(dashboardData.totalRevenue)}`,
            icon: <AttachMoneyIcon />,
            color: 'text-green-500',
            bgColor: 'bg-green-100',
            iconColor: 'bg-green-500',
            change: '+15%'
        }
    ]

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-auto p-6">
                    <h1 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h1>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white rounded-lg shadow p-6">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-sm text-gray-500">{stat.title}</p>
                                        <p className="text-3xl font-semibold mt-1">{stat.value}</p>
                                    </div>
                                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                                        <span className={stat.color}>{stat.icon}</span>
                                    </div>
                                </div>
                                <div className="flex items-center mt-4">
                                    <ArrowUpwardIcon className="text-green-500 text-sm mr-1" />
                                    <span className="text-green-500 text-sm">{stat.change}</span>
                                    <span className="text-gray-500 text-sm ml-2">Dibanding bulan lalu</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Main Content */}
                    <div className="flex flex-col lg:flex-row gap-6 mb-6">
                        {/* Left Column */}
                        <div className="lg:w-2/3">
                            <div className="bg-white rounded-lg shadow p-6 h-full">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Analisis Booking</h2>

                                <div className="mt-6 space-y-4">
                                    {dashboardData.bookingsByFieldType.map((item, index) => {
                                        const totalBookings = dashboardData.totalBookings || 1;
                                        const percentage = Math.round((item.jumlah / totalBookings) * 100);

                                        return (
                                            <div key={index} className="mb-4">
                                                <div className="flex justify-between mb-2">
                                                    <span className="text-sm">{safeToString(item.kategoriName)}</span>
                                                    <span className="text-sm">{safeToString(item.jumlah)} ({percentage}%)</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full ${getCategoryColor(safeToString(item.kategoriName))}`}
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <p className="text-sm text-gray-500 mt-6">
                                    * Data ini berdasarkan total booking dalam 30 hari terakhir
                                </p>
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="lg:w-1/3">
                            <div className="bg-white rounded-lg shadow p-6 h-full">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Kalender</h2>

                                <div className="bg-purple-600 text-white rounded-lg p-4 text-center mb-4">
                                    <p className="text-4xl font-semibold">{new Date().getDate()}</p>
                                    <p className="text-lg">
                                        {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                                    </p>
                                </div>

                                <h3 className="text-sm font-medium text-gray-800 mt-6 mb-2">Hari ini</h3>

                                {dashboardData.recentBookings.length > 0 ? (
                                    dashboardData.recentBookings.slice(0, 2).map((booking, idx) => (
                                        <div key={idx} className="bg-gray-50 rounded-lg p-4 mb-2">
                                            <p className="text-sm text-gray-600">{safeToString(booking.time || 'Waktu tidak tersedia')}</p>
                                            <p className="text-sm font-medium mt-1">
                                                {safeToString(booking.field || 'Lapangan')} ({safeToString(booking.name || 'Pelanggan')})
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        <p className="text-sm text-gray-600">Tidak ada booking hari ini</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Recent Bookings */}
                    <div className="bg-white rounded-lg shadow p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Booking Terbaru</h2>

                        <div className="divide-y">
                            {dashboardData.recentBookings.map((booking, index) => (
                                <div key={index} className="py-4">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0">
                                            <div className="bg-gray-100 text-purple-600 rounded-full w-10 h-10 flex items-center justify-center">
                                                {safeToString(booking.name || 'P').charAt(0)}
                                            </div>
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <div className="flex flex-col sm:flex-row sm:justify-between">
                                                <p className="text-sm font-medium">{safeToString(booking.name || 'Pelanggan')}</p>
                                                <span className={`${getStatusTextColor(safeToString(booking.status))} text-xs px-2 py-1 rounded-full ${getStatusColor(safeToString(booking.status))} bg-opacity-20 mt-1 sm:mt-0`}>
                                                    {safeToString(booking.status || 'Menunggu')}
                                                </span>
                                            </div>
                                            <div className="flex flex-col sm:flex-row mt-1">
                                                <p className="text-sm text-gray-500">
                                                    {safeToString(booking.field || 'Lapangan')} • {safeToString(booking.time || 'Waktu tidak tersedia')}
                                                </p>
                                                <p className="text-sm text-gray-500 sm:ml-2">
                                                    {safeToString(booking.date || '-')}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}