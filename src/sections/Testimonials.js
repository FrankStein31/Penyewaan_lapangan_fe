'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function Testimonials() {
    const testimonials = [
        {
            id: 1,
            name: 'Anisa Putri',
            role: 'Member Reguler',
            content: 'Saya sangat senang bergabung dengan SI Sport Center. Fasilitas yang disediakan sangat lengkap dan bersih. Pelatih-pelatihnya juga profesional dan membantu saya mencapai tujuan kebugaran saya.',
            gender: 'female',
            glowColor: 'from-blue-500/20 to-blue-600/30'
        },
        {
            id: 2,
            name: 'Budi Santoso',
            role: 'Atlet Basket',
            content: 'Sebagai atlet basket, saya membutuhkan tempat latihan yang memenuhi standar. SI Sport Center menyediakan lapangan basket yang sangat baik dengan fasilitas pendukung yang lengkap. Sangat direkomendasikan!',
            gender: 'male',
            glowColor: 'from-purple-500/20 to-blue-600/30'
        },
        {
            id: 3,
            name: 'Dewi Safitri',
            role: 'Instruktur Yoga',
            content: 'Ruang yoga di SI Sport Center dirancang dengan sangat baik. Suasananya tenang dan nyaman, sempurna untuk praktik yoga. Saya senang bisa mengajar di tempat yang memperhatikan detail seperti ini.',
            gender: 'female',
            glowColor: 'from-cyan-500/20 to-blue-600/30'
        },
        {
            id: 4,
            name: 'Eko Prasetyo',
            role: 'Pengusaha',
            content: 'Jadwal saya sangat padat, tapi SI Sport Center yang buka 24 jam memungkinkan saya untuk tetap berolahraga. Fasilitas VIP yang disediakan sangat membantu saya untuk relaksasi setelah seharian bekerja.',
            gender: 'male',
            glowColor: 'from-indigo-500/20 to-blue-600/30'
        }
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const [avatarUrls, setAvatarUrls] = useState([]);
    const [isHovered, setIsHovered] = useState(false);

    // Fetch random avatars
    useEffect(() => {
        const fetchAvatars = async () => {
            if (typeof window === "undefined") return; // SSR protection

            try {
                const urls = await Promise.all(
                    testimonials.map(async (testimonial) => {
                        const gender = testimonial?.gender || "male";
                        try {
                            const response = await fetch(`https://randomuser.me/api/?gender=${gender}`);

                            if (!response.ok) {
                                throw new Error(`Failed to fetch avatar: ${response.status}`);
                            }

                            const data = await response.json();
                            return data.results[0]?.picture?.large || "/default-avatar.png"; // Fallback
                        } catch (err) {
                            console.warn("Avatar fetch failed for", testimonial.name, err);
                            return "/default-avatar.png"; // Fallback
                        }
                    })
                );

                setAvatarUrls(urls);
            } catch (error) {
                console.error("Error fetching avatars:", error);
            }
        };

        if (testimonials && testimonials.length > 0) {
            fetchAvatars();
        }
    }, []);// tambahkan dependencies kalau datanya dari props/state


    const nextTestimonial = () => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <section id="testimonials" className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
            {/* Floating gradient elements */}
            <div className="absolute top-0 left-0 w-64 h-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 translate-x-1/2 translate-y-1/2 rounded-full bg-purple-500/10 blur-3xl"></div>

            <div className="container relative z-10 px-4 mx-auto sm:px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <span className="inline-block px-4 py-1 mb-3 text-xs font-semibold tracking-wider text-blue-400 uppercase rounded-full bg-blue-900/30">
                        Testimonial
                    </span>
                    <h2 className="mb-4 text-3xl font-bold text-center text-transparent md:text-4xl bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                        Apa Kata <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">Mereka</span>
                    </h2>
                    <p className="max-w-3xl mx-auto text-lg text-gray-300 md:text-xl">
                        Dengarkan pengalaman para member kami yang telah merasakan manfaat bergabung dengan SI Sport Center.
                    </p>
                </div>

                {avatarUrls.length > 0 && (
                    <div className="relative max-w-6xl mx-auto">
                        {/* Testimonial Card */}
                        <div
                            className="relative overflow-hidden transition-all duration-500 ease-in-out border rounded-xl group border-gray-700/50 bg-gray-800/50 hover:bg-gray-800/70 hover:shadow-2xl backdrop-blur-sm"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            {/* Glow effect */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${testimonials[activeIndex].glowColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl`}></div>

                            <div className="relative flex flex-col md:flex-row">
                                {/* Avatar Image */}
                                <div className="relative flex items-center justify-center p-8 md:w-1/3 bg-gradient-to-br from-blue-600 to-blue-700">
                                    <div className="absolute inset-0 transition-opacity duration-500 opacity-0 bg-gradient-to-br from-blue-500/30 to-blue-700/30 group-hover:opacity-100"></div>
                                    <div className="relative w-40 h-40 overflow-hidden transition-transform duration-500 border-4 rounded-full shadow-lg border-white/80 md:w-48 md:h-48 group-hover:scale-105">
                                        <Image
                                            src={avatarUrls[activeIndex]}
                                            alt={testimonials[activeIndex].name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            unoptimized
                                            priority={activeIndex === 0}
                                        />
                                    </div>
                                    {/* Decorative elements */}
                                    <div className="absolute top-0 left-0 w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-md"></div>
                                    <div className="absolute bottom-0 right-0 w-24 h-24 translate-x-1/2 translate-y-1/2 rounded-full bg-white/20 blur-md"></div>
                                </div>

                                {/* Testimonial Content */}
                                <div className="p-8 md:w-2/3 md:p-12">
                                    <svg
                                        className="w-12 h-12 mb-6 text-blue-300 transition-colors duration-500 group-hover:text-blue-200"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                    </svg>

                                    <blockquote className="mb-8 text-lg leading-relaxed text-gray-300 transition-colors duration-500 md:text-xl group-hover:text-white">
                                        "{testimonials[activeIndex].content}"
                                    </blockquote>

                                    <div className="pt-6 transition-colors duration-500 border-t border-gray-700/50 group-hover:border-blue-500/30">
                                        <div className="text-xl font-bold text-white transition-colors duration-500 group-hover:text-blue-300">
                                            {testimonials[activeIndex].name}
                                        </div>
                                        <div className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                                            {testimonials[activeIndex].role}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Dots */}
                        <div className="flex justify-center mt-8 space-x-3">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setActiveIndex(index)}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 relative overflow-hidden ${index === activeIndex
                                        ? 'w-6 bg-gradient-to-r from-blue-500 to-cyan-500'
                                        : 'bg-gray-700 hover:bg-gray-600'}`}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                >
                                    {index === activeIndex && (
                                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400 animate-pulse opacity-70"></div>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* Navigation Arrows */}
                        <button
                            onClick={prevTestimonial}
                            className="absolute left-0 p-3 transition-all duration-300 -translate-x-4 -translate-y-1/2 bg-gray-800 border border-gray-700 rounded-full shadow-lg top-1/2 md:-translate-x-12 hover:shadow-xl hover:bg-gray-700 hover:border-blue-500/30 group"
                            aria-label="Previous testimonial"
                        >
                            <div className="absolute inset-0 transition-opacity duration-300 rounded-full opacity-0 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:opacity-10"></div>
                            <svg
                                className="w-6 h-6 text-gray-400 transition-colors duration-300 group-hover:text-blue-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        <button
                            onClick={nextTestimonial}
                            className="absolute right-0 p-3 transition-all duration-300 translate-x-4 -translate-y-1/2 bg-gray-800 border border-gray-700 rounded-full shadow-lg top-1/2 md:translate-x-12 hover:shadow-xl hover:bg-gray-700 hover:border-blue-500/30 group"
                            aria-label="Next testimonial"
                        >
                            <div className="absolute inset-0 transition-opacity duration-300 rounded-full opacity-0 bg-gradient-to-r from-blue-500 to-cyan-500 group-hover:opacity-10"></div>
                            <svg
                                className="w-6 h-6 text-gray-400 transition-colors duration-300 group-hover:text-blue-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}