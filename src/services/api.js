import axios from 'axios';

const BACKEND_URL = 'http://localhost:8000';
const API_URL = `${BACKEND_URL}/api`;

// Membuat instance axios dengan konfigurasi dasar
const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
    withCredentials: true, // Penting untuk CSRF protection dan cookies
});

// Interceptor untuk menangani error
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Log semua error untuk debugging
        console.error('API Error:', error.response || error);
        
        // Jika error karena unauthenticated (401) dan bukan karena request login
        if (error.response?.status === 401 && !error.config.url.includes('/login')) {
            console.log('Session expired, redirecting to login page...');
            // Redirect ke halaman login jika berada di browser
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Auth Service
export const authService = {
    // Mendapatkan CSRF cookie dari Laravel
    getCsrfCookie: async () => {
        try {
            console.log('Getting CSRF token...');
            const response = await axios.get(`${BACKEND_URL}/sanctum/csrf-cookie`, {
                withCredentials: true
            });
            console.log('CSRF token response:', response);
            return response;
        } catch (error) {
            console.error('Error getting CSRF token:', error);
            throw error;
        }
    },
    
    // Register user baru
    register: async (userData) => {
        try {
            // Ambil CSRF token terlebih dahulu
            await authService.getCsrfCookie();
            
            // Buat FormData untuk mengirim data sesuai format backend
            const formData = new FormData();
            formData.append('nama', userData.name);
            formData.append('email', userData.email);
            formData.append('no_hp', userData.phone);
            formData.append('password', userData.password);
            if (userData.password_confirmation) {
                formData.append('password_confirmation', userData.password_confirmation);
            }
            
            console.log('Sending register request with formData');
            
            // Gunakan Axios langsung dengan FormData
            return await axios.post(`${BACKEND_URL}/api/register`, formData, {
                withCredentials: true,
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                    // Content-Type tidak perlu diatur karena FormData sudah mengaturnya
                }
            });
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },
    
    // Login user
    login: async (credentials) => {
        try {
            // Ambil CSRF token terlebih dahulu
            await authService.getCsrfCookie();
            
            // Buat FormData untuk login
            const formData = new FormData();
            formData.append('email', credentials.email);
            formData.append('password', credentials.password);
            
            console.log('Sending login request with formData');
            
            // Gunakan Axios langsung dengan FormData
            return await axios.post(`${BACKEND_URL}/api/login`, formData, {
                withCredentials: true,
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                    // Content-Type tidak perlu diatur karena FormData sudah mengaturnya
                }
            });
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },
    
    // Logout user
    logout: () => api.post('/logout'),

    // Get authenticated user
    getUser: () => api.get('/user'),
};

// User Service
export const userService = {
    // Mendapatkan semua user (admin only)
    getAll: () => api.get('/users'),
    
    // Mendapatkan user by ID
    getById: (id) => api.get(`/users/${id}`),
    
    // Update user
    update: (id, userData) => api.put(`/users/${id}`, userData),
    
    // Cari user berdasarkan nomor HP
    getByNoHp: (noHp) => api.get(`/users/no_hp/${noHp}`),
    
    // Menambahkan user baru (admin only)
    create: (userData) => api.post('/users', userData),
    
    // Menghapus user (admin only)
    delete: (id) => api.delete(`/users/${id}`),
};

// Lapangan Service
export const fieldService = {
    // Mendapatkan semua lapangan
    getAll: () => api.get('/lapangan'),
    
    // Mendapatkan lapangan by ID
    getById: (id) => api.get(`/lapangan/${id}`),
    
    // Menambahkan lapangan baru (admin only)
    create: (lapanganData) => api.post('/lapangan', lapanganData),
    
    // Update lapangan (admin only)
    update: (id, lapanganData) => api.put(`/lapangan/${id}`, lapanganData),
    
    // Menghapus lapangan (admin only)
    delete: (id) => api.delete(`/lapangan/${id}`),
};

// Kategori Lapangan Service
export const kategoriLapService = {
    // Mendapatkan semua kategori
    getAll: () => api.get('/kategori-lap'),
    
    // Mendapatkan kategori by ID
    getById: (id) => api.get(`/kategori-lap/${id}`),
    
    // Menambahkan kategori baru (admin only)
    create: (kategoriData) => api.post('/kategori-lap', kategoriData),
    
    // Update kategori (admin only)
    update: (id, kategoriData) => api.put(`/kategori-lap/${id}`, kategoriData),
    
    // Menghapus kategori (admin only)
    delete: (id) => api.delete(`/kategori-lap/${id}`),
};

// Fasilitas Service
export const fasilitasService = {
    // Mendapatkan semua fasilitas
    getAll: () => api.get('/fasilitas'),
    
    // Mendapatkan fasilitas by ID
    getById: (id) => api.get(`/fasilitas/${id}`),
    
    // Menambahkan fasilitas baru (admin only)
    create: (fasilitasData) => api.post('/fasilitas', fasilitasData),
    
    // Update fasilitas (admin only)
    update: (id, fasilitasData) => api.put(`/fasilitas/${id}`, fasilitasData),
    
    // Menghapus fasilitas (admin only)
    delete: (id) => api.delete(`/fasilitas/${id}`),
};

// Status Lapangan Service
export const statusService = {
    // Mendapatkan semua status
    getAll: () => api.get('/status-lapangan'),
    
    // Mendapatkan status by ID
    getById: (id) => api.get(`/status-lapangan/${id}`),
    
    // Menambahkan status baru (admin only)
    create: (statusData) => api.post('/status-lapangan', statusData),
    
    // Update status (admin only)
    update: (id, statusData) => api.put(`/status-lapangan/${id}`, statusData),
    
    // Menghapus status (admin only)
    delete: (id) => api.delete(`/status-lapangan/${id}`),
};

// Sesi Service
export const sessionService = {
    // Mendapatkan semua sesi
    getAll: () => api.get('/sesi'),
    
    // Mendapatkan sesi by ID
    getById: (id) => api.get(`/sesi/${id}`),
    
    // Menambahkan sesi baru (admin only)
    create: (sesiData) => api.post('/sesi', sesiData),
    
    // Update sesi (admin only)
    update: (id, sesiData) => api.put(`/sesi/${id}`, sesiData),
    
    // Menghapus sesi (admin only)
    delete: (id) => api.delete(`/sesi/${id}`),
};

// Hari Service
export const dayService = {
    // Mendapatkan semua hari
    getAll: () => api.get('/hari'),
    
    // Mendapatkan hari by ID
    getById: (id) => api.get(`/hari/${id}`),
    
    // Menambahkan hari baru (admin only)
    create: (hariData) => api.post('/hari', hariData),
    
    // Update hari (admin only)
    update: (id, hariData) => api.put(`/hari/${id}`, hariData),
    
    // Menghapus hari (admin only)
    delete: (id) => api.delete(`/hari/${id}`),
};

// Booking Service
export const bookingService = {
    // Mendapatkan semua booking
    getAll: () => api.get('/pemesanan'),
    
    // Mendapatkan booking by ID
    getById: (id) => api.get(`/pemesanan/${id}`),
    
    // Membuat booking baru
    create: (pemesananData) => api.post('/pemesanan', pemesananData),
    
    // Update booking
    update: (id, pemesananData) => api.put(`/pemesanan/${id}`, pemesananData),
    
    // Menghapus booking
    delete: (id) => api.delete(`/pemesanan/${id}`),
    
    // Check ketersediaan lapangan
    checkAvailability: (params) => api.get('/pemesanan/check-availability', { params }),

    // Mendapatkan booking pengguna tertentu
    getUserBookings: () => api.get('/pemesanan/user'),
};

// Pembayaran Service
export const paymentService = {
    // Mendapatkan semua pembayaran
    getAll: () => api.get('/pembayaran'),
    
    // Mendapatkan pembayaran by ID
    getById: (id) => api.get(`/pembayaran/${id}`),
    
    // Membuat pembayaran baru
    create: (pembayaranData) => api.post('/pembayaran', pembayaranData),
    
    // Update pembayaran
    update: (id, pembayaranData) => api.put(`/pembayaran/${id}`, pembayaranData),
    
    // Menghapus pembayaran
    delete: (id) => api.delete(`/pembayaran/${id}`),
};

export default api; 