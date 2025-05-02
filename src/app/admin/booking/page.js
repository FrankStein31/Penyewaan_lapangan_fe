"use client";

import { useState, useEffect } from "react";
import { bookingService } from "../../../services/api";
import { FaEdit, FaTrash, FaEye } from "react-icons/fa";

export default function BookingAdmin() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentBooking, setCurrentBooking] = useState(null);
    const [modalType, setModalType] = useState("view");
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchBookings();
    }, []);

    useEffect(() => {
        if (currentBooking && modalType === "edit") {
            setFormData({ ...currentBooking });
        }
    }, [currentBooking, modalType]);

    const fetchBookings = async () => {
        try {
            setLoading(true);
            const response = await bookingService.getAll();
            setBookings(response?.data?.data || []);
        } catch (error) {
            console.error("Error fetching bookings:", error);
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

    const renderViewModal = () => (
        <div className="max-w-md p-6 mx-auto bg-white rounded-lg">
            <h3 className="mb-4 text-lg font-bold">Detail Pemesanan</h3>
            <div className="mb-4 space-y-1">
                <p><span className="font-semibold">ID:</span> {currentBooking.id}</p>
                <p><span className="font-semibold">Nama:</span> {currentBooking.nama}</p>
                <p><span className="font-semibold">Tanggal:</span> {new Date(currentBooking.tanggal).toLocaleDateString()}</p>
                <p><span className="font-semibold">Waktu:</span> {currentBooking.waktu}</p>
                <p><span className="font-semibold">Status:</span> {currentBooking.status}</p>
                {currentBooking.catatanAdmin && (
                    <p><span className="font-semibold">Catatan Admin:</span> {currentBooking.catatanAdmin}</p>
                )}
            </div>
            <div className="flex justify-end">
                <button
                    className="px-4 py-2 text-white bg-gray-500 rounded"
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
                        className="w-full p-2 border rounded"
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
                        className="w-full p-2 border rounded"
                        rows="3"
                    ></textarea>
                </div>
                <div className="flex justify-end space-x-2">
                    <button
                        type="button"
                        className="px-4 py-2 text-white bg-gray-500 rounded"
                        onClick={closeModal}
                    >
                        Batal
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 text-white bg-blue-500 rounded"
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
                    className="px-4 py-2 text-white bg-gray-500 rounded"
                    onClick={closeModal}
                >
                    Batal
                </button>
                <button
                    className="px-4 py-2 text-white bg-red-500 rounded"
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
        <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="flex flex-col gap-6 mb-8 md:flex-row md:items-center md:justify-between">
                <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Manajemen Pemesanan</h1>

                <div className="flex items-center space-x-4">
                    <button className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <span className="mr-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                        </span>
                        Tambah Baru
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="flex flex-col items-center">
                        <svg className="w-10 h-10 mb-4 text-blue-500 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="font-medium text-gray-500">Memuat data...</p>
                    </div>
                </div>
            ) : (
                <div className="overflow-hidden bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr className="bg-gradient-to-r from-blue-50 to-blue-100">
                                    <th scope="col" className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">ID</th>
                                    <th scope="col" className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">Nama</th>
                                    <th scope="col" className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">Tanggal</th>
                                    <th scope="col" className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">Waktu</th>
                                    <th scope="col" className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">Status</th>
                                    <th scope="col" className="px-6 py-4 text-xs font-semibold tracking-wider text-left text-gray-700 uppercase">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {bookings.length > 0 ? (
                                    bookings.map((booking) => (
                                        <tr key={booking.id} className="transition-colors duration-150 hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{booking.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{booking.nama}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{new Date(booking.tanggal).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap">{booking.waktu}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                              ${booking.status === "confirmed"
                                                        ? "bg-green-100 text-green-800 border border-green-200"
                                                        : booking.status === "pending"
                                                            ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                                            : booking.status === "cancelled"
                                                                ? "bg-red-100 text-red-800 border border-red-200"
                                                                : "bg-blue-100 text-blue-800 border border-blue-200"
                                                    }`}>
                                                    <span className={`w-2 h-2 mr-1.5 rounded-full
                                ${booking.status === "confirmed"
                                                            ? "bg-green-500"
                                                            : booking.status === "pending"
                                                                ? "bg-yellow-500"
                                                                : booking.status === "cancelled"
                                                                    ? "bg-red-500"
                                                                    : "bg-blue-500"
                                                        }`}></span>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                                                <div className="flex items-center space-x-3">
                                                    <button onClick={() => handleView(booking)} className="text-blue-600 transition-colors duration-150 hover:text-blue-900" title="Lihat">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                    <button onClick={() => handleEdit(booking)} className="transition-colors duration-150 text-amber-600 hover:text-amber-900" title="Edit">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                        </svg>
                                                    </button>
                                                    <button onClick={() => handleDelete(booking)} className="text-red-600 transition-colors duration-150 hover:text-red-900" title="Hapus">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                <p className="text-lg font-medium text-gray-500">Tidak ada data pemesanan.</p>
                                                <p className="mt-1 text-sm text-gray-400">Silakan tambahkan pemesanan baru.</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
                    <div className="flex items-end justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" aria-hidden="true"></div>
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
