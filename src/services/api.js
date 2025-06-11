import "../../src/styles/globals.css";
import axios from 'axios';

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
    (response) => response,
    (error) => {
        if (error.response) {
            // Server memberikan response dengan status error
            console.error('Response Error:', {
                status: error.response.status,
                data: error.response.data,
                message: error.message,
            });
        } else if (error.request) {
            // Request terkirim tapi tidak ada respons
            console.error('No response received:', error.request);
        } else {
            // Kesalahan saat menyetting request
            console.error('Axios Error:', error.message);
        }

        // Cek jika status 401 (Unauthorized)
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                sessionStorage.clear();

                // Hapus semua cookie
                try {
                    document.cookie.split(';').forEach((c) => {
                        document.cookie = c
                            .replace(/^ +/, '')
                            .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/');
                    });
                } catch (e) {
                    console.error('Error saat menghapus cookies:', e);
                }

                // Redirect ke login jika tidak sedang di halaman publik
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

// Payment service - pastikan hanya dideklarasikan sekali
// export const paymentService = {
//     getAll: async () => {
//         try {
//             // Coba akses API
//             const response = await axiosInstance.get('/pembayaran');
//             return response.data.data || [];
//         } catch (error) {
//             console.warn('Menggunakan mock data untuk payments karena API error:', error);
//             // Fallback ke mock data jika API error
//             return getMockPayments();
//         }
//     },

//     // Mendapatkan semua pembayaran - implementasi alternatif
//     getAllPayments: async () => {
//         const response = await axiosInstance.get('/pembayaran')
//         return response.data.data
//     },

//     // Gunakan endpoint yang benar: payment-proof bukan upload-proof
//     uploadPaymentProof: async (formData) => {
//         try {
//             // Gunakan mock untuk sementara
//             // Hapus baris ini jika backend sudah siap
//             return await mockUploadPaymentProof(formData);

//             // Kode asli yang akan digunakan nanti dengan endpoint yang benar
//             /*
//             const response = await axiosInstance.post('/pembayaran/bukti-pembayaran', formData, {
//                 headers: {
//                     'Content-Type': 'multipart/form-data'
//                 }
//             });
//             return response.data;
//             */
//         } catch (error) {
//             console.error('Error uploading payment proof:', error);
//             throw error;
//         }
//     },

//     // Tambahkan fungsi lain jika perlu
//     getById: async (id) => {
//         try {
//             // Ubah endpoint dari '/payments' ke '/pembayaran'
//             const response = await axiosInstance.get(`/pembayaran/${id}`);
//             return response.data.data;
//         } catch (error) {
//             console.error(`Error fetching payment ${id}:`, error);
//             throw error;
//         }
//     },

//     // Membuat pembayaran baru
//     create: async (paymentData) => {
//         return axiosInstance.post('/pembayaran', paymentData);
//     },

//     // Update pembayaran
//     update: async (id, paymentData) => {
//         return axiosInstance.put(`/pembayaran/${id}`, paymentData);
//     },

//     // Hapus pembayaran
//     delete: async (id) => {
//         return axiosInstance.delete(`/pembayaran/${id}`);
//     },

//     // Midtrans payment
//     createPayment: async (bookingId) => {
//         try {
//             const response = await axiosInstance.post(`/pemesanan/${bookingId}/payment`);
//             return response.data;
//         } catch (error) {
//             console.error('Error creating payment:', error);
//             throw error;
//         }
//     },

//     // Check payment status
//     checkStatus: async (bookingId) => {
//         try {
//             const response = await axiosInstance.get(`/pemesanan/${bookingId}/payment/status`);
//             return response.data;
//         } catch (error) {
//             console.error('Error checking payment status:', error);
//             throw error;
//         }
//     }
// };

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
    // Get all bookings
    getAll: async () => {
        const response = await axiosInstance.get('/pemesanan');
        return response.data;
    },

    // Get user's bookings
    getUserBookings: async () => {
        const response = await axiosInstance.get('/pemesanan/user');
        return response.data;
    },

    // Get booking by ID
    getById: async (id) => {
        const response = await axiosInstance.get(`/pemesanan/${id}`);
        return response.data;
    },

    // Create new booking
    create: async (bookingData) => {
        const response = await axiosInstance.post('/pemesanan', bookingData);
        return response.data;
    },

    // Update booking
    update: async (id, bookingData) => {
        const response = await axiosInstance.put(`/pemesanan/${id}`, bookingData);
        return response.data;
    },

    // Delete booking
    delete: async (id) => {
        const response = await axiosInstance.delete(`/pemesanan/${id}`);
        return response.data;
    },

    // Get payment token
    getPaymentToken: async (bookingId) => {
        const response = await axiosInstance.post(`/pemesanan/${bookingId}/payment`);
        return response.data;
    },

    // Check payment status
    checkPaymentStatus: async (bookingId) => {
        const response = await axiosInstance.get(`/pemesanan/${bookingId}/payment/status`);
        return response.data;
    },

    // Update payment status
    updatePaymentStatus: async (bookingId, paymentData) => {
        try {
            console.log('Updating payment status:', { bookingId, paymentData });
            const response = await axiosInstance.post(`/pemesanan/${bookingId}/payment/update`, paymentData);
            console.log('Update payment status response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error updating payment status:', error);
            throw error;
        }
    }
};

