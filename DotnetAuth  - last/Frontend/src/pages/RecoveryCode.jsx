import { useState } from 'react';
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
  useTheme,
} from '@mui/material';
import authService from '../services/authService';
import KeyIcon from '@mui/icons-material/Key';

export default function RecoveryCode() {
  const [recoveryCode, setRecoveryCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // This endpoint would need to be implemented in the backend
      const response = await authService.verifyRecoveryCode({
        email: state.email,
        recoveryCode: recoveryCode,
      });

      if (response.success) {
        login(response, response.accessToken);
        navigate('/profile');
      } else {
        setError(response.message || 'Recovery code verification failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Recovery code verification failed');
    } finally {
      setLoading(false);
    }
  };

  // Redirect if no email in state
  if (!state?.email) {
    return <Navigate to="/login" />;
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
            Recovery Code
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <KeyIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
          <Typography variant="body1" color="text.secondary">
            Enter one of your recovery codes to regain access to your account.
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Recovery Code
          </Typography>
          <TextField
            required
            fullWidth
            id="recoveryCode"
            placeholder="Enter recovery code"
            name="recoveryCode"
            autoFocus
            value={recoveryCode}
            onChange={(e) => setRecoveryCode(e.target.value)}
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
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Verify Recovery Code'}
          </Button>
          
          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Remember your two-factor authentication code?
            </Typography>
            <Link href="#" variant="body2" onClick={() => navigate('/two-factor-verify', { state: { email: state.email } })}>
              Go back to verification
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
