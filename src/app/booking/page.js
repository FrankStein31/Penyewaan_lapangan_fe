'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
    Container,
    Typography,
    Box,
    Paper,
    Grid,
    Button,
    Card,
    CardContent,
    CardMedia,
    CardActionArea,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    CircularProgress,
    Divider,
    Stepper,
    Step,
    StepLabel,
    Alert
} from '@mui/material';
import { fieldService, dayService, sessionService, bookingService } from '@/services/api';

export default function BookingPage() {
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    
    const [activeStep, setActiveStep] = useState(0);
    const [fields, setFields] = useState([]);
    const [days, setDays] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [availableSessions, setAvailableSessions] = useState([]);
    const [isCheckingAvailability, setIsCheckingAvailability] = useState(false);
    const [error, setError] = useState('');
    
    const [selectedField, setSelectedField] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedDateString, setSelectedDateString] = useState('');
    const [selectedSession, setSelectedSession] = useState(null);
    const [booking, setBooking] = useState(null);
    
    // Fungsi untuk mendapatkan minimal tanggal (hari ini)
    const getMinDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };
    
    useEffect(() => {
        // Redirect if not authenticated
        if (!authLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [authLoading, isAuthenticated, router]);
    
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Fetch fields
                const fieldsResponse = await fieldService.getAll();
                if (fieldsResponse && fieldsResponse.data) {
                    setFields(Array.isArray(fieldsResponse.data) ? fieldsResponse.data : []);
                } else {
                    setFields([]);
                    setError('Data lapangan tidak tersedia');
                }
                
                // Fetch days
                const daysResponse = await dayService.getAll();
                if (daysResponse && daysResponse.data) {
                    setDays(Array.isArray(daysResponse.data) ? daysResponse.data : []);
                } else {
                    setDays([]);
                }
                
                // Fetch sessions
                const sessionsResponse = await sessionService.getAll();
                if (sessionsResponse && sessionsResponse.data) {
                    setSessions(Array.isArray(sessionsResponse.data) ? sessionsResponse.data : []);
                } else {
                    setSessions([]);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                setError('Terjadi kesalahan saat memuat data. Silakan coba lagi.');
                setFields([]);
                setDays([]);
                setSessions([]);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, []);
    
    const handleFieldSelect = (field) => {
        setSelectedField(field);
        setSelectedDate(null);
        setSelectedDateString('');
        setSelectedSession(null);
        setAvailableSessions([]);
        setActiveStep(1);
    };
    
    const handleDateChange = (e) => {
        const dateStr = e.target.value;
        setSelectedDateString(dateStr);
        const date = new Date(dateStr);
        setSelectedDate(date);
    };
    
    const handleDateSelect = async () => {
        if (!selectedDate) {
            setError('Silakan pilih tanggal terlebih dahulu');
            return;
        }
        
        setSelectedSession(null);
        setIsCheckingAvailability(true);
        setError('');
        
        try {
            const day = selectedDate.getDay();
            const dayName = days.find(d => d.day_number === day)?.id;
            
            if (!dayName) {
                setError('Terjadi kesalahan saat menentukan hari.');
                setIsCheckingAvailability(false);
                return;
            }
            
            const response = await bookingService.checkAvailability({
                field_id: selectedField.id,
                date: selectedDateString,
                day_id: dayName
            });
            
            setAvailableSessions(response.data);
            setActiveStep(2);
        } catch (error) {
            console.error('Error checking availability:', error);
            setError('Terjadi kesalahan saat memeriksa ketersediaan. Silakan coba lagi.');
        } finally {
            setIsCheckingAvailability(false);
        }
    };
    
    const handleSessionSelect = (session) => {
        setSelectedSession(session);
        setActiveStep(3);
    };
    
    const handleSubmitBooking = async () => {
        if (!selectedField || !selectedDate || !selectedSession) {
            setError('Silakan lengkapi semua data pemesanan.');
            return;
        }
        
        try {
            setLoading(true);
            const response = await bookingService.create({
                field_id: selectedField.id,
                session_id: selectedSession.id,
                date: selectedDateString,
                user_id: user.id
            });
            
            setBooking(response.data);
            setActiveStep(4);
        } catch (error) {
            console.error('Error creating booking:', error);
            setError('Terjadi kesalahan saat membuat pemesanan. Silakan coba lagi.');
        } finally {
            setLoading(false);
        }
    };
    
    const handlePayNow = () => {
        if (booking?.id) {
            router.push(`/payment/${booking.id}`);
        }
    };
    
    const handleBackToBookings = () => {
        router.push('/dashboard');
    };
    
    if (authLoading || loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }
    
    if (!isAuthenticated) {
        return null;
    }
    
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Pemesanan Lapangan
                </Typography>
                
                <Stepper activeStep={activeStep} sx={{ my: 4 }} alternativeLabel>
                    <Step>
                        <StepLabel>Pilih Lapangan</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Pilih Tanggal</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Pilih Sesi</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Konfirmasi</StepLabel>
                    </Step>
                    <Step>
                        <StepLabel>Pembayaran</StepLabel>
                    </Step>
                </Stepper>
                
                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                
                {activeStep === 0 && (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Pilih Lapangan
                        </Typography>
                        {fields && fields.length > 0 ? (
                            <Grid container spacing={3}>
                                {fields.map((field, index) => (
                                    <Grid item xs={12} sm={6} md={4} key={field.id || index}>
                                        <Card>
                                            <CardActionArea onClick={() => handleFieldSelect(field)}>
                                                <CardMedia
                                                    component="img"
                                                    height="200"
                                                    image={field.image || '/images/field-placeholder.jpg'}
                                                    alt={field.name}
                                                />
                                                <CardContent>
                                                    <Typography gutterBottom variant="h5" component="div">
                                                        {field.name}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary" gutterBottom>
                                                        {field.description || 'Tidak ada deskripsi'}
                                                    </Typography>
                                                    <Typography variant="body1" color="primary">
                                                        Rp {field.price?.toLocaleString('id-ID')} / jam
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        ) : (
                            <Alert severity="info" sx={{ mt: 2 }}>
                                Tidak ada lapangan yang tersedia saat ini
                            </Alert>
                        )}
                    </Box>
                )}
                
                {activeStep === 1 && (
                    <Box>
                        <Button 
                            variant="outlined" 
                            onClick={() => setActiveStep(0)} 
                            sx={{ mb: 3 }}
                        >
                            Kembali
                        </Button>
                        
                        <Typography variant="h6" gutterBottom>
                            Pilih Tanggal
                        </Typography>
                        
                        <Box sx={{ maxWidth: 400, mb: 3 }}>
                            <TextField
                                type="date"
                                label="Tanggal Booking"
                                fullWidth
                                value={selectedDateString}
                                onChange={handleDateChange}
                                inputProps={{
                                    min: getMinDate()
                                }}
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                sx={{ mb: 2 }}
                            />
                            
                            <Button 
                                variant="contained" 
                                color="primary" 
                                onClick={handleDateSelect}
                                disabled={!selectedDateString || isCheckingAvailability}
                            >
                                {isCheckingAvailability ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    'Periksa Ketersediaan'
                                )}
                            </Button>
                        </Box>
                    </Box>
                )}
                
                {activeStep === 2 && (
                    <Box>
                        <Button 
                            variant="outlined" 
                            onClick={() => setActiveStep(1)} 
                            sx={{ mb: 3 }}
                        >
                            Kembali
                        </Button>
                        
                        <Typography variant="h6" gutterBottom>
                            Pilih Sesi
                        </Typography>
                        
                        {availableSessions.length === 0 ? (
                            <Alert severity="info">
                                Tidak ada sesi yang tersedia pada tanggal yang dipilih
                            </Alert>
                        ) : (
                            <Grid container spacing={2}>
                                {availableSessions.map((session) => (
                                    <Grid item xs={12} sm={6} md={4} key={session.id}>
                                        <Card
                                            sx={{
                                                borderColor: selectedSession?.id === session.id ? 'primary.main' : 'grey.300',
                                                borderWidth: selectedSession?.id === session.id ? 2 : 1,
                                                borderStyle: 'solid'
                                            }}
                                        >
                                            <CardActionArea onClick={() => handleSessionSelect(session)}>
                                                <CardContent>
                                                    <Typography variant="h6">
                                                        {session.start_time} - {session.end_time}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                        {session.description}
                                                    </Typography>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        )}
                    </Box>
                )}
                
                {activeStep === 3 && (
                    <Box>
                        <Button 
                            variant="outlined" 
                            onClick={() => setActiveStep(2)} 
                            sx={{ mb: 3 }}
                        >
                            Kembali
                        </Button>
                        
                        <Typography variant="h6" gutterBottom>
                            Konfirmasi Pemesanan
                        </Typography>
                        
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={3}>
                                    <Typography variant="body2" color="text.secondary">
                                        Lapangan
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={9}>
                                    <Typography variant="body1">
                                        {selectedField?.name}
                                    </Typography>
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <Divider />
                                </Grid>
                                
                                <Grid item xs={12} sm={3}>
                                    <Typography variant="body2" color="text.secondary">
                                        Tanggal
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={9}>
                                    <Typography variant="body1">
                                        {selectedDate?.toLocaleDateString('id-ID', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </Typography>
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <Divider />
                                </Grid>
                                
                                <Grid item xs={12} sm={3}>
                                    <Typography variant="body2" color="text.secondary">
                                        Sesi
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={9}>
                                    <Typography variant="body1">
                                        {selectedSession?.start_time} - {selectedSession?.end_time}
                                    </Typography>
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <Divider />
                                </Grid>
                                
                                <Grid item xs={12} sm={3}>
                                    <Typography variant="body2" color="text.secondary">
                                        Harga
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={9}>
                                    <Typography variant="body1">
                                        Rp {selectedField?.price?.toLocaleString('id-ID')}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                        
                        <Button 
                            variant="contained"
                            color="primary"
                            onClick={handleSubmitBooking}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Konfirmasi Pemesanan'}
                        </Button>
                    </Box>
                )}
                
                {activeStep === 4 && booking && (
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            Pemesanan Berhasil
                        </Typography>
                        
                        <Alert severity="success" sx={{ mb: 3 }}>
                            Pemesanan berhasil dibuat. Silakan lakukan pembayaran untuk menyelesaikan proses pemesanan.
                        </Alert>
                        
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={3}>
                                    <Typography variant="body2" color="text.secondary">
                                        Kode Booking
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={9}>
                                    <Typography variant="body1" fontWeight="bold">
                                        {booking.booking_code || `BK-${booking.id}`}
                                    </Typography>
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <Divider />
                                </Grid>
                                
                                <Grid item xs={12} sm={3}>
                                    <Typography variant="body2" color="text.secondary">
                                        Lapangan
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={9}>
                                    <Typography variant="body1">
                                        {booking.field?.name || selectedField?.name}
                                    </Typography>
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <Divider />
                                </Grid>
                                
                                <Grid item xs={12} sm={3}>
                                    <Typography variant="body2" color="text.secondary">
                                        Tanggal
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={9}>
                                    <Typography variant="body1">
                                        {new Date(booking.date || selectedDateString).toLocaleDateString('id-ID', {
                                            weekday: 'long',
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </Typography>
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <Divider />
                                </Grid>
                                
                                <Grid item xs={12} sm={3}>
                                    <Typography variant="body2" color="text.secondary">
                                        Sesi
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={9}>
                                    <Typography variant="body1">
                                        {booking.session?.start_time || selectedSession?.start_time} - {booking.session?.end_time || selectedSession?.end_time}
                                    </Typography>
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <Divider />
                                </Grid>
                                
                                <Grid item xs={12} sm={3}>
                                    <Typography variant="body2" color="text.secondary">
                                        Status
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={9}>
                                    <Typography variant="body1" color="warning.main">
                                        {booking.status || 'Menunggu Pembayaran'}
                                    </Typography>
                                </Grid>
                                
                                <Grid item xs={12}>
                                    <Divider />
                                </Grid>
                                
                                <Grid item xs={12} sm={3}>
                                    <Typography variant="body2" color="text.secondary">
                                        Total
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={9}>
                                    <Typography variant="h6" color="primary">
                                        Rp {booking.total_price?.toLocaleString('id-ID')}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button 
                                variant="outlined" 
                                onClick={handleBackToBookings}
                            >
                                Lihat Semua Pesanan
                            </Button>
                        
                            <Button 
                                variant="contained" 
                                color="primary"
                                onClick={handlePayNow}
                            >
                                Bayar Sekarang
                            </Button>
                        </Box>
                    </Box>
                )}
            </Paper>
        </Container>
    );
} 