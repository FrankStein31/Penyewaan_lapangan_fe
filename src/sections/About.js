export default function About() {
    return (
        <section
            id="about"
            className="flex items-center min-h-screen py-16 md:py-24 bg-gradient-to-br from-gray-50 to-blue-50"
        >
            <div className="container max-w-6xl px-4 mx-auto">
                <h2 className="mb-12 text-3xl font-extrabold tracking-tight text-center text-transparent md:text-5xl bg-clip-text bg-gradient-to-r from-blue-700 to-blue-400">
                    Tentang SI Sport Center
                </h2>

                <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
                    <div className="space-y-6">
                        <h3 className="pl-4 text-2xl font-bold text-gray-900 transition-all duration-300 border-l-4 border-blue-600 md:text-3xl">
                            Pusat Olahraga Terlengkap
                        </h3>

                        <div className="space-y-4 text-base leading-relaxed text-gray-700 md:text-lg">
                            <p>
                                SI Sport Center merupakan pusat olahraga terlengkap yang didirikan pada tahun 2010
                                dengan visi menjadi fasilitas olahraga modern yang dapat diakses oleh semua kalangan.
                            </p>
                            <p>
                                Kami menyediakan berbagai fasilitas olahraga seperti kolam renang, lapangan basket,
                                lapangan futsal, lapangan badminton, pusat kebugaran, dan ruang yoga. Semua fasilitas
                                kami dirancang dengan standar internasional untuk memberikan pengalaman terbaik bagi
                                pengguna.
                            </p>
                            <p>
                                Kami juga menyediakan program pelatihan untuk berbagai cabang olahraga yang dibimbing
                                oleh pelatih profesional. Bergabunglah dengan SI Sport Center untuk meningkatkan
                                kebugaran dan keterampilan olahraga Anda.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-6 sm:grid-cols-4">
                            <div className="p-4 text-center transition-all duration-300 transform bg-white shadow-md rounded-xl hover:shadow-xl hover:-translate-y-2">
                                <div className="text-3xl font-bold text-blue-600">10+</div>
                                <div className="text-sm text-gray-600">Tahun Pengalaman</div>
                            </div>
                            <div className="p-4 text-center transition-all duration-300 transform bg-white shadow-md rounded-xl hover:shadow-xl hover:-translate-y-2">
                                <div className="text-3xl font-bold text-blue-600">6+</div>
                                <div className="text-sm text-gray-600">Fasilitas Olahraga</div>
                            </div>
                            <div className="p-4 text-center transition-all duration-300 transform bg-white shadow-md rounded-xl hover:shadow-xl hover:-translate-y-2">
                                <div className="text-3xl font-bold text-blue-600">20+</div>
                                <div className="text-sm text-gray-600">Pelatih Profesional</div>
                            </div>
                            <div className="p-4 text-center transition-all duration-300 transform bg-white shadow-md rounded-xl hover:shadow-xl hover:-translate-y-2">
                                <div className="text-3xl font-bold text-blue-600">5000+</div>
                                <div className="text-sm text-gray-600">Member Aktif</div>
                            </div>
                        </div>
                    </div>

                    <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden shadow-xl">
                        <img
                            src="/images/bg.jpg"
                            alt="Gambar Sport Center"
                            className="object-cover w-full h-full"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
