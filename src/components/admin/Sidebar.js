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
    Avatar
} from '@mui/material'
import DashboardIcon from '@mui/icons-material/Dashboard'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import SportsIcon from '@mui/icons-material/Sports'
import PeopleIcon from '@mui/icons-material/People'
import ReceiptIcon from '@mui/icons-material/Receipt'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const drawerWidth = 280

const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin' },
    { text: 'Booking', icon: <CalendarMonthIcon />, path: '/admin/booking' },
    { text: 'Lapangan', icon: <SportsIcon />, path: '/admin/lapangan' },
    { text: 'Pelanggan', icon: <PeopleIcon />, path: '/admin/pelanggan' },
    { text: 'Transaksi', icon: <ReceiptIcon />, path: '/admin/transaksi' },
    { text: 'Pengaturan', icon: <SettingsIcon />, path: '/admin/pengaturan' },
]

export default function Sidebar() {
    const pathname = usePathname()
    
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
            <Toolbar sx={{ px: [1], py: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                <Typography variant="h5" component="div" sx={{ fontWeight: 700, color: theme => theme.palette.primary.main }}>
                SportCenter
                </Typography>
            </Box>
            </Toolbar>
            <Divider />
            
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ bgcolor: theme => theme.palette.primary.main }}>A</Avatar>
            <Box sx={{ ml: 2 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Admin</Typography>
                <Typography variant="body2" color="textSecondary">Administrator</Typography>
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
                    <ListItemText primary={item.text} />
                </ListItemButton>
                </ListItem>
            ))}
            </List>
            
            <Divider />
            <List sx={{ px: 2, py: 1 }}>
            <ListItem disablePadding sx={{ mb: 1 }}>
                <ListItemButton 
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
                <ListItemText primary="Logout" />
                </ListItemButton>
            </ListItem>
            </List>
        </Box>
        </Drawer>
    )
} 