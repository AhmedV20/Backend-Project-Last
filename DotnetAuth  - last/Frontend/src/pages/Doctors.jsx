import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  Chip,
  useTheme,
  Pagination
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import FaceIcon from '@mui/icons-material/Face';
import PsychologyIcon from '@mui/icons-material/Psychology';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function Doctors() {
  const theme = useTheme();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [specialty, setSpecialty] = useState('');

  // Specialties data
  const specialties = [
    {
      id: 1,
      title: 'General doctor',
      icon: <PersonIcon sx={{ fontSize: 40, color: 'white' }} />,
      color: '#6A5ACD',
      value: 'general',
    },
    {
      id: 2,
      title: 'Dermatologist',
      icon: <FaceIcon sx={{ fontSize: 40, color: 'white' }} />,
      color: '#6A5ACD',
      value: 'dermatology',
    },
    {
      id: 3,
      title: 'Pediatric doctor',
      icon: <ChildCareIcon sx={{ fontSize: 40, color: 'white' }} />,
      color: '#6A5ACD',
      value: 'pediatrics',
    },
    {
      id: 4,
      title: 'Neurologist',
      icon: <PsychologyIcon sx={{ fontSize: 40, color: 'white' }} />,
      color: '#6A5ACD',
      value: 'neurology',
    },
    {
      id: 5,
      title: 'Ophthalmologist',
      icon: <VisibilityIcon sx={{ fontSize: 40, color: 'white' }} />,
      color: '#6A5ACD',
      value: 'ophthalmology',
    },
    {
      id: 6,
      title: 'Cardiologist',
      icon: <LocalHospitalIcon sx={{ fontSize: 40, color: 'white' }} />,
      color: '#6A5ACD',
      value: 'cardiology',
    },
  ];

  // Doctors data
  const doctors = [
    {
      id: 1,
      name: 'Dr. Richard James',
      specialty: 'Cardiologist',
      rating: 4.9,
      image: 'https://via.placeholder.com/300x300/f5f5f5/333333?text=Dr.+Richard+James',
      availability: true,
    },
    {
      id: 2,
      name: 'Dr. Emily Larson',
      specialty: 'Dermatologist',
      rating: 4.8,
      image: 'https://via.placeholder.com/300x300/f5f5f5/333333?text=Dr.+Emily+Larson',
      availability: true,
    },
    {
      id: 3,
      name: 'Dr. Sarah Patel',
      specialty: 'Pediatrician',
      rating: 4.7,
      image: 'https://via.placeholder.com/300x300/f5f5f5/333333?text=Dr.+Sarah+Patel',
      availability: true,
    },
    {
      id: 4,
      name: 'Dr. Christopher Lee',
      specialty: 'Neurologist',
      rating: 4.9,
      image: 'https://via.placeholder.com/300x300/f5f5f5/333333?text=Dr.+Christopher+Lee',
      availability: true,
    },
    {
      id: 5,
      name: 'Dr. Jennifer Garcia',
      specialty: 'Psychiatrist',
      rating: 4.8,
      image: 'https://via.placeholder.com/300x300/f5f5f5/333333?text=Dr.+Jennifer+Garcia',
      availability: true,
    },
    {
      id: 6,
      name: 'Dr. Andrew Williams',
      specialty: 'Orthopedist',
      rating: 4.7,
      image: 'https://via.placeholder.com/300x300/f5f5f5/333333?text=Dr.+Andrew+Williams',
      availability: true,
    },
    {
      id: 7,
      name: 'Dr. Christopher Davis',
      specialty: 'Ophthalmologist',
      rating: 4.9,
      image: 'https://via.placeholder.com/300x300/f5f5f5/333333?text=Dr.+Christopher+Davis',
      availability: true,
    },
    {
      id: 8,
      name: 'Dr. Timothy White',
      specialty: 'Cardiologist',
      rating: 4.8,
      image: 'https://via.placeholder.com/300x300/f5f5f5/333333?text=Dr.+Timothy+White',
      availability: true,
    },
  ];

  // Filter doctors based on search term and specialty
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = specialty ? doctor.specialty.toLowerCase().includes(specialty.toLowerCase()) : true;
    return matchesSearch && matchesSpecialty;
  });

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSpecialtyChange = (event) => {
    setSpecialty(event.target.value);
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #483D8B 0%, #6A5ACD 100%)'
            : 'linear-gradient(135deg, #6A5ACD 0%, #9370DB 100%)',
          py: { xs: 6, md: 8 },
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
              Find Your Doctor
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.9, maxWidth: 700, mx: 'auto', mb: 4 }}>
              Browse through our network of trusted doctors and book your appointment today.
            </Typography>

            <Grid container spacing={2} justifyContent="center">
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  placeholder="Search by doctor name"
                  variant="outlined"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'white' }} />
                      </InputAdornment>
                    ),
                    sx: {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 2,
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white',
                      },
                      '& .MuiInputBase-input::placeholder': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        opacity: 1,
                      },
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} md={3}>
                <TextField
                  select
                  fullWidth
                  placeholder="Specialty"
                  variant="outlined"
                  value={specialty}
                  onChange={handleSpecialtyChange}
                  InputProps={{
                    sx: {
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                      borderRadius: 2,
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'white',
                      },
                    }
                  }}
                  SelectProps={{
                    sx: { color: 'white' }
                  }}
                >
                  <MenuItem value="">All Specialties</MenuItem>
                  {specialties.map((specialty) => (
                    <MenuItem key={specialty.id} value={specialty.value}>
                      {specialty.title}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>

      {/* Doctors List */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          {filteredDoctors.map((doctor) => (
            <Grid item xs={12} sm={6} md={3} key={doctor.id}>
              <Card
                elevation={1}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  overflow: 'hidden',
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)',
                  },
                  border: '1px solid',
                  borderColor: 'rgba(0, 0, 0, 0.05)',
                }}
              >
                <Box sx={{ position: 'relative' }}>
                  <CardMedia
                    component="img"
                    height="200"
                    image={doctor.image}
                    alt={doctor.name}
                  />
                  {doctor.availability && (
                    <Chip
                      label="AVAILABLE"
                      color="success"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 10,
                        left: 10,
                        fontWeight: 'bold',
                        fontSize: '0.7rem',
                      }}
                    />
                  )}
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 2 }}>
                  <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
                    {doctor.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {doctor.specialty}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      borderRadius: 25,
                      py: 1,
                    }}
                  >
                    Book Appointment
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filteredDoctors.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              No doctors found matching your search criteria.
            </Typography>
          </Box>
        )}

        {filteredDoctors.length > 0 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Pagination
              count={Math.ceil(filteredDoctors.length / 8)}
              page={page}
              onChange={handlePageChange}
              color="primary"
              size="large"
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}
