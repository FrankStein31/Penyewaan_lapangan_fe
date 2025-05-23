"use client";
import { useState, useEffect } from "react";
import { bookingService } from "@/services/api";
import { fieldService } from "@/services/api";
import { sessionService } from "@/services/api";
import { categoryService } from "@/services/api";
import UserLayout from "@/components/user/UserLayout";
import { Card, CardContent, Typography, CardMedia, Chip, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Select, FormControl, InputLabel, Grid, Box, Divider, Alert, CircularProgress, IconButton } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function BookingPage() {
  const [fields, setFields] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedField, setSelectedField] = useState(null);
  const [selectedSession, setSelectedSession] = useState(null);
  const [availableSessions, setAvailableSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingSessions, setLoadingSessions] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
    email: "",
    team: "",
    participants: "",
    notes: "",
    paymentMethod: "transfer"
  });
  const [error, setError] = useState(null);
  const [showSessionsModal, setShowSessionsModal] = useState(false);
  const router = useRouter();

  // Fungsi untuk memformat tanggal menjadi string yyyy-mm-dd untuk API
  const formatDateForAPI = (date) => {
    // Pastikan kita menggunakan UTC untuk menghindari masalah timezone
    const utcDate = new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    ));
    const day = String(utcDate.getUTCDate()).padStart(2, '0');
    const month = String(utcDate.getUTCMonth() + 1).padStart(2, '0');
    const year = utcDate.getUTCFullYear();
    return `${year}-${month}-${day}`;
  };

  // Fungsi untuk memformat tanggal menjadi string dd/mm/yyyy untuk display
  const formatDate = (date) => {
    if (!date) return '-';
    // Pastikan kita menggunakan UTC untuk menghindari masalah timezone
    const utcDate = new Date(Date.UTC(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
    ));
    return utcDate.toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
  };

  // Handle input perubahan pada form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submit untuk booking
  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi form
    if (!bookingForm.name || !bookingForm.phone || !bookingForm.email) {
      alert("Mohon lengkapi data diri untuk melakukan booking");
      return;
    }
    
    if (selectedTimeSlots.length === 0) {
      alert("Mohon pilih setidaknya satu sesi waktu");
      return;
    }

    try {
      // Tampilkan loading atau feedback
      setLoading(true);
      
      // Kumpulkan semua ID sesi yang dipilih
      const selectedSessionIds = selectedTimeSlots.map(slot => slot.id_jam || slot.id_sesi || slot.id);
      
      // Siapkan data untuk API
      const bookingData = {
        id_lapangan: selectedField.id,
        id_sesi: selectedSessionIds, // Kirim array id_sesi
        tanggal: formatDateForAPI(selectedDate),
        nama_pelanggan: bookingForm.name,
        email: bookingForm.email,
        no_hp: bookingForm.phone,
        catatan: bookingForm.notes,
      };
      
      console.log("Mengirim data booking:", bookingData);
      
      // Kirim request ke API
      const response = await bookingService.create(bookingData);
      console.log("Respons booking:", response);
      
      // Booking berhasil
      alert("Booking berhasil dibuat! Silakan cek halaman dashboard untuk melihat booking Anda.");
      
      // Close modal
      setShowBookingModal(false);
      
      // Reset form dan selected slots
      setBookingForm({
        name: "",
        phone: "",
        email: "",
        team: "",
        participants: "",
        notes: "",
        paymentMethod: "transfer"
      });
      setSelectedTimeSlots([]);
      
      // Redirect ke halaman dashboard
      router.push('/dashboard');
      
    } catch (error) {
      console.error("Error creating booking:", error);
      
      // Tampilkan pesan error
      let errorMessage = "Terjadi kesalahan saat membuat booking. Silakan coba lagi.";
      
      if (error.response) {
        console.error("Full error response:", error.response);
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data && error.response.data.error) {
          errorMessage = error.response.data.error;
        }
      }
      
      alert(`Booking gagal: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // Fungsi untuk menangani saat sesi waktu dipilih
  const handleSessionSelect = (session) => {
    // Cek apakah sesi sudah dipilih (toggle)
    const isSelected = selectedTimeSlots.some(s => s.id === session.id);
    
    if (isSelected) {
      // Hapus sesi dari daftar yang dipilih
      setSelectedTimeSlots(selectedTimeSlots.filter(s => s.id !== session.id));
    } else {
      // Tambahkan sesi ke daftar yang dipilih
      setSelectedTimeSlots([...selectedTimeSlots, session]);
    }
  };

  // Fungsi untuk membuka modal booking
  const openBookingModal = (field) => {
    if (selectedTimeSlots.length === 0) {
      alert("Mohon pilih setidaknya satu sesi waktu terlebih dahulu");
      return;
    }
    
    console.log("Data lapangan:", field);
    console.log("Data slot waktu yang dipilih:", selectedTimeSlots);
    
    setSelectedField(field);
    setShowSessionsModal(false);
    setShowBookingModal(true);
  };

  // Fungsi untuk mendapatkan nama hari dalam Bahasa Indonesia
  const getDayName = (date) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[date.getDay()];
  };

  // Mendapatkan data lapangan dengan info ketersediaan
  const fetchFieldsWithAvailability = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("Mengambil data lapangan...");
      const response = await fieldService.getAll();
      console.log("Response lapangan:", response);
      
      if (response && response.data) {
        let fieldsData = response.data.data || response.data;
        console.log("Data lapangan:", fieldsData);
        
        // Filter lapangan berdasarkan kategori yang dipilih
        let filteredFields = fieldsData;
        if (selectedCategory !== "all") {
          console.log("Filtering by category:", selectedCategory);
          filteredFields = fieldsData.filter(field => 
            field.kategori_id && field.kategori_id.toString() === selectedCategory
          );
          console.log("Filtered fields:", filteredFields);
        }
        
        // Ambil semua sesi
        const sessionsResponse = await axios.get(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/sesi`);
        const allSessions = sessionsResponse.data.data || sessionsResponse.data || [];
        console.log("All sessions:", allSessions);
        
        if (allSessions.length === 0) {
          setError("Tidak ada data sesi yang tersedia. Silakan hubungi administrator.");
          setFields([]);
          return;
        }
        
        // Proses untuk mendapatkan ketersediaan setiap lapangan
        const fieldsWithAvailability = await Promise.all(
          filteredFields.map(async (field) => {
            if (!field.id) {
              console.error("Field ID tidak ditemukan:", field);
              return { 
                ...field, 
                availableSessions: [],
                error: "ID lapangan tidak valid" 
              };
            }
            
            try {
              const formattedDate = formatDateForAPI(selectedDate);
              console.log(`Memeriksa ketersediaan untuk lapangan ID=${field.id}, tanggal=${formattedDate}`);
              
              let availableSessions = [];
              
              try {
                const availabilityResponse = await axios.get(
                  `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/pemesanan/check-availability`, 
                  { 
                    params: { 
                      id_lapangan: field.id, 
                      tanggal: formattedDate 
                    } 
                  }
                );
                
                console.log(`Response ketersediaan untuk lapangan ${field.id}:`, availabilityResponse);
                
                if (availabilityResponse && availabilityResponse.data && availabilityResponse.data.data) {
                  console.log(`Data sesi mentah dari API:`, JSON.stringify(availabilityResponse.data.data));
                  
                  // Pastikan format waktu sesi tersedia sudah benar sebelum disimpan
                  availableSessions = availabilityResponse.data.data.map(session => {
                    // Log data sesi mentah untuk debugging
                    console.log(`Data sesi individual:`, session);
                    console.log(`id_jam:`, session.id_jam);
                    console.log(`jam_mulai mentah:`, session.jam_mulai);
                    console.log(`jam_selesai mentah:`, session.jam_selesai);
                    
                    // JANGAN UBAH FORMAT JAM DARI DATABASE!
                    // Gunakan properti jam_mulai dan jam_selesai langsung dari database
                    const sessionData = {
                      ...session,
                      // Gunakan ID sesual prioritas
                      id: session.id_jam || session.id || session.id_sesi,
                      // SIMPAN JAM LANGSUNG DARI DATABASE!
                      jam_mulai: session.jam_mulai,
                      jam_selesai: session.jam_selesai,
                      harga: session.harga || "0",
                      tersedia: true
                    };
                    
                    console.log(`Data sesi final:`, sessionData);
                    return sessionData;
                  });
                }
              } catch (availabilityError) {
                console.error(`Error saat memeriksa ketersediaan lapangan ${field.id}:`, availabilityError);
                return { 
                  ...field, 
                  availableSessions: [],
                  sessions: [], 
                  error: availabilityError.message || "Gagal memeriksa ketersediaan" 
                };
              }
              
              return { 
                ...field, 
                availableSessions,
                sessions: availableSessions // Untuk kompatibilitas dengan kode lama
              };
            } catch (error) {
              console.error(`Error saat memeriksa ketersediaan lapangan ${field.id}:`, error);
              return { 
                ...field, 
                availableSessions: [],
                sessions: [], // Untuk kompatibilitas dengan kode lama
                error: error.message || "Gagal memeriksa ketersediaan" 
              };
            }
          })
        );
        
        console.log("Data lapangan dengan ketersediaan:", fieldsWithAvailability);
        setFields(fieldsWithAvailability);
      } else {
        console.error("Format response tidak sesuai:", response);
        setError("Format respons dari server tidak sesuai. Silakan coba lagi nanti.");
        setFields([]);
      }
    } catch (error) {
      console.error("Error fetching fields:", error);
      setError(`Gagal memuat data lapangan: ${error.message || "Kesalahan tidak diketahui"}`);
      setFields([]);
    } finally {
      setLoading(false);
    }
  };

  // Mendapatkan data kategori dari API - pindahkan fungsi ke atas untuk prioritas
  const fetchCategories = async () => {
    try {
      setLoadingCategories(true);
      console.log("Mengambil data kategori...");
      const response = await categoryService.getAll();
      console.log("Response kategori:", response);
      
      if (response && response.data) {
        // Coba akses data dengan berbagai format response yang mungkin
        let categoriesData = [];
        
        if (Array.isArray(response.data)) {
          console.log("Data kategori adalah array:", response.data);
          categoriesData = response.data;
        } else if (response.data.data && Array.isArray(response.data.data)) {
          console.log("Data kategori dalam response.data.data:", response.data.data);
          categoriesData = response.data.data;
        } else {
          console.log("Format data tidak dikenali:", response.data);
          // Coba ambil data dengan cara lain - asumsi response.data adalah object dengan field-field kategori
          if (typeof response.data === 'object' && response.data !== null) {
            console.log("Mencoba ekstrak kategori dari object...");
            categoriesData = Object.values(response.data);
          }
        }
        
        // Set data kategori
        console.log("Data kategori setelah diproses:", categoriesData);
        
        // Pastikan data valid dengan id dan nama_kategori
        const validCategories = categoriesData.filter(cat => cat && cat.id && cat.nama_kategori);
        console.log("Kategori valid:", validCategories);
        
        setCategories(validCategories);
      } else {
        console.log("Tidak ada data kategori dalam response");
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]); // Set kosong jika ada error
    } finally {
      setLoadingCategories(false);
    }
  };

  // Mengambil data kategori saat komponen dimuat pertama kali
  useEffect(() => {
    fetchCategories();
  }, []);

  // Menambahkan useEffect untuk mengambil data lapangan ketika kategori berubah
  useEffect(() => {
    fetchFieldsWithAvailability();
  }, [selectedDate, selectedCategory]); // Reload saat tanggal atau kategori berubah

  // Fungsi untuk mengubah tanggal
  const changeDate = (amount) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + amount);
    setSelectedDate(newDate);
  };

  // Filter lapangan berdasarkan kategori
  const filteredFields = selectedCategory === "all"
    ? fields
    : fields.filter(field => {
        // Cek apakah field memiliki kategori_id, jika tidak coba gunakan properti lain
        return field.kategori_id === parseInt(selectedCategory) || 
               field.id_kategori === parseInt(selectedCategory) ||
               (field.kategori && field.kategori.id === parseInt(selectedCategory));
      });

  // Fungsi untuk memformat waktu dari sesi
  const formatSessionTime = (timeStr) => {
    if (!timeStr) return '';
    
    try {
      // Menangani kasus tanggal dan waktu lengkap seperti "2025-05-16T07:00:00.000000Z"
      if (timeStr.includes('T') && timeStr.includes('Z')) {
        return new Date(timeStr).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      }

      // Menangani format waktu standar seperti "07:00:00"
      if (timeStr.includes(':')) {
        const parts = timeStr.split(':');
        if (parts.length >= 2) {
          return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
        }
      }

      // Fallback jika format tidak dikenali
      return timeStr;
    } catch (error) {
      console.error('Error formatting time:', error, timeStr);
      return timeStr; // Kembalikan string asli jika ada error
    }
  };

  // Fungsi tambahan untuk parse time dari format apapun ke HH:MM
  const parse_time = (timeInput) => {
    // Jika input kosong, return string kosong
    if (!timeInput) return '';
    
    try {
      // Konversi ke string untuk memastikan
      const timeStr = String(timeInput);
      
      // Coba mengekstrak dengan regex untuk mendapatkan jam dan menit
      const timeRegex = /(\d{1,2}):(\d{1,2})(?::(\d{1,2}))?/;
      const match = timeStr.match(timeRegex);
      
      if (match) {
        // Format dengan padding
        return `${match[1].padStart(2, '0')}:${match[2].padStart(2, '0')}`;
      }
      
      // Jika tidak berhasil, gunakan pendekatan alternatif
      if (timeStr.includes('T')) {
        // Format ISO
        const timePart = timeStr.split('T')[1];
        return timePart.substring(0, 5);
      } else if (timeStr.includes(' ') && timeStr.includes('-')) {
        // Format dengan spasi
        const parts = timeStr.split(' ');
        if (parts.length > 1) {
          return parts[1].substring(0, 5);
        }
      }
      
      // Jika tidak ada format yang cocok
      console.error("Format waktu tidak dapat diparse:", timeStr);
      return "00:00";
    } catch (e) {
      console.error("Error saat parse waktu:", e);
      return "00:00";
    }
  };

  // Fungsi untuk menampilkan modal sesi tersedia untuk lapangan yang dipilih
  const handleViewSessions = async (field) => {
    try {
      setSelectedField(field);
      setLoadingSessions(true);
      setError(null);
      
      const formattedDate = formatDateForAPI(selectedDate);
      console.log(`Memeriksa ketersediaan untuk lapangan ID=${field.id}, tanggal=${formattedDate}`);
      
      // Tambahkan parameter debugging
      const params = { 
        id_lapangan: field.id, 
        tanggal: formattedDate,
        debug: true  // Tambahkan parameter debugging
      };
      
      console.log("Mengirim request dengan params:", params);
      
      const availabilityResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/pemesanan/check-availability`, 
        { params }
      );
      
      if (availabilityResponse?.data?.data) {
        // Log seluruh respons untuk debugging
        console.log("Respons lengkap dari API:", availabilityResponse);
        console.log("Data sesi dari API (raw):", JSON.stringify(availabilityResponse.data.data));
        
        // Tambahkan debugging untuk setiap field
        availabilityResponse.data.data.forEach((session, index) => {
          console.log(`Sesi ${index + 1}:`, {
            id: session.id_jam || session.id || session.id_sesi,
            jam_mulai: session.jam_mulai,
            jam_selesai: session.jam_selesai,
            tipe_data_jam_mulai: typeof session.jam_mulai,
            tipe_data_jam_selesai: typeof session.jam_selesai
          });
        });
        
        const sessionsData = availabilityResponse.data.data.map(session => {
          // Log data mentah setiap sesi untuk debugging
          console.log(`Data sesi mentah:`, session);
          
          // Extract waktu dari format lengkap menggunakan fungsi parse_time
          const formattedStart = parse_time(session.jam_mulai);
          const formattedEnd = parse_time(session.jam_selesai);
          
          console.log(`Waktu setelah diformat - Mulai: ${formattedStart}, Selesai: ${formattedEnd}`);
          
          // Proses data sesi untuk tampilan
          return {
            ...session,
            id: session.id_jam || session.id || session.id_sesi,
            // Simpan waktu asli
            jam_mulai_original: session.jam_mulai,
            jam_selesai_original: session.jam_selesai,
            // Format untuk tampilan
            formatted_start: formattedStart,
            formatted_end: formattedEnd,
            // Tambahkan pengecekan ketersediaan
            tersedia: session.tersedia === undefined ? true : session.tersedia
          };
        });
        
        console.log("Data sesi setelah diproses:", sessionsData);
        setAvailableSessions(sessionsData);
        setShowSessionsModal(true);
      } else {
        console.error("Tidak ada data sesi dalam respons:", availabilityResponse);
        setAvailableSessions([]);
        setError("Tidak dapat memuat data sesi. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error fetching sessions:", error.response || error);
      setError("Gagal memuat data sesi. Silakan coba lagi.");
    } finally {
      setLoadingSessions(false);
    }
  };

  // Fungsi untuk menutup modal sesi
  const handleCloseSessionsModal = () => {
    setShowSessionsModal(false);
    setAvailableSessions([]);
    setSelectedField(null);
  };

  return (
    <UserLayout title="Booking Lapangan">
      <Card sx={{ mb: 3, borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" component="h2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              Cari dan Booking Lapangan
            </Typography>
          </Box>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: {xs: 'column', md: 'row'}, 
            justifyContent: 'space-between', 
            alignItems: {xs: 'flex-start', md: 'center'}, 
            gap: 2.5
          }}>
            {/* Date Selector */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 1,
              py: 1.25,
              px: 2.5, 
              bgcolor: 'background.paper',
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.04)',
              width: {xs: '100%', md: 'auto'}
            }}>
              <Button 
                variant="outlined" 
                onClick={() => changeDate(-1)}
                size="small"
                sx={{
                  minWidth: '40px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  p: 0,
                  border: '1px solid rgba(0,0,0,0.15)',
                  color: 'primary.main'
                }}
              >
                &lt;
              </Button>
              <Box sx={{ textAlign: 'center', mx: 2, minWidth: '150px' }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'primary.main' }}>{getDayName(selectedDate)}</Typography>
                <Typography variant="body2" color="text.secondary">{formatDate(selectedDate)}</Typography>
              </Box>
              <Button 
                variant="outlined" 
                onClick={() => changeDate(1)}
                size="small"
                sx={{
                  minWidth: '40px',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  p: 0,
                  border: '1px solid rgba(0,0,0,0.15)',
                  color: 'primary.main'
                }}
              >
                &gt;
              </Button>
            </Box>

            {/* Category Filter */}
            <Box sx={{ 
              display: 'flex', 
              gap: 1.5, 
              flexWrap: 'wrap',
              bgcolor: 'background.paper',
              py: 1.25,
              px: 2.5,
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.04)',
              width: {xs: '100%', md: 'auto'}
            }}>
              <Button
                variant={selectedCategory === "all" ? "contained" : "text"}
                onClick={() => setSelectedCategory("all")}
                size="small"
                sx={{
                  borderRadius: '20px',
                  px: 2,
                  py: 0.75,
                  textTransform: 'none',
                  fontWeight: selectedCategory === "all" ? 'bold' : 'normal',
                  '&.MuiButton-contained': {
                    boxShadow: '0 3px 6px rgba(0,0,0,0.15)'
                  },
                  '&.MuiButton-text': {
                    color: 'text.secondary'
                  }
                }}
              >
                Semua
              </Button>
              
              {/* Kategori dinamis dari API */}
              {loadingCategories ? (
                <Box sx={{ display: 'flex', alignItems: 'center', px: 2 }}>
                  <div className="animate-pulse w-16 h-8 bg-gray-200 rounded-full"></div>
                </Box>
              ) : (
                categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id.toString() ? "contained" : "text"}
                    onClick={() => setSelectedCategory(category.id.toString())}
                    size="small"
                    sx={{
                      borderRadius: '20px',
                      px: 2,
                      py: 0.75,
                      textTransform: 'none',
                      fontWeight: selectedCategory === category.id.toString() ? 'bold' : 'normal',
                      '&.MuiButton-contained': {
                        boxShadow: '0 3px 6px rgba(0,0,0,0.15)'
                      },
                      '&.MuiButton-text': {
                        color: 'text.secondary'
                      }
                    }}
                  >
                    {category.nama_kategori}
                  </Button>
                ))
              )}
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Box sx={{ position: 'relative' }}>
        {/* Loading state */}
        {loading && (
          <Box sx={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center', 
            alignItems: 'center', 
            py: 10,
            minHeight: '300px' 
          }}>
            <Box sx={{
              width: '60px',
              height: '60px',
              border: '4px solid',
              borderColor: 'primary.light',
              borderTopColor: 'primary.main',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              mb: 3,
              '@keyframes spin': {
                '0%': {
                  transform: 'rotate(0deg)',
                },
                '100%': {
                  transform: 'rotate(360deg)',
                },
              },
            }} />
            <Typography variant="h6" color="primary" sx={{ fontWeight: 'medium' }}>
              Memuat Lapangan...
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Mohon tunggu sebentar
            </Typography>
          </Box>
        )}

        {/* Error state */}
        {!loading && error && (
          <Card sx={{ 
            p: 5, 
            textAlign: 'center',
            borderRadius: '12px',
            boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.04)'
          }}>
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'center',
              mb: 3,
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </Box>
            <Typography variant="h6" gutterBottom>{error}</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Silakan coba lagi nanti atau hubungi administrator.
            </Typography>
            <Button 
              variant="outlined" 
              onClick={fetchFieldsWithAvailability}
              startIcon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>}
            >
              Coba Lagi
            </Button>
          </Card>
        )}

        {/* No fields state */}
        {!loading && !error && filteredFields.length === 0 && (
          <Card sx={{ 
            p: 5, 
            textAlign: 'center',
            borderRadius: '12px',
            boxShadow: '0 6px 16px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.04)'
          }}>
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'center',
              mb: 3,
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </Box>
            <Typography variant="h6" gutterBottom>Tidak Ada Lapangan Tersedia</Typography>
            <Typography variant="body2" color="text.secondary">
              Tidak ditemukan lapangan untuk kategori dan tanggal yang dipilih.
            </Typography>
          </Card>
        )}

        {/* Fields Grid */}
        {!loading && !error && filteredFields.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredFields.map((field) => (
              <div key={field.id} className="w-full">
                <Card sx={{ 
                  height: 400,
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: '12px', 
                  overflow: 'hidden',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out', 
                  '&:hover': { 
                    transform: 'translateY(-5px)', 
                    boxShadow: '0 12px 20px rgba(0,0,0,0.1)' 
                  } 
                }}>
                  {/* Image section with fixed height */}
                  <Box 
                    sx={{ 
                      width: '100%',
                      height: 160,
                      backgroundColor: '#111111',
                      backgroundImage: `url(${field.foto ? `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${field.foto}` : "https://via.placeholder.com/400x200?text=Lapangan"})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat'
                    }}
                  />
                  
                  {/* Content section with fixed layout */}
                  <CardContent sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    p: 2,
                    pt: 2,
                    pb: 2,
                    height: 240,
                    flexGrow: 0
                  }}>
                    {/* Title and price section */}
                    <Box sx={{ mb: 1 }}>
                      <Typography variant="h6" component="h3" sx={{ 
                        fontWeight: 'bold', 
                        fontSize: '1rem',
                        mb: 0.5,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {field.nama}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Chip
                            label={field.kategori?.nama_kategori || 'Lapangan'}
                            size="small"
                            color="primary"
                            sx={{ fontWeight: 'medium', height: 24 }}
                          />
                          <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 mr-1 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <Typography variant="body2">4.5</Typography>
                          </Box>
                        </Box>
                        <Typography variant="h6" color="primary.main" fontWeight="bold" fontSize="1rem">
                          Rp {parseInt(field.harga || 0).toLocaleString('id-ID')}
                        </Typography>
                      </Box>
                    </Box>
                    
                    {/* Description with fixed height */}
                    <Typography variant="body2" sx={{ 
                      color: 'text.secondary', 
                      fontStyle: field.deskripsi ? 'normal' : 'italic',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      height: 40,
                      mb: 1
                    }}>
                      {field.deskripsi || 'Tidak ada deskripsi'}
                    </Typography>

                    {/* Facilities section with fixed height */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="text.secondary" fontWeight="bold" sx={{ display: 'block', mb: 0.5 }}>
                        Fasilitas:
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap', 
                        gap: 0.5,
                        height: 50,
                        overflow: 'hidden'
                      }}>
                        {field.fasilitas && field.fasilitas.length > 0 ? (
                          field.fasilitas.map((fasilitas) => (
                            <Chip
                              key={fasilitas.id}
                              label={fasilitas.nama_fasilitas}
                              size="small"
                              sx={{ 
                                bgcolor: 'rgba(25, 118, 210, 0.08)', 
                                color: 'primary.main',
                                fontSize: '0.7rem',
                                height: 24
                              }}
                            />
                          ))
                        ) : (
                          <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                            Tidak ada fasilitas tercatat
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    {/* Button with fixed height at bottom */}
                    <Box sx={{ mt: 'auto' }}>
                      <Button
                        variant="contained"
                        fullWidth
                        onClick={() => handleViewSessions(field)}
                        sx={{
                          height: 40,
                          borderRadius: '8px',
                          fontWeight: 'bold',
                          textTransform: 'none',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          '&:hover': {
                            boxShadow: '0 6px 12px rgba(0,0,0,0.2)',
                          }
                        }}
                      >
                        Lihat Jam Tersedia
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </Box>

      {/* Sessions Modal */}
      <Dialog
        open={showSessionsModal}
        onClose={handleCloseSessionsModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            overflow: 'hidden'
          }
        }}
      >
        <Box sx={{ 
          p: 3, 
          background: 'linear-gradient(135deg, #7367f0 0%, #9e95f5 100%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <Typography variant="h6" fontWeight="bold">
              Pilih Sesi
            </Typography>
            {selectedField && (
              <Typography variant="subtitle1">
                {selectedField.nama} - {formatDate(selectedDate)} ({getDayName(selectedDate)})
              </Typography>
            )}
          </div>
          {selectedTimeSlots.length > 0 && (
            <Button 
              variant="contained" 
              color="success"
              onClick={() => openBookingModal(selectedField)}
              sx={{
                bgcolor: 'white',
                color: '#7367f0',
                fontWeight: 'bold',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                }
              }}
            >
              Lanjut Booking ({selectedTimeSlots.length})
            </Button>
          )}
        </Box>
        <DialogContent sx={{ pt: 3 }}>
          {loadingSessions ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
          ) : (
            <>
              {availableSessions.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="body1" gutterBottom>
                    Tidak ada sesi tersedia untuk tanggal ini
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Silakan coba tanggal lain
                  </Typography>
                </Box>
              ) : (
                <>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Pilih satu atau lebih sesi yang ingin Anda booking:
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mt: 2 }}>
                    {availableSessions.map((session) => {
                      // Cek apakah sesi ini telah dipilih
                      const isSelected = selectedTimeSlots.some(s => s.id === session.id);
                      
                      // Tentukan pesan status untuk sesi yang tidak tersedia
                      let statusMessage = '';
                      if (!session.tersedia) {
                          if (session.alasan === 'expired') {
                              statusMessage = 'Waktu telah lewat';
                          } else if (session.alasan === 'booked') {
                              statusMessage = 'Sudah dipesan';
                          }
                      }

                      // Format harga
                      const formatPrice = (price) => {
                          return new Intl.NumberFormat('id-ID', {
                              style: 'currency',
                              currency: 'IDR',
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 0
                          }).format(price);
                      };
                      
                      return (
                        <Button
                          key={session.id}
                          variant={isSelected ? "contained" : "outlined"}
                          onClick={() => handleSessionSelect(session)}
                          disabled={!session.tersedia}
                          sx={{
                            minWidth: '200px',
                            borderRadius: '8px',
                            py: 1.5,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            borderColor: !session.tersedia 
                                ? 'grey.300' 
                                : isSelected 
                                    ? 'primary.main' 
                                    : 'primary.main',
                            color: !session.tersedia 
                                ? 'grey.500' 
                                : isSelected 
                                    ? 'white' 
                                    : 'primary.main',
                            backgroundColor: !session.tersedia 
                                ? 'grey.100' 
                                : isSelected 
                                    ? 'primary.main' 
                                    : 'transparent',
                            '&:hover': {
                                backgroundColor: !session.tersedia 
                                    ? 'grey.200' 
                                    : isSelected 
                                        ? 'primary.dark' 
                                        : 'primary.light',
                                color: !session.tersedia 
                                    ? 'grey.600' 
                                    : 'white',
                                borderColor: !session.tersedia 
                                    ? 'grey.300' 
                                    : isSelected 
                                        ? 'primary.dark' 
                                        : 'primary.light',
                            },
                            position: 'relative',
                            '&::after': !session.tersedia ? {
                                content: `"${statusMessage}"`,
                                position: 'absolute',
                                bottom: '2px',
                                right: '3px',
                                fontSize: '8px',
                                color: 'error.main',
                                fontWeight: 'bold'
                            } : {}
                          }}
                        >
                          <Typography variant="subtitle1" component="span" sx={{ fontWeight: 'medium' }}>
                              {session.formatted_start} - {session.formatted_end}
                          </Typography>
                          <Box sx={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              alignItems: 'center',
                              fontSize: '0.75rem',
                              color: isSelected ? 'inherit' : 'text.secondary'
                          }}>
                              <Typography variant="caption">
                                  Harga: {formatPrice(session.harga_dasar)}
                              </Typography>
                              {session.biaya_tambahan > 0 && (
                                  <Typography variant="caption" sx={{ color: isSelected ? 'inherit' : 'warning.main' }}>
                                      +{formatPrice(session.biaya_tambahan)}
                                  </Typography>
                              )}
                          </Box>
                        </Button>
                      );
                    })}
                  </Box>
                </>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
          <Button onClick={handleCloseSessionsModal} color="inherit">
            Tutup
          </Button>
        </DialogActions>
      </Dialog>

      {/* Booking Modal */}
      <Dialog
        open={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '12px',
            overflow: 'hidden'
          }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" fontWeight="bold">
            Booking Lapangan
          </Typography>
          {selectedField && (
            <Typography variant="subtitle1" color="text.secondary">
              {selectedField.nama} - {formatDate(selectedDate)} ({getDayName(selectedDate)})
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          {selectedField && selectedTimeSlots.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Card sx={{ mb: 3, overflow: 'hidden' }}>
                <Box sx={{ 
                    p: 2, 
                    background: 'linear-gradient(135deg, #7367f0 0%, #9e95f5 100%)',
                    color: 'white'
                }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Detail Booking
                  </Typography>
                </Box>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Lapangan
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedField.nama}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Kategori
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedField.kategori?.nama_kategori || 'Lapangan'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Tanggal
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {formatDate(selectedDate)} ({getDayName(selectedDate)})
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Jumlah Sesi
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedTimeSlots.length} sesi
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary">
                        Sesi Waktu
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                        {selectedTimeSlots.map((slot, index) => (
                          <Chip 
                            key={index} 
                            label={`${slot.formatted_start} - ${slot.formatted_end}`}
                            color="primary"
                            size="small"
                          />
                        ))}
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Total Durasi
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedTimeSlots.reduce((acc, slot) => acc + (slot.durasi || 1), 0)} jam
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Total Harga
                      </Typography>
                      <Typography variant="body1" fontWeight="medium" color="primary.main">
                        Rp {selectedTimeSlots.reduce((acc, slot) => acc + parseInt(slot.total_harga || selectedField.harga || 0), 0).toLocaleString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              <form>
                <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                  Data Pemesan
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      name="name"
                      label="Nama Lengkap"
                      fullWidth
                      required
                      value={bookingForm.name}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="email"
                      label="Email"
                      type="email"
                      fullWidth
                      required
                      value={bookingForm.email}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="phone"
                      label="Nomor Telepon"
                      fullWidth
                      required
                      value={bookingForm.phone}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="team"
                      label="Nama Tim (opsional)"
                      fullWidth
                      value={bookingForm.team}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      name="participants"
                      label="Jumlah Orang (opsional)"
                      type="number"
                      fullWidth
                      value={bookingForm.participants}
                      onChange={handleInputChange}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      name="notes"
                      label="Catatan (opsional)"
                      multiline
                      rows={2}
                      fullWidth
                      value={bookingForm.notes}
                      onChange={handleInputChange}
                    />
                  </Grid>
                </Grid>

                <Typography variant="subtitle1" gutterBottom fontWeight="medium" sx={{ mt: 3 }}>
                  Metode Pembayaran
                </Typography>
                <FormControl fullWidth>
                  <Select
                    name="paymentMethod"
                    value={bookingForm.paymentMethod}
                    onChange={handleInputChange}
                    displayEmpty
                  >
                    <MenuItem value="transfer">Transfer Bank</MenuItem>
                    <MenuItem value="cash">Tunai</MenuItem>
                    <MenuItem value="qris">QRIS</MenuItem>
                  </Select>
                </FormControl>
              </form>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowBookingModal(false)} variant="outlined">
            Batal
          </Button>
          <Button
            onClick={handleBookingSubmit}
            variant="contained"
            disabled={loading}
          >
            {loading ? 'Memproses...' : 'Booking Sekarang'}
          </Button>
        </DialogActions>
      </Dialog>
    </UserLayout>
  );
}