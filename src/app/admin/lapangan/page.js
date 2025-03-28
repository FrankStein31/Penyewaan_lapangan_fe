'use client'

import { useState } from 'react'
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Toolbar,
  Button,
  IconButton,
  Avatar,
  Chip,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material'
import Sidebar from '@/components/admin/Sidebar'
import Topbar from '@/components/admin/Topbar'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'

export default function LapanganPage() {
  const [open, setOpen] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [selectedLapangan, setSelectedLapangan] = useState(null)

  const handleClickOpen = (lapangan = null) => {
    setSelectedLapangan(lapangan)
    setIsEdit(!!lapangan)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedLapangan(null)
  }

  const lapangan = [
    { 
      id: 1, 
      nama: 'Lapangan Basket 1', 
      jenis: 'Basket', 
      harga: 150000, 
      status: 'Tersedia',
      image: '/basket1.jpg' 
    },
    { 
      id: 2, 
      nama: 'Lapangan Basket 2', 
      jenis: 'Basket', 
      harga: 150000, 
      status: 'Tersedia',
      image: '/basket2.jpg' 
    },
    { 
      id: 3, 
      nama: 'Lapangan Futsal 1', 
      jenis: 'Futsal', 
      harga: 200000, 
      status: 'Tersedia',
      image: '/futsal1.jpg' 
    },
    { 
      id: 4, 
      nama: 'Lapangan Futsal 2', 
      jenis: 'Futsal', 
      harga: 200000, 
      status: 'Maintenance',
      image: '/futsal2.jpg' 
    },
    { 
      id: 5, 
      nama: 'Lapangan Badminton 1', 
      jenis: 'Badminton', 
      harga: 75000, 
      status: 'Tersedia',
      image: '/badminton1.jpg' 
    },
    { 
      id: 6, 
      nama: 'Lapangan Badminton 2', 
      jenis: 'Badminton', 
      harga: 75000, 
      status: 'Tersedia',
      image: '/badminton2.jpg' 
    },
  ]

  return (
    <>
      <Sidebar />
      <Box
        component="main"
        sx={{
          backgroundColor: 'background.default',
          flexGrow: 1,
          minHeight: '100vh',
          overflow: 'auto',
        }}
      >
        <Topbar />
        <Toolbar />
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
              Kelola Lapangan
            </Typography>
            <Button 
              variant="contained" 
              startIcon={<AddIcon />}
              onClick={() => handleClickOpen()}
            >
              Tambah Lapangan
            </Button>
          </Box>
          
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
            {lapangan.map(item => (
              <Box 
                key={item.id} 
                sx={{ 
                  flexGrow: 1, 
                  flexBasis: { 
                    xs: '100%', 
                    sm: 'calc(50% - 24px)', 
                    md: 'calc(33.333% - 24px)' 
                  } 
                }}
              >
                <Card elevation={0} sx={{ height: '100%' }}>
                  <Box 
                    sx={{ 
                      height: 200, 
                      backgroundColor: '#f0f0f0', 
                      backgroundImage: `url(${item.image})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      position: 'relative' 
                    }}
                  >
                    <Chip 
                      label={item.status} 
                      size="small"
                      sx={{ 
                        position: 'absolute', 
                        top: 12, 
                        right: 12,
                        backgroundColor: item.status === 'Tersedia' ? '#28c76f' : '#ea5455',
                        color: 'white'
                      }} 
                    />
                  </Box>
                  <CardContent>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                      {item.nama}
                    </Typography>
                    <Typography variant="body2" component="div" color="text.secondary" sx={{ mb: 1 }}>
                      Jenis: {item.jenis}
                    </Typography>
                    <Typography variant="subtitle1" component="div" sx={{ fontWeight: 600, color: 'primary.main', mb: 2 }}>
                      Rp {item.harga.toLocaleString('id-ID')}/jam
                    </Typography>
                    
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleClickOpen(item)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{isEdit ? 'Edit Lapangan' : 'Tambah Lapangan Baru'}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              fullWidth
              label="Nama Lapangan"
              variant="outlined"
              defaultValue={selectedLapangan?.nama || ''}
            />
            <TextField
              fullWidth
              label="Jenis"
              variant="outlined"
              defaultValue={selectedLapangan?.jenis || ''}
            />
            <TextField
              fullWidth
              label="Harga per Jam"
              variant="outlined"
              type="number"
              defaultValue={selectedLapangan?.harga || ''}
            />
            <TextField
              fullWidth
              label="Status"
              select
              SelectProps={{ native: true }}
              defaultValue={selectedLapangan?.status || 'Tersedia'}
            >
              <option value="Tersedia">Tersedia</option>
              <option value="Maintenance">Maintenance</option>
            </TextField>
            <TextField
              fullWidth
              label="URL Gambar"
              variant="outlined"
              defaultValue={selectedLapangan?.image || ''}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Batal</Button>
          <Button variant="contained" onClick={handleClose}>
            {isEdit ? 'Simpan Perubahan' : 'Simpan'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
} 