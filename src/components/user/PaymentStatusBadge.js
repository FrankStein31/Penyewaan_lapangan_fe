import React from 'react';
import { Chip } from '@mui/material';

/**
 * Komponen untuk menampilkan status pembayaran
 * @param {object} props
 * @param {string} props.status - Status pembayaran (pending, paid, expired, dll)
 * @param {object} props.sx - Custom styles
 * @returns {JSX.Element}
 */
export default function PaymentStatusBadge({ status, sx = {} }) {
  // Konfigurasi warna dan label berdasarkan status
  const getStatusConfig = (status) => {
    const statusConfigs = {
      'paid': { color: 'success', label: 'Lunas' },
      'pending': { color: 'warning', label: 'Menunggu' },
      'failed': { color: 'error', label: 'Gagal' },
      'expired': { color: 'error', label: 'Kadaluarsa' },
      'refunded': { color: 'info', label: 'Dikembalikan' },
      'cancelled': { color: 'error', label: 'Dibatalkan' },
      'confirmed': { color: 'success', label: 'Dikonfirmasi' },
      'unpaid': { color: 'error', label: 'Belum Dibayar' },
      'partial': { color: 'warning', label: 'Sebagian' },
    };

    // Konversi status ke lowercase untuk standarisasi
    const lowercaseStatus = status?.toLowerCase() || 'pending';
    
    // Jika status tidak terdaftar, gunakan default
    return statusConfigs[lowercaseStatus] || { color: 'default', label: status };
  };

  const { color, label } = getStatusConfig(status);

  return (
    <Chip
      label={label}
      color={color}
      size="small"
      variant="outlined"
      sx={{ fontWeight: 500, ...sx }}
    />
  );
} 