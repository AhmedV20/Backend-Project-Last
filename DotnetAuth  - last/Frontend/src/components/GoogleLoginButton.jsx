import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import { Box, Button, CircularProgress, Typography, useTheme } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import authService from '../services/authService';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

export default function GoogleLoginButton({ variant = 'login', onError }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const theme = useTheme();

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setLoading(true);
        console.log('Google OAuth success:', tokenResponse);

        // Get user info from Google using the access token
        const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` }
        });

        console.log('Google user info:', userInfoResponse.data);

        // Extract user information
        const { email, given_name, family_name, sub } = userInfoResponse.data;

        // Get ID token from tokenResponse
        // Since we're using the access token directly, we'll pass it as the ID token
        // The backend will handle this appropriately
        const idToken = tokenResponse.access_token;

        // Call the backend to authenticate with Google
        const response = await authService.googleLogin(idToken);

        if (response.success) {
          if (response.requiresRegistration) {
            // User needs to complete registration
            navigate('/register', {
              state: {
                googleData: {
                  idToken: idToken,
                  email: email,
                  firstName: given_name || '',
                  lastName: family_name || ''
                }
              }
            });
          } else if (response.requiresTwoFactor) {
            // User needs to complete 2FA
            navigate('/verify-google-2fa', {
              state: {
                userId: response.userId,
                email: response.email,
                twoFactorType: response.twoFactorType
              }
            });
          } else {
            // User is authenticated, store tokens and redirect
            login(response, response.accessToken);
            navigate('/profile');
          }
        } else {
          // Handle error
          if (onError) {
            onError(response.message || 'Authentication failed');
          }
        }
      } catch (error) {
        console.error('Google login error:', error);
        if (onError) {
          onError(error.response?.data?.message || 'Authentication failed');
        }
      } finally {
        setLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google OAuth error:', error);
      if (onError) {
        onError('Google authentication failed');
      }
    },
    // Request additional scopes for user information
    scope: 'email profile',
    flow: 'implicit', // Use implicit flow to get ID token
  });

  return (
    <Button
      fullWidth
      variant="outlined"
      onClick={handleGoogleLogin}
      disabled={loading}
      startIcon={loading ? <CircularProgress size={20} /> : <GoogleIcon />}
      sx={{
        mt: 2,
        mb: 2,
        py: 1.2,
        borderRadius: 2,
        borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.23)',
        color: theme.palette.mode === 'dark' ? 'white' : 'rgba(0,0,0,0.87)',
        '&:hover': {
          borderColor: theme.palette.mode === 'dark' ? 'white' : 'rgba(0,0,0,0.87)',
          bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)',
        }
      }}
    >
      <Typography variant="button">
        {variant === 'login' ? 'Sign in with Google' : 'Sign up with Google'}
      </Typography>
    </Button>
  );
}
