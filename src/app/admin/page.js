'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { 
    Box, 
    Card, 
    CardContent, 
    Typography, 
    Toolbar,
    Paper,
    LinearProgress,
    Divider,
    Avatar,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar,
    CircularProgress
} from '@mui/material'
import Sidebar from '@/components/admin/Sidebar'
import Topbar from '@/components/admin/Topbar'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import PersonIcon from '@mui/icons-material/Person'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'
import { fieldService, userService, bookingService, paymentService } from '@/services/api'

// Helper function untuk mengkonversi data ke string dengan aman
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

    // Mengambil data dashboard
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setIsLoading(true)
                setError(null)
                
                // Mengambil data pengguna (pelanggan)
                const usersResponse = await userService.getAll()
                console.log('Users response:', usersResponse)
                
                // Pastikan data users berupa array
                let users = []
                if (usersResponse && usersResponse.data) {
                    if (Array.isArray(usersResponse.data)) {
                        users = usersResponse.data
                    } else if (usersResponse.data.data && Array.isArray(usersResponse.data.data)) {
                        users = usersResponse.data.data
                    }
                }
                
                const customers = users.filter(user => user.role === 'customer' || user.role === 'pelanggan')
                
                // Mengambil data lapangan
                const fieldsResponse = await fieldService.getAll()
                console.log('Fields response:', fieldsResponse)
                
                // Pastikan data fields berupa array
                let fields = []
                if (fieldsResponse && fieldsResponse.data) {
                    if (Array.isArray(fieldsResponse.data)) {
                        fields = fieldsResponse.data
                    } else if (fieldsResponse.data.data && Array.isArray(fieldsResponse.data.data)) {
                        fields = fieldsResponse.data.data
                    }
                }
                
                console.log('Processed fields:', fields)
                
                // Mengambil data booking
                const bookingsResponse = await bookingService.getAll()
                console.log('Bookings response:', bookingsResponse)
                
                // Pastikan data bookings berupa array
                let bookings = []
                if (bookingsResponse && bookingsResponse.data) {
                    if (Array.isArray(bookingsResponse.data)) {
                        bookings = bookingsResponse.data
                    } else if (bookingsResponse.data.data && Array.isArray(bookingsResponse.data.data)) {
                        bookings = bookingsResponse.data.data
                    }
                }
                
                // Mengambil data pembayaran
                const paymentsResponse = await paymentService.getAll()
                
                // Pastikan data payments berupa array
                let payments = []
                if (paymentsResponse && paymentsResponse.data) {
                    if (Array.isArray(paymentsResponse.data)) {
                        payments = paymentsResponse.data
                    } else if (paymentsResponse.data.data && Array.isArray(paymentsResponse.data.data)) {
                        payments = paymentsResponse.data.data
                    }
                }
                
                // Menghitung total pendapatan
                const totalRevenue = payments.reduce((total, payment) => {
                    return total + (payment.amount || payment.jumlah || 0)
                }, 0)
                
                // Menghitung jumlah booking berdasarkan jenis lapangan
                const bookingsByFieldType = [];
                
                // Membuat objek untuk menyimpan booking berdasarkan kategori
                const bookingsByCategory = {};
                
                // Proses data lapangan dan booking
                fields.forEach(field => {
                    const categoryObj = field.kategori;
                    console.log('Field kategori raw:', field.kategori, 'Type:', typeof field.kategori)
                    
                    // Periksa apakah kategori adalah objek atau string
                    const categoryName = typeof categoryObj === 'object' && categoryObj !== null 
                        ? (categoryObj.nama_kategori || categoryObj.name || 'Lainnya') 
                        : (categoryObj || field.jenis || 'Lainnya');
                    
                    console.log('Field kategori processed:', categoryName)
                    
                    // Inisialisasi kategori jika belum ada
                    if (!bookingsByCategory[categoryName]) {
                        bookingsByCategory[categoryName] = {
                            kategoriName: categoryName,
                            jumlah: 0
                        };
                    }
                    
                    // Hitung jumlah booking untuk lapangan ini
                    const fieldBookings = bookings.filter(booking => 
                        booking.id_lapangan === field.id || booking.field_id === field.id
                    );
                    
                    // Tambahkan ke kategori
                    bookingsByCategory[categoryName].jumlah += fieldBookings.length;
                });
                
                // Konversi objek menjadi array untuk chart
                Object.values(bookingsByCategory).forEach(item => {
                    bookingsByFieldType.push(item);
                });
                
                // Mendapatkan 5 booking terbaru
                const recentBookings = bookings
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .slice(0, 5)
                    .map(booking => {
                        // Cari data pelanggan
                        const customer = users.find(u => u.id === booking.id_user || u.id === booking.user_id) || {};
                        
                        // Cari data lapangan
                        const field = fields.find(f => f.id === booking.id_lapangan || f.id === booking.field_id) || {};
                        
                        // Format data booking untuk display
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
                
                // Update state dengan data yang sudah diolah
                setDashboardData({
                    totalBookings: bookings.length,
                    totalCustomers: customers.length,
                    totalFields: fields.length,
                    totalRevenue: totalRevenue,
                    bookingsByFieldType: bookingsByFieldType,
                    recentBookings: recentBookings
                });
                
            } catch (error) {
                console.error('Error mengambil data dashboard:', error);
                setError('Gagal mendapatkan data dashboard');
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchDashboardData();
    }, []);
    
    // Helper function untuk mendapatkan warna berdasarkan kategori
    const getCategoryColor = (category) => {
        const colors = {
            'Basket': '#7367f0',
            'Futsal': '#00cfe8',
            'Badminton': '#ea5455',
            'Tenis': '#28c76f',
            'Bulu Tangkis': '#ea5455',
            'Sepak Bola': '#00cfe8',
            'Voli': '#ea5455',
            'Lainnya': '#ff9f43'
        }
        
        // Coba cocokkan kategori dengan exact match
        if (colors[category]) return colors[category]
        
        // Jika tidak ada exact match, coba cari substring match
        for (const key in colors) {
            if (category.toLowerCase().includes(key.toLowerCase())) {
                return colors[key]
            }
        }
        
        // Default color jika tidak ada yang cocok
        return '#7367f0'
    }
    
    // Helper function untuk mendapatkan warna berdasarkan status
    const getStatusColor = (status) => {
        const statusColors = {
            'Selesai': '#28c76f',
            'Dikonfirmasi': '#7367f0',
            'Ditolak': '#ea5455',
            'Menunggu': '#ff9f43',
            'Dibatalkan': '#ea5455',
            'pending': '#ff9f43',
            'confirmed': '#7367f0',
            'completed': '#28c76f',
            'cancelled': '#ea5455',
            'rejected': '#ea5455'
        }
        
        return statusColors[status] || '#7367f0'
    }
    
    // Tampilkan error state jika ada error
    if (error) {
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
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: 'calc(100vh - 64px)',
                        flexDirection: 'column',
                        p: 3
                    }}>
                        <Typography color="error" variant="h6" gutterBottom>
                            {error}
                        </Typography>
                        <Typography variant="body1">
                            Silakan refresh halaman atau coba lagi nanti.
                        </Typography>
                    </Box>
                </Box>
            </>
        )
    }

    // Tampilkan loading state
    if (isLoading) {
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
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: 'calc(100vh - 64px)' 
                    }}>
                        <CircularProgress />
                    </Box>
                </Box>
            </>
        )
    }

    // Data statistik untuk menampilkan card
    const stats = [
        { 
            title: 'Total Booking', 
            value: dashboardData.totalBookings, 
            icon: <CalendarTodayIcon />, 
            color: '#7367f0',
            bgColor: '#7367f01a',
            change: '+12%'
        },
        { 
            title: 'Total Pelanggan', 
            value: dashboardData.totalCustomers, 
            icon: <PersonIcon />, 
            color: '#00cfe8',
            bgColor: '#00cfe81a',
            change: '+8%'
        },
        { 
            title: 'Lapangan Aktif', 
            value: dashboardData.totalFields, 
            icon: <SportsBasketballIcon />, 
            color: '#ea5455',
            bgColor: '#ea54551a',
            change: '+0%'
        },
        { 
            title: 'Pendapatan', 
            value: `Rp ${formatNumber(dashboardData.totalRevenue)}`, 
            icon: <AttachMoneyIcon />, 
            color: '#28c76f',
            bgColor: '#28c76f1a',
            change: '+15%'
        }
    ]

    // Helper function untuk format angka
    function formatNumber(number) {
        if (number >= 1000000) {
            return (number / 1000000).toFixed(1) + ' jt'
        } else if (number >= 1000) {
            return (number / 1000).toFixed(1) + ' rb'
        }
        return number.toString()
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
            <Typography variant="h5" component="div" sx={{ fontWeight: 600, mb: 3 }}>
                Dashboard
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                {/* Stats Cards */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, width: '100%', mb: 3 }}>
                    {stats.map(stat => (
                    <Box key={stat.title} sx={{ flexGrow: 1, flexBasis: { xs: '100%', sm: 'calc(50% - 24px)', md: 'calc(25% - 24px)' } }}>
                        <Card elevation={0} sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                                <Typography component="div" color="textSecondary" variant="body2" gutterBottom>
                                {safeToString(stat.title)}
                                </Typography>
                                <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                                {safeToString(stat.value)}
                                </Typography>
                            </Box>
                            <Avatar
                                sx={{
                                backgroundColor: stat.bgColor,
                                color: stat.color,
                                width: 42,
                                height: 42
                                }}
                            >
                                {stat.icon}
                            </Avatar>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                            <ArrowUpwardIcon fontSize="small" sx={{ color: '#28c76f', mr: 0.5 }} />
                            <Typography component="span" variant="body2" sx={{ color: '#28c76f' }}>
                                {stat.change}
                            </Typography>
                            <Typography component="span" variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                                Dibanding bulan lalu
                            </Typography>
                            </Box>
                        </CardContent>
                        </Card>
                    </Box>
                    ))}
                </Box>
                
                {/* Main Content */}
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, width: '100%' }}>
                    {/* Left Column */}
                    <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', md: 'calc(66.666% - 12px)' } }}>
                        <Card elevation={0} sx={{ height: '100%' }}>
                            <CardContent>
                            <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 600 }}>
                                Analisis Booking
                            </Typography>
                            
                            <Box sx={{ mt: 3 }}>
                                {dashboardData.bookingsByFieldType.map((item, index) => {
                                    // Hitung persentase untuk progress bar
                                    const totalBookings = dashboardData.totalBookings || 1; // Hindari pembagian dengan 0
                                    const percentage = Math.round((item.jumlah / totalBookings) * 100);
                                    
                                    return (
                                        <Box key={index} sx={{ mb: 2 }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                <Typography component="span" variant="body2">{safeToString(item.kategoriName)}</Typography>
                                                <Typography component="span" variant="body2">{safeToString(item.jumlah)} ({percentage}%)</Typography>
                                            </Box>
                                            <LinearProgress 
                                                variant="determinate" 
                                                value={percentage} 
                                                sx={{ 
                                                    height: 8, 
                                                    borderRadius: 5,
                                                    backgroundColor: '#f0f0f0',
                                                    '& .MuiLinearProgress-bar': {
                                                        backgroundColor: getCategoryColor(safeToString(item.kategoriName)),
                                                    }
                                                }} 
                                            />
                                        </Box>
                                    );
                                })}
                            </Box>
                            
                            <Box sx={{ mt: 3 }}>
                                <Typography component="div" variant="body2" color="textSecondary">
                                * Data ini berdasarkan total booking dalam 30 hari terakhir
                                </Typography>
                            </Box>
                            </CardContent>
                        </Card>
                    </Box>
                    
                    {/* Right Column */}
                    <Box sx={{ flexGrow: 1, flexBasis: { xs: '100%', md: 'calc(33.333% - 12px)' } }}>
                        <Card elevation={0} sx={{ height: '100%' }}>
                            <CardContent>
                            <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 600 }}>
                                Kalender
                            </Typography>
                            
                            <Box sx={{ 
                                p: 2,
                                bgcolor: 'primary.main',
                                color: 'white',
                                borderRadius: 2,
                                textAlign: 'center',
                                mb: 2,
                                mt: 1
                            }}>
                                <Typography variant="h4" component="div" gutterBottom sx={{ fontWeight: 600 }}>
                                {new Date().getDate()}
                                </Typography>
                                <Typography variant="body1" component="div">
                                {new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                                </Typography>
                            </Box>
                            
                            <Typography variant="subtitle2" component="div" gutterBottom sx={{ mt: 3 }}>
                                Hari ini
                            </Typography>
                            
                            {dashboardData.recentBookings.length > 0 ? (
                                dashboardData.recentBookings.slice(0, 2).map((booking, idx) => (
                                    <Box key={idx} sx={{ p: 2, bgcolor: '#f8f8f8', borderRadius: 2, mt: 1 }}>
                                        <Typography variant="body2" component="div" gutterBottom>
                                            {safeToString(booking.time || 'Waktu tidak tersedia')}
                                        </Typography>
                                        <Typography variant="subtitle2" component="div">
                                            {safeToString(booking.field || 'Lapangan')} ({safeToString(booking.name || 'Pelanggan')})
                                        </Typography>
                                    </Box>
                                ))
                            ) : (
                                <Box sx={{ p: 2, bgcolor: '#f8f8f8', borderRadius: 2, mt: 1 }}>
                                    <Typography variant="body2" component="div" gutterBottom>
                                        Tidak ada booking hari ini
                                    </Typography>
                                </Box>
                            )}
                            </CardContent>
                        </Card>
                    </Box>
                </Box>
                
                {/* Bottom Section */}
                <Box sx={{ width: '100%', mt: 3 }}>
                    <Card elevation={0}>
                        <CardContent>
                        <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 600 }}>
                            Booking Terbaru
                        </Typography>
                        
                        <Box sx={{ mt: 2 }}>
                            <List>
                            {dashboardData.recentBookings.map((booking, index) => (
                                <Box key={index}>
                                <ListItem sx={{ px: 0 }}>
                                    <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: '#f0f0f0', color: '#7367f0' }}>
                                        {safeToString(booking.name || 'P').charAt(0)}
                                    </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between' }}>
                                        <Typography variant="subtitle2" component="span" sx={{ fontWeight: 600 }}>
                                            {safeToString(booking.name || 'Pelanggan')}
                                        </Typography>
                                        <Box>
                                            <Typography 
                                            variant="body2" 
                                            component="span" 
                                            sx={{ 
                                                px: 1.5,
                                                py: 0.5,
                                                borderRadius: 5,
                                                fontSize: '0.75rem',
                                                bgcolor: `${getStatusColor(safeToString(booking.status))}1a`,
                                                color: getStatusColor(safeToString(booking.status)),
                                                fontWeight: 600
                                            }}
                                            >
                                            {safeToString(booking.status || 'Menunggu')}
                                            </Typography>
                                        </Box>
                                        </Box>
                                    }
                                    secondary={
                                        <Box component="span" sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, mt: 0.5 }}>
                                        <Typography component="span" variant="body2" color="textSecondary">
                                            {safeToString(booking.field || 'Lapangan')} • {safeToString(booking.time || 'Waktu tidak tersedia')}
                                        </Typography>
                                        <Typography 
                                            component="span"
                                            variant="body2" 
                                            color="textSecondary" 
                                            sx={{ ml: { xs: 0, sm: 2 } }}
                                        >
                                            {safeToString(booking.date || '-')}
                                        </Typography>
                                        </Box>
                                    }
                                    />
                                </ListItem>
                                {index < dashboardData.recentBookings.length - 1 && <Divider variant="inset" component="li" />}
                                </Box>
                            ))}
                            </List>
                        </Box>
                        </CardContent>
                    </Card>
                </Box>
            </Box>
            </Box>
        </Box>
        </>
    )
}