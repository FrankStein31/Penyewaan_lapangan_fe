'use client'

import { useState } from 'react'
import { 
    Box, 
    Card, 
    CardContent, 
    Grid, 
    Typography, 
    Toolbar,
    Paper,
    LinearProgress,
    Divider,
    Avatar,
    List,
    ListItem,
    ListItemText,
    ListItemAvatar
} from '@mui/material'
import Sidebar from '@/components/admin/Sidebar'
import Topbar from '@/components/admin/Topbar'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import PersonIcon from '@mui/icons-material/Person'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball'
import AttachMoneyIcon from '@mui/icons-material/AttachMoney'

export default function AdminDashboard() {
    const stats = [
        { 
        title: 'Total Booking', 
        value: '425', 
        icon: <CalendarTodayIcon />, 
        color: '#7367f0',
        bgColor: '#7367f01a',
        change: '+42%'
        },
        { 
        title: 'Total Pelanggan', 
        value: '145', 
        icon: <PersonIcon />, 
        color: '#00cfe8',
        bgColor: '#00cfe81a',
        change: '+12%'
        },
        { 
        title: 'Lapangan Aktif', 
        value: '8', 
        icon: <SportsBasketballIcon />, 
        color: '#ea5455',
        bgColor: '#ea54551a',
        change: '+0%'
        },
        { 
        title: 'Pendapatan', 
        value: 'Rp 12.5 jt', 
        icon: <AttachMoneyIcon />, 
        color: '#28c76f',
        bgColor: '#28c76f1a',
        change: '+18%'
        }
    ]

    const bookingData = [
        {name: 'Lapangan Basket', value: 40, color: '#7367f0'},
        {name: 'Lapangan Futsal', value: 30, color: '#00cfe8'},
        {name: 'Lapangan Badminton', value: 15, color: '#ea5455'},
        {name: 'Lapangan Tenis', value: 15, color: '#28c76f'},
    ]

    const recentBookings = [
        {id: 1, name: 'Ahmad Zaky', field: 'Lapangan Basket', time: '14:00 - 16:00', date: '22 Mar 2023', status: 'Selesai', statusColor: '#28c76f'},
        {id: 2, name: 'Budi Santoso', field: 'Lapangan Futsal', time: '18:00 - 20:00', date: '21 Mar 2023', status: 'Aktif', statusColor: '#7367f0'},
        {id: 3, name: 'Citra Dewi', field: 'Lapangan Badminton', time: '09:00 - 11:00', date: '20 Mar 2023', status: 'Batal', statusColor: '#ea5455'},
        {id: 4, name: 'Dedi Kurniawan', field: 'Lapangan Tenis', time: '16:00 - 18:00', date: '19 Mar 2023', status: 'Selesai', statusColor: '#28c76f'},
        {id: 5, name: 'Eko Prasetyo', field: 'Lapangan Basket', time: '20:00 - 22:00', date: '18 Mar 2023', status: 'Selesai', statusColor: '#28c76f'},
    ]

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
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 3 }}>
                Dashboard
            </Typography>
            
            <Grid container spacing={3}>
                {stats.map(stat => (
                <Grid item xs={12} sm={6} md={3} key={stat.title}>
                    <Card elevation={0} sx={{ height: '100%' }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <Box>
                            <Typography color="textSecondary" variant="body2" gutterBottom>
                            {stat.title}
                            </Typography>
                            <Typography variant="h4" component="div" sx={{ fontWeight: 600 }}>
                            {stat.value}
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
                        <Typography variant="body2" sx={{ color: '#28c76f' }}>
                            {stat.change}
                        </Typography>
                        <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                            Dibanding bulan lalu
                        </Typography>
                        </Box>
                    </CardContent>
                    </Card>
                </Grid>
                ))}
                
                <Grid item xs={12} md={8}>
                <Card elevation={0} sx={{ height: '100%' }}>
                    <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        Analisis Booking
                    </Typography>
                    
                    <Box sx={{ mt: 3 }}>
                        {bookingData.map(item => (
                        <Box key={item.name} sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body2">{item.name}</Typography>
                            <Typography variant="body2">{item.value}%</Typography>
                            </Box>
                            <LinearProgress 
                            variant="determinate" 
                            value={item.value} 
                            sx={{ 
                                height: 8, 
                                borderRadius: 5,
                                backgroundColor: '#f0f0f0',
                                '& .MuiLinearProgress-bar': {
                                backgroundColor: item.color,
                                }
                            }} 
                            />
                        </Box>
                        ))}
                    </Box>
                    
                    <Box sx={{ mt: 3 }}>
                        <Typography variant="body2" color="textSecondary">
                        * Data ini berdasarkan total booking dalam 30 hari terakhir
                        </Typography>
                    </Box>
                    </CardContent>
                </Card>
                </Grid>
                
                <Grid item xs={12} md={4}>
                <Card elevation={0} sx={{ height: '100%' }}>
                    <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
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
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600 }}>
                        24
                        </Typography>
                        <Typography variant="body1">
                        Maret 2023
                        </Typography>
                    </Box>
                    
                    <Typography variant="subtitle2" gutterBottom sx={{ mt: 3 }}>
                        Hari ini ada 5 booking
                    </Typography>
                    
                    <Box sx={{ p: 2, bgcolor: '#f8f8f8', borderRadius: 2, mt: 1 }}>
                        <Typography variant="body2" gutterBottom>
                        10:00 - 12:00
                        </Typography>
                        <Typography variant="subtitle2">
                        Lapangan Basket (Tim Hoops)
                        </Typography>
                    </Box>
                    
                    <Box sx={{ p: 2, bgcolor: '#f8f8f8', borderRadius: 2, mt: 1 }}>
                        <Typography variant="body2" gutterBottom>
                        15:00 - 17:00
                        </Typography>
                        <Typography variant="subtitle2">
                        Lapangan Futsal (Bintang FC)
                        </Typography>
                    </Box>
                    </CardContent>
                </Card>
                </Grid>
                
                <Grid item xs={12}>
                <Card elevation={0}>
                    <CardContent>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                        Booking Terbaru
                    </Typography>
                    
                    <Box sx={{ mt: 2 }}>
                        <List>
                        {recentBookings.map((booking, index) => (
                            <Box key={booking.id}>
                            <ListItem sx={{ px: 0 }}>
                                <ListItemAvatar>
                                <Avatar sx={{ bgcolor: '#f0f0f0', color: '#7367f0' }}>
                                    {booking.name.charAt(0)}
                                </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                primary={
                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between' }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                        {booking.name}
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
                                            bgcolor: `${booking.statusColor}1a`,
                                            color: booking.statusColor,
                                            fontWeight: 600
                                        }}
                                        >
                                        {booking.status}
                                        </Typography>
                                    </Box>
                                    </Box>
                                }
                                secondary={
                                    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, mt: 0.5 }}>
                                    <Typography variant="body2" color="textSecondary">
                                        {booking.field} • {booking.time}
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        color="textSecondary" 
                                        sx={{ ml: { xs: 0, sm: 2 } }}
                                    >
                                        {booking.date}
                                    </Typography>
                                    </Box>
                                }
                                />
                            </ListItem>
                            {index < recentBookings.length - 1 && <Divider variant="inset" component="li" />}
                            </Box>
                        ))}
                        </List>
                    </Box>
                    </CardContent>
                </Card>
                </Grid>
            </Grid>
            </Box>
        </Box>
        </>
    )
} 