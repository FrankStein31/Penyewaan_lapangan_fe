'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { bookingService } from '@/services/api';
import {
    Person,
    CalendarMonth,
    History,
    Logout as LogoutIcon,
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    EventAvailable,
    Settings,
    AccountCircle,
    Close as CloseIcon,
    Notifications,
    Search,
    LightMode,
    DarkMode,
    ChevronRight,
    MonetizationOn,
    Schedule,
    Place
} from '@mui/icons-material';

const drawerWidth = 260;

export default function CustomerDashboard() {
    const { user, loading: authLoading, isAuthenticated, logout } = useAuth();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState(0);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [mobileOpen, setMobileOpen] = useState(false);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
    const [profileAnchorEl, setProfileAnchorEl] = useState(null);

    const handleNotificationOpen = (event) => setNotificationAnchorEl(event.currentTarget);
    const handleNotificationClose = () => setNotificationAnchorEl(null);
    const handleProfileOpen = (event) => setProfileAnchorEl(event.currentTarget);
    const handleProfileClose = () => setProfileAnchorEl(null);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            console.log('User not authenticated, redirecting to login');
            router.replace('/login');
        }
    }, [authLoading, isAuthenticated, router]);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                await bookingService.getUserBookings();
            } catch (error) {
                if (error.response && error.response.status === 401) {
                    console.log('Token tidak valid, redirect ke login');
                    logout();
                    router.replace('/login');
                }
            }
        };

        if (!authLoading && isAuthenticated) {
            checkAuth();
        }
    }, [authLoading, isAuthenticated, logout, router]);

    useEffect(() => {
        const fetchBookings = async () => {
            if (!isAuthenticated || !user) return;

            try {
                setLoading(true);
                setError('');
                const response = await bookingService.getUserBookings();
                setBookings(Array.isArray(response?.data) ? response.data : []);
            } catch (error) {
                console.error('Error fetching bookings:', error);
                setError('Gagal memuat data pesanan. Silakan coba lagi nanti.');
                setBookings([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [isAuthenticated, user]);

    const handleChangeTab = (event, newValue) => {
        setActiveTab(newValue);
    };

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const filteredBookings = bookings.filter(booking => {
        if (!booking) return false;
        const bookingDate = new Date(booking.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return activeTab === 0 ? bookingDate >= today : bookingDate < today;
    });

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'menunggu pembayaran': return 'bg-yellow-100 text-yellow-800';
            case 'dikonfirmasi': return 'bg-green-100 text-green-800';
            case 'dibatalkan': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getMenuItemStyle = (isActive) =>
        `rounded-lg mb-1 ${isActive ? 'bg-purple-100 text-purple-600 font-bold' : ''}`;

    const drawer = (
        <div className="flex flex-col h-full bg-white border-r-0">
            <div className="flex items-center justify-between p-6">
                <button
                    className="text-gray-500 sm:hidden hover:text-gray-700"
                    onClick={handleDrawerToggle}
                >
                    <CloseIcon />
                </button>
            </div>
            <div className="border-t border-gray-200 opacity-50"></div>
            <div className="px-6 mb-2">
                <p className="text-xs font-bold text-gray-500 uppercase">Menu Utama</p>
            </div>

            <div className="flex-1 px-4">
                <button
                    className={`w-full flex items-center p-3 ${getMenuItemStyle(true)}`}
                    onClick={() => router.push('/dashboard')}
                >
                    <DashboardIcon className="mr-3" />
                    <span>Dashboard</span>
                </button>

                <button
                    className={`w-full flex items-center p-3 ${getMenuItemStyle(false)}`}
                    onClick={() => router.push('/booking')}
                >
                    <EventAvailable className="mr-3" />
                    <span>Pesan Lapangan</span>
                </button>

                <div className="px-3 mt-8 mb-2">
                    <p className="text-xs font-bold text-gray-500 uppercase">Akun</p>
                </div>

                <button
                    className={`w-full flex items-center p-3 ${getMenuItemStyle(false)}`}
                    onClick={() => router.push('/profile')}
                >
                    <AccountCircle className="mr-3" />
                    <span>Profil Saya</span>
                </button>

                <button
                    className={`w-full flex items-center p-3 ${getMenuItemStyle(false)}`}
                    onClick={() => router.push('/settings')}
                >
                    <Settings className="mr-3" />
                    <span>Pengaturan</span>
                </button>
            </div>

            <div className="p-6">
                <button
                    className="w-full bg-[#F8F7FA] text-[#7367F0] rounded-lg py-2 px-4 flex items-center justify-center hover:bg-[#7367F0] hover:text-white transition-colors"
                    onClick={() => logout()}
                >
                    <LogoutIcon className="mr-2" />
                    Logout
                </button>
            </div>
        </div>
    );

    if (authLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#F4F5FA]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7367F0]"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="flex bg-[#F4F5FA] min-h-screen">
            {/* App Bar */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm shadow-[rgba(115,103,240,0.1)]">
                <div className="flex items-center h-16 px-4">
                    <button
                        className="mr-4 text-gray-500 sm:hidden hover:text-gray-700"
                        onClick={handleDrawerToggle}
                    >
                        <MenuIcon />
                    </button>
                    <h1 className="flex-grow hidden text-lg font-semibold sm:block">Dashboard User</h1>

                    {/* Search Bar */}
                    <div className="flex-grow hidden max-w-md mx-4 md:flex">
                        <div className="flex items-center p-2 rounded-full bg-[#F4F5FA] w-full">
                            <Search className="mx-1 text-gray-500" />
                            <input
                                className="w-full text-sm bg-transparent border-none outline-none"
                                placeholder="Cari..."
                            />
                        </div>
                    </div>

                    {/* Icons */}
                    <div className="flex items-center">
                        <button className="text-gray-500 hover:text-gray-700">
                            <LightMode />
                        </button>

                        <button
                            className="ml-2 text-gray-500 hover:text-gray-700"
                            onClick={handleNotificationOpen}
                        >
                            <div className="relative">
                                <Notifications />
                                <span className="absolute flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full -top-1 -right-1">
                                    3
                                </span>
                            </div>
                        </button>

                        {/* Notifications Menu */}
                        {notificationAnchorEl && (
                            <div className="absolute right-0 z-50 mt-12 origin-top-right bg-white rounded-md shadow-lg w-80">
                                <div className="p-4 border-b border-gray-200">
                                    <h3 className="font-bold">Notifikasi</h3>
                                    <p className="text-xs text-gray-500">Anda memiliki 3 pesan baru</p>
                                </div>
                                <div className="py-1">
                                    <button
                                        className="block w-full px-4 py-2 text-left hover:bg-gray-100"
                                        onClick={handleNotificationClose}
                                    >
                                        <p className="font-medium">Pembayaran Diterima</p>
                                        <p className="text-xs text-gray-500">Pembayaran untuk pesanan #123 telah dikonfirmasi</p>
                                    </button>
                                    {/* More menu items... */}
                                </div>
                                <div className="p-2 text-center border-t border-gray-200">
                                    <button className="text-sm text-[#7367F0]">Lihat Semua</button>
                                </div>
                            </div>
                        )}

                        {/* Profile */}
                        <button
                            className="flex items-center ml-3 hover:opacity-90"
                            onClick={handleProfileOpen}
                        >
                            <div className="flex items-center justify-center w-10 h-10 text-purple-600 bg-purple-100 rounded-full">
                                {user?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="hidden ml-2 sm:block">
                                <p className="text-sm font-medium">{user?.name || 'User'}</p>
                                <p className="text-xs text-gray-500">{user?.role || 'Pelanggan'}</p>
                            </div>
                        </button>

                        {/* Profile Menu */}
                        {profileAnchorEl && (
                            <div className="absolute right-0 z-50 w-56 mt-12 origin-top-right bg-white rounded-md shadow-lg">
                                <div className="p-4 border-b border-gray-200">
                                    <h3 className="font-bold">{user?.name || 'User'}</h3>
                                    <p className="text-xs text-gray-500">{user?.email || 'email@example.com'}</p>
                                </div>
                                <div className="py-1">
                                    <button
                                        className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
                                        onClick={() => { handleProfileClose(); router.push('/profile'); }}
                                    >
                                        <AccountCircle fontSize="small" className="mr-2" />
                                        <span>Profil Saya</span>
                                    </button>
                                    {/* More menu items... */}
                                </div>
                                <div className="py-1 border-t border-gray-200">
                                    <button
                                        className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100"
                                        onClick={() => { handleProfileClose(); logout(); }}
                                    >
                                        <LogoutIcon fontSize="small" className="mr-2" />
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Side Drawer - Mobile */}
            <div className={`fixed inset-0 z-40 sm:hidden ${mobileOpen ? 'block' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={handleDrawerToggle}></div>
                <div className="relative flex flex-col w-64 h-full bg-white shadow-xl">
                    {drawer}
                </div>
            </div>

            {/* Side Drawer - Desktop */}
            <aside className="fixed flex-col hidden w-64 h-full bg-white shadow-sm sm:flex">
                {drawer}
            </aside>

            {/* Main Content */}
            <main className={`flex-1 p-6 ${drawerWidth ? `sm:ml-64` : ''} mt-16`}>
                {/* Welcome Card */}
                <div className="mb-6 rounded-xl bg-gradient-to-r from-[#7367F0] to-[#9e95f5] text-white relative overflow-hidden">
                    <div className="relative z-10 flex items-center h-full p-6 sm:p-8">
                        <div className="w-full md:w-8/12">
                            <h1 className="mb-4 text-2xl font-bold leading-tight sm:text-3xl">
                                Selamat Datang, {user?.name || 'Pelanggan'}!
                            </h1>
                            <p className="mb-4 opacity-90 text-sm sm:text-base max-w-[90%]">
                                Kelola semua pesanan lapangan Anda di satu tempat. Anda memiliki{' '}
                                <span className="font-bold">
                                    {filteredBookings.filter(booking => booking?.status?.toLowerCase() === 'dikonfirmasi').length || 0}
                                </span>{' '}
                                pesanan aktif saat ini.
                            </p>
                            <button
                                className="bg-white text-[#7367F0] font-bold py-2 px-6 rounded-lg shadow-md hover:bg-opacity-90 hover:-translate-y-0.5 transition-all text-sm"
                                onClick={() => router.push('/booking')}
                            >
                                Pesan Lapangan
                            </button>
                        </div>
                    </div>
                    {/* Decorative elements */}
                    <div className="absolute w-48 h-48 bg-white rounded-full -right-5 -bottom-8 bg-opacity-10"></div>
                    <div className="absolute w-24 h-24 bg-white rounded-full right-10 -top-12 bg-opacity-10"></div>
                </div>

                {/* Statistics Cards */}
                <h2 className="mb-4 text-xl font-bold">Ringkasan</h2>
                <div className="grid grid-cols-1 gap-4 mb-6 sm:grid-cols-2 md:grid-cols-3">
                    {/* Active Bookings Card */}
                    <div className="overflow-hidden transition-shadow bg-white shadow-sm rounded-xl hover:shadow-md hover:-translate-y-1">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500">Pesanan Aktif</p>
                                    <h3 className="my-2 text-2xl font-bold">
                                        {filteredBookings.filter(b => b?.status?.toLowerCase() === 'dikonfirmasi').length || 0}
                                    </h3>
                                    <p className="text-xs text-gray-500">Jadwal terkonfirmasi</p>
                                </div>
                                <div className="flex items-center justify-center ml-3 text-purple-600 bg-purple-100 rounded-full w-14 h-14">
                                    <EventAvailable />
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-200"></div>
                        <button
                            className="flex items-center justify-between w-full p-3 hover:bg-gray-50"
                            onClick={() => router.push('/bookings/active')}
                        >
                            <span className="text-sm font-medium text-[#7367F0]">Lihat Semua</span>
                            <ChevronRight className="text-[#7367F0]" fontSize="small" />
                        </button>
                    </div>

                    {/* Pending Payments Card */}
                    <div className="overflow-hidden transition-shadow bg-white shadow-sm rounded-xl hover:shadow-md hover:-translate-y-1">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500">Menunggu Pembayaran</p>
                                    <h3 className="my-2 text-2xl font-bold">
                                        {filteredBookings.filter(b => b?.status?.toLowerCase() === 'menunggu pembayaran').length || 0}
                                    </h3>
                                    <p className="text-xs text-yellow-600">Perlu segera dibayar</p>
                                </div>
                                <div className="flex items-center justify-center ml-3 text-yellow-600 bg-yellow-100 rounded-full w-14 h-14">
                                    <MonetizationOn />
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-200"></div>
                        <button
                            className="flex items-center justify-between w-full p-3 hover:bg-gray-50"
                            onClick={() => router.push('/bookings/pending')}
                        >
                            <span className="text-sm font-medium text-[#7367F0]">Lihat Semua</span>
                            <ChevronRight className="text-[#7367F0]" fontSize="small" />
                        </button>
                    </div>

                    {/* History Card */}
                    <div className="overflow-hidden transition-shadow bg-white shadow-sm rounded-xl hover:shadow-md hover:-translate-y-1">
                        <div className="p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <p className="text-sm text-gray-500">Total Riwayat</p>
                                    <h3 className="my-2 text-2xl font-bold">{bookings.length || 0}</h3>
                                    <p className="text-xs text-gray-500">Semua pesanan Anda</p>
                                </div>
                                <div className="flex items-center justify-center ml-3 text-green-600 bg-green-100 rounded-full w-14 h-14">
                                    <History />
                                </div>
                            </div>
                        </div>
                        <div className="border-t border-gray-200"></div>
                        <button
                            className="flex items-center justify-between w-full p-3 hover:bg-gray-50"
                            onClick={() => router.push('/bookings/history')}
                        >
                            <span className="text-sm font-medium text-[#7367F0]">Lihat Riwayat</span>
                            <ChevronRight className="text-[#7367F0]" fontSize="small" />
                        </button>
                    </div>
                </div>

                {/* Bookings Section */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold">Daftar Pesanan</h2>
                        <div className="flex border-b border-gray-200">
                            <button
                                className={`flex items-center px-4 py-3 ${activeTab === 0 ? 'text-[#7367F0] border-b-2 border-[#7367F0]' : 'text-gray-500'}`}
                                onClick={() => setActiveTab(0)}
                            >
                                <CalendarMonth className="mr-2" />
                                <span>Mendatang</span>
                            </button>
                            <button
                                className={`flex items-center px-4 py-3 ${activeTab === 1 ? 'text-[#7367F0] border-b-2 border-[#7367F0]' : 'text-gray-500'}`}
                                onClick={() => setActiveTab(1)}
                            >
                                <History className="mr-2" />
                                <span>Riwayat</span>
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center mt-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#7367F0]"></div>
                        </div>
                    ) : error ? (
                        <div className="p-4 mb-4 text-red-700 bg-red-100 border-l-4 border-red-500">
                            <p>{error}</p>
                        </div>
                    ) : filteredBookings.length === 0 ? (
                        <div className="p-8 text-center bg-white rounded-xl">
                            <p className="text-gray-500">
                                {activeTab === 0 ? 'Tidak ada pesanan mendatang' : 'Belum ada riwayat pesanan'}
                            </p>
                            <button
                                className="mt-4 bg-[#7367F0] text-white py-2 px-4 rounded hover:bg-[#5d52d1] transition-colors"
                                onClick={() => router.push('/booking')}
                            >
                                Buat Pesanan Baru
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {filteredBookings.map((booking, index) => (
                                <div key={index} className="overflow-hidden transition-shadow bg-white shadow-sm rounded-xl hover:shadow-md">
                                    <div className="p-6">
                                        <div className="flex items-start justify-between mb-4">
                                            <div>
                                                <h3 className="font-bold">{booking.fieldName || 'Lapangan Tidak Diketahui'}</h3>
                                                <p className="text-sm text-gray-500">Kode Booking: #{booking.bookingCode || 'N/A'}</p>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(booking.status)}`}>
                                                {booking.status || 'Status Tidak Diketahui'}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 mt-4 sm:grid-cols-2 md:grid-cols-4">
                                            {/* Date */}
                                            <div className="flex items-center">
                                                <Schedule className="text-[#7367F0] mr-2" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Tanggal</p>
                                                    <p>
                                                        {new Date(booking.date).toLocaleDateString('id-ID', {
                                                            weekday: 'long',
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Time */}
                                            <div className="flex items-center">
                                                <Schedule className="text-[#7367F0] mr-2" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Jam</p>
                                                    <p>{booking.startTime} - {booking.endTime}</p>
                                                </div>
                                            </div>

                                            {/* Location */}
                                            <div className="flex items-center">
                                                <Place className="text-[#7367F0] mr-2" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Lokasi</p>
                                                    <p>{booking.location || 'Lokasi Tidak Diketahui'}</p>
                                                </div>
                                            </div>

                                            {/* Total */}
                                            <div className="flex items-center">
                                                <MonetizationOn className="text-[#7367F0] mr-2" />
                                                <div>
                                                    <p className="text-xs text-gray-500">Total</p>
                                                    <p className="font-bold">
                                                        {new Intl.NumberFormat('id-ID', {
                                                            style: 'currency',
                                                            currency: 'IDR'
                                                        }).format(booking.totalPrice || 0)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="border-t border-gray-200"></div>
                                    <div className="flex justify-end p-4 space-x-2">
                                        <button
                                            className="border border-[#7367F0] text-[#7367F0] px-3 py-1 rounded text-sm hover:bg-[#7367F0] hover:text-white transition-colors"
                                            onClick={() => router.push(`/bookings/${booking._id}`)}
                                        >
                                            Detail
                                        </button>
                                        {booking.status?.toLowerCase() === 'menunggu pembayaran' && (
                                            <button
                                                className="bg-[#7367F0] text-white px-3 py-1 rounded text-sm hover:bg-[#5d52d1] transition-colors"
                                                onClick={() => router.push(`/payment/${booking._id}`)}
                                            >
                                                Bayar Sekarang
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}