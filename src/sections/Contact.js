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

        // Simulasikan pengiriman form
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

            // Reset pesan sukses setelah beberapa detik
            setTimeout(() => {
                setSubmitResult({ success: false, message: '' });
            }, 5000);
        }, 1500);
    };

    return (
        <section id="contact" className="py-16 bg-gradient-to-b from-white to-gray-50">
            <div className="container max-w-4xl px-4 mx-auto sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <h2 className="relative inline-block mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                        Hubungi Kami
                        <span className="absolute bottom-0 left-0 w-full h-1 transform translate-y-1 bg-blue-500"></span>
                    </h2>
                    <p className="text-lg text-gray-600">
                        Punya pertanyaan atau butuh informasi? Silakan isi form berikut.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="p-6 bg-white border border-gray-100 shadow-lg rounded-xl sm:p-8 lg:p-10"
                >
                    <div className="grid grid-cols-1 gap-6 mb-6 md:grid-cols-2">
                        <div className="space-y-2">
                            <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Nama Lengkap <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 placeholder-gray-400 transition-all duration-300 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Nama Anda"
                            />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 placeholder-gray-400 transition-all duration-300 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="email@contoh.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="phone"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Nomor Telepon <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 placeholder-gray-400 transition-all duration-300 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="0812-3456-7890"
                            />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="subject"
                                className="block text-sm font-medium text-gray-700"
                            >
                                Subjek <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 placeholder-gray-400 transition-all duration-300 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Subjek pesan"
                            />
                        </div>
                    </div>

                    <div className="mb-6 space-y-2">
                        <label
                            htmlFor="message"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Pesan Anda <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            rows="5"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-3 placeholder-gray-400 transition-all duration-300 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Tulis pesan Anda disini..."
                        ></textarea>
                    </div>

                    <div className="flex flex-col items-center">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`w-full md:w-auto px-8 py-3 rounded-lg font-medium text-white transition-all duration-300 shadow-lg hover:shadow-xl
                                ${isSubmitting
                                    ? 'bg-blue-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700'}
                            `}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center">
                                    <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Mengirim...
                                </span>
                            ) : 'Kirim Pesan'}
                        </button>

                        {submitResult.message && (
                            <div
                                className={`mt-4 p-4 rounded-lg w-full text-center transition-all duration-300
                                    ${submitResult.success
                                        ? 'bg-green-100 text-green-700 border border-green-200'
                                        : 'bg-red-100 text-red-700 border border-red-200'}
                                `}
                            >
                                {submitResult.message}
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </section>
    );
}