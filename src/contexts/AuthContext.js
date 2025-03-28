'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authChecked, setAuthChecked] = useState(false);
    const router = useRouter();

    // Memeriksa apakah pengguna sudah login saat aplikasi pertama kali dimuat
    useEffect(() => {
        // Hindari pemeriksaan berulang jika sudah dilakukan
        if (authChecked) return;

        const checkAuth = async () => {
            try {
                setLoading(true);
                // Coba mendapatkan data user dari API
                const response = await authService.getUser();
                if (response.data) {
                    setUser(response.data);
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Not authenticated:', error);
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
                setAuthChecked(true);
            }
        };

        // Cek jika URL saat ini adalah login atau register, jangan lakukan pemeriksaan otomatis
        if (typeof window !== 'undefined') {
            const currentPath = window.location.pathname;
            if (currentPath === '/login' || currentPath === '/register') {
                setLoading(false);
                setAuthChecked(true);
                return;
            }
            checkAuth();
        }
    }, [authChecked]);

    // Fungsi untuk login
    const login = async (email, password) => {
        try {
            setLoading(true);
            setError(null);
            
            // Login menggunakan credentials
            const response = await authService.login({ email, password });
            console.log('Login response:', response);
            
            if (response.data && response.data.success) {
                // Simpan user data
                const userData = response.data.data;
                setUser(userData);
                setIsAuthenticated(true);
                
                // Redirect berdasarkan role
                if (userData.role === 'admin') {
                    router.push('/admin');
                } else {
                    router.push('/dashboard');
                }
                
                return response.data;
            } else {
                throw new Error('Login gagal. Data tidak valid.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError(error.response?.data?.message || 'Login gagal. Silakan coba lagi.');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Fungsi untuk register
    const register = async (userData) => {
        try {
            setLoading(true);
            setError(null);
            
            // Register user baru
            const response = await authService.register(userData);
            console.log('Register response:', response);
            
            if (response.data && response.data.success) {
                // Simpan user data
                const newUser = response.data.data;
                setUser(newUser);
                setIsAuthenticated(true);
                
                // Redirect ke dashboard customer
                router.push('/dashboard');
                
                return response.data;
            } else {
                throw new Error('Registrasi gagal. Data tidak valid.');
            }
        } catch (error) {
            console.error('Register error:', error);
            setError(error.response?.data?.message || 'Registrasi gagal. Silakan coba lagi.');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Fungsi untuk logout
    const logout = async () => {
        try {
            setLoading(true);
            
            // Panggil API logout
            await authService.logout();
            
            // Reset state
            setUser(null);
            setIsAuthenticated(false);
            setAuthChecked(false); // Reset untuk cek ulang saat login kembali
            
            // Redirect ke homepage
            router.push('/');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setLoading(false);
        }
    };

    // Fungsi untuk mengetahui apakah user adalah admin
    const isAdmin = () => {
        return user?.role === 'admin';
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                isAuthenticated,
                login,
                register,
                logout,
                isAdmin,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 