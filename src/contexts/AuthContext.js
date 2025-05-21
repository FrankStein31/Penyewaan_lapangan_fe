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
                // Jika 401, hapus data sesi di localStorage jika ada
                if (error.response && error.response.status === 401) {
                    localStorage.removeItem('user');
                    
                    // Redirect manual ke halaman utama jika bukan di halaman publik
                    if (typeof window !== 'undefined') {
                        const publicPaths = ['/', '/login', '/register'];
                        const currentPath = window.location.pathname;
                        
                        if (!publicPaths.includes(currentPath)) {
                            router.push('/');
                        }
                    }
                }
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
                setAuthChecked(true);
            }
        };

        // Cek jika URL saat ini adalah login atau register, jangan lakukan pemeriksaan otomatis
        if (typeof window !== 'undefined') {
            const publicPaths = ['/', '/login', '/register'];
            const currentPath = window.location.pathname;
            
            if (publicPaths.includes(currentPath)) {
                setLoading(false);
                setAuthChecked(true);
                return;
            }
            
            checkAuth();
        }
    }, [authChecked, router]);

    // Fungsi untuk login
    const login = async (email, password) => {
        try {
            setLoading(true);
            setError(null);
            
            // Login menggunakan credentials
            const response = await authService.login({ email, password });
            console.log('Login response:', response);
            
            if (response.data) {
                // Coba dapatkan user dari berbagai kemungkinan struktur respons
                const userData = response.data.data || response.data;
                
                if (userData) {
                    // Konversi ke format yang konsisten dengan frontend
                    const formattedUser = {
                        id: userData.id,
                        name: userData.nama,         // Backend menggunakan 'nama'
                        email: userData.email,
                        phone: userData.no_hp,       // Backend menggunakan 'no_hp'
                        role: userData.role || 'user'
                    };
                    
                    console.log('Data user login setelah diformat:', formattedUser);
                    setUser(formattedUser);
                    setIsAuthenticated(true);
                    
                    // Redirect berdasarkan role
                    if (formattedUser.role === 'admin') {
                        router.push('/admin');
                    } else {
                        router.push('/dashboard');
                    }
                    
                    return response.data;
                } else {
                    throw new Error('Login berhasil namun data pengguna tidak valid');
                }
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
            
            // Pastikan data respons ada
            if (response.data) {
                // Simpan user data sesuai struktur respons dari API
                // Kemungkinan struktur { data: {...}, status: 201, statusText: 'Created' }
                // atau { message: 'User registered successfully', data: {...}, success: true }
                
                // Coba dapatkan user dari berbagai kemungkinan struktur respons
                const newUser = response.data.data || response.data;
                
                if (newUser) {
                    // Konversi ke format yang konsisten dengan frontend
                    const formattedUser = {
                        id: newUser.id,
                        name: newUser.nama,         // Backend menggunakan 'nama'
                        email: newUser.email,
                        phone: newUser.no_hp,       // Backend menggunakan 'no_hp'
                        role: newUser.role || 'user'
                    };
                    
                    console.log('Data user setelah diformat:', formattedUser);
                    setUser(formattedUser);
                    setIsAuthenticated(true);
                    
                    // Redirect ke dashboard customer
                    router.push('/dashboard');
                    
                    return response.data;
                } else {
                    throw new Error('Registrasi berhasil namun data pengguna tidak valid');
                }
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
            console.log('Proses logout dimulai...');
            
            // Reset state terlebih dahulu untuk memastikan UI langsung merespons
            setUser(null);
            setIsAuthenticated(false);
            setAuthChecked(false);
            
            // Hapus dari localStorage
            if (typeof window !== 'undefined') {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                // Hapus semua item yang mungkin terkait dengan autentikasi
                sessionStorage.clear();
                console.log('Data user dihapus dari localStorage dan sessionStorage');
                
                // Untuk memastikan tidak ada cache lain
                try {
                    document.cookie.split(";").forEach(function(c) {
                        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                    });
                    console.log('Cookies dihapus');
                } catch (e) {
                    console.error('Error saat menghapus cookies:', e);
                }
            }
            
            // Panggil API logout setelah state direset
            await authService.logout();
            console.log('Respons dari API logout diterima');
            
            console.log('Status autentikasi di-reset, redirect ke homepage');
            
            // Force refresh halaman untuk memastikan semua state direset
            window.location.href = '/';
        } catch (error) {
            console.error('Logout error:', error);
            // Tetap redirect meskipun terjadi error
            window.location.href = '/';
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