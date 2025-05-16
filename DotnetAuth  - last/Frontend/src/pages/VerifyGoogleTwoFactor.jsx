import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Paper,
  Alert,
  CircularProgress,
  useTheme,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import SecurityIcon from '@mui/icons-material/Security';

export default function VerifyGoogleTwoFactor() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const theme = useTheme();

  // Get state from location
  const state = location.state || {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Verify the OTP for Google authentication
      const response = await authService.verifyTwoFactorLogin({
        userId: state.userId,
        code: otp,
        twoFactorType: state.twoFactorType || 'authenticator'
      });

      if (response.success) {
        // After successful verification, log in with the tokens
        login(response, response.accessToken);
        navigate('/profile');
      } else {
        setError(response.message || 'Verification failed');
      }
    } catch (err) {
      console.error('2FA verification error:', err);
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 8, mb: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          borderRadius: 4,
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 32px rgba(0, 0, 0, 0.3)'
            : '0 8px 32px rgba(106, 90, 205, 0.1)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(45deg, #6A5ACD 30%, #7B68EE 90%)'
                : 'linear-gradient(45deg, #6A5ACD 30%, #7B68EE 90%)',
              color: 'white',
              p: 2,
              borderRadius: 2,
              mb: 3,
            }}
          >
            <SecurityIcon sx={{ fontSize: 32 }} />
          </Box>

          <Typography component="h1" variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 0 }}>
            Two-Factor Verification
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3, width: '100%' }}>
            {error}
          </Alert>
        )}

        <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
          Please enter the verification code from your authenticator app
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="otp"
            label="Verification Code"
            name="otp"
            autoFocus
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            sx={{
              mb: 3,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(106, 90, 205, 0.05)',
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
            color="primary"
            disabled={loading}
            sx={{
              mt: 2,
              mb: 2,
              py: 1.5,
              fontSize: '1rem',
              borderRadius: 2,
              background: theme.palette.mode === 'dark'
                ? 'linear-gradient(45deg, #6A5ACD 30%, #7B68EE 90%)'
                : 'linear-gradient(45deg, #6A5ACD 30%, #7B68EE 90%)',
              boxShadow: '0 4px 14px rgba(106, 90, 205, 0.3)',
              '&:hover': {
                boxShadow: '0 6px 20px rgba(106, 90, 205, 0.4)',
                transform: 'translateY(-2px)',
              },
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
