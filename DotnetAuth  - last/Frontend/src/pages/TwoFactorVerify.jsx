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
  Link,
  Grid,
  useTheme,
  useMediaQuery,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import authService from '../services/authService';
import SecurityIcon from '@mui/icons-material/Security';

export default function TwoFactorVerify() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Use the correct endpoint for 2FA verification with the correct property names
      const response = await authService.verifyTwoFactorLogin({
        email: state.email,
        twoFactorCode: code, // This matches the TwoFactorLoginRequest.TwoFactorCode property
        rememberDevice: rememberDevice
      });

      console.log('2FA verification response:', response);

      if (response.success) {
        // Check if we have an access token
        if (response.accessToken) {
          login(response, response.accessToken);
          navigate('/profile');
        } else {
          setError('Authentication successful but no access token received');
        }
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

  // Redirect if no email in state
  if (!state?.email) {
    return <Navigate to="/login" />;
  }

  // If twoFactorType is not provided, default to "authenticator"
  const twoFactorTypeDisplay = state?.twoFactorType || "authenticator";

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
            Two-Factor Authentication
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <SecurityIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
          <Typography variant="body1" color="text.secondary">
            Please enter the verification code from your {twoFactorTypeDisplay} to complete the login.
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Verification Code
          </Typography>
          <TextField
            required
            fullWidth
            id="code"
            placeholder="Enter verification code"
            name="code"
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value)}
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

          <FormControlLabel
            control={
              <Checkbox
                checked={rememberDevice}
                onChange={(e) => setRememberDevice(e.target.checked)}
                color="primary"
              />
            }
            label="Remember this device for 30 days"
            sx={{ mb: 2 }}
          />

          <Grid container spacing={2}>
            <Grid item xs={12}>
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
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify'}
              </Button>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Lost access to your two-factor authentication device?
            </Typography>
            <Link href="#" variant="body2" onClick={() => navigate('/recovery-code', { state: { email: state.email } })}>
              Use a recovery code
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
