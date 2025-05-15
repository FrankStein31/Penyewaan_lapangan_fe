"use client";
import { useState, useEffect } from "react";

export default function AvailableFields() {
  const [fields, setFields] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
    email: "",
    team: "",
    participants: "",
    notes: "",
    paymentMethod: "transfer"
  });

  // Fungsi untuk memformat tanggal menjadi string dd/mm/yyyy
  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Handle input perubahan pada form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle submit form booking
  const handleBookingSubmit = (e) => {
    e.preventDefault();

    // Di sini Anda bisa menambahkan validasi form

    // Data booking untuk dikirim ke backend
    const bookingData = {
      fieldId: selectedField.id,
      date: formatDate(selectedDate),
      timeSlot: selectedTimeSlot,
      ...bookingForm
    };

    console.log("Booking data:", bookingData);

    // Di implementasi nyata, kirim data ke API
    // submitBookingToAPI(bookingData);

    // Reset form dan tutup modal
    alert("Booking berhasil! Kami akan menghubungi Anda untuk konfirmasi pembayaran.");
    setShowBookingModal(false);
    setSelectedField(null);
    setSelectedTimeSlot(null);
    setBookingForm({
      name: "",
      phone: "",
      email: "",
      team: "",
      participants: "",
      notes: "",
      paymentMethod: "transfer"
    });
  };

  // Fungsi untuk membuka modal booking
  const openBookingModal = (field, timeSlot) => {
    setSelectedField(field);
    setSelectedTimeSlot(timeSlot);
    setShowBookingModal(true);
  };

  // Fungsi untuk mendapatkan nama hari dalam Bahasa Indonesia
  const getDayName = (date) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[date.getDay()];
  };

  // Fungsi untuk mendapatkan data lapangan dari API/backend
  useEffect(() => {
    // Simulasi loading data
    setLoading(true);

    // Di implementasi sebenarnya, ganti dengan API call ke backend
    setTimeout(() => {
      // Data dummy untuk simulasi
      const dummyFields = [
        {
          id: 1,
          name: "Lapangan Futsal A",
          image: "/api/placeholder/600/400",
          category: "futsal",
          price: 150000,
          location: "Lantai 1, Gedung Olahraga Utama",
          rating: 4.8,
          availableSlots: [
            { time: "08:00 - 09:00", available: true },
            { time: "09:00 - 10:00", available: true },
            { time: "10:00 - 11:00", available: false },
            { time: "13:00 - 14:00", available: true },
            { time: "14:00 - 15:00", available: true },
          ],
          facilities: ["Ruang Ganti", "Toilet", "WiFi", "Parkir"]
        },
        {
          id: 2,
          name: "Lapangan Basket Indoor",
          image: "/api/placeholder/600/400",
          category: "basket",
          price: 200000,
          location: "Lantai 2, Gedung Olahraga Utama",
          rating: 4.5,
          availableSlots: [
            { time: "08:00 - 09:00", available: false },
            { time: "09:00 - 10:00", available: true },
            { time: "15:00 - 16:00", available: true },
            { time: "16:00 - 17:00", available: true },
          ],
          facilities: ["AC", "Ruang Ganti", "Toilet", "Kantin", "Parkir"]
        },
        {
          id: 3,
          name: "Lapangan Badminton 1",
          image: "/api/placeholder/600/400",
          category: "badminton",
          price: 100000,
          location: "Gedung Serbaguna, Area Timur",
          rating: 4.2,
          availableSlots: [
            { time: "07:00 - 08:00", available: true },
            { time: "08:00 - 09:00", available: true },
            { time: "17:00 - 18:00", available: true },
            { time: "18:00 - 19:00", available: false },
            { time: "19:00 - 20:00", available: false },
          ],
          facilities: ["Ruang Ganti", "Toilet", "Loker"]
        },
        {
          id: 4,
          name: "Lapangan Tenis",
          image: "/api/placeholder/600/400",
          category: "tenis",
          price: 180000,
          location: "Area Outdoor, Sebelah Parkir Timur",
          rating: 4.6,
          availableSlots: [
            { time: "06:00 - 07:00", available: true },
            { time: "07:00 - 08:00", available: true },
            { time: "15:00 - 16:00", available: true },
            { time: "16:00 - 17:00", available: true },
          ],
          facilities: ["Toilet", "Parkir", "Tribun Penonton"]
        },
        {
          id: 5,
          name: "Lapangan Futsal B",
          image: "/api/placeholder/600/400",
          category: "futsal",
          price: 170000,
          location: "Lantai 1, Gedung Olahraga Utama",
          rating: 4.7,
          availableSlots: [
            { time: "10:00 - 11:00", available: true },
            { time: "11:00 - 12:00", available: true },
            { time: "19:00 - 20:00", available: true },
            { time: "20:00 - 21:00", available: true },
          ],
          facilities: ["Ruang Ganti", "Toilet", "WiFi", "Parkir", "Kafetaria"]
        },
      ];

      setFields(dummyFields);
      setLoading(false);
    }, 1000);
  }, [selectedDate]); // Reload ketika tanggal berubah

  // Fungsi untuk mengubah tanggal
  const changeDate = (amount) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + amount);
    setSelectedDate(newDate);
  };

  // Filter lapangan berdasarkan kategori
  const filteredFields = selectedCategory === "all"
    ? fields
    : fields.filter(field => field.category === selectedCategory);

  return (
    <div className="min-h-screen pb-10 bg-gray-50">
      {/* Header */}
      <div className="p-6 text-white bg-blue-600">
        <h1 className="text-2xl font-bold">Lapangan Tersedia</h1>
        <p className="mt-1">Temukan dan booking lapangan olahraga favorit Anda</p>
      </div>

      {/* Filter dan Date Selector */}
      <div className="p-4 bg-white shadow-md">
        <div className="flex flex-col items-center justify-between md:flex-row">
          {/* Date Selector */}
          <div className="flex items-center mb-4 space-x-4 md:mb-0">
            <button
              onClick={() => changeDate(-1)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-600">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <div>
                <p className="font-medium">{getDayName(selectedDate)}</p>
                <p className="text-sm text-gray-600">{formatDate(selectedDate)}</p>
              </div>
            </div>

            <button
              onClick={() => changeDate(1)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          {/* Category Filter */}
          <div className="flex pb-2 space-x-2 overflow-x-auto">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-4 py-2 rounded-full text-sm ${selectedCategory === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
            >
              Semua
            </button>
            <button
              onClick={() => setSelectedCategory("futsal")}
              className={`px-4 py-2 rounded-full text-sm ${selectedCategory === "futsal"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
            >
              Futsal
            </button>
            <button
              onClick={() => setSelectedCategory("basket")}
              className={`px-4 py-2 rounded-full text-sm ${selectedCategory === "basket"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
            >
              Basket
            </button>
            <button
              onClick={() => setSelectedCategory("badminton")}
              className={`px-4 py-2 rounded-full text-sm ${selectedCategory === "badminton"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
            >
              Badminton
            </button>
            <button
              onClick={() => setSelectedCategory("tenis")}
              className={`px-4 py-2 rounded-full text-sm ${selectedCategory === "tenis"
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
            >
              Tenis
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 mx-auto mt-6 max-w-7xl">
        {/* Loading state */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin"></div>
            <p className="mt-4 text-gray-600">Memuat data lapangan...</p>
          </div>
        ) : filteredFields.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-xl text-gray-600">Tidak ada lapangan tersedia untuk kategori ini</p>
            <button
              onClick={() => setSelectedCategory("all")}
              className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Lihat Semua Lapangan
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredFields.map((field) => (
              <div key={field.id} className="overflow-hidden transition-transform bg-white rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1">
                {/* Field Image */}
                <div className="relative h-48">
                  <img src={field.image} alt={field.name} className="object-cover w-full h-full" />
                  <div className="absolute px-2 py-1 text-xs font-medium bg-white rounded-full top-2 right-2">
                    ⭐ {field.rating}
                  </div>
                </div>

                {/* Field Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-bold">{field.name}</h3>
                    <span className="font-bold text-blue-600">Rp {field.price.toLocaleString()}/jam</span>
                  </div>

                  <div className="flex items-start mt-2 text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-1 mr-1">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                    <p className="text-sm">{field.location}</p>
                  </div>

                  {/* Facilities */}
                  <div className="mt-3">
                    <p className="mb-1 text-xs text-gray-500">Fasilitas:</p>
                    <div className="flex flex-wrap gap-1">
                      {field.facilities.map((facility, index) => (
                        <span key={index} className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                          {facility}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Available Time Slots */}
                  <div className="mt-4">
                    <div className="flex items-center mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-600">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      <p className="text-sm font-medium">Slot Waktu Tersedia:</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {field.availableSlots.map((slot, index) => (
                        <div
                          key={index}
                          onClick={() => slot.available && openBookingModal(field, slot.time)}
                          className={`text-center text-xs py-2 px-1 rounded-md transition-colors ${slot.available
                            ? "bg-green-100 text-green-800 cursor-pointer hover:bg-green-200"
                            : "bg-gray-100 text-gray-400 line-through"
                            }`}
                        >
                          {slot.time}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Booking Button */}
                  <button
                    onClick={() => {
                      // Find first available slot
                      const firstAvailableSlot = field.availableSlots.find(slot => slot.available);
                      if (firstAvailableSlot) {
                        openBookingModal(field, firstAvailableSlot.time);
                      } else {
                        alert("Tidak ada slot waktu tersedia untuk lapangan ini.");
                      }
                    }}
                    className="w-full py-2 mt-4 text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
                  >
                    Booking Sekarang
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && selectedField && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="w-full max-w-2xl max-h-screen overflow-y-auto bg-white rounded-lg shadow-xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 text-white bg-blue-600 rounded-t-lg">
              <h3 className="text-xl font-bold">Form Booking Lapangan</h3>
              <button onClick={() => setShowBookingModal(false)} className="text-white hover:text-gray-200">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {/* Booking Info */}
              <div className="p-4 mb-6 rounded-lg bg-blue-50">
                <div className="flex flex-col mb-3 md:flex-row md:justify-between md:items-center">
                  <h4 className="text-lg font-bold text-blue-800">{selectedField.name}</h4>
                  <p className="font-semibold text-blue-800">Rp {selectedField.price.toLocaleString()}/jam</p>
                </div>
                <div className="flex flex-col gap-4 text-blue-700 md:flex-row">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>{formatDate(selectedDate)}</span>
                  </div>
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    <span>{selectedTimeSlot}</span>
                  </div>
                </div>
              </div>

              {/* Form Booking */}
              <form onSubmit={handleBookingSubmit}>
                <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
                  {/* Nama Lengkap */}
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={bookingForm.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>

                  {/* Nomor Telepon */}
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Nomor Telepon <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={bookingForm.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Contoh: 081234567890"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={bookingForm.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="contoh@email.com"
                    />
                  </div>

                  {/* Tim/Kelompok */}
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Nama Tim/Kelompok
                    </label>
                    <input
                      type="text"
                      name="team"
                      value={bookingForm.team}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Opsional"
                    />
                  </div>

                  {/* Jumlah Peserta */}
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Jumlah Peserta <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="participants"
                      value={bookingForm.participants}
                      onChange={handleInputChange}
                      required
                      min="1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Masukkan jumlah peserta"
                    />
                  </div>

                  {/* Metode Pembayaran */}
                  <div>
                    <label className="block mb-1 text-sm font-medium text-gray-700">
                      Metode Pembayaran <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="paymentMethod"
                      value={bookingForm.paymentMethod}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="transfer">Transfer Bank</option>
                      <option value="qris">QRIS</option>
                      <option value="ewallet">E-Wallet</option>
                      <option value="cash">Tunai (Bayar di Tempat)</option>
                    </select>
                  </div>
                </div>

                {/* Catatan */}
                <div className="mb-6">
                  <label className="block mb-1 text-sm font-medium text-gray-700">
                    Catatan Tambahan
                  </label>
                  <textarea
                    name="notes"
                    value={bookingForm.notes}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Tambahkan catatan jika ada (opsional)"
                  ></textarea>
                </div>

                {/* Syarat dan Ketentuan */}
                <div className="mb-6">
                  <div className="p-4 text-sm text-yellow-800 rounded-lg bg-yellow-50">
                    <p className="mb-2 font-bold">Syarat dan Ketentuan:</p>
                    <ul className="space-y-1 list-disc list-inside">
                      <li>Pembayaran harus dilakukan maksimal 1 jam setelah booking.</li>
                      <li>Pembatalan maksimal 24 jam sebelum jadwal, biaya admin 5%.</li>
                      <li>Harap datang 15 menit sebelum jadwal dimulai.</li>
                      <li>Penggunaan lapangan sesuai slot waktu yang dipilih.</li>
                    </ul>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 mt-6 md:flex-row">
                  <button
                    type="submit"
                    className="w-full py-3 font-medium text-white transition-colors bg-blue-600 rounded-lg md:w-2/3 hover:bg-blue-700"
                  >
                    Konfirmasi Booking
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowBookingModal(false)}
                    className="w-full py-3 text-gray-700 transition-colors border border-gray-300 rounded-lg md:w-1/3 hover:bg-gray-100"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}