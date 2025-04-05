'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`
      fixed top-0 left-0 right-0 z-50 
      transition-all duration-300 ease-in-out 
      ${isScrolled
        ? 'bg-gradient-to-r from-gray-900 to-gray-800 backdrop-blur-md shadow-xl'
        : 'bg-gradient-to-r from-red-400/90 to-blue-500/90'}
    `}>
      <div className="container flex items-center justify-between px-4 py-3 mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <span className={`
            text-2xl font-black tracking-tight 
            ${isScrolled ? 'text-white' : 'text-white'}
            group-hover:scale-105 transition-transform
          `}>
            SI Sport Center
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="items-center hidden space-x-6 md:flex">
          <div className="flex space-x-6">
            {[
              { href: "/#about", label: "Tentang Kami" },
              { href: "/#facilities", label: "Fasilitas" },
              { href: "/#services", label: "Layanan" },
              { href: "/#pricing", label: "Harga" },
              { href: "/#contact", label: "Kontak" }
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  font-semibold tracking-wide
                  transition-all duration-300 
                  ${isScrolled
                    ? 'text-gray-300 hover:text-white'
                    : 'text-white/90 hover:text-white hover:scale-105'}
                `}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex space-x-3">
            <Link
              href="/login"
              className={`
                px-5 py-2 rounded-full font-bold tracking-wider
                transition-all duration-300 ease-in-out
                ${isScrolled
                  ? 'bg-gray-700 text-white hover:bg-gray-600 border border-gray-600'
                  : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'}
              `}
            >
              Login
            </Link>

            <Link
              href="/register"
              className={`
                px-5 py-2 rounded-full font-bold tracking-wider
                transition-all duration-300 ease-in-out
                ${isScrolled
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:from-blue-700 hover:to-cyan-600'
                  : 'bg-red-400 text-white hover:bg-red-500'}
              `}
            >
              Daftar
            </Link>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className={`
            md:hidden w-10 h-10 flex items-center justify-center
            rounded-full transition-all duration-300
            ${isScrolled
              ? 'text-gray-300 hover:bg-gray-700'
              : 'text-white hover:bg-white/20'}
          `}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle Mobile Menu"
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={`
          md:hidden absolute top-full left-0 w-full 
          bg-gradient-to-b from-gray-900 to-gray-800 shadow-lg py-4 px-4
          backdrop-blur-md
        `}>
          <div className="flex flex-col space-y-4">
            {[
              { href: "/#about", label: "Tentang Kami" },
              { href: "/#facilities", label: "Fasilitas" },
              { href: "/#services", label: "Layanan" },
              { href: "/#pricing", label: "Harga" },
              { href: "/#contact", label: "Kontak" }
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 font-medium text-gray-300 transition-all duration-300 rounded-md hover:text-white hover:bg-gray-700"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <div className="flex flex-col gap-2">
              <Link
                href="/login"
                className="w-full px-4 py-3 font-bold tracking-wider text-center text-white transition-all duration-300 bg-gray-700 rounded-full hover:bg-gray-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="w-full px-4 py-3 font-bold tracking-wider text-center text-white transition-all duration-300 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                Daftar
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}