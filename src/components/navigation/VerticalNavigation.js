import { Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material'
import { Dashboard, SportsCricket, BookOnline } from '@mui/icons-material'
import { useRouter } from 'next/router'

const VerticalNavigation = () => {
    const router = useRouter()
    
    const menuItems = [
        { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
        { text: 'Lapangan', icon: <SportsCricket />, path: '/lapangan' },
        { text: 'Pemesanan', icon: <BookOnline />, path: '/pemesanan' }
    ]

    return (
        <Drawer variant="permanent">
        <List>
            {menuItems.map((item) => (
            <ListItem 
                button 
                key={item.text}
                onClick={() => router.push(item.path)}
                selected={router.pathname === item.path}
            >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
            </ListItem>
            ))}
        </List>
        </Drawer>
    )
}

export default VerticalNavigation 