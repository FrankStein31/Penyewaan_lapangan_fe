import React from 'react';

export default function Services() {
    const services = [
        {
            icon: (
                <svg className="w-12 h-12 text-blue-300 transition-colors group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            ),
            title: 'Pelatihan Pribadi',
            description: 'Program pelatihan pribadi yang dirancang khusus untuk kebutuhan dan tujuan kebugaran Anda.'
        },
        {
            icon: (
                <svg className="w-12 h-12 text-blue-300 transition-colors group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            ),
            title: 'Kelas Kelompok',
            description: 'Berbagai kelas kelompok seperti yoga, pilates, zumba, dan spinning yang dipimpin oleh instruktur berpengalaman.'
        },
        {
            icon: (
                <svg className="w-12 h-12 text-blue-300 transition-colors group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                </svg>
            ),
            title: 'Program Nutrisi',
            description: 'Konsultasi nutrisi dan program diet yang dirancang untuk mendukung tujuan kebugaran dan kesehatan Anda.'
        },
        {
            icon: (
                <svg className="w-12 h-12 text-blue-300 transition-colors group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 3l-6 6m0 0V4m0 5h5M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
                </svg>
            ),
            title: 'Konsultasi Kesehatan',
            description: 'Konsultasi kesehatan dengan ahli untuk mengevaluasi kondisi kesehatan dan memberikan rekomendasi program kebugaran.'
        }
    ];

    return (
        <section
            id="services"
            className="py-16 text-white md:py-20 lg:py-24 bg-gradient-to-br from-blue-600 to-blue-800"
        >
            <div className="container px-4 mx-auto max-w-7xl">
                <div className="mb-12 text-center md:mb-16">
                    <h2 className="mb-4 text-3xl font-extrabold text-white md:text-4xl lg:text-5xl">
                        Layanan Kami
                    </h2>
                    <p className="max-w-3xl mx-auto text-base leading-relaxed text-blue-100 md:text-lg">
                        Kami menawarkan berbagai layanan premium untuk membantu Anda mencapai tujuan kebugaran dan kesehatan.
                    </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 md:gap-8">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="p-6 transition-all duration-300 ease-in-out transform border group bg-blue-700/50 hover:bg-blue-700/70 rounded-xl md:p-8 hover:-translate-y-2 hover:shadow-2xl border-blue-600/30 hover:border-blue-500/50"
                        >
                            <div className="flex justify-center mb-4 md:mb-6">
                                {service.icon}
                            </div>
                            <h3 className="mb-3 text-xl font-bold text-center text-white transition-colors md:text-2xl group-hover:text-blue-100">
                                {service.title}
                            </h3>
                            <p className="text-sm text-center text-blue-200 transition-colors md:text-base group-hover:text-blue-50">
                                {service.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}