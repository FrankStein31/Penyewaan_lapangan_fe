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
            gender: 'female'
        },
        {
            id: 2,
            name: 'Budi Santoso',
            role: 'Atlet Basket',
            content: 'Sebagai atlet basket, saya membutuhkan tempat latihan yang memenuhi standar. SI Sport Center menyediakan lapangan basket yang sangat baik dengan fasilitas pendukung yang lengkap. Sangat direkomendasikan!',
            gender: 'male'
        },
        {
            id: 3,
            name: 'Dewi Safitri',
            role: 'Instruktur Yoga',
            content: 'Ruang yoga di SI Sport Center dirancang dengan sangat baik. Suasananya tenang dan nyaman, sempurna untuk praktik yoga. Saya senang bisa mengajar di tempat yang memperhatikan detail seperti ini.',
            gender: 'female'
        },
        {
            id: 4,
            name: 'Eko Prasetyo',
            role: 'Pengusaha',
            content: 'Jadwal saya sangat padat, tapi SI Sport Center yang buka 24 jam memungkinkan saya untuk tetap berolahraga. Fasilitas VIP yang disediakan sangat membantu saya untuk relaksasi setelah seharian bekerja.',
            gender: 'male'
        }
    ];

    const [activeIndex, setActiveIndex] = useState(0);
    const [avatarUrls, setAvatarUrls] = useState([]);

    // Fungsi untuk mengambil gambar random dari API
    useEffect(() => {
        const fetchAvatars = async () => {
            const urls = await Promise.all(
                testimonials.map(async (testimonial) => {
                    const gender = testimonial.gender;
                    const response = await fetch(`https://randomuser.me/api/?gender=${gender}`);
                    const data = await response.json();
                    return data.results[0].picture.large;
                })
            );
            setAvatarUrls(urls);
        };

        fetchAvatars();
    }, []);

    const nextTestimonial = () => {
        setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    };

    const prevTestimonial = () => {
        setActiveIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    };

    return (
        <section id="testimonials" className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="container px-4 mx-auto sm:px-6 lg:px-8">
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-gray-900 md:text-4xl">
                        Apa Kata <span className="text-blue-600">Mereka</span>
                    </h2>
                    <p className="max-w-3xl mx-auto text-lg text-gray-600 md:text-xl">
                        Dengarkan pengalaman para member kami yang telah merasakan manfaat bergabung dengan SI Sport Center.
                    </p>
                </div>

                {avatarUrls.length > 0 && (
                    <div className="relative max-w-6xl mx-auto">
                        {/* Testimonial Card */}
                        <div className="overflow-hidden transition-all duration-500 ease-in-out bg-white shadow-xl rounded-xl">
                            <div className="flex flex-col md:flex-row">
                                {/* Avatar Image */}
                                <div className="flex items-center justify-center p-8 md:w-1/3 bg-gradient-to-br from-blue-500 to-blue-600">
                                    <div className="relative w-40 h-40 overflow-hidden border-4 border-white rounded-full shadow-lg md:w-48 md:h-48">
                                        <Image
                                            src={avatarUrls[activeIndex]}
                                            alt={testimonials[activeIndex].name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            unoptimized // Untuk gambar dari API eksternal
                                            priority={activeIndex === 0} // Prioritas untuk gambar pertama
                                        />
                                    </div>
                                </div>

                                {/* Testimonial Content */}
                                <div className="p-8 md:w-2/3 md:p-12">
                                    <svg
                                        className="w-12 h-12 mb-6 text-blue-100"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                    </svg>

                                    <blockquote className="mb-8 text-lg leading-relaxed text-gray-700 md:text-xl">
                                        "{testimonials[activeIndex].content}"
                                    </blockquote>

                                    <div className="pt-6 border-t border-gray-200">
                                        <div className="text-xl font-bold text-gray-900">{testimonials[activeIndex].name}</div>
                                        <div className="font-medium text-blue-600">{testimonials[activeIndex].role}</div>
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
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === activeIndex
                                        ? 'bg-blue-600 w-6'
                                        : 'bg-gray-300 hover:bg-gray-400'}`}
                                    aria-label={`Go to testimonial ${index + 1}`}
                                />
                            ))}
                        </div>

                        {/* Navigation Arrows */}
                        <button
                            onClick={prevTestimonial}
                            className="absolute left-0 p-3 transition-all duration-300 -translate-x-4 -translate-y-1/2 bg-white rounded-full shadow-lg top-1/2 md:-translate-x-12 hover:shadow-xl hover:bg-blue-50 group"
                            aria-label="Previous testimonial"
                        >
                            <svg
                                className="w-6 h-6 text-gray-600 transition-colors duration-300 group-hover:text-blue-600"
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
                            className="absolute right-0 p-3 transition-all duration-300 translate-x-4 -translate-y-1/2 bg-white rounded-full shadow-lg top-1/2 md:translate-x-12 hover:shadow-xl hover:bg-blue-50 group"
                            aria-label="Next testimonial"
                        >
                            <svg
                                className="w-6 h-6 text-gray-600 transition-colors duration-300 group-hover:text-blue-600"
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