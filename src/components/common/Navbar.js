'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

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
        ? 'bg-[#101e3d] shadow-[inset_5px_5px_15px_#0a1429,_inset_-5px_-5px_15px_#162851]'
        : 'bg-[#15294e] shadow-[inset_5px_5px_15px_#0f1d38,_inset_-5px_-5px_15px_#1b3564]'}
    `}>
      <div className="container flex items-center justify-between px-4 py-3 mx-auto">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <Image
            src="/images/SIGMA.svg"
            alt="SI Sport Center Logo"
            width={150}
            height={150}
            className="group-hover:scale-105 group-hover:drop-shadow-[0_0_8px_#4d8dff] transition-all duration-300"
          />
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
                  text-blue-200 hover:text-white hover:text-shadow-[0_0_10px_#4d8dff]
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
                px-5 py-2 rounded-xl font-bold tracking-wider
                transition-all duration-300 ease-in-out
                bg-[#162a51] text-blue-200
                shadow-[3px_3px_6px_#0f1d38,_-3px_-3px_6px_#1b3564]
                hover:shadow-[inset_3px_3px_6px_#0f1d38,_inset_-3px_-3px_6px_#1b3564]
                hover:text-white
              `}
            >
              Login
            </Link>

            <Link
              href="/register"
              className={`
                px-5 py-2 rounded-xl font-bold tracking-wider
                transition-all duration-300 ease-in-out
                bg-[#2442a1] text-white
                shadow-[3px_3px_6px_#19327c,_-3px_-3px_6px_#2f52c6]
                hover:shadow-[inset_3px_3px_6px_#19327c,_inset_-3px_-3px_6px_#2f52c6]
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
            bg-[#162a51] text-blue-200
            shadow-[3px_3px_6px_#0f1d38,_-3px_-3px_6px_#1b3564]
            hover:shadow-[inset_3px_3px_6px_#0f1d38,_inset_-3px_-3px_6px_#1b3564]
            hover:text-white
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
          bg-[#101e3d] py-4 px-4
          shadow-[inset_5px_5px_15px_#0a1429,_inset_-5px_-5px_15px_#162851]
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
                className="px-3 py-2 font-medium text-blue-200 transition-all duration-300 rounded-md hover:text-white hover:text-shadow-[0_0_10px_#4d8dff]"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}

            <div className="flex flex-col gap-2 pt-2">
              <Link
                href="/login"
                className="w-full px-4 py-3 font-bold tracking-wider text-center text-blue-200 transition-all duration-300 rounded-xl bg-[#162a51] shadow-[3px_3px_6px_#0f1d38,_-3px_-3px_6px_#1b3564] hover:shadow-[inset_3px_3px_6px_#0f1d38,_inset_-3px_-3px_6px_#1b3564] hover:text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/register"
                className="w-full px-4 py-3 font-bold tracking-wider text-center text-white transition-all duration-300 rounded-xl bg-[#2442a1] shadow-[3px_3px_6px_#19327c,_-3px_-3px_6px_#2f52c6] hover:shadow-[inset_3px_3px_6px_#19327c,_inset_-3px_-3px_6px_#2f52c6]"
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