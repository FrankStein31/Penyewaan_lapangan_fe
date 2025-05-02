import axios from 'axios';
// import { axiosInstance } from '@/services/api';

// Dapatkan URL API dari environment variable
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Setup axios dengan default config
const axiosInstance = axios.create({
    baseURL: API_URL,
    withCredentials: true, // Penting untuk cookie auth
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Menambahkan interceptor untuk menangani error 401
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        // Jika error 401 (Unauthorized), arahkan ke halaman login
        if (error.response && error.response.status === 401) {
            console.log('Session habis atau tidak terotentikasi, redirect ke login');

            // Hapus data autentikasi dari localStorage
            if (typeof window !== 'undefined') {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                sessionStorage.clear();

                // Hapus cookie
                try {
                    document.cookie.split(";").forEach(function (c) {
                        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
                    });
                } catch (e) {
                    console.error('Error saat menghapus cookies:', e);
                }

                // Redirect ke login, kecuali jika di halaman publik
                const currentPath = window.location.pathname;
                if (currentPath !== '/' && currentPath !== '/login' && currentPath !== '/register') {
                    console.log('Redirecting ke halaman login...');
                    window.location.href = '/login';
                } else {
                    console.log('Sudah di halaman publik, tidak perlu redirect');
                }
            }
        }
        return Promise.reject(error);
    }
);

// Auth services
export const authService = {
    // Login pengguna
    login: async (credentials) => {
        return axiosInstance.post('/login', credentials);
    },

    // Register pengguna baru
    register: async (userData) => {
        return axiosInstance.post('/register', userData);
    },

    // Logout pengguna
    logout: async () => {
        try {
            const response = await axiosInstance.post('/logout', {}, {
                withCredentials: true,
            });
            console.log('Logout API response:', response);
            return response;
        } catch (error) {
            console.error('Error in logout API call:', error);
            throw error;
        }
    },

    // Mendapatkan data user yang sedang login
    getUser: async () => {
        return axiosInstance.get('/user');
    }
};

// User services
export const userService = {
    // Mendapatkan semua user (admin)
    getAll: async () => {
        return axiosInstance.get('/users');
    },

    // Mendapatkan user berdasarkan id
    getById: async (id) => {
        return axiosInstance.get(`/users/${id}`);
    },

    // Membuat user baru (admin)
    create: async (userData) => {
        return axiosInstance.post('/users', userData);
    },

    // Update user
    update: async (id, userData) => {
        return axiosInstance.put(`/users/${id}`, userData);
    },

    // Hapus user
    delete: async (id) => {
        return axiosInstance.delete(`/users/${id}`);
    }
};

// Session (Sesi) services
export const sessionService = {
    // Mendapatkan semua sesi
    getAll: async () => {
        return axiosInstance.get('/sesi');
    },

    // Mendapatkan semua sesi - alias untuk kompatibilitas
    getSessions: async () => {
        return axiosInstance.get('/sesi');
    },

    // Mendapatkan sesi berdasarkan id
    getById: async (id) => {
        if (!id) throw new Error('ID sesi diperlukan');
        return axiosInstance.get(`/sesi/${id}`);
    },

    // Membuat sesi baru
    create: async (sessionData) => {
        try {
            // Pastikan data dalam format yang benar sebelum dikirim
            const validatedData = {
                jam_mulai: sessionData.jam_mulai,
                jam_selesai: sessionData.jam_selesai,
                deskripsi: sessionData.deskripsi || ''
            };
            console.log('Mengirim data sesi ke server:', validatedData);
            return axiosInstance.post('/sesi', validatedData);
        } catch (error) {
            console.error('Error creating session:', error);
            throw error;
        }
    },

    // Tambah sesi baru - alias untuk kompatibilitas
    createSession: async (sessionData) => {
        return sessionService.create(sessionData);
    },

    // Update sesi
    update: async (id, sessionData) => {
        try {
            if (!id) throw new Error('ID sesi diperlukan untuk update');

            // Pastikan ID dalam format yang benar (angka)
            const sessionId = String(id).trim();
            if (!sessionId) throw new Error('ID sesi tidak valid');

            // Pastikan data dalam format yang benar sebelum dikirim
            const validatedData = {
                jam_mulai: sessionData.jam_mulai,
                jam_selesai: sessionData.jam_selesai,
                deskripsi: sessionData.deskripsi || ''
            };
            console.log(`Memperbarui sesi ID ${sessionId} dengan data:`, validatedData);

            // Pastikan URL dalam format yang benar dengan slash (/)
            return axiosInstance.put(`/sesi/${sessionId}`, validatedData);
        } catch (error) {
            console.error(`Error updating session ${id}:`, error);
            throw error;
        }
    },

    // Update sesi - alias untuk kompatibilitas
    updateSession: async (id, sessionData) => {
        return sessionService.update(id, sessionData);
    },

    // Hapus sesi
    delete: async (id) => {
        if (!id) throw new Error('ID sesi diperlukan untuk delete');
        return axiosInstance.delete(`/sesi/${id}`);
    },

    // Hapus sesi - alias untuk kompatibilitas
    deleteSession: async (id) => {
        return sessionService.delete(id);
    }
};

