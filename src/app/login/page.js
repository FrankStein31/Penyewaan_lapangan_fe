'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, loading } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email dan password harus diisi');
      return;
    }

    try {
      await login(email, password);
      // Redirect akan ditangani oleh AuthContext
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal. Silahkan coba lagi.');
    }
  };

  const handleLoginSosial = (provider) => {
    // Implementasi login sosial
    console.log(`Login dengan ${provider}`);
    // Tambahkan logika untuk login dengan provider sosial
  };

  return (
    <>
      <Head>
        <title>Login | Sport Center</title>
        <meta name="description" content="Halaman login Sport Center" />
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
                <h1 className="text-3xl font-bold text-white">Login</h1>
                <p className="mt-2 text-white">Silakan masuk untuk melanjutkan</p>
              </div>

              {error && (
                <div className="flex items-center p-3 mb-4 text-sm text-red-700 bg-red-100 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
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
                    className="w-full px-4 py-3 text-white transition-all border border-gray-200 rounded-lg shadow-sm bg-gradient-to-br from-gray-900 to-gray-800 focus:ring-2 focus:ring-blue-500 focus:bg-blue-50 focus:border-blue-400"
                    placeholder="contoh@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Field password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="password" className="block text-sm font-medium text-white">
                      Kata Sandi
                    </label>
                    <Link href="/lupa-password" className="text-xs font-medium text-blue-600 hover:text-blue-500">
                      Lupa kata sandi?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      required
                      minLength="6"
                      className="w-full px-4 py-3 pr-12 text-white transition-all border border-gray-200 rounded-lg shadow-sm bg-gradient-to-br from-gray-900 to-gray-800 focus:ring-2 focus:ring-blue-500 focus:bg-blue-50 focus:border-blue-400"
                      placeholder="Masukkan kata sandi"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute text-gray-500 transform -translate-y-1/2 right-3 top-1/2 hover:text-gray-700 focus:outline-none"
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
                </div>

                {/* Ingat saya */}
                <div className="flex items-center">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="rememberMe" className="block ml-2 text-sm text-white">
                    Ingat saya
                  </label>
                </div>

                {/* Tombol submit */}
                <div>
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
                    ) : 'Masuk'}
                  </button>
                </div>
              </form>

              {/* Pembatas login sosial */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 text-white bg-gradient-to-br from-gray-900 to-gray-800">
                      Atau masuk menggunakan
                    </span>
                  </div>
                </div>

                {/* Tombol login sosial */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => handleLoginSosial('Facebook')}
                    disabled={loading}
                    className={`inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white transition-all bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-300 shadow-sm rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-2">Facebook</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleLoginSosial('Google')}
                    disabled={loading}
                    className={`inline-flex justify-center w-full px-4 py-2 text-sm font-medium text-white transition-all bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-300 shadow-sm rounded-xl hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      <path d="M1 1h22v22H1z" fill="none" />
                    </svg>
                    <span className="ml-2">Google</span>
                  </button>
                </div>
              </div>

              {/* Link pendaftaran */}
              <div className="mt-6 text-sm text-center">
                <p className="text-white">
                  Belum punya akun?{' '}
                  <Link href="/daftar" className="font-medium text-blue-600 hover:text-blue-500">
                    Daftar sekarang
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}