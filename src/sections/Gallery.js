export default function Gallery() {
    const galleryImages = [
        {
            src: '/images/bg.jpg',
            alt: 'Lapangan Basket',
            category: 'Fasilitas'
        },
        {
            src: '/images/bg.jpg',
            alt: 'Kolam Renang',
            category: 'Fasilitas'
        },
        {
            src: '/images/bg.jpg',
            alt: 'Pusat Kebugaran',
            category: 'Fasilitas'
        },
        {
            src: '/images/bg.jpg',
            alt: 'Kompetisi Basket',
            category: 'Event'
        },
        {
            src: '/images/bg.jpg',
            alt: 'Kelas Yoga',
            category: 'Event'
        },
        {
            src: '/images/bg.jpg',
            alt: 'Turnamen Renang',
            category: 'Event'
        }
    ];

    return (
        <section id="gallery" className="py-16 bg-gray-100">
            <div className="container px-6 mx-auto">
                <h2 className="mb-8 text-3xl font-bold text-center text-gray-800 md:text-4xl">
                    Galeri <span className="text-primary">SI Sport Center</span>
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                    {galleryImages.map((image, index) => (
                        <div
                            key={index}
                            className="relative overflow-hidden bg-center bg-cover rounded-lg shadow-lg group"
                            style={{ backgroundImage: `url('${image.src}')` }}
                        >
                            <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100">
                                <span className="text-lg font-semibold text-white">{image.alt}</span>
                            </div>
                            <img src={image.src} alt={image.alt} className="object-cover w-full h-64 opacity-0" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