// Day (Hari) services
export const dayService = {
    // Mendapatkan semua hari
    getAll: async () => {
        return axiosInstance.get('/hari');
    },

    // Mendapatkan semua hari - alias untuk kompatibilitas
    getDays: async () => {
        return axiosInstance.get('/hari');
    },

    // Mendapatkan hari berdasarkan id
    getById: async (id) => {
        return axiosInstance.get(`/hari/${id}`);
    },

    // Membuat hari baru
    create: async (dayData) => {
        return axiosInstance.post('/hari', dayData);
    },

    // Membuat hari baru - alias untuk kompatibilitas
    createDay: async (dayData) => {
        return axiosInstance.post('/hari', dayData);
    },

    // Update hari
    update: async (id, dayData) => {
        return axiosInstance.put(`/hari/${id}`, dayData);
    },

    // Update hari - alias untuk kompatibilitas
    updateDay: async (id, dayData) => {
        return axiosInstance.put(`/hari/${id}`, dayData);
    },

    // Hapus hari
    delete: async (id) => {
        return axiosInstance.delete(`/hari/${id}`);
    },

    // Hapus hari - alias untuk kompatibilitas
    deleteDay: async (id) => {
        return axiosInstance.delete(`/hari/${id}`);
    }
};

// Category (Kategori) services
export const categoryService = {
    // Mendapatkan semua kategori
    getAll: async () => {
        return axiosInstance.get('/kategori-lap');
    },

    // Mendapatkan kategori berdasarkan id
    getById: async (id) => {
        return axiosInstance.get(`/kategori-lap/${id}`);
    },

    // Membuat kategori baru
    create: async (categoryData) => {
        return axiosInstance.post('/kategori-lap', categoryData);
    },

    // Update kategori
    update: async (id, categoryData) => {
        return axiosInstance.put(`/kategori-lap/${id}`, categoryData);
    },

    // Hapus kategori
    delete: async (id) => {
        return axiosInstance.delete(`/kategori-lap/${id}`);
    }
};

// Field (Lapangan) services
export const fieldService = {
    // Mendapatkan semua lapangan
    getAll: async () => {
        return axiosInstance.get('/lapangan');
    },

    // Mendapatkan lapangan berdasarkan id
    getById: async (id) => {
        return axiosInstance.get(`/lapangan/${id}`);
    },

    // Membuat lapangan baru (dengan support untuk upload file/foto)
    create: async (fieldData) => {
        return axiosInstance.post('/lapangan', fieldData, {
            headers: {
                'Content-Type': 'multipart/form-data' // Penting untuk upload file
            }
        });
    },

    // Update lapangan (dengan support untuk upload file/foto)
    update: async (id, fieldData) => {
        return axiosInstance.post(`/lapangan/${id}`, fieldData, {
            headers: {
                'Content-Type': 'multipart/form-data' // Penting untuk upload file
            }
        });
    },

    // Hapus lapangan
    delete: async (id) => {
        return axiosInstance.delete(`/lapangan/${id}`);
    }
};

// Facility (Fasilitas) services
export const facilityService = {
    // Mendapatkan semua fasilitas
    getAll: async () => {
        return axiosInstance.get('/fasilitas');
    },

    // Mendapatkan fasilitas berdasarkan id
    getById: async (id) => {
        return axiosInstance.get(`/fasilitas/${id}`);
    },

    // Membuat fasilitas baru
    create: async (facilityData) => {
        return axiosInstance.post('/fasilitas', facilityData);
    },

    // Update fasilitas
    update: async (id, facilityData) => {
        return axiosInstance.put(`/fasilitas/${id}`, facilityData);
    },

    // Hapus fasilitas
    delete: async (id) => {
        return axiosInstance.delete(`/fasilitas/${id}`);
    }
};

// Status Lapangan services
export const statusService = {
    // Mendapatkan semua status lapangan
    getAll: async () => {
        return axiosInstance.get('/status-lapangan');
    },

    // Mendapatkan status berdasarkan id
    getById: async (id) => {
        return axiosInstance.get(`/status-lapangan/${id}`);
    },

    // Membuat status baru
    create: async (statusData) => {
        return axiosInstance.post('/status-lapangan', statusData);
    },

    // Update status
    update: async (id, statusData) => {
        return axiosInstance.put(`/status-lapangan/${id}`, statusData);
    },

    // Hapus status
    delete: async (id) => {
        return axiosInstance.delete(`/status-lapangan/${id}`);
    }
};

// Booking (Pemesanan) pada services/api.js
export const bookingService = {
    // Ganti ini:
    getAll: async () => {
        return axiosInstance.get('/pemesanan');
    },

    // Mendapatkan pemesanan berdasarkan id
    getById: async (id) => {
        return axiosInstance.get(`/pemesanan/${id}`);
    },

    // Mendapatkan pemesanan user yang login
    getUserBookings: async () => {
        return axiosInstance.get('/pemesanan/user');
    },
    // Cek ketersediaan lapangan
    checkAvailability: async (params) => {
        return axiosInstance.get('/api/pemesanan/check-availability', { params });
    },
    // Membuat pemesanan baru
    create: async (bookingData) => {
        return axiosInstance.post('/pemesanan', bookingData);
    },
    // Update pemesanan
    update: async (id, bookingData) => {
        return axiosInstance.put(`/pemesanan/${id}`, bookingData);
    },
    // Hapus pemesanan
    delete: async (id) => {
        return axiosInstance.delete(`/pemesanan/${id}`);
    }
};

// Payment (Pembayaran) services
export const paymentService = {
    // Mendapatkan semua pembayaran
    getAll: async () => {
        return axiosInstance.get('/pembayaran');
    },

    // Mendapatkan pembayaran berdasarkan id
    getById: async (id) => {
        return axiosInstance.get(`/pembayaran/${id}`);
    },

    // Membuat pembayaran baru
    create: async (paymentData) => {
        return axiosInstance.post('/pembayaran', paymentData);
    },

    // Update pembayaran
    update: async (id, paymentData) => {
        return axiosInstance.put(`/pembayaran/${id}`, paymentData);
    },

    // Hapus pembayaran
    delete: async (id) => {
        return axiosInstance.delete(`/pembayaran/${id}`);
    }
};