'use client';
// File: src/sections/LapanganTerlaris.js
// Deskripsi: Komponen ini menampilkan daftar lapangan terlaris dengan efek glow dan animasi saat di-hover.

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { fieldService } from '@/services/api'; // Import service yang sama dengan admin


export default function LapanganTerlaris() {
    const [popularCourts, setPopularCourts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch data dari API saat komponen dimount
    useEffect(() => {
        fetchPopularCourts();
    }, []);

    const fetchPopularCourts = async () => {
        try {
            setLoading(true);
            const response = await fieldService.getAll();

            if (response && response.data) {
                const data = Array.isArray(response.data) ? response.data : response.data.data;

                // Filter dan transform data untuk menampilkan lapangan terlaris
                // Anda bisa menambahkan logika untuk menentukan lapangan mana yang "terlaris"
                // Misalnya berdasarkan jumlah booking, rating, atau kriteria lainnya
                const transformedData = data
                    .filter(lapangan => lapangan.status === 'tersedia') // Hanya tampilkan yang tersedia
                    .slice(2, 6) // Ambil 3 lapangan pertama sebagai "terlaris"
                    .map((lapangan, index) => ({
                        id: lapangan.id,
                        name: lapangan.nama,
                        price: formatPrice(lapangan.harga),
                        period: '/jam',
                        description: lapangan.deskripsi || `Lapangan ${lapangan.kategori?.nama_kategori || ''} berkualitas premium`,
                        highlighted: index === 0, // Lapangan pertama sebagai highlight
                        btnText: 'Booking Sekarang',
                        glowColor: getGlowColor(index),
                        image: getFotoUrl(lapangan.foto),
                        category: lapangan.kategori?.nama_kategori || '',
                        capacity: lapangan.kapasitas,
                        facilities: lapangan.fasilitas || []
                    }));

                setPopularCourts(transformedData);
                setError(null);
            } else {
                setPopularCourts([]);
            }
        } catch (err) {
            console.error('Error fetching lapangan:', err);
            setError('Gagal memuat data lapangan');

            // Fallback ke data statis jika API gagal
            setPopularCourts([
                {
                    name: 'Lapangan Futsal',
                    price: '150K',
                    period: '/jam',
                    description: 'Lapangan indoor dengan rumput sintetis berkualitas tinggi',
                    highlighted: true,
                    btnText: 'Booking Sekarang',
                    glowColor: 'from-green-500/10 to-green-600/20',
                    image: '/images/fut2.jpg'
                },
                {
                    name: 'Lapangan Basket',
                    price: '175K',
                    period: '/jam',
                    description: 'Lapangan indoor dengan lantai kayu profesional anti-selip',
                    highlighted: true,
                    btnText: 'Booking Sekarang',
                    glowColor: 'from-orange-500/10 via-red-500/10 to-red-600/20',
                    image: '/images/basket.jpg'
                },
                {
                    name: 'Lapangan Badminton',
                    price: '120K',
                    period: '/jam',
                    description: 'Lapangan dengan lantai vinyl khusus untuk performa terbaik',
                    highlighted: true,
                    btnText: 'Booking Sekarang',
                    glowColor: 'from-blue-500/10 to-indigo-600/20',
                    image: '/images/bad2.jpg'
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    // Fungsi helper untuk format harga
    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID')
            .format(price)
            .replace(/\./g, ',') + 'K';
    };

    // Fungsi helper untuk mendapatkan URL foto
    const getFotoUrl = (fotoPath) => {
        if (!fotoPath) {
            // Return default image berdasarkan kategori atau index
            return '/images/default.jpg';
        }

        if (fotoPath.startsWith('http')) {
            return fotoPath;
        }

        const baseApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
        const baseUrl = baseApiUrl.replace('/api', '');
        return `${baseUrl}/storage/${fotoPath}`;
    };

    // Fungsi helper untuk mendapatkan warna glow
    const getGlowColor = (index) => {
        const colors = [
            'from-green-500/10 to-green-600/20',
            'from-orange-500/10 via-red-500/10 to-red-600/20',
            'from-blue-500/10 to-indigo-600/20',
            'from-purple-500/10 to-pink-600/20',
            'from-yellow-500/10 to-orange-600/20'
        ];
        return colors[index % colors.length];
    };

    return (
        <section id="popular-courts" className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
            {/* Floating gradient elements */}
            <div className="absolute top-0 left-0 w-64 h-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-500/10 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 translate-x-1/2 translate-y-1/2 rounded-full bg-orange-500/10 blur-3xl"></div>

            <div className="container relative z-10 px-4 mx-auto sm:px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <span className="inline-block px-4 py-1 mb-3 text-xs font-semibold tracking-wider text-green-400 uppercase rounded-full bg-green-900/30">
                        TERFAVORIT
                    </span>
                    <h2 className="mb-4 text-3xl font-bold text-center text-white md:text-4xl lg:text-5xl">
                        Lapangan <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">Terlaris</span>
                    </h2>
                    <p className="max-w-3xl mx-auto text-lg text-gray-300 md:text-xl">
                        Nikmati fasilitas olahraga terbaik dengan lapangan berkualitas premium untuk pengalaman bermain terbaik Anda.
                    </p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center p-8">
                        <div className="w-12 h-12 border-t-2 border-b-2 border-green-500 rounded-full animate-spin"></div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="px-4 py-3 mb-6 text-center text-yellow-300 border rounded-lg border-yellow-500/30 bg-yellow-900/20">
                        <p>{error}</p>
                        <p className="mt-2 text-sm text-gray-400">Menampilkan data contoh</p>
                    </div>
                )}

                {/* Courts Grid */}
                {!loading && (
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
                        {popularCourts.map((court, index) => (
                            <div
                                key={court.id || index}
                                className={`relative overflow-hidden rounded-xl transition-all duration-500 ease-in-out group hover:-translate-y-2 ${court.highlighted
                                    ? 'ring-4 ring-orange-500/50 shadow-2xl'
                                    : 'shadow-lg hover:shadow-xl'
                                    }`}
                            >
                                {/* Glow Effect */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${court.glowColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl`}></div>

                                {court.highlighted && (
                                    <div className="absolute top-0 right-0 px-4 py-1 text-xs font-bold text-white transform translate-x-2 -translate-y-2 rounded-full shadow-sm rotate-12 bg-gradient-to-r from-orange-600 to-red-600">
                                        PALING LARIS
                                    </div>
                                )}

                                <div className={`relative h-full flex flex-col bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl ${court.highlighted ? 'border-t-4 border-t-orange-500' : ''
                                    }`}>
                                    {/* Image */}
                                    <div className="relative w-full h-48 overflow-hidden">
                                        {court.image && court.image.startsWith('http') ? (
                                            // Gunakan img biasa untuk URL eksternal jika Next.js Image bermasalah
                                            <img
                                                src={court.image}
                                                alt={`Gambar ${court.name}`}
                                                className="object-cover w-full h-full rounded-t-xl"
                                                onError={(e) => {
                                                    e.target.src = '/images/default-court.jpg';
                                                }}
                                            />
                                        ) : (
                                            // Gunakan Next.js Image untuk gambar lokal
                                            <Image
                                                src={court.image || '/images/default-court.jpg'}
                                                alt={`Gambar ${court.name}`}
                                                fill
                                                className="object-cover rounded-t-xl"
                                                onError={(e) => {
                                                    e.target.src = '/images/default-court.jpg';
                                                }}
                                            />
                                        )}
                                        <div className="absolute inset-0 z-10 bg-gradient-to-b from-gray-900/0 to-gray-900/80"></div>

                                        {/* Category Badge */}
                                        {court.category && (
                                            <div className="absolute z-20 top-3 left-3">
                                                <span className="inline-block px-2 py-1 text-xs font-semibold text-white rounded-full bg-black/50 backdrop-blur-sm">
                                                    {court.category}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 p-8">
                                        <h3 className={`text-2xl font-extrabold mb-3 ${court.highlighted
                                            ? 'text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400'
                                            : 'text-white'
                                            }`}>
                                            {court.name}
                                        </h3>
                                        <p className="mb-6 text-gray-300">{court.description}</p>

                                        <div className="mb-6">
                                            <span className="text-4xl font-bold text-white">Rp {court.price}</span>
                                            <span className="text-gray-400">{court.period}</span>
                                        </div>

                                        {/* Facilities */}
                                        {court.facilities && court.facilities.length > 0 && (
                                            <div className="mb-6">
                                                <h4 className="mb-2 text-sm font-semibold tracking-wider text-gray-400 uppercase">
                                                    Fasilitas
                                                </h4>
                                                <div className="flex flex-wrap gap-1">
                                                    {court.facilities.slice(0, 3).map((facility, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="inline-block px-2 py-1 text-xs text-green-300 rounded-full bg-green-900/30"
                                                        >
                                                            {facility.nama_fasilitas}
                                                        </span>
                                                    ))}
                                                    {court.facilities.length > 3 && (
                                                        <span className="inline-block px-2 py-1 text-xs text-gray-400 rounded-full bg-gray-700/50">
                                                            +{court.facilities.length - 3} lainnya
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Capacity */}
                                        {court.capacity && (
                                            <div className="mb-4">
                                                <span className="text-sm text-gray-400">
                                                    Kapasitas: {court.capacity} orang
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="px-8 pb-8">
                                        <Link
                                            href="/login"
                                            className={`block w-full py-3 px-6 rounded-lg font-bold text-center transition-all duration-300 ${court.highlighted
                                                ? 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-md hover:shadow-lg hover:shadow-orange-500/30'
                                                : 'bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white shadow-md hover:shadow-lg hover:shadow-orange-500/30'
                                                }`}
                                        >
                                            {court.btnText}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="relative max-w-4xl p-8 mx-auto mt-20 overflow-hidden text-center rounded-xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-green-900/30 to-blue-900/30 opacity-60 backdrop-blur-sm"></div>
                    <div className="relative">
                        <h3 className="mb-3 text-xl font-semibold text-white">Butuh paket khusus untuk event?</h3>
                        <p className="mb-6 text-gray-300">Kami menyediakan solusi khusus untuk turnamen, event perusahaan, atau acara olahraga lainnya.</p>
                        <Link
                            href="/#contact"
                            className="inline-flex items-center px-6 py-3 text-base font-medium text-white transition-all duration-300 border border-transparent rounded-md shadow-sm bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 hover:shadow-lg hover:shadow-green-500/30"
                        >
                            Hubungi Tim Kami
                            <svg className="w-5 h-5 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}