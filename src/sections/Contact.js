'use client';

import { useState } from 'react';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState({ success: false, message: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Simulate form submission
        setTimeout(() => {
            setIsSubmitting(false);
            setSubmitResult({
                success: true,
                message: 'Pesan Anda telah berhasil dikirim. Tim kami akan menghubungi Anda segera.'
            });

            // Reset form
            setFormData({
                name: '',
                email: '',
                phone: '',
                subject: '',
                message: ''
            });

            // Reset success message after 5 seconds
            setTimeout(() => {
                setSubmitResult({ success: false, message: '' });
            }, 5000);
        }, 1500);
    };

    return (
        <section id="contact" className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
            {/* Floating gradient elements */}
            <div className="absolute top-0 left-0 w-64 h-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 translate-x-1/2 translate-y-1/2 rounded-full bg-purple-500/10 blur-3xl"></div>

            <div className="container relative z-10 max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <span className="inline-block px-4 py-1 mb-3 text-xs font-semibold tracking-wider text-blue-400 uppercase rounded-full bg-blue-900/30">
                        Contact Us
                    </span>
                    <h2 className="mb-4 text-3xl font-bold text-center text-transparent sm:text-4xl lg:text-5xl bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">Hubungi</span> Kami
                    </h2>
                    <p className="max-w-2xl mx-auto text-lg text-gray-300 md:text-xl">
                        Punya pertanyaan atau butuh informasi? Silakan isi form berikut.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="relative p-8 overflow-hidden transition-all duration-500 border rounded-2xl group border-gray-700/50 bg-gray-800/50 hover:bg-gray-800/70 hover:shadow-2xl backdrop-blur-sm"
                >
                    {/* Glow effect */}
                    <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/20 group-hover:opacity-100 rounded-xl"></div>

                    <div className="relative grid grid-cols-1 gap-6 mb-8 md:grid-cols-2">
                        <div className="space-y-2">
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-300"
                            >
                                Nama Lengkap <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 text-white placeholder-gray-400 transition-all duration-300 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-500"
                                    placeholder="Nama Anda"
                                />
                                <div className="absolute inset-0 transition-all duration-300 border-2 border-transparent rounded-lg pointer-events-none group-hover:border-blue-500/30"></div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-300"
                            >
                                Email <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 text-white placeholder-gray-400 transition-all duration-300 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-500"
                                    placeholder="email@contoh.com"
                                />
                                <div className="absolute inset-0 transition-all duration-300 border-2 border-transparent rounded-lg pointer-events-none group-hover:border-blue-500/30"></div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="phone"
                                className="block text-sm font-medium text-gray-300"
                            >
                                Nomor Telepon <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 text-white placeholder-gray-400 transition-all duration-300 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-500"
                                    placeholder="0812-3456-7890"
                                />
                                <div className="absolute inset-0 transition-all duration-300 border-2 border-transparent rounded-lg pointer-events-none group-hover:border-blue-500/30"></div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="subject"
                                className="block text-sm font-medium text-gray-300"
                            >
                                Subjek <span className="text-red-400">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 text-white placeholder-gray-400 transition-all duration-300 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-500"
                                    placeholder="Subjek pesan"
                                />
                                <div className="absolute inset-0 transition-all duration-300 border-2 border-transparent rounded-lg pointer-events-none group-hover:border-blue-500/30"></div>
                            </div>
                        </div>
                    </div>

                    <div className="relative mb-8 space-y-2">
                        <label
                            htmlFor="message"
                            className="block text-sm font-medium text-gray-300"
                        >
                            Pesan Anda <span className="text-red-400">*</span>
                        </label>
                        <div className="relative">
                            <textarea
                                id="message"
                                name="message"
                                rows="5"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 text-white placeholder-gray-400 transition-all duration-300 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 hover:border-gray-500"
                                placeholder="Tulis pesan Anda disini..."
                            ></textarea>
                            <div className="absolute inset-0 transition-all duration-300 border-2 border-transparent rounded-lg pointer-events-none group-hover:border-blue-500/30"></div>
                        </div>
                    </div>

                    <div className="flex flex-col items-center">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`relative w-full md:w-auto px-8 py-4 rounded-xl font-bold text-white transition-all duration-300 shadow-lg overflow-hidden
                                ${isSubmitting
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 hover:shadow-xl'}
                            `}
                        >
                            {/* Button glow effect */}
                            <div className={`absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 opacity-0 hover:opacity-100 transition-opacity duration-300 ${isSubmitting ? 'opacity-0' : ''}`}></div>

                            {isSubmitting ? (
                                <span className="relative flex items-center justify-center">
                                    <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Mengirim...
                                </span>
                            ) : (
                                <span className="relative flex items-center justify-center">
                                    Kirim Pesan
                                    <svg className="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                    </svg>
                                </span>
                            )}
                        </button>

                        {submitResult.message && (
                            <div
                                className={`mt-6 p-4 rounded-lg w-full text-center transition-all duration-500 backdrop-blur-sm
                                    ${submitResult.success
                                        ? 'bg-green-900/50 text-green-300 border border-green-700/50 shadow-sm'
                                        : 'bg-red-900/50 text-red-300 border border-red-700/50 shadow-sm'}
                                `}
                            >
                                <div className="flex items-center justify-center">
                                    {submitResult.success ? (
                                        <svg className="w-5 h-5 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5 mr-2 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                                        </svg>
                                    )}
                                    {submitResult.message}
                                </div>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </section>
    );
}