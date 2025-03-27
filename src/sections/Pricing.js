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
            btnText: 'Pilih Paket'
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
            btnText: 'Pilih Paket'
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
            btnText: 'Pilih Paket'
        }
    ];

    return (
        <section id="pricing" className="py-20 bg-gradient-to-b from-gray-50 to-white">
            <div className="container px-4 mx-auto sm:px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl lg:text-5xl">
                        Paket Keanggotaan
                    </h2>
                    <p className="max-w-3xl mx-auto text-lg text-gray-600 md:text-xl">
                        Kami menawarkan berbagai paket keanggotaan yang dirancang untuk memenuhi kebutuhan dan anggaran Anda.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
                    {pricingPlans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative rounded-xl overflow-hidden transition-all duration-500 ease-in-out hover:-translate-y-2 ${plan.highlighted
                                ? 'ring-4 ring-blue-500 ring-opacity-50 shadow-2xl'
                                : 'shadow-lg'}`}
                        >
                            {plan.highlighted && (
                                <div className="absolute top-0 right-0 px-4 py-1 text-xs font-bold text-white transform translate-x-2 translate-y-2 bg-blue-600 rotate-12">
                                    POPULER
                                </div>
                            )}

                            <div className={`h-full flex flex-col ${plan.highlighted ? 'border-t-4 border-blue-500' : ''}`}>
                                <div className="flex-1 p-8">
                                    <h3 className={`text-2xl font-extrabold mb-3 ${plan.highlighted ? 'text-blue-600' : 'text-gray-800'}`}>
                                        {plan.name}
                                    </h3>
                                    <p className="mb-6 text-gray-600">{plan.description}</p>

                                    <div className="mb-8">
                                        <span className="text-4xl font-bold text-gray-900">Rp {plan.price}</span>
                                        <span className="text-gray-500">{plan.period}</span>
                                    </div>

                                    <ul className="mb-8 space-y-4">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start">
                                                <svg
                                                    className={`flex-shrink-0 w-5 h-5 mt-1 mr-3 ${plan.highlighted ? 'text-blue-500' : 'text-green-500'}`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                <span className="text-gray-700">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="px-8 pb-8">
                                    <Link
                                        href="/#contact"
                                        className={`block w-full py-3 px-6 rounded-lg font-bold text-center transition-all duration-300 ${plan.highlighted
                                            ? 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-md hover:shadow-lg'
                                            : 'bg-gray-100 hover:bg-gray-200 text-gray-800 hover:text-gray-900'
                                            }`}
                                    >
                                        {plan.btnText}
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="max-w-4xl p-8 mx-auto mt-20 text-center bg-white shadow-sm rounded-xl">
                    <h3 className="mb-3 text-xl font-semibold text-gray-800">Butuh paket khusus?</h3>
                    <p className="mb-6 text-gray-600">Kami menyediakan solusi khusus untuk kebutuhan corporate atau event Anda.</p>
                    <Link
                        href="/#contact"
                        className="inline-flex items-center px-6 py-3 text-base font-medium text-white transition-all duration-300 border border-transparent rounded-md shadow-sm bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                    >
                        Hubungi Tim Kami
                        <svg className="w-5 h-5 ml-2 -mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    );
}