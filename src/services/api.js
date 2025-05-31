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

// Add request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        console.log('Request:', {
            method: config.method,
            url: config.url,
            data: config.data,
            headers: config.headers
        });
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        console.log('Response:', {
            status: response.status,
            data: response.data
        });
        return response;
    },
    (error) => {
        console.error('Response Error:', {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });

        // Jika error 401 (Unauthorized)
        if (error.response?.status === 401) {
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

// Sesi waktu service
export const sessionService = {
    // Mendapatkan semua sesi waktu
    getAll: async () => {
        return axiosInstance.get('/sesi');
    },

    // Alias untuk getAll demi kompatibilitas
    getSessions: async () => {
        return axiosInstance.get('/sesi');
    },

    // Mendapatkan sesi waktu berdasarkan id
    getById: async (id) => {
        return axiosInstance.get(`/sesi/${id}`);
    },

    // Membuat sesi waktu baru
    create: async (sessionData) => {
        return axiosInstance.post('/sesi', sessionData);
    },

    // Update sesi waktu
    update: async (id, sessionData) => {
        // Pastikan ID dalam format yang benar
        const sessionId = typeof id === 'number' ? id.toString() : id;
        console.log(`Update sesi dengan ID: ${sessionId}`, sessionData);
        return axiosInstance.put(`/sesi/${sessionId}`, sessionData);
    },

    // Hapus sesi waktu
    delete: async (id) => {
        const sessionId = typeof id === 'number' ? id.toString() : id;
        return axiosInstance.delete(`/sesi/${sessionId}`);
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
        console.log("Memanggil endpoint kategori-lap");
        try {
            const response = await axiosInstance.get('/kategori-lap');
            console.log("Response getAll kategori:", response);
            return response;
        } catch (error) {
            console.error("Error dalam categoryService.getAll:", error);
            throw error;
        }
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

// Booking (Pemesanan) services
export const bookingService = {
    // Mendapatkan semua pemesanan
    getAll: async () => {
        try {
            const response = await axiosInstance.get('/pemesanan');
            return response;
        } catch (error) {
            console.error('Error in getAll bookings:', error);
            throw error;
        }
    },

    // Mendapatkan pemesanan berdasarkan id
    getById: async (id) => {
        try {
            const response = await axiosInstance.get(`/pemesanan/${id}`);
            return response;
        } catch (error) {
            console.error('Error in getById booking:', error);
            throw error;
        }
    },

    // Mendapatkan pemesanan user yang login
    getUserBookings: async () => {
        try {
            const response = await axiosInstance.get('/pemesanan/user');
            return response;
        } catch (error) {
            console.error('Error in getUserBookings:', error);
            throw error;
        }
    },

    // Cek ketersediaan lapangan untuk tanggal tertentu
    checkAvailability: async (id_lapangan, tanggal) => {
        // Pastikan kedua parameter ada dan valid
        if (!id_lapangan || !tanggal) {
            console.error('checkAvailability: Parameter tidak lengkap', { id_lapangan, tanggal });
            throw new Error('ID lapangan dan tanggal harus diisi');
        }

        // Convert id_lapangan ke string jika itu adalah angka
        const fieldId = typeof id_lapangan === 'number' ? id_lapangan.toString() : id_lapangan;

        console.log('Sending availability check request with params:', { id_lapangan: fieldId, tanggal });

        return axiosInstance.get('/pemesanan/check-availability', {
            params: {
                id_lapangan: fieldId,
                tanggal
            }
        });
    },

    // Membuat pemesanan baru
    create: async (bookingData) => {
        console.log('Mengirim data pemesanan ke API:', bookingData);

        // Memastikan semua parameter wajib tersedia
        const { id_lapangan, tanggal, id_sesi } = bookingData;
        if (!id_lapangan || !tanggal || !id_sesi) {
            throw new Error('Data pemesanan tidak lengkap. id_lapangan, tanggal, dan id_sesi wajib diisi.');
        }

        // Pastikan id_sesi adalah array
        if (!Array.isArray(id_sesi)) {
            bookingData.id_sesi = [id_sesi]; // Konversi ke array jika bukan array
            console.log('id_sesi dikonversi ke array:', bookingData.id_sesi);
        }

        // Kirim semua data yang tersedia ke API
        return axiosInstance.post('/pemesanan', bookingData);
    },

    // Update pemesanan (misal: update status)
    update: async (id, bookingData) => {
        try {
            const response = await axiosInstance.put(`/pemesanan/${id}`, bookingData);
            return response;
        } catch (error) {
            console.error('Error in update booking:', error);
            throw error;
        }
    },

    // Hapus pemesanan
    delete: async (id) => {
        try {
            const response = await axiosInstance.delete(`/pemesanan/${id}`);
            return response;
        } catch (error) {
            console.error('Error in delete booking:', error);
            throw error;
        }
    },

    getPaymentToken: async (bookingId) => {
        const response = await axiosInstance.post(`/pemesanan/${bookingId}/payment`);
        return response.data;
    },

    checkPaymentStatus: async (bookingId) => {
        const response = await axiosInstance.get(`/pemesanan/${bookingId}/payment/status`);
        return response.data;
    },

    // Verifikasi pemesanan
    verify: async (id, isApproved) => {
        try {
            const response = await axiosInstance.put(`/pemesanan/${id}/verify`, {
                status: isApproved ? 'diverifikasi' : 'ditolak'
            });
            return response;
        } catch (error) {
            console.error('Error in verify booking:', error);
            throw error;
        }
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
    },

    // Midtrans payment
    createMidtransTransaction: async (bookingId, paymentData) => {
        try {
            const response = await axiosInstance.post(`/pemesanan/${bookingId}/payment`);
            return response.data;
        } catch (error) {
            console.error('Error creating payment:', error);
            throw error;
        }
    },

    // Check payment status
    checkStatus: async (bookingId) => {
        try {
            const response = await axiosInstance.get(`/pemesanan/${bookingId}/payment/status`);
            return response.data;
        } catch (error) {
            console.error('Error checking payment status:', error);
            throw error;
        }
    }
};

// src/services/api.js

export async function getUserPayments() {
    // Simulasi panggilan API
    return [
        { id: 1, date: '2025-05-01', total: 150000, status: 'Lunas' },
        { id: 2, date: '2025-04-20', total: 100000, status: 'Pending' },
    ]
}

export async function getUserNotifications() {
    // Simulasi panggilan API
    return [
        { id: 1, message: 'Pembayaran berhasil dikonfirmasi.', timestamp: '2025-05-01T10:00:00' },
        { id: 2, message: 'Jadwal booking kamu hari ini jam 16:00.', timestamp: '2025-05-14T07:00:00' },
    ]
}


// poto profile user
export async function getUserProfile() {
    return {
        name: 'Bayu Gilang P.',
        email: 'user@example.com',
        phone: '081234567890',
        photoUrl: '/images/profile.jpg',
        type: 'user',
    }
}

export async function updateUserProfile(data) {
    console.log('Update profile with:', data)
    return { success: true }
}

export async function updateUserPhoto(formData) {
    console.log('Upload photo with:', formData.get('photo'))
    return { success: true }
}
