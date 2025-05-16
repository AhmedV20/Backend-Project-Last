import { Box, Container, Typography, Grid, Paper, Avatar, useTheme } from '@mui/material';
import VerifiedIcon from '@mui/icons-material/Verified';
import MedicalServicesIcon from '@mui/icons-material/MedicalServices';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function About() {
  const theme = useTheme();

  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: 'Dr. Michael Johnson',
      role: 'Founder & CEO',
      image: 'https://via.placeholder.com/300x300/f5f5f5/333333?text=Dr.+Michael+Johnson',
      bio: 'Dr. Johnson founded Prescripto with a vision to make healthcare more accessible to everyone.',
    },
    {
      id: 2,
      name: 'Dr. Sarah Williams',
      role: 'Medical Director',
      image: 'https://via.placeholder.com/300x300/f5f5f5/333333?text=Dr.+Sarah+Williams',
      bio: 'With over 15 years of experience, Dr. Williams ensures the highest quality of care for all patients.',
    },
    {
      id: 3,
      name: 'James Anderson',
      role: 'CTO',
      image: 'https://via.placeholder.com/300x300/f5f5f5/333333?text=James+Anderson',
      bio: 'James leads our technology team, developing innovative solutions for healthcare delivery.',
    },
  ];

  return (
    <Box>
      {/* Hero Section */}
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
            <Grid item xs={12} md={6}>
              <Typography
                variant="h2"
                component="h1"
                fontWeight="bold"
                gutterBottom
                sx={{
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                }}
              >
                About Prescripto
              </Typography>
              <Typography
                variant="h6"
                paragraph
                sx={{ opacity: 0.9, mb: 4 }}
              >
                We're on a mission to make healthcare more accessible, convenient, and personalized for everyone.
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  display: { xs: 'none', md: 'block' },
                  position: 'relative',
                }}
              >
                <img
                  src="https://via.placeholder.com/600x400/f5f5f5/333333?text=Medical+Team"
                  alt="Medical Team"
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

      {/* Our Story Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Typography variant="h4" component="h2" fontWeight="600" gutterBottom>
              Our Story
            </Typography>
            <Typography variant="body1" paragraph>
              Prescripto was founded in 2020 with a simple mission: to make healthcare more accessible to everyone. What started as a small team of dedicated healthcare professionals has grown into a comprehensive platform connecting patients with trusted doctors.
            </Typography>
            <Typography variant="body1" paragraph>
              Our founder, Dr. Michael Johnson, recognized the challenges many patients face when trying to access quality healthcare. Long wait times, difficulty finding specialists, and lack of transparency in pricing were just a few of the issues he wanted to address.
            </Typography>
            <Typography variant="body1">
              Today, Prescripto serves thousands of patients, connecting them with hundreds of qualified healthcare providers across multiple specialties. We continue to innovate and expand our services to fulfill our mission of making healthcare accessible to all.
            </Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src="https://via.placeholder.com/600x400/f5f5f5/333333?text=Our+Story"
              alt="Our Story"
              sx={{
                width: '100%',
                height: 'auto',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              }}
            />
          </Grid>
        </Grid>
      </Container>

      {/* Why Choose Us Section */}
      <Box
        sx={{
          py: { xs: 6, md: 10 },
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(18, 18, 18, 0.6)' : 'rgba(249, 250, 251, 0.6)',
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h4" component="h2" fontWeight="600" gutterBottom>
              Why Choose Prescripto
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
              We're committed to providing the best healthcare experience for our patients.
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  borderRadius: 3,
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'white',
                  border: '1px solid',
                  borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    width: 60,
                    height: 60,
                    mb: 2,
                  }}
                >
                  <VerifiedIcon fontSize="large" />
                </Avatar>
                <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
                  Verified Doctors
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All our doctors are verified professionals with proven expertise in their fields.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  borderRadius: 3,
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'white',
                  border: '1px solid',
                  borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    width: 60,
                    height: 60,
                    mb: 2,
                  }}
                >
                  <MedicalServicesIcon fontSize="large" />
                </Avatar>
                <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
                  Quality Care
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  We prioritize quality healthcare delivery and patient satisfaction above all.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  borderRadius: 3,
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'white',
                  border: '1px solid',
                  borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    width: 60,
                    height: 60,
                    mb: 2,
                  }}
                >
                  <SupportAgentIcon fontSize="large" />
                </Avatar>
                <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
                  24/7 Support
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Our customer support team is available around the clock to assist you.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  borderRadius: 3,
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'white',
                  border: '1px solid',
                  borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    width: 60,
                    height: 60,
                    mb: 2,
                  }}
                >
                  <AccessTimeIcon fontSize="large" />
                </Avatar>
                <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
                  Easy Scheduling
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Book appointments at your convenience with our easy-to-use platform.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Our Team Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography variant="h4" component="h2" fontWeight="600" gutterBottom>
            Meet Our Team
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
            The dedicated professionals behind Prescripto's success.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {teamMembers.map((member) => (
            <Grid item xs={12} sm={6} md={4} key={member.id}>
              <Paper
                elevation={0}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                  borderRadius: 3,
                  overflow: 'hidden',
                  bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'white',
                  border: '1px solid',
                  borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                }}
              >
                <Box
                  component="img"
                  src={member.image}
                  alt={member.name}
                  sx={{
                    width: '100%',
                    height: 250,
                    objectFit: 'cover',
                  }}
                />
                <Box sx={{ p: 3 }}>
                  <Typography variant="h6" component="h3" fontWeight="bold" gutterBottom>
                    {member.name}
                  </Typography>
                  <Typography variant="subtitle1" color="primary" gutterBottom>
                    {member.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.bio}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
