export default function Gallery() {
    const galleryImages = [
        {
            src: '/images/basket.jpg',
            alt: 'Lapangan Basket',
            category: 'Fasilitas',
            highlightColor: 'from-blue-500/20 to-blue-600/30'
        },
        {
            src: '/images/renang.jpg',
            alt: 'Kolam Renang',
            category: 'Fasilitas',
            highlightColor: 'from-cyan-500/20 to-blue-500/30'
        },
        {
            src: '/images/kebugaran.jpg',
            alt: 'Pusat Kebugaran',
            category: 'Fasilitas',
            highlightColor: 'from-purple-500/20 to-indigo-600/30'
        },
        {
            src: '/images/kompetisi basket.jpg',
            alt: 'Kompetisi Basket',
            category: 'Event',
            highlightColor: 'from-orange-500/20 to-amber-600/30'
        },
        {
            src: '/images/kelas yoga.jpg',
            alt: 'Kelas Yoga',
            category: 'Event',
            highlightColor: 'from-emerald-500/20 to-teal-600/30'
        },
        {
            src: '/images/turnamen renang.jpg',
            alt: 'Turnamen Renang',
            category: 'Event',
            highlightColor: 'from-pink-500/20 to-rose-600/30'
        }
    ];

    return (
        <section id="gallery" className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800">
            {/* Floating gradient elements */}
            <div className="absolute top-0 left-0 w-64 h-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/10 blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-64 h-64 translate-x-1/2 translate-y-1/2 rounded-full bg-purple-500/10 blur-3xl"></div>

            <div className="container relative z-10 px-4 mx-auto sm:px-6 lg:px-8">
                <div className="mb-12 text-center">
                    <span className="inline-block px-4 py-1 mb-3 text-xs font-semibold tracking-wider text-blue-400 uppercase rounded-full bg-blue-900/30">
                        Gallery Preview
                    </span>
                    <h2 className="mb-4 text-3xl font-bold text-center text-white md:text-4xl lg:text-5xl">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Sport Center</span> Gallery
                    </h2>
                    <p className="max-w-2xl mx-auto text-lg text-gray-300 md:text-xl">
                        Jelajahi fasilitas premium dan momen seru di tempat kami
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {galleryImages.map((image, index) => (
                        <div
                            key={index}
                            className="relative overflow-hidden transition-all duration-500 rounded-xl group hover:scale-[1.03] hover:shadow-2xl"
                        >
                            {/* Glow overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${image.highlightColor} opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-xl`}></div>

                            {/* Image container */}
                            <div className="relative h-64 overflow-hidden rounded-xl">
                                <img
                                    src={image.src}
                                    alt={image.alt}
                                    className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                />
                            </div>

                            {/* Info overlay */}
                            <div className="absolute inset-0 flex flex-col items-start justify-end p-6 text-white transition-opacity duration-500 opacity-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent group-hover:opacity-100">
                                <span className="px-3 py-1 mb-2 text-xs font-medium text-blue-300 uppercase rounded-full bg-blue-900/50 backdrop-blur-sm">
                                    {image.category}
                                </span>
                                <h3 className="text-xl font-bold">{image.alt}</h3>
                                <div className="flex items-center mt-2">
                                    <svg className="w-4 h-4 mr-1 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                    <span className="text-sm text-gray-300">5.0</span>
                                </div>
                            </div>

                            {/* Shine effect */}
                            <div className="absolute top-0 left-0 w-1/2 h-full -translate-x-full -rotate-12 bg-gradient-to-r from-white/10 to-transparent group-hover:translate-x-[400%] transition-transform duration-1000"></div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <button className="px-8 py-3 font-medium text-white transition-all duration-300 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 hover:shadow-lg hover:shadow-blue-500/30">
                        Lihat Galeri Lengkap
                        <svg className="inline-block w-4 h-4 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}