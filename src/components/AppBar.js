import { AppBar as MuiAppBar, Toolbar, Typography, IconButton } from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'

const AppBar = () => {
    return (
        <MuiAppBar position="static">
        <Toolbar>
            <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            >
            <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Penyewaan Lapangan
            </Typography>
        </Toolbar>
        </MuiAppBar>
    )
}

export default AppBar
