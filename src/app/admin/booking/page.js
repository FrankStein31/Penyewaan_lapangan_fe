"use client";

import { useState, useEffect } from "react";
import { bookingService } from "../../../services/api";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import Sidebar from "@/components/admin/Sidebar";
import Topbar from "@/components/admin/Topbar";


export default function BookingAdmin() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Added error state
    const [showModal, setShowModal] = useState(false);
    const [currentBooking, setCurrentBooking] = useState(null);
    const [modalType, setModalType] = useState("view");
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await bookingService.getAll();

            // Pastikan data ada dan dalam format yang benar
            let bookingsData = [];
            if (response && response.data) {
                if (Array.isArray(response.data)) {
                    bookingsData = response.data;
                } else if (response.data.data && Array.isArray(response.data.data)) {
                    bookingsData = response.data.data;
                }
            }

            // Urutkan booking berdasarkan tanggal terbaru
            bookingsData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

            setBookings(bookingsData);
            setError(null);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            setError('Gagal memuat data pemesanan');
            setBookings([]);
        } finally {
            setLoading(false);
        }
    };


    const handleView = (booking) => {
        setCurrentBooking(booking);
        setModalType("view");
        setShowModal(true);
    };

    // Ganti status mapping agar sesuai backend
    const STATUS_OPTIONS = [
        { value: "menunggu verifikasi", label: "Menunggu Verifikasi" },
        { value: "diverifikasi", label: "Diverifikasi" },
        { value: "ditolak", label: "Ditolak" },
        { value: "dibatalkan", label: "Dibatalkan" },
        { value: "selesai", label: "Selesai" },
    ];

    // Perbaiki mapping warna status
    const getStatusColor = (status) => {
        switch (status) {
            case 'diverifikasi':
                return 'bg-green-100 text-green-800';
            case 'menunggu verifikasi':
                return 'bg-yellow-100 text-yellow-800';
            case 'ditolak':
            case 'dibatalkan':
                return 'bg-red-100 text-red-800';
            case 'selesai':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleEdit = (booking) => {
        setCurrentBooking(booking);
        setFormData({
            status: booking.status,
            catatan: booking.catatan || "",
        });
        setModalType("edit");
        setShowModal(true);
    };

    const handleDelete = (booking) => {
        setCurrentBooking(booking);
        setModalType("delete");
        setShowModal(true);
    };

    const handleVerify = async (booking, isApproved) => {
        try {
            const newStatus = isApproved ? 'diverifikasi' : 'ditolak';
            await bookingService.update(booking.id_pemesanan, {
                status: newStatus
            });

            showSnackbar(`Pemesanan berhasil ${isApproved ? 'diverifikasi' : 'ditolak'}`, 'success');
            fetchBookings();
            setShowModal(false);
        } catch (error) {
            console.error('Error updating booking:', error);
            showSnackbar('Gagal memperbarui status pemesanan', 'error');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await bookingService.update(currentBooking.id, formData);
            setShowModal(false);
            fetchBookings();
        } catch (error) {
            console.error("Error updating booking:", error);
        }
    };

    const closeModal = () => {
        setShowModal(false);
        setCurrentBooking(null);
        setFormData({});
    };

    const renderViewModal = () => (
        <div className="max-w-2xl p-6 mx-auto bg-white rounded-lg">
            <h3 className="mb-4 text-xl font-bold">Detail Pemesanan</h3>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-gray-600">ID Pemesanan</p>
                    <p className="font-medium">#{currentBooking.id_pemesanan}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(currentBooking.status)}`}>
                        {currentBooking.status}
                    </span>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Nama Pelanggan</p>
                    <p className="font-medium">{currentBooking.nama_pelanggan}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="font-medium">{currentBooking.email}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">No. HP</p>
                    <p className="font-medium">{currentBooking.no_hp}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Lapangan</p>
                    <p className="font-medium">{currentBooking.lapangan?.nama || '-'}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Tanggal</p>
                    <p className="font-medium">{new Date(currentBooking.tanggal).toLocaleDateString('id-ID')}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-600">Waktu</p>
                    <p className="font-medium">
                        {(currentBooking.sesi && currentBooking.sesi.length > 0)
                            ? `${currentBooking.sesi[0].jam_mulai} - ${currentBooking.sesi[currentBooking.sesi.length - 1].jam_selesai}`
                            : "-"}
                    </p>
                </div>
                <div className="col-span-2">
                    <p className="text-sm text-gray-600">Total Harga</p>
                    <p className="text-lg font-bold text-indigo-600">
                        {new Intl.NumberFormat('id-ID', {
                            style: 'currency',
                            currency: 'IDR'
                        }).format(currentBooking.total_harga)}
                    </p>
                </div>
                {currentBooking.catatan && (
                    <div className="col-span-2">
                        <p className="text-sm text-gray-600">Catatan</p>
                        <p className="font-medium">{currentBooking.catatan}</p>
                    </div>
                )}
            </div>

            {currentBooking.status === 'menunggu verifikasi' && (
                <div className="flex justify-center gap-4 mt-6">
                    <button
                        onClick={() => handleVerify(currentBooking, false)}
                        className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                        Tolak
                    </button>
                    <button
                        onClick={() => handleVerify(currentBooking, true)}
                        className="px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700"
                    >
                        Verifikasi
                    </button>
                </div>
            )}

            <div className="flex justify-end mt-6">
                <button
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    onClick={closeModal}
                >
                    Tutup
                </button>
            </div>
        </div>
    );

    // Modal Edit: gunakan field yang sesuai backend
    const renderEditModal = () => (
        <div className="max-w-md p-6 mx-auto bg-white rounded-lg">
            <h3 className="mb-4 text-lg font-bold">Edit Pemesanan</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 text-sm font-medium">Status</label>
                    <select
                        name="status"
                        value={formData.status || ""}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        required
                    >
                        {STATUS_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium">Catatan Admin</label>
                    <textarea
                        name="catatan"
                        value={formData.catatan || ""}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        rows="3"
                    ></textarea>
                </div>
                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        onClick={closeModal}
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    >
                        Simpan
                    </button>
                </div>
            </form>
        </div>
    );

    const renderDeleteModal = () => (
        <div className="max-w-md p-6 mx-auto bg-white rounded-lg">
            <h3 className="mb-4 text-lg font-bold">Hapus Pemesanan</h3>
            <p className="mb-4">Apakah Anda yakin ingin menghapus pemesanan ini?</p>
            <div className="flex justify-end space-x-2">
                <button
                    className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    onClick={closeModal}
                >
                    Batal
                </button>
                <button
                    className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700"
                    onClick={confirmDelete}
                >
                    Hapus
                </button>
            </div>
        </div>
    );

    const ModalContent = () => {
        if (!currentBooking) return null;
        switch (modalType) {
            case "view": return renderViewModal();
            case "edit": return renderEditModal();
            case "delete": return renderDeleteModal();
            default: return null;
        }
    };

    // Fungsi hapus booking
    const confirmDelete = async () => {
        if (!currentBooking) return;
        try {
            await bookingService.delete(currentBooking.id_pemesanan);
            fetchBookings();
            setShowModal(false);
        } catch (error) {
            console.error("Error deleting booking:", error);
            setError("Gagal menghapus pemesanan");
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex flex-col flex-1 overflow-hidden">
                <Topbar />
                <main className="flex-1 pt-20 overflow-auto">
                    <div className="px-6 py-4">
                        <div className="flex items-center justify-between mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">Manajemen Pemesanan</h1>
                            <button
                                onClick={() => fetchBookings()}
                                className="flex items-center px-4 py-2 text-white transition bg-blue-600 rounded-md hover:bg-blue-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                </svg>
                                Refresh
                            </button>
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="flex justify-center p-8">
                                <div className="w-12 h-12 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
                            </div>
                        )}

                        {/* Error State */}
                        {error && (
                            <div className="flex items-center p-4 mb-6 text-red-700 bg-red-100 border border-red-200 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </div>
                        )}

                        {/* Booking Table */}
                        {!loading && !error && (
                            <div className="overflow-hidden bg-white rounded-lg shadow">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                    ID
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                    Nama
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                    Tanggal
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                    Waktu
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                    Status
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {bookings.length > 0 ? (
                                                bookings.map((booking) => {
                                                    // Ambil sesi terurut
                                                    const sesi = booking.sesi || [];
                                                    sesi.sort((a, b) => (a.jam_mulai > b.jam_mulai ? 1 : -1));
                                                    const jamMulai = sesi.length > 0 ? sesi[0].jam_mulai : "-";
                                                    const jamSelesai = sesi.length > 0 ? sesi[sesi.length - 1].jam_selesai : "-";
                                                    return (
                                                        <tr key={booking.id_pemesanan} className="hover:bg-gray-50">
                                                            <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                                {booking.id_pemesanan}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                                {booking.nama_pelanggan}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                                {new Date(booking.tanggal).toLocaleDateString('id-ID')}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                                {jamMulai} - {jamSelesai}
                                                            </td>
                                                            <td className="px-6 py-4 whitespace-nowrap">
                                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                                                                    {booking.status}
                                                                </span>
                                                            </td>
                                                            <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                                                <div className="flex space-x-2">
                                                                    <button
                                                                        onClick={() => handleView(booking)}
                                                                        className="text-blue-600 hover:text-blue-900"
                                                                        title="Lihat"
                                                                    >
                                                                        <FaEye className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleEdit(booking)}
                                                                        className="text-yellow-600 hover:text-yellow-900"
                                                                        title="Edit"
                                                                    >
                                                                        <FaEdit className="w-4 h-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDelete(booking)}
                                                                        className="text-red-600 hover:text-red-900"
                                                                        title="Hapus"
                                                                    >
                                                                        <FaTrash className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="px-6 py-12 text-sm text-center text-gray-500">
                                                        Tidak ada data pemesanan
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <ModalContent />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}