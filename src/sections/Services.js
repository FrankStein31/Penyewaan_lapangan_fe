import React from 'react';

export default function Services() {
    const services = [
        {
            icon: (
                <svg
                    className="w-8 h-8 text-blue-400 transition-colors duration-300 group-hover:text-blue-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                </svg>
            ),
            title: 'Pelatihan Pribadi',
            description: 'Program pelatihan pribadi yang dirancang khusus untuk kebutuhan dan tujuan kebugaran Anda.',
            glowColor: 'from-blue-500/20 to-blue-600/30'
        },
        {
            icon: (
                <svg
                    className="w-8 h-8 text-blue-400 transition-colors duration-300 group-hover:text-blue-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                </svg>
            ),
            title: 'Kelas Kelompok',
            description: 'Berbagai kelas kelompok seperti yoga, pilates, zumba, dan spinning yang dipimpin oleh instruktur berpengalaman.',
            glowColor: 'from-purple-500/20 to-blue-600/30'
        },
        {
            icon: (
                <svg
                    className="w-8 h-8 text-blue-400 transition-colors duration-300 group-hover:text-blue-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                </svg>
            ),
            title: 'Program Nutrisi',
            description: 'Konsultasi nutrisi dan program diet yang dirancang untuk mendukung tujuan kebugaran dan kesehatan Anda.',
            glowColor: 'from-emerald-500/20 to-teal-600/30'
        },
        {
            icon: (
                <svg
                    className="w-8 h-8 text-blue-400 transition-colors duration-300 group-hover:text-blue-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 3l-6 6m0 0V4m0 5h5M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z"
                    />
                </svg>
            ),
            title: 'Konsultasi Kesehatan',
            description: 'Konsultasi kesehatan dengan ahli untuk mengevaluasi kondisi kesehatan dan memberikan rekomendasi program kebugaran.',
            glowColor: 'from-indigo-500/20 to-blue-600/30'
        }
    ];

    return (
        <section id="services" className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
            {/* Floating gradient elements */}
            <div className="absolute top-0 left-0 w-64 h-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 translate-x-1/2 translate-y-1/2 rounded-full bg-purple-500/10 blur-3xl"></div>

            <div className="container relative z-10 px-4 mx-auto max-w-7xl">
                {/* Header Section */}
                <div className="mb-12 text-center md:mb-16">
                    <span className="inline-block px-4 py-1 mb-4 text-xs font-semibold tracking-wider text-blue-400 uppercase rounded-full bg-blue-900/30">
                        Our Services
                    </span>
                    <h2 className="mb-3 text-3xl font-bold text-transparent md:text-4xl lg:text-5xl bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                        Layanan <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-blue-500">Premium</span> Kami
                    </h2>
                    <div className="w-16 h-1 mx-auto rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"></div>
                    <p className="max-w-2xl mx-auto mt-4 text-gray-300 md:text-lg">
                        Solusi lengkap untuk kebutuhan kesehatan dan kebugaran Anda
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {services.map((service, index) => (
                        <div
                            key={index}
                            className="relative p-6 transition-all duration-500 ease-in-out border rounded-xl group hover:-translate-y-2 border-gray-700/50 bg-gray-800/50 hover:bg-gray-800/70 hover:shadow-2xl backdrop-blur-sm"
                        >
                            {/* Glow effect */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${service.glowColor} opacity-0 group-hover:opacity-100 rounded-xl transition-opacity duration-500`}></div>

                            <div className="relative">
                                {/* Icon Container */}
                                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-5 transition-colors rounded-xl bg-blue-900/30 group-hover:bg-blue-900/50">
                                    {service.icon}
                                </div>

                                {/* Content */}
                                <h3 className="mb-3 text-xl font-semibold text-center text-white transition-colors group-hover:text-blue-300">
                                    {service.title}
                                </h3>
                                <p className="text-center text-gray-300">
                                    {service.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* CTA Button */}
                <div className="mt-12 text-center">
                    <button className="relative px-8 py-3 font-medium text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 hover:shadow-lg hover:shadow-blue-500/30">
                        <div className="absolute inset-0 transition-opacity duration-300 rounded-lg opacity-0 bg-gradient-to-r from-blue-400 to-cyan-400 hover:opacity-100"></div>
                        <span className="relative flex items-center justify-center">
                            Explore All Services
                            <svg className="w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                            </svg>
                        </span>
                    </button>
                </div>
            </div>
        </section>
    );
}