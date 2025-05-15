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
            setError(null); // Reset error state on new fetch
            const response = await bookingService.getAll();
            setBookings(response?.data?.data || []);
        } catch (error) {
            console.error("Error fetching bookings:", error);
            setError("Gagal memuat data pemesanan. Silakan coba lagi."); // Set error message
        } finally {
            setLoading(false);
        }
    };


    const handleView = (booking) => {
        setCurrentBooking(booking);
        setModalType("view");
        setShowModal(true);
    };

    const handleEdit = (booking) => {
        setCurrentBooking(booking);
        setModalType("edit");
        setShowModal(true);
    };

    const handleDelete = (booking) => {
        setCurrentBooking(booking);
        setModalType("delete");
        setShowModal(true);
    };

    const confirmDelete = async () => {
        try {
            await bookingService.delete(currentBooking.id);
            setShowModal(false);
            fetchBookings();
        } catch (error) {
            console.error("Error deleting booking:", error);
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const renderViewModal = () => (
        <div className="max-w-md p-6 mx-auto bg-white rounded-lg">
            <h3 className="mb-4 text-lg font-bold">Detail Pemesanan</h3>
            <div className="mb-4 space-y-2">
                <p><span className="font-semibold">ID:</span> {currentBooking.id}</p>
                <p><span className="font-semibold">Nama:</span> {currentBooking.nama}</p>
                <p><span className="font-semibold">Tanggal:</span> {new Date(currentBooking.tanggal).toLocaleDateString('id-ID')}</p>
                <p><span className="font-semibold">Waktu:</span> {currentBooking.waktu}</p>
                <p><span className="font-semibold">Status:</span>
                    <span className={`ml-1 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(currentBooking.status)}`}>
                        {currentBooking.status}
                    </span>
                </p>
                {currentBooking.catatanAdmin && (
                    <p><span className="font-semibold">Catatan Admin:</span> {currentBooking.catatanAdmin}</p>
                )}
            </div>
            <div className="flex justify-end">
                <button
                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                    onClick={closeModal}
                >
                    Tutup
                </button>
            </div>
        </div>
    );

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
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="completed">Completed</option>
                    </select>
                </div>
                <div>
                    <label className="block mb-1 text-sm font-medium">Catatan Admin</label>
                    <textarea
                        name="catatanAdmin"
                        value={formData.catatanAdmin || ""}
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

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Topbar />
                <main className="flex-1 overflow-auto pt-20">
                    <div className="px-6 py-4">
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-2xl font-bold text-gray-800">Manajemen Pemesanan</h1>
                            <button
                                onClick={() => fetchBookings()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition flex items-center"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                </svg>
                                Refresh
                            </button>
                        </div>

                        {/* Loading State */}
                        {loading && (
                            <div className="flex justify-center p-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        )}

                        {/* Error State */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-100 border border-red-200 text-red-700 rounded-lg flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </div>
                        )}

                        {/* Booking Table */}
                        {!loading && !error && (
                            <div className="bg-white rounded-lg shadow overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    ID
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Nama
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Tanggal
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Waktu
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Aksi
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {bookings.length > 0 ? (
                                                bookings.map((booking) => (
                                                    <tr key={booking.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                                                            {booking.id}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                            {booking.nama}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                            {new Date(booking.tanggal).toLocaleDateString('id-ID')}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                                                            {booking.waktu}
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
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="6" className="px-6 py-12 text-center text-sm text-gray-500">
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
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                            <ModalContent />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}