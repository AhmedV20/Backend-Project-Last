import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Paper,
  useTheme,
  useMediaQuery,
  Avatar,
  Rating,
  Chip,
  CircularProgress,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import FaceIcon from '@mui/icons-material/Face';
import PsychologyIcon from '@mui/icons-material/Psychology';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Simulate loading and check for errors
    const timer = setTimeout(() => {
      try {
        // Any initialization code can go here
        setLoading(false);
      } catch (err) {
        console.error("Error initializing Home page:", err);
        setError(true);
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Featured doctors data
  const featuredDoctors = [
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

  // Specialties data
  const specialties = [
    {
      id: 1,
      title: 'General doctor',
      icon: <PersonIcon sx={{ fontSize: 40, color: 'white' }} />,
      color: '#6A5ACD',
    },
    {
      id: 2,
      title: 'Dermatologist',
      icon: <FaceIcon sx={{ fontSize: 40, color: 'white' }} />,
      color: '#6A5ACD',
    },
    {
      id: 3,
      title: 'Pediatric doctor',
      icon: <ChildCareIcon sx={{ fontSize: 40, color: 'white' }} />,
      color: '#6A5ACD',
    },
    {
      id: 4,
      title: 'Neurologist',
      icon: <PsychologyIcon sx={{ fontSize: 40, color: 'white' }} />,
      color: '#6A5ACD',
    },
    {
      id: 5,
      title: 'Ophthalmologist',
      icon: <VisibilityIcon sx={{ fontSize: 40, color: 'white' }} />,
      color: '#6A5ACD',
    },
    {
      id: 6,
      title: 'Cardiologist',
      icon: <LocalHospitalIcon sx={{ fontSize: 40, color: 'white' }} />,
      color: '#6A5ACD',
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" color="error" gutterBottom>
          Something went wrong
        </Typography>
        <Typography variant="body1" paragraph>
          We're having trouble loading this page. Please try refreshing.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.reload()}
          sx={{ mt: 2 }}
        >
          Refresh Page
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #483D8B 0%, #6A5ACD 100%)'
            : 'linear-gradient(135deg, #6A5ACD 0%, #9370DB 100%)',
          pt: { xs: 8, md: 12 },
          pb: { xs: 8, md: 12 },
          overflow: 'hidden',
          position: 'relative',
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', zIndex: 2 }}>
                <Typography
                  variant="h2"
                  component="h1"
                  fontWeight="bold"
                  gutterBottom
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    mb: 2,
                  }}
                >
                  Book Appointment With Trusted Doctors
                </Typography>
                <Typography
                  variant="h6"
                  paragraph
                  sx={{ mb: 4, maxWidth: '90%', opacity: 0.9 }}
                >
                  Simply browse through our network of trusted doctors, schedule your appointment online now.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button
                    variant="contained"
                    size="large"
                    component={Link}
                    to={isAuthenticated ? "/profile" : "/register"}
                    sx={{
                      py: 1.5,
                      px: 4,
                      bgcolor: 'white',
                      color: '#6A5ACD',
                      fontWeight: 500,
                      '&:hover': {
                        bgcolor: 'rgba(255, 255, 255, 0.9)',
                        boxShadow: '0 6px 20px rgba(255, 255, 255, 0.2)',
                      }
                    }}
                  >
                    Book appointment
                  </Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: { xs: 'none', md: 'block' },
                  position: 'relative',
                }}
              >
                <img
                  src="https://via.placeholder.com/600x400/f5f5f5/333333?text=Doctors+Team"
                  alt="Doctor with patient"
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '16px',
                    position: 'relative',
                    zIndex: 1,
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Find by Specialty Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h4"
            component="h2"
            fontWeight="600"
            gutterBottom
          >
            Find by Specialty
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: '700px', mx: 'auto' }}>
            Simply browse through our network of trusted doctors, schedule your appointment online now.
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {specialties.map((specialty) => (
            <Grid item xs={6} sm={4} md={2} key={specialty.id}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    bgcolor: specialty.color,
                    mb: 2,
                  }}
                >
                  {specialty.icon}
                </Avatar>
                <Typography variant="body1" fontWeight="500">
                  {specialty.title}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Top Doctors Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography
            variant="h4"
            component="h2"
            fontWeight="600"
            gutterBottom
          >
            Top Doctors To Book
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: '700px', mx: 'auto' }}>
            Simply browse through our network of trusted doctors.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {featuredDoctors.slice(0, 8).map((doctor) => (
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

        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <Button
            variant="outlined"
            size="large"
            component={Link}
            to="/doctors"
            sx={{
              py: 1.5,
              px: 4,
              borderRadius: 25,
            }}
          >
            View All
          </Button>
        </Box>
      </Container>

      {/* Book Appointment Section */}
      <Box
        sx={{
          background: theme.palette.mode === 'dark'
            ? 'linear-gradient(135deg, #483D8B 0%, #6A5ACD 100%)'
            : 'linear-gradient(135deg, #6A5ACD 0%, #9370DB 100%)',
          py: { xs: 6, md: 10 },
          color: 'white',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={7}>
              <Typography
                variant="h3"
                component="h2"
                fontWeight="bold"
                gutterBottom
              >
                Book Appointment With 100+ Trusted Doctors
              </Typography>
              <Button
                variant="contained"
                size="large"
                component={Link}
                to="/doctors"
                sx={{
                  mt: 3,
                  py: 1.5,
                  px: 4,
                  bgcolor: 'white',
                  color: '#6A5ACD',
                  fontWeight: 500,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.9)',
                  }
                }}
              >
                Book Appointment
              </Button>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  display: { xs: 'none', md: 'block' },
                  position: 'relative',
                }}
              >
                <img
                  src="https://via.placeholder.com/500x400/f5f5f5/333333?text=Doctor"
                  alt="Doctor"
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: '16px',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
}
