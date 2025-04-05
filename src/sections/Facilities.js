export default function Facilities() {
    const facilities = [
        {
            name: 'Kolam Renang',
            description: 'Kolam renang standar olimpiade dengan kontrol suhu dan sistem filtrasi modern.',
            icon: (
                <svg className="w-12 h-12 text-blue-400 transition-colors duration-300 group-hover:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            glowColor: 'from-blue-500/10 to-cyan-500/20'
        },
        {
            name: 'Lapangan Basket',
            description: 'Lapangan basket indoor dengan lantai kayu berkualitas tinggi dan perlengkapan standar NBA.',
            icon: (
                <svg className="w-12 h-12 text-blue-400 transition-colors duration-300 group-hover:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
            ),
            glowColor: 'from-purple-500/10 to-blue-500/20'
        },
        {
            name: 'Lapangan Futsal',
            description: 'Lapangan futsal dengan rumput sintetis berkualitas tinggi dan sistem pencahayaan modern.',
            icon: (
                <svg className="w-12 h-12 text-blue-400 transition-colors duration-300 group-hover:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" strokeWidth={2} />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9h.01M15 9h.01" />
                </svg>
            ),
            glowColor: 'from-emerald-500/10 to-teal-500/20'
        },
        {
            name: 'Lapangan Badminton',
            description: 'Lapangan badminton dengan lantai vinyl berkualitas dan pencahayaan ideal untuk pertandingan.',
            icon: (
                <svg className="w-12 h-12 text-blue-400 transition-colors duration-300 group-hover:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            ),
            glowColor: 'from-amber-500/10 to-yellow-500/20'
        },
        {
            name: 'Pusat Kebugaran',
            description: 'Pusat kebugaran lengkap dengan peralatan modern dan area latihan fungsional.',
            icon: (
                <svg className="w-12 h-12 text-blue-400 transition-colors duration-300 group-hover:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            ),
            glowColor: 'from-red-500/10 to-pink-500/20'
        },
        {
            name: 'Ruang Yoga',
            description: 'Ruang yoga yang tenang dengan peralatan lengkap dan suasana yang menenangkan.',
            icon: (
                <svg className="w-12 h-12 text-blue-400 transition-colors duration-300 group-hover:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            glowColor: 'from-indigo-500/10 to-purple-500/20'
        }
    ];

    return (
        <section id="facilities" className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
            {/* Floating gradient elements */}
            <div className="absolute top-0 left-0 w-64 h-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 translate-x-1/2 translate-y-1/2 rounded-full bg-purple-500/10 blur-3xl"></div>

            <div className="container relative z-10 max-w-6xl px-4 mx-auto">
                <div className="mb-12 text-center">
                    <span className="inline-block px-4 py-1 mb-3 text-xs font-semibold tracking-wider text-blue-400 uppercase rounded-full bg-blue-900/30">
                        Fasilitas Unggulan
                    </span>
                    <h2 className="mb-4 text-3xl font-bold text-center text-transparent md:text-4xl bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                        Fasilitas Kami
                    </h2>
                    <p className="max-w-3xl mx-auto text-lg leading-relaxed text-center text-gray-300 md:text-xl">
                        Kami menyediakan berbagai fasilitas olahraga modern dengan standar internasional untuk memberikan pengalaman terbaik bagi Anda.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {facilities.map((facility, index) => (
                        <div
                            key={index}
                            className="relative p-6 transition-all duration-500 transform border rounded-2xl group hover:-translate-y-3 border-gray-700/50 bg-gray-800/50 hover:bg-gray-800/70 hover:shadow-2xl backdrop-blur-sm"
                        >
                            {/* Glow effect */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${facility.glowColor} opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-500`}></div>

                            <div className="relative">
                                <div className="mb-4 transition duration-300 group-hover:scale-110">
                                    {facility.icon}
                                </div>
                                <h3 className="mb-3 text-xl font-bold text-white transition duration-300 group-hover:text-blue-400">
                                    {facility.name}
                                </h3>
                                <p className="text-gray-300">
                                    {facility.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}