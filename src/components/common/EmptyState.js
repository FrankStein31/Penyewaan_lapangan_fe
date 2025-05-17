import React from 'react';
import { Box, Typography, Button } from '@mui/material';

/**
 * Komponen untuk menampilkan state kosong/tidak ada data
 * @param {object} props
 * @param {string} props.title - Judul pesan
 * @param {string} props.message - Isi pesan
 * @param {string} props.buttonText - Teks pada tombol
 * @param {function} props.buttonAction - Fungsi yang dijalankan saat tombol diklik
 * @param {JSX.Element} props.icon - Icon custom
 * @returns {JSX.Element}
 */
export default function EmptyState({ 
  title = 'Tidak ada data', 
  message = 'Belum ada data yang tersedia saat ini.', 
  buttonText, 
  buttonAction,
  icon
}) {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        textAlign: 'center',
        p: 4,
        my: 2,
        bgcolor: 'background.paper',
        borderRadius: 1,
        border: '1px dashed',
        borderColor: 'divider'
      }}
    >
      {icon && (
        <Box sx={{ mb: 2, color: 'text.secondary' }}>
          {icon}
        </Box>
      )}
      
      {!icon && (
        <Box sx={{ mb: 2, color: 'text.secondary' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
            <path d="M7 11.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm2-3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z"/>
          </svg>
        </Box>
      )}
      
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {message}
      </Typography>
      
      {buttonText && buttonAction && (
        <Button
          variant="contained"
          onClick={buttonAction}
        >
          {buttonText}
        </Button>
      )}
    </Box>
  );
} 