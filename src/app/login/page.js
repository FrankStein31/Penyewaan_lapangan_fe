'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { Orbitron } from 'next/font/google';

const orbitron = Orbitron({ 
  weight: '600',
  subsets: ['latin'],
});

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { login, loading } = useAuth();
  const router = useRouter();

  // Tambahkan style untuk autofill
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      input:-webkit-autofill,
      input:-webkit-autofill:hover,
      input:-webkit-autofill:focus,
      input:-webkit-autofill:active {
        -webkit-text-fill-color:rgb(133, 133, 133) !important;
        transition: background-color 5000s ease-in-out 0s;
        background-color: #ffffff !important;
        border-radius: 0.75rem !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

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

      <div className="min-h-screen font-sans bg-[#121212]">
        <div className="container flex flex-col items-center justify-center min-h-screen px-4 py-8 mx-auto">
          <div className="relative w-full max-w-md">
            {/* Efek dekoratif */}
            <div className="absolute inset-0 transform bg-[#1a1a1a] shadow-lg rounded-3xl -rotate-6"></div>
            <div className="absolute inset-0 transform bg-[#1e1e1e] shadow-lg rounded-3xl rotate-6"></div>

            {/* Kartu utama */}
            <div className="relative p-8 overflow-hidden bg-[#181818] rounded-3xl shadow-[8px_8px_16px_#0a0a0a,_-8px_-8px_16px_#262626]">
              <div className="mb-8 text-center">
                <div className="flex justify-center mt-4 mb-10">
                  <div className="relative">
                    <div className="relative flex items-center justify-center w-full h-full">
                      <Image
                        src="/images/SIGMA.svg"
                        alt="SIGMA Logo"
                        width={200}
                        height={200}
                        className="object-contain animate-pulse filter drop-shadow-[0_0_8px_rgba(120,198,255,0.6)] hover:drop-shadow-[0_0_12px_rgba(120,198,255,0.8)] transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>
                <h1 className={`text-3xl font-bold text-[#78c6ff] ${orbitron.className}`}>Login</h1>
              </div>

              {error && (
                <div className="flex items-center p-3 mb-4 text-sm text-red-300 bg-[#251515] rounded-xl shadow-[inset_3px_3px_6px_#1a0e0e,_inset_-3px_-3px_6px_#301c1c]">
                  <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* Field email */}
                <div>
                  <label htmlFor="email" className="block mb-2 text-sm font-medium text-[#a8dcff]">
                    Alamat Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-4 py-3 text-[#e1f4ff] rounded-xl bg-[#202020] border-none transition-all shadow-[inset_4px_4px_8px_#151515,_inset_-4px_-4px_8px_#2b2b2b] focus:shadow-[inset_5px_5px_10px_#151515,_inset_-3px_-3px_6px_#2b2b2b] focus:outline-none focus:ring-1 focus:ring-[#78c6ff] placeholder:text-[#666666]"
                    placeholder="contoh@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Field password */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label htmlFor="password" className="block text-sm font-medium text-[#a8dcff]">
                      Kata Sandi
                    </label>
                    <Link href="/lupa-password" className="text-xs font-medium text-[#78c6ff] hover:text-[#a8dcff]">
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
                      className="w-full px-4 py-3 pr-12 text-[#e1f4ff] rounded-xl bg-[#202020] border-none transition-all shadow-[inset_4px_4px_8px_#151515,_inset_-4px_-4px_8px_#2b2b2b] focus:shadow-[inset_5px_5px_10px_#151515,_inset_-3px_-3px_6px_#2b2b2b] focus:outline-none focus:ring-1 focus:ring-[#78c6ff] placeholder:text-[#666666]"
                      placeholder="Masukkan kata sandi"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      className="absolute text-[#78c6ff] transform -translate-y-1/2 right-3 top-1/2 hover:text-[#a8dcff] focus:outline-none"
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
                  <div className="relative flex items-center">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      className="w-5 h-5 rounded-md appearance-none bg-[#202020] shadow-[inset_2px_2px_3px_#151515,_inset_-2px_-2px_3px_#2b2b2b] checked:bg-[#4a9eda] focus:outline-none focus:ring-1 focus:ring-[#78c6ff]"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="absolute text-white pointer-events-none left-1 top-0.5">
                      {rememberMe && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                  </div>
                  <label htmlFor="rememberMe" className="block ml-2 text-sm text-[#a8dcff]">
                    Ingat saya
                  </label>
                </div>

                {/* Tombol submit */}
                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center py-3 px-4 rounded-xl text-sm font-medium text-white
                    bg-[#4a9eda] shadow-[4px_4px_8px_#378ac1,_-4px_-4px_8px_#5db2f3]
                    hover:shadow-[inset_4px_4px_8px_#378ac1,_inset_-4px_-4px_8px_#5db2f3]
                    transition-all duration-300 ${loading ? 'opacity-75 cursor-not-allowed' : ''}`}
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

                
              {/* Link pendaftaran */}
              <div className="mt-6 text-sm text-center">
                <p className="text-[#a8dcff]">
                  Belum punya akun?{' '}
                  <Link href="/register" className="font-medium text-[#78c6ff] hover:text-[#a8dcff]">
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