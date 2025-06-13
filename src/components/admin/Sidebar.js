'use client'

import { useState } from 'react'
import {
    Box,
    Drawer,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Divider,
    Typography,
    Avatar,
    Collapse
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import SportsIcon from '@mui/icons-material/Sports'
import PeopleIcon from '@mui/icons-material/People'
import ReceiptIcon from '@mui/icons-material/Receipt'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import CategoryIcon from '@mui/icons-material/Category'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import PaymentIcon from '@mui/icons-material/Payment'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

const drawerWidth = 280

const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { text: 'Booking', icon: <CalendarMonthIcon />, path: '/admin/booking' },
    { text: 'Lapangan', icon: <SportsIcon />, path: '/admin/lapangan' },
    { text: 'Kategori Lapangan', icon: <CategoryIcon />, path: '/admin/kategori' },
    { text: 'Pelanggan', icon: <PeopleIcon />, path: '/admin/pelanggan' },
    { text: 'Pembayaran', icon: <PaymentIcon />, path: '/admin/pembayaran' },
    { text: 'Jadwal & Sesi', icon: <AccessTimeIcon />, path: '/admin/jadwal' },
    { text: 'Fasilitas', icon: <MeetingRoomIcon />, path: '/admin/fasilitas' },
    // { text: 'Status Lapangan', icon: <EventAvailableIcon />, path: '/admin/status_lapangan' },
]

export default function Sidebar() {
    const pathname = usePathname()
    const { logout } = useAuth()

    const handleLogout = async () => {
        console.log('Admin logout diklik')
        try {
            await logout()
            console.log('Admin berhasil logout')
        } catch (error) {
            console.error('Error saat logout admin:', error)
        }
    }

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    borderRight: '0px',
                    boxShadow: '0px 0px 20px rgba(115, 103, 240, 0.3)',
                    backgroundColor: '#1a1a2e',
                    color: '#fff'
                },
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Toolbar sx={{ px: [1], py: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                        <Image 
                            src="/images/SIGMA.svg"
                            alt="SIGMA Logo"
                            width={120}
                            height={40}
                            style={{ filter: 'brightness(0) invert(1)' }}
                        />
                    </Box>
                </Toolbar>

                <Box sx={{ p: 2, pl: 4, display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: '#7367f0' }}>A</Avatar>
                    <Box sx={{ ml: 2 }}>
                        <Typography variant="subtitle1" component="div" sx={{ fontWeight: 600, color: '#fff' }}>Admin</Typography>
                        <Typography variant="body2" component="div" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Administrator</Typography>
                    </Box>
                </Box>

                <List sx={{ flex: 1, px: 2, py: 1 }}>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                component={Link}
                                href={item.path}
                                sx={{
                                    borderRadius: '8px',
                                    backgroundColor: pathname === item.path ? 'rgba(115, 103, 240, 0.2)' : 'transparent',
                                    color: pathname === item.path ? '#7367f0' : 'rgba(255, 255, 255, 0.7)',
                                    '&:hover': {
                                        backgroundColor: 'rgba(115, 103, 240, 0.1)',
                                        color: '#7367f0'
                                    }
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: pathname === item.path ? '#7367f0' : 'rgba(255, 255, 255, 0.7)',
                                        minWidth: '40px'
                                    }}
                                >
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Typography component="span">
                                            {item.text}
                                        </Typography>
                                    }
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>

                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />
                <List sx={{ px: 2, py: 1 }}>
                    <ListItem disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            onClick={handleLogout}
                            sx={{
                                borderRadius: '8px',
                                color: 'rgba(255, 255, 255, 0.7)',
                                '&:hover': {
                                    backgroundColor: 'rgba(115, 103, 240, 0.1)',
                                    color: '#7367f0'
                                }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: '40px', color: 'inherit' }}>
                                <LogoutIcon />
                            </ListItemIcon>
                            <ListItemText
                                primary={
                                    <Typography component="span">
                                        Logout
                                    </Typography>
                                }
                            />
                        </ListItemButton>
                    </ListItem>
                </List>
            </Box>
        </Drawer>
    )
} 