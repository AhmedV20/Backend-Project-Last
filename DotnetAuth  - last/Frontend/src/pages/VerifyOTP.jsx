import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
  CircularProgress,
  Paper,
} from '@mui/material';
import authService from '../services/authService';

export default function VerifyOTP() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.verifyOtp({
        email: state.email,
        otp: otp,
      });

      if (response.success) {
        // Check if this is an email change verification
        if (state.isEmailChange) {
          // For email change, we need to log out and prompt the user to log in with the new email
          alert('Your email has been changed successfully. Please log in with your new email address.');
          await authService.logout();
          login(null, null); // Clear the current login
          navigate('/login');
        } else {
          // For regular verification (registration), automatically log in
          const loginResponse = await authService.login({
            email: state.email,
            password: state.password,
            rememberMe: false
          });

          if (loginResponse.accessToken) {
            login(loginResponse, loginResponse.accessToken);
            navigate('/profile');
          }
        }
      } else {
        setError(response.message || 'Verification failed');
      }
    } catch (err) {
      console.error('Verification error:', err);
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  // Redirect if no email in state
  if (!state?.email) {
    return <Navigate to="/register" />;
  }

  return (
    <Container component="main" maxWidth="sm" sx={{ mt: { xs: 4, md: 8 }, mb: 4 }}>
      <Paper
        elevation={3}
        sx={{
          borderRadius: 4,
          overflow: 'hidden',
          p: 4,
          maxWidth: '450px',
          mx: 'auto',
          boxShadow: '0 8px 32px rgba(3, 169, 244, 0.1)',
          border: '1px solid rgba(3, 169, 244, 0.1)',
        }}
      >
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 4,
              height: 32,
              bgcolor: 'primary.main',
              borderRadius: 1
            }}
          />
          <Typography component="h1" variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 0 }}>
            {state.isEmailChange ? 'Verify New Email' : 'Verify Email'}
          </Typography>
        </Box>

        {state.message && (
          <Alert severity="info" sx={{ mb: 3 }}>
            {state.message}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {state.isEmailChange && (
          <Alert severity="warning" sx={{ mb: 3 }}>
            You are changing your email from <strong>{state.oldEmail}</strong> to <strong>{state.email}</strong>.
            After verification, you will need to log in with your new email address.
          </Alert>
        )}

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Please enter the verification code sent to your email: <Box component="span" fontWeight="medium" color="primary.main">{state.email}</Box>
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Verification Code
          </Typography>
          <TextField
            required
            fullWidth
            id="otp"
            placeholder="Enter verification code"
            name="otp"
            autoFocus
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            variant="outlined"
            sx={{
              mb: 4,
              bgcolor: 'rgba(3, 169, 244, 0.05)',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              py: 1.5,
              fontSize: '1rem',
              borderRadius: 2,
              background: 'linear-gradient(45deg, #03A9F4 30%, #4FC3F7 90%)',
              boxShadow: '0 4px 14px rgba(3, 169, 244, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(3, 169, 244, 0.4)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : state.isEmailChange ? 'Verify New Email' : 'Verify Email'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}