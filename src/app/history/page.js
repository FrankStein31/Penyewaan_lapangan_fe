// File: app/booking/history/page.js

'use client';

import { useEffect, useState } from 'react';
import { getHistory } from '@/services/api';

export default function HistoryPage() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await getHistory();
                setBookings(res.data);
            } catch (err) {
                setError('Gagal memuat data riwayat booking.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    return (
        <div className="p-6">
            <h1 className="mb-4 text-2xl font-bold">Riwayat Booking</h1>

            {loading && <p>Memuat data...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && (
                bookings.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full border border-gray-200 table-auto">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 border">No</th>
                                    <th className="px-4 py-2 border">Nama</th>
                                    <th className="px-4 py-2 border">Tanggal</th>
                                    <th className="px-4 py-2 border">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((booking, index) => (
                                    <tr key={index} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 text-center border">{index + 1}</td>
                                        <td className="px-4 py-2 border">{booking.name}</td>
                                        <td className="px-4 py-2 border">{new Date(booking.date).toLocaleDateString('id-ID')}</td>
                                        <td className="px-4 py-2 text-center border">{booking.status}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>Tidak ada riwayat booking.</p>
                )
            )}
        </div>
    );
}
