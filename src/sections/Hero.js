export default function Hero() {
    return (
        <section
            id="hero"
            className="relative flex items-center justify-center min-h-screen bg-center bg-cover"
            style={{
                backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/images/bg.jpg')",
            }}
        >
            <div className="container px-6 mx-auto text-center text-white">
                <h1 className="mb-6 text-4xl font-extrabold leading-tight md:text-6xl">
                    Selamat Datang di <span className="text-primary">SI Sport Center</span>
                </h1>
                <p className="max-w-2xl mx-auto mb-8 text-lg md:text-xl lg:text-2xl">
                    Pusat olahraga modern dengan fasilitas lengkap untuk kebutuhan kebugaran dan olahraga Anda.
                </p>
                <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                    <a href="/#facilities" className="px-6 py-3 text-lg font-semibold text-white transition-all duration-300 rounded-lg bg-primary hover:bg-primary-dark">
                        Lihat Fasilitas
                    </a>
                    <a href="/#contact" className="px-6 py-3 text-lg font-semibold text-white transition-all duration-300 border-2 border-white rounded-lg hover:bg-white hover:text-primary">
                        Hubungi Kami
                    </a>
                </div>
                <div className="mt-16">
                    <a href="#about" className="inline-block animate-bounce">
                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
}
