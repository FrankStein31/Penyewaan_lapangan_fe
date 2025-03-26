import { createContext, useState, useEffect, useContext } from 'react'
import axiosInstance from '@/configs/axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        try {
        const token = localStorage.getItem('token')
        if (token) {
            const response = await axiosInstance.get('/user')
            setUser(response.data)
        }
        } catch (error) {
        localStorage.removeItem('token')
        } finally {
        setLoading(false) 
        }
    }

    const login = async (credentials) => {
        const response = await axiosInstance.post('/login', credentials)
        localStorage.setItem('token', response.data.token)
        setUser(response.data.user)
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
        {children}
        </AuthContext.Provider>
    )
}

// Export hook untuk menggunakan auth context
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
} 