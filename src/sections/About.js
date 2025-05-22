export default function About() {
    return (
        <section
            id="about"
            className="relative flex items-center min-h-screen py-20 overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800"
        >
            {/* Floating gradient elements */}
            <div className="absolute top-0 left-0 w-64 h-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 translate-x-1/2 translate-y-1/2 rounded-full bg-purple-500/10 blur-3xl"></div>

            <div className="container relative z-10 max-w-6xl px-4 mx-auto">
                <div className="mb-16 text-center">
                    <span className="inline-block px-4 py-1 mb-3 text-xs font-semibold tracking-wider text-blue-400 uppercase rounded-full bg-blue-900/30">
                        Tentang Kami
                    </span>
                    <h2 className="mb-4 text-3xl font-bold text-center text-white md:text-4xl lg:text-5xl">
                        Tentang <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">Sport Center</span>
                    </h2>
                    <div className="w-16 h-1 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                </div>

                <div className="grid items-center grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
                    <div className="space-y-8">
                        <h3 className="pl-4 text-2xl font-bold text-white transition-all duration-300 border-l-4 border-blue-400 md:text-3xl">
                            Pusat Olahraga <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">Terlengkap</span>
                        </h3>

                        <div className="space-y-6 text-base leading-relaxed text-gray-300 md:text-lg">
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

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                            {[
                                { value: "10+", label: "Tahun Pengalaman", glow: "from-blue-500/20 to-blue-600/30" },
                                { value: "6+", label: "Fasilitas Olahraga", glow: "from-purple-500/20 to-blue-600/30" },
                                { value: "20+", label: "Pelatih Profesional", glow: "from-cyan-500/20 to-blue-600/30" },
                                { value: "5000+", label: "Member Aktif", glow: "from-indigo-500/20 to-blue-600/30" }
                            ].map((stat, index) => (
                                <div
                                    key={index}
                                    className="relative p-4 text-center transition-all duration-500 transform border rounded-xl hover:-translate-y-2 border-gray-700/50 bg-gray-800/50 hover:bg-gray-800/70 hover:shadow-xl backdrop-blur-sm"
                                >
                                    {/* Glow effect */}
                                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.glow} opacity-0 hover:opacity-100 rounded-xl transition-opacity duration-500`}></div>

                                    <div className="relative">
                                        <div className="text-3xl font-bold text-white">{stat.value}</div>
                                        <div className="text-sm text-gray-400">{stat.label}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="relative h-[400px] md:h-[500px] rounded-3xl overflow-hidden group">
                        {/* Glow effect */}
                        <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/30 group-hover:opacity-100"></div>

                        {/* Image */}
                        <img
                            src="/images/tentang sport center.jpg"
                            alt="Gambar Sport Center"
                            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}