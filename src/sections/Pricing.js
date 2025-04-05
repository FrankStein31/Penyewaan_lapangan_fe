import Link from 'next/link';

export default function Pricing() {
    const pricingPlans = [
        {
            name: 'Basic',
            price: '300K',
            period: '/bulan',
            description: 'Paket dasar untuk akses fasilitas utama',
            features: [
                'Akses Kolam Renang',
                'Akses Pusat Kebugaran',
                'Jam Operasional Standar',
                'Loker Harian',
                'Handuk (1x per kunjungan)'
            ],
            highlighted: false,
            btnText: 'Pilih Paket',
            glowColor: 'from-blue-500/10 to-blue-600/20'
        },
        {
            name: 'Premium',
            price: '550K',
            period: '/bulan',
            description: 'Paket lengkap dengan akses semua fasilitas',
            features: [
                'Semua fitur Basic',
                'Akses Semua Fasilitas Olahraga',
                'Kelas Kelompok (4x per bulan)',
                'Loker Tetap',
                'Handuk (2x per kunjungan)',
                'Akses Jam Perpanjangan',
                'Diskon 10% untuk Minuman & Suplemen'
            ],
            highlighted: true,
            btnText: 'Pilih Paket',
            glowColor: 'from-purple-500/10 via-blue-500/10 to-blue-600/20'
        },
        {
            name: 'VIP',
            price: '850K',
            period: '/bulan',
            description: 'Pengalaman eksklusif dengan layanan prioritas',
            features: [
                'Semua fitur Premium',
                'Pelatihan Pribadi (2x per bulan)',
                'Konsultasi Nutrisi Bulanan',
                'Ruang Ganti VIP',
                'Tempat Parkir Prioritas',
                'Akses 24 Jam',
                'Diskon 20% untuk Minuman & Suplemen',
                'Membership Lounge Access'
            ],
            highlighted: false,
            btnText: 'Pilih Paket',
            glowColor: 'from-indigo-500/10 to-blue-600/20'
        }
    ];

    return (
        <section id="pricing" className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
            {/* Floating gradient elements */}
            <div className="absolute top-0 left-0 w-64 h-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 translate-x-1/2 translate-y-1/2 rounded-full bg-purple-500/10 blur-3xl"></div>

            <div className="container relative z-10 px-4 mx-auto sm:px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <span className="inline-block px-4 py-1 mb-3 text-xs font-semibold tracking-wider text-blue-400 uppercase rounded-full bg-blue-900/30">
                        Paket Keanggotaan
                    </span>
                    <h2 className="mb-4 text-3xl font-bold text-center text-white md:text-4xl lg:text-5xl">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Pilihan</span> Paket
                    </h2>
                    <p className="max-w-3xl mx-auto text-lg text-gray-300 md:text-xl">
                        Kami menawarkan berbagai paket keanggotaan yang dirancang untuk memenuhi kebutuhan dan anggaran Anda.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
                    {pricingPlans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative overflow-hidden rounded-xl transition-all duration-500 ease-in-out group hover:-translate-y-2 ${plan.highlighted
                                    ? 'ring-4 ring-blue-500/50 shadow-2xl'
                                    : 'shadow-lg hover:shadow-xl'
                                }`}
                        >
                            {/* Glow Effect */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${plan.glowColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl`}></div>

                            {plan.highlighted && (
                                <div className="absolute top-0 right-0 px-4 py-1 text-xs font-bold text-white transform translate-x-2 -translate-y-2 rounded-full shadow-sm rotate-12 bg-gradient-to-r from-purple-600 to-blue-600">
                                    POPULER
                                </div>
                            )}

                            <div className={`relative h-full flex flex-col bg-gray-800/80 backdrop-blur-sm border border-gray-700/50 rounded-xl ${plan.highlighted ? 'border-t-4 border-t-blue-500' : ''}`}>
                                <div className="flex-1 p-8">
                                    <h3 className={`text-2xl font-extrabold mb-3 ${plan.highlighted ? 'text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400' : 'text-white'}`}>
                                        {plan.name}
                                    </h3>
                                    <p className="mb-6 text-gray-300">{plan.description}</p>

                                    <div className="mb-8">
                                        <span className="text-4xl font-bold text-white">Rp {plan.price}</span>
                                        <span className="text-gray-400">{plan.period}</span>
                                    </div>

                                    <ul className="mb-8 space-y-4">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start">
                                                <div className={`flex-shrink-0 w-6 h-6 mt-1 mr-3 rounded-full flex items-center justify-center ${plan.highlighted ? 'bg-blue-900/50 text-blue-400' : 'bg-gray-700/50 text-gray-400'}`}>
                                                    <svg
                                                        className="w-4 h-4"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                    </svg>
                                                </div>
                                                <span className="text-gray-200">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="px-8 pb-8">
                                    <Link
                                        href="/#contact"
                                        className={`block w-full py-3 px-6 rounded-lg font-bold text-center transition-all duration-300 ${plan.highlighted
                                                ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-md hover:shadow-lg hover:shadow-blue-500/30'
                                                : 'bg-gray-700 hover:bg-gray-600 text-white border border-gray-600 hover:border-gray-500'
                                            }`}
                                    >
                                        {plan.btnText}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="relative max-w-4xl p-8 mx-auto mt-20 overflow-hidden text-center rounded-xl">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 to-purple-900/30 opacity-60 backdrop-blur-sm"></div>
                    <div className="relative">
                        <h3 className="mb-3 text-xl font-semibold text-white">Butuh paket khusus?</h3>
                        <p className="mb-6 text-gray-300">Kami menyediakan solusi khusus untuk kebutuhan corporate atau event Anda.</p>
                        <Link
                            href="/#contact"
                            className="inline-flex items-center px-6 py-3 text-base font-medium text-white transition-all duration-300 border border-transparent rounded-md shadow-sm bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 hover:shadow-lg hover:shadow-blue-500/30"
                        >
                            Hubungi Tim Kami
                            <svg className="w-5 h-5 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                            </svg>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}