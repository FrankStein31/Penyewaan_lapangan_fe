"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { bookingService } from "../../services/api";

/**
 * Halaman untuk membuat pemesanan baru.
 * Fitur: Form input, pengecekan ketersediaan, dan submit booking.
 */
export default function BookingPage() {
  const router = useRouter();

  // Data pemesanan
  const [bookingData, setBookingData] = useState({
    nama: "",
    tanggal: "",
    waktu: "",
    jumlahOrang: 1,
    catatan: "",
  });

  // Status UI
  const [availabilityStatus, setAvailabilityStatus] = useState(null);
  const [isChecking, setIsChecking] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Slot waktu yang tersedia
  const TIME_SLOTS = [
    "09:00", "10:00", "11:00", "12:00", "13:00",
    "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
  ];

  // Tanggal minimum (hari ini)
  const today = new Date().toISOString().split("T")[0];

  /**
   * Handler untuk perubahan input form
   */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Reset status ketersediaan jika tanggal/waktu berubah
    if (name === "tanggal" || name === "waktu") {
      setAvailabilityStatus(null);
    }
  };

  /**
   * Memeriksa apakah waktu yang dipilih tersedia
   */
  const checkAvailability = async () => {
    const { tanggal, waktu, jumlahOrang } = bookingData;

    if (!tanggal || !waktu || !jumlahOrang) {
      setError("Tanggal, waktu, dan jumlah orang wajib diisi.");
      return;
    }

    try {
      setIsChecking(true);
      setError(null);

      const params = {
        tanggal,
        waktu,
        jumlah_orang: Number(jumlahOrang),
      };

      // 🟡 Tambahkan ini untuk debug
      console.log("PARAMS YANG DIKIRIM:", params);
      console.log(
        "URL YANG DITUJU:",
        axiosInstance.defaults.baseURL + "/pemesanan/check-availability"
      );

      if (!result?.data || typeof result.data.available !== "boolean") {
        throw new Error("Format respons tidak valid");
      }

      setAvailabilityStatus(result.data.available);
    } catch (err) {
      console.error("Error checking availability:", err);
      if (err.response?.status === 422) {
        setError("Data tidak valid. Periksa input Anda.");
      } else {
        setError("Gagal memeriksa ketersediaan. Coba lagi.");
      }
    } finally {
      setIsChecking(false);
    }
  };


  /**
   * Mengirim data booking ke backend
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (availabilityStatus !== true) {
      setError("Harap periksa ketersediaan terlebih dahulu.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const payload = {
        ...bookingData,
        jumlahOrang: Number(bookingData.jumlahOrang),
      };

      await bookingService.create(payload);
      setSuccess(true);

      // Arahkan ke halaman riwayat setelah 2 detik
      setTimeout(() => {
        router.push("/booking/history");
      }, 2000);
    } catch (err) {
      console.error("Error creating booking:", err);
      setError("Gagal membuat pemesanan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md p-6 mx-auto">
      <h1 className="mb-6 text-2xl font-bold">Buat Pemesanan Baru</h1>

      {success ? (
        <div className="px-4 py-3 mb-4 text-green-700 bg-green-100 border border-green-400 rounded">
          Pemesanan berhasil dibuat! Anda akan diarahkan ke halaman riwayat.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="px-4 py-3 text-red-700 bg-red-100 border border-red-400 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block mb-1 text-sm font-medium">Nama</label>
            <input
              type="text"
              name="nama"
              value={bookingData.nama}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Tanggal</label>
            <input
              type="date"
              name="tanggal"
              value={bookingData.tanggal}
              onChange={handleChange}
              min={today}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Waktu</label>
            <select
              name="waktu"
              value={bookingData.waktu}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Pilih Waktu</option>
              {TIME_SLOTS.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Jumlah Orang</label>
            <input
              type="number"
              name="jumlahOrang"
              value={bookingData.jumlahOrang}
              onChange={handleChange}
              min="1"
              max="10"
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Catatan (opsional)</label>
            <textarea
              name="catatan"
              value={bookingData.catatan}
              onChange={handleChange}
              rows="3"
              className="w-full p-2 border rounded"
            ></textarea>
          </div>

          <div className="pt-2">
            <button
              type="button"
              onClick={checkAvailability}
              disabled={isChecking || !bookingData.tanggal || !bookingData.waktu}
              className={`w-full p-2 rounded mb-4 ${isChecking
                ? "bg-gray-400 text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
            >
              {isChecking ? "Memeriksa..." : "Cek Ketersediaan"}
            </button>

            {availabilityStatus !== null && (
              <div
                className={`p-3 rounded mb-4 ${availabilityStatus
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
                  }`}
              >
                {availabilityStatus
                  ? "Waktu tersedia! Silakan lanjutkan pemesanan."
                  : "Maaf, waktu ini sudah terpesan. Pilih waktu lain."}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting || availabilityStatus !== true}
              className={`w-full p-2 rounded ${isSubmitting || availabilityStatus !== true
                ? "bg-gray-400 text-white"
                : "bg-green-500 hover:bg-green-600 text-white"
                }`}
            >
              {isSubmitting ? "Memproses..." : "Buat Pemesanan"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
