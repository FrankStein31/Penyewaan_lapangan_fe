'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Box,
    Badge,
    Avatar,
    Menu,
    MenuItem,
    InputBase,
    alpha,
    Button
} from '@mui/material'
import NotificationsIcon from '@mui/icons-material/Notifications'
import SearchIcon from '@mui/icons-material/Search'
import { styled } from '@mui/material/styles'

const drawerWidth = 280

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.black, 0.04),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.black, 0.06),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
    },
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: alpha(theme.palette.common.black, 0.54),
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
}))

export default function Topbar({ title = "Dashboard" }) {
    const [anchorEl, setAnchorEl] = useState(null)
    const isMenuOpen = Boolean(anchorEl)
    const { logout, user } = useAuth()
    const router = useRouter()

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
    }
    
    const handleLogout = () => {
        logout()
        setAnchorEl(null)
    }

    const menuId = 'primary-search-account-menu'
    const renderMenu = (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
            }}
            id={menuId}
            keepMounted
            transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            open={isMenuOpen}
            onClose={handleMenuClose}
        >
            <MenuItem onClick={() => {
                handleMenuClose();
                router.push('/profile');
            }}>
                <Typography component="span">Profil</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
                <Typography component="span">Logout</Typography>
            </MenuItem>
        </Menu>
    )

    return (
        <>
            <AppBar
                position="fixed"
                elevation={0}
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    backgroundColor: 'white',
                    color: 'text.primary',
                    borderBottom: '1px solid #f0f0f0'
                }}
            >
                <Toolbar>
                    <Typography variant="h6" component="div" noWrap sx={{ display: { xs: 'none', sm: 'block' } }}>
                        {title}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: 'flex' }}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            sx={{ mr: 2 }}
                            onClick={() => router.push('/booking')}
                        >
                            Booking Lapangan
                        </Button>
                        <IconButton
                            size="large"
                            aria-label="show 5 new notifications"
                            color="inherit"
                            onClick={() => router.push('/notifications')}
                        >
                            <Badge badgeContent={5} color="primary">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="account of current user"
                            aria-controls={menuId}
                            aria-haspopup="true"
                            onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                                {user?.name?.charAt(0) || 'U'}
                            </Avatar>
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
            {renderMenu}
        </>
    )
} 