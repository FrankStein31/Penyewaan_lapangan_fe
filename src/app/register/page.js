'use client';

import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        password_confirmation: ''
    });
    const [error, setError] = useState('');
    const [errors, setErrors] = useState({});
    const { register, loading } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name) newErrors.name = 'Nama wajib diisi';
        if (!formData.email) newErrors.email = 'Email wajib diisi';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Format email tidak valid';

        if (!formData.phone) newErrors.phone = 'Nomor telepon wajib diisi';
        else if (!/^[0-9]{10,13}$/.test(formData.phone)) newErrors.phone = 'Nomor telepon tidak valid';

        if (!formData.password) newErrors.password = 'Password wajib diisi';
        else if (formData.password.length < 6) newErrors.password = 'Password minimal 6 karakter';

        if (!formData.password_confirmation) newErrors.password_confirmation = 'Konfirmasi password wajib diisi';
        else if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = 'Password dan konfirmasi password tidak cocok';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) return;

        try {
            const dataToSend = {
                nama: formData.name,
                email: formData.email,
                no_hp: formData.phone,
                password: formData.password,
                password_confirmation: formData.password_confirmation
            };

            await register(dataToSend);
        } catch (err) {
            if (err.response?.data?.errors) {
                const backendErrors = err.response.data.errors;
                const fieldErrors = {};

                Object.keys(backendErrors).forEach(key => {
                    const frontendKey = key === 'nama' ? 'name' : (key === 'no_hp' ? 'phone' : key);
                    fieldErrors[frontendKey] = backendErrors[key][0];
                });

                setErrors(fieldErrors);
            } else {
                setError(err.response?.data?.message || 'Registrasi gagal. Silahkan coba lagi.');
            }
        }
    };

    return (
        <>
            <Head>
                <title>Registrasi | Sport Center</title>
                <meta name="description" content="Halaman registrasi Sport Center" />
            </Head>

            <div className="min-h-screen font-sans bg-gradient-to-br from-gray-900 to-gray-800">
                <div className="container flex flex-col items-center justify-center min-h-screen px-4 py-8 mx-auto">
                    <div className="relative w-full max-w-md">
                        {/* Efek dekoratif */}
                        <div className="absolute inset-0 transform bg-blue-400 shadow-lg rounded-3xl -rotate-6"></div>
                        <div className="absolute inset-0 transform bg-red-400 shadow-lg rounded-3xl rotate-6"></div>

                        {/* Kartu utama */}
                        <div className="relative p-8 overflow-hidden shadow-xl bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl">
                            <div className="mb-8 text-center">
                                <h1 className="text-3xl font-bold text-white">Registrasi</h1>
                                <p className="mt-2 text-white">Buat akun baru untuk bergabung</p>
                            </div>

                            {error && (
                                <div className="flex items-center p-3 mb-4 text-sm text-red-300 border rounded-md bg-red-900/50 backdrop-blur-sm border-red-700/50">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                                {/* Field nama */}
                                <div>
                                    <label htmlFor="name" className="block mb-1 text-sm font-medium text-white">
                                        Nama Lengkap
                                    </label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        required
                                        className={`w-full px-4 py-3 transition-all border rounded-lg shadow-sm bg-gray-800/50 border-gray-700/50 focus:ring-2 focus:ring-blue-500/50 text-white focus:border-blue-500 placeholder-gray-400 ${errors.name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}`}
                                        placeholder="Masukkan nama lengkap"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                    {errors.name && (
                                        <p className="mt-1 text-xs text-red-400">{errors.name}</p>
                                    )}
                                </div>

                                {/* Field email */}
                                <div>
                                    <label htmlFor="email" className="block mb-1 text-sm font-medium text-white">
                                        Alamat Email
                                    </label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        className={`w-full px-4 py-3 transition-all border rounded-lg shadow-sm bg-gray-800/50 border-gray-700/50 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 placeholder-gray-400 ${errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}`}
                                        placeholder="contoh@email.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                    {errors.email && (
                                        <p className="mt-1 text-xs text-red-400">{errors.email}</p>
                                    )}
                                </div>

                                {/* Field telepon */}
                                <div>
                                    <label htmlFor="phone" className="block mb-1 text-sm font-medium text-white">
                                        Nomor Telepon
                                    </label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        autoComplete="tel"
                                        required
                                        className={`w-full px-4 py-3 transition-all border rounded-lg shadow-sm bg-gray-800/50 border-gray-700/50 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 placeholder-gray-400 ${errors.phone ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}`}
                                        placeholder="08xxxxxxxxxx"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                    {errors.phone && (
                                        <p className="mt-1 text-xs text-red-400">{errors.phone}</p>
                                    )}
                                </div>

                                {/* Field password */}
                                <div>
                                    <label htmlFor="password" className="block mb-1 text-sm font-medium text-white">
                                        Kata Sandi
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            autoComplete="new-password"
                                            required
                                            minLength="6"
                                            className={`w-full px-4 py-3 pr-12 transition-all border rounded-lg shadow-sm bg-gray-800/50 border-gray-700/50 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 placeholder-gray-400 ${errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}`}
                                            placeholder="Minimal 6 karakter"
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                        <button
                                            type="button"
                                            className="absolute text-gray-400 transition-colors transform -translate-y-1/2 right-3 top-1/2 hover:text-blue-300 focus:outline-none"
                                            onClick={() => setShowPassword(!showPassword)}
                                            aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                                        >
                                            {showPassword ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1 text-xs text-red-400">{errors.password}</p>
                                    )}
                                </div>

                                {/* Field konfirmasi password */}
                                <div>
                                    <label htmlFor="password_confirmation" className="block mb-1 text-sm font-medium text-white">
                                        Konfirmasi Kata Sandi
                                    </label>
                                    <div className="relative">
                                        <input
                                            id="password_confirmation"
                                            name="password_confirmation"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            autoComplete="new-password"
                                            required
                                            className={`w-full px-4 py-3 pr-12 transition-all border rounded-lg shadow-sm bg-gray-800/50 border-gray-700/50 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 placeholder-gray-400 ${errors.password_confirmation ? 'border-red-500 focus:border-red-500 focus:ring-red-500/50' : ''}`}
                                            placeholder="Masukkan ulang kata sandi"
                                            value={formData.password_confirmation}
                                            onChange={handleChange}
                                        />
                                        <button
                                            type="button"
                                            className="absolute text-gray-400 transition-colors transform -translate-y-1/2 right-3 top-1/2 hover:text-blue-300 focus:outline-none"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            aria-label={showConfirmPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                                        >
                                            {showConfirmPassword ? (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                                </svg>
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                    {errors.password_confirmation && (
                                        <p className="mt-1 text-xs text-red-400">{errors.password_confirmation}</p>
                                    )}
                                </div>

                                {/* Tombol submit */}
                                <div className="pt-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className={`w-full flex justify-center py-3 px-4 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-gray-800 transition-all duration-300 shadow-lg hover:shadow-blue-500/20 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                                    >
                                        {loading ? (
                                            <>
                                                <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Memproses...
                                            </>
                                        ) : 'Daftar Sekarang'}
                                    </button>
                                </div>
                            </form>

                            {/* Link login */}
                            <div className="mt-6 text-sm text-center">
                                <p className="text-gray-300">
                                    Sudah punya akun?{' '}
                                    <Link href="/login" className="font-medium text-blue-400 transition-colors hover:text-blue-300">
                                        Masuk disini
                                    </Link>
                                </p>
                                <Link href="/" className="block mt-2 text-sm text-blue-400 transition-colors hover:text-blue-300">
                                    Kembali ke Beranda
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}