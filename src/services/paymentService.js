import api from './api';

const paymentService = {
    // Membuat transaksi Midtrans baru
    createMidtransTransaction: async (paymentData) => {
        try {
            const response = await api.post('/pembayaran/create-transaction', paymentData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Mendapatkan semua data pembayaran
    getAll: async () => {
        try {
            const response = await api.get('/pembayaran');
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Mendapatkan detail pembayaran berdasarkan ID
    getById: async (id) => {
        try {
            const response = await api.get(`/pembayaran/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Update status pembayaran
    update: async (id, data) => {
        try {
            const response = await api.put(`/pembayaran/${id}`, data);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Hapus pembayaran
    delete: async (id) => {
        try {
            const response = await api.delete(`/pembayaran/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    }
};

export default paymentService;