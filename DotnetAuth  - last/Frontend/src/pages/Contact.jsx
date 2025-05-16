import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  useTheme,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

export default function Contact() {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)) {
      newErrors.email = 'Invalid email address';
    }
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.message.trim()) newErrors.message = 'Message is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        setSnackbar({
          open: true,
          message: 'Your message has been sent successfully!',
          severity: 'success',
        });
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        });
      }, 1500);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({
      ...prev,
      open: false,
    }));
  };

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
          <Box sx={{ textAlign: 'center', maxWidth: 800, mx: 'auto' }}>
            <Typography
              variant="h2"
              component="h1"
              fontWeight="bold"
              gutterBottom
              sx={{
                fontSize: { xs: '2.5rem', md: '3.5rem' },
              }}
            >
              Contact Us
            </Typography>
            <Typography
              variant="h6"
              paragraph
              sx={{ opacity: 0.9, mb: 4 }}
            >
              Have questions or need assistance? We're here to help. Reach out to our team and we'll get back to you as soon as possible.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* Contact Information and Form */}
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Typography variant="h4" component="h2" fontWeight="600" gutterBottom>
              Get In Touch
            </Typography>
            <Typography variant="body1" paragraph color="text.secondary">
              We'd love to hear from you. Please fill out the form or contact us using the information below.
            </Typography>

            <Box sx={{ mt: 4 }}>
              <Box sx={{ display: 'flex', mb: 3 }}>
                <LocationOnIcon sx={{ color: theme.palette.primary.main, mr: 2, fontSize: 24 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Our Location
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    123 Medical Center Drive, Suite 200<br />
                    New York, NY 10001
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', mb: 3 }}>
                <PhoneIcon sx={{ color: theme.palette.primary.main, mr: 2, fontSize: 24 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Phone Number
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    +1-202-555-0190<br />
                    +1-202-555-0191
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', mb: 3 }}>
                <EmailIcon sx={{ color: theme.palette.primary.main, mr: 2, fontSize: 24 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Email Address
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    info@prescripto.com<br />
                    support@prescripto.com
                  </Typography>
                </Box>
              </Box>

              <Box sx={{ display: 'flex', mb: 3 }}>
                <AccessTimeIcon sx={{ color: theme.palette.primary.main, mr: 2, fontSize: 24 }} />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Working Hours
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monday - Friday: 9:00 AM - 6:00 PM<br />
                    Saturday: 9:00 AM - 2:00 PM
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={7}>
            <Paper
              elevation={0}
              component="form"
              onSubmit={handleSubmit}
              sx={{
                p: 4,
                borderRadius: 3,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'white',
                border: '1px solid',
                borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              }}
            >
              <Typography variant="h5" component="h3" fontWeight="bold" gutterBottom>
                Send Us a Message
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Fill out the form below and we'll get back to you as soon as possible.
              </Typography>

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    required
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Your Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    error={!!errors.subject}
                    helperText={errors.subject}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Your Message"
                    name="message"
                    multiline
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    error={!!errors.message}
                    helperText={errors.message}
                    required
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      px: 4,
                      borderRadius: 25,
                    }}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Send Message'}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      {/* Map Section */}
      <Box sx={{ height: 400, width: '100%', mt: 4 }}>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.11976397304903!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1645564562986!5m2!1sen!2s"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          title="Prescripto Location"
        ></iframe>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
