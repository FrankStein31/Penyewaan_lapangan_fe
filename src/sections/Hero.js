import { Orbitron } from 'next/font/google';
import Image from 'next/image';

const orbitron = Orbitron({ 
  subsets: ['latin'],
  weight: ['500'],
  display: 'swap',
});

export default function Hero() {
    return (
        <section
            id="hero"
            className="relative flex items-center justify-center object-cover min-h-screen overflow-hidden bg-center bg-cover "
            style={{
                backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('/images/bg2.jpg')",
            }}
        >
            <div className="container px-6 mx-auto text-center text-white animate-fade-in-up">
                <div className="flex justify-center mt-24 mb-8">
                    <Image
                        src="/images/SIGMA_HEAD.svg"
                        alt="SIGMA Logo"
                        width={150}
                        height={150}
                        className="animate-pulse drop-shadow-[0_0_30px_rgba(2,150,255,1)]"
                    />
                </div>
                <h1 className={`mb-6 pb-4 text-4xl font-extrabold leading-tight text-transparent shadow-lg md:text-6xl bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 ${orbitron.className}`}>
                    Selamat Datang di <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-teal-300">SIGMA Sport Center</span>
                </h1>
                <p className="max-w-2xl mx-auto mb-8 text-lg md:text-xl lg:text-2xl opacity-90 text-gray-300">
                    Pusat olahraga modern dengan fasilitas lengkap untuk kebutuhan kebugaran dan olahraga Anda di Kota Malang.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                    <a href="/#facilities" className="px-8 py-4 text-lg font-semibold text-white transition duration-300 transform rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-105 hover:shadow-xl">
                        Lihat Fasilitas
                    </a>
                    <a href="/#contact" className="px-8 py-4 text-lg font-semibold text-gray-300 transition duration-300 transform bg-gray-900 rounded-lg hover:bg-gray-700 hover:text-white hover:scale-105 hover:shadow-xl">
                        Hubungi Kami
                    </a>
                </div>
                <div className="mt-16 animate-bounce">
                    <a href="#about" className="inline-block">
                        <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
}
