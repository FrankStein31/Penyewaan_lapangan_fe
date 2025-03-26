import { Box } from '@mui/material'
import VerticalNavigation from '@/components/navigation/VerticalNavigation'
import AppBar from '@/components/AppBar'

const UserLayout = ({ children }) => {
    return (
        <Box sx={{ display: 'flex' }}>
        <VerticalNavigation />
        <Box sx={{ flexGrow: 1 }}>
            <AppBar />
            <Box component="main" sx={{ p: 3 }}>
            {children}
            </Box>
        </Box>
        </Box>
    )
}

export default UserLayout 