// Payment (Pembayaran) services
export const paymentService = {
    getAll: async () => {
        try {
            const response = await axiosInstance.get('/pembayaran');
            console.log('Response pembayaran:', response);
            return response;
        } catch (error) {
            console.error('Error fetching payments:', error);
            throw error;
        }
    },
    verify: async (id) => {
        try {
            const response = await axiosInstance.put(`/pembayaran/${id}/verify`);
            console.log('Response verify pembayaran:', response);
            return response;
        } catch (error) {
            console.error('Error verifying payment:', error);
            throw error;
        }
    },
    getById: async (id) => {
        return axiosInstance.get(`/pembayaran/${id}`);
    },
    create: async (paymentData) => {
        return axiosInstance.post('/pembayaran', paymentData);
    },
    update: async (id, paymentData) => {
        return axiosInstance.put(`/pembayaran/${id}`, paymentData);
    },
    delete: async (id) => {
        return axiosInstance.delete(`/pembayaran/${id}`);
    },
    createMidtransTransaction: async (paymentData) => {
        try {
            // Log data untuk debugging
            console.log('Creating Midtrans transaction with data:', paymentData);

            // Pastikan data yang dikirim sesuai format
            const requestData = {
                booking_id: paymentData.booking_id,
                amount: parseInt(paymentData.amount),
                customer_details: {
                    first_name: paymentData.customer_details.first_name || 'Customer',
                    email: paymentData.customer_details.email || 'customer@example.com',
                    phone: paymentData.customer_details.phone || '08123456789'
                }
            };

            // Pastikan amount valid
            if (!requestData.amount || requestData.amount <= 0) {
                throw new Error('Jumlah pembayaran tidak valid');
            }

            // Pastikan booking_id ada
            if (!requestData.booking_id) {
                throw new Error('ID Booking tidak valid');
            }

            const response = await axiosInstance.post('/pembayaran/create-transaction', requestData);
            console.log('Midtrans response:', response);
            return response;
        } catch (error) {
            console.error('Error creating payment:', error);
            throw error;
        }
    },
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

// Sesi service
export const sesiService = {
    // Get all sesi
    getAll: async () => {
        const response = await axiosInstance.get('/sesi');
        return response.data;
    },

    // Get sesi by ID
    getById: async (id) => {
        const response = await axiosInstance.get(`/sesi/${id}`);
        return response.data;
    },

    // Get multiple sesi by IDs
    getByIds: async (ids) => {
        const response = await axiosInstance.get('/sesi/multiple', {
            params: { ids: ids.join(',') }
        });
        return response.data;
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
