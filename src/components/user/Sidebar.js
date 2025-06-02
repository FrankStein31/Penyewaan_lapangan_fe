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
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import ReceiptIcon from '@mui/icons-material/Receipt'
import LogoutIcon from '@mui/icons-material/Logout'
import HistoryIcon from '@mui/icons-material/History'
import NotificationsIcon from '@mui/icons-material/Notifications'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

const drawerWidth = 280

const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
    { text: 'Booking Lapangan', icon: <CalendarMonthIcon />, path: '/booking' },
    { text: 'Histori Booking', icon: <HistoryIcon />, path: '/history' },
    { text: 'Notifikasi', icon: <NotificationsIcon />, path: '/notifications' },
    { text: 'Pembayaran', icon: <ReceiptIcon />, path: '/payments' },
    { text: 'Profil', icon: <AccountCircleIcon />, path: '/profile' },
]

export default function Sidebar() {
    const pathname = usePathname()
    const { logout, user } = useAuth()

    const handleLogout = async () => {
        console.log('User logout diklik')
        try {
            await logout()
            console.log('User berhasil logout')
        } catch (error) {
            console.error('Error saat logout user:', error)
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
                    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'white'
                },
            }}
        >
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Toolbar sx={{ pl: 15, py: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'left', width: '100%' }}>
                        <Image 
                            src="/images/SIGMA.svg"
                            alt="SIGMA Logo"
                            width={160}
                            height={40}
                            style={{ filter: 'invert(50%) sepia(98%) saturate(2000%) hue-rotate(228deg) brightness(70%) contrast(150%)' }}
                        />
                    </Box>
                </Toolbar>
                <Divider />

                <Box sx={{ pt: 2, pl: 3, display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: theme => theme.palette.primary.main }}>
                        {user?.name?.charAt(0) || 'U'}
                    </Avatar>
                    <Box sx={{ ml: 2 }}>
                        <Typography variant="subtitle1" component="div" sx={{ fontWeight: 600 }}>
                            {user?.name || 'User'}
                        </Typography>
                        <Typography variant="body2" component="div" color="textSecondary">
                            {user?.email || 'user@example.com'}
                        </Typography>
                    </Box>
                </Box>

                <Divider />

                <List sx={{ flex: 1, px: 2, py: 1 }}>
                    {menuItems.map((item) => (
                        <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                            <ListItemButton
                                component={Link}
                                href={item.path}
                                sx={{
                                    borderRadius: '8px',
                                    backgroundColor: pathname === item.path ? 'rgba(115, 103, 240, 0.1)' : 'transparent',
                                    color: pathname === item.path ? 'primary.main' : 'inherit',
                                    '&:hover': {
                                        backgroundColor: 'rgba(115, 103, 240, 0.05)',
                                    }
                                }}
                            >
                                <ListItemIcon
                                    sx={{
                                        color: pathname === item.path ? 'primary.main' : 'inherit',
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

                <Divider />
                <List sx={{ px: 2, py: 1 }}>
                    <ListItem disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            onClick={handleLogout}
                            sx={{
                                borderRadius: '8px',
                                '&:hover': {
                                    backgroundColor: 'rgba(115, 103, 240, 0.05)',
                                }
                            }}
                        >
                            <ListItemIcon sx={{ minWidth: '40px' }}>
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