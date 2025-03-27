import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-white">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="text-xl font-bold mb-4">SI Sport Center</h3>
                        <p className="mb-4">Pusat olahraga modern dengan fasilitas lengkap untuk kebutuhan kebugaran dan olahraga Anda.</p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-white hover:text-blue-400">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                                </svg>
                            </a>
                            <a href="#" className="text-white hover:text-blue-400">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465.668.25 1.29.621 1.883 1.214.593.593.963 1.215 1.214 1.883.247.636.416 1.363.465 2.427.047 1.024.06 1.379.06 3.808s-.013 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.214 1.883 4.902 4.902 0 01-1.883 1.214c-.636.247-1.363.416-2.427.465-1.024.047-1.379.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.883-1.214 4.902 4.902 0 01-1.214-1.883c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808s.013-2.784.06-3.808c.049-1.064.218-1.791.465-2.427.25-.668.621-1.29 1.214-1.883.593-.593 1.215-.963 1.883-1.214.636-.247 1.363-.416 2.427-.465 1.024-.047 1.379-.06 3.808-.06M12 0C9.556 0 9.249.01 8.204.06 7.174.11 6.373.278 5.669.525a7.38 7.38 0 00-2.706 1.764 7.38 7.38 0 00-1.764 2.706C.99 5.673.822 6.474.77 7.504.723 8.55.712 8.856.712 11.3c0 2.444.01 2.751.06 3.796.049 1.03.217 1.83.464 2.535a7.38 7.38 0 001.764 2.706 7.38 7.38 0 002.706 1.764c.683.248 1.484.415 2.515.464 1.045.05 1.352.06 3.796.06 2.444 0 2.751-.01 3.796-.06 1.03-.049 1.83-.216 2.535-.464a7.38 7.38 0 002.706-1.764 7.38 7.38 0 001.764-2.706c.248-.683.415-1.484.464-2.515.05-1.045.06-1.352.06-3.796 0-2.444-.01-2.751-.06-3.796-.049-1.03-.216-1.83-.464-2.535a7.38 7.38 0 00-1.764-2.706A7.38 7.38 0 0017.834.525C17.131.278 16.33.11 15.3.06 14.255.01 13.948 0 11.504 0h.496z" />
                                    <path d="M12 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8z" />
                                </svg>
                            </a>
                            <a href="#" className="text-white hover:text-blue-400">
                                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4">Menu</h3>
                        <ul className="space-y-2">
                            <li><Link href="/#about" className="hover:text-blue-400">Tentang Kami</Link></li>
                            <li><Link href="/#facilities" className="hover:text-blue-400">Fasilitas</Link></li>
                            <li><Link href="/#services" className="hover:text-blue-400">Layanan</Link></li>
                            <li><Link href="/#pricing" className="hover:text-blue-400">Harga</Link></li>
                            <li><Link href="/#gallery" className="hover:text-blue-400">Galeri</Link></li>
                            <li><Link href="/#contact" className="hover:text-blue-400">Kontak</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4">Fasilitas</h3>
                        <ul className="space-y-2">
                            <li><Link href="/#" className="hover:text-blue-400">Kolam Renang</Link></li>
                            <li><Link href="/#" className="hover:text-blue-400">Lapangan Basket</Link></li>
                            <li><Link href="/#" className="hover:text-blue-400">Lapangan Futsal</Link></li>
                            <li><Link href="/#" className="hover:text-blue-400">Lapangan Badminton</Link></li>
                            <li><Link href="/#" className="hover:text-blue-400">Pusat Kebugaran</Link></li>
                            <li><Link href="/#" className="hover:text-blue-400">Ruang Yoga</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-xl font-bold mb-4">Kontak</h3>
                        <ul className="space-y-2">
                            <li className="flex items-start space-x-2">
                                <svg className="w-6 h-6 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>Jl. Olahraga No. 123, Jakarta Selatan</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <svg className="w-6 h-6 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                <span>+62 21 1234 5678</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <svg className="w-6 h-6 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                <span>info@sisportcenter.com</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <svg className="w-6 h-6 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Senin - Minggu: 06.00 - 22.00</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-8 text-center">
                    <p>&copy; {new Date().getFullYear()} SI Sport Center. Hak Cipta Dilindungi.</p>
                </div>
            </div>
        </footer>
    );
}