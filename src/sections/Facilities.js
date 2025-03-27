export default function Facilities() {
    const facilities = [
        {
            name: 'Kolam Renang',
            description: 'Kolam renang standar olimpiade dengan kontrol suhu dan sistem filtrasi modern.',
            icon: (
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            name: 'Lapangan Basket',
            description: 'Lapangan basket indoor dengan lantai kayu berkualitas tinggi dan perlengkapan standar NBA.',
            icon: (
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                </svg>
            )
        },
        {
            name: 'Lapangan Futsal',
            description: 'Lapangan futsal dengan rumput sintetis berkualitas tinggi dan sistem pencahayaan modern.',
            icon: (
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" strokeWidth={2} />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14s1.5 2 4 2 4-2 4-2" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9h.01M15 9h.01" />
                </svg>
            )
        },
        {
            name: 'Lapangan Badminton',
            description: 'Lapangan badminton dengan lantai vinyl berkualitas dan pencahayaan ideal untuk pertandingan.',
            icon: (
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
            )
        },
        {
            name: 'Pusat Kebugaran',
            description: 'Pusat kebugaran lengkap dengan peralatan modern dan area latihan fungsional.',
            icon: (
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
            )
        },
        {
            name: 'Ruang Yoga',
            description: 'Ruang yoga yang tenang dengan peralatan lengkap dan suasana yang menenangkan.',
            icon: (
                <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            )
        }
    ];

    return (
        <section
            id="facilities"
            className="py-16 md:py-24 bg-gray-50"
        >
            <div className="container max-w-6xl px-4 mx-auto">
                <h2 className="mb-6 text-3xl font-extrabold tracking-tight text-center text-transparent md:text-4xl bg-clip-text bg-gradient-to-r from-blue-700 to-blue-500">
                    Fasilitas Kami
                </h2>
                <p className="max-w-3xl mx-auto mb-12 text-base leading-relaxed text-center text-gray-600 md:text-lg">
                    Kami menyediakan berbagai fasilitas olahraga modern dengan standar internasional untuk memberikan pengalaman terbaik bagi Anda.
                </p>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {facilities.map((facility, index) => (
                        <div
                            key={index}
                            className="p-6 transition duration-300 transform bg-white border border-gray-100 shadow-lg rounded-2xl hover:shadow-2xl hover:-translate-y-3 hover:border-blue-100 group"
                        >
                            <div className="mb-4 transition duration-300 group-hover:scale-110">
                                {facility.icon}
                            </div>
                            <h3 className="mb-2 text-xl font-bold text-gray-800 transition duration-300 group-hover:text-blue-600">
                                {facility.name}
                            </h3>
                            <p className="text-base leading-relaxed text-gray-600 ">
                                {facility.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}