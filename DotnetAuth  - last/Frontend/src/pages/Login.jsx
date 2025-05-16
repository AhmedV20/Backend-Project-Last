import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
  CircularProgress,
  FormControlLabel,
  Checkbox,
  Paper,
  Grid,
  useTheme,
  useMediaQuery,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import HomeIcon from '@mui/icons-material/Home';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import GoogleLoginButton from '../components/GoogleLoginButton';

const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export default function Login() {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      try {
        const response = await authService.login(values);
        console.log('Login response:', response);

        // Check for different response formats

        // Case 1: Standard 2FA response with requiresTwoFactor flag
        if (response.requiresTwoFactor) {
          navigate('/two-factor-verify', {
            state: {
              email: values.email,
              twoFactorType: response.twoFactorType || 'authenticator'
            }
          });
          return;
        }

        // Case 2: Normal login with access token
        if (response.accessToken) {
          login(response, response.accessToken);
          navigate('/profile');
          return;
        }

        // Case 3: User has 2FA enabled but API doesn't return requiresTwoFactor flag
        // This happens when the API returns a UserResponse object without 2FA properties
        // We can detect this by checking if the response has user properties but no accessToken
        if (response.email && response.id && !response.accessToken) {
          // This is likely a user with 2FA enabled
          // Get 2FA status to confirm
          try {
            const twoFactorStatus = await authService.get2faStatus();
            if (twoFactorStatus.isEnabled) {
              navigate('/two-factor-verify', {
                state: {
                  email: values.email,
                  twoFactorType: twoFactorStatus.type || 'authenticator'
                }
              });
              return;
            }
          } catch (twoFactorErr) {
            console.error('Failed to get 2FA status:', twoFactorErr);
            // If we can't get 2FA status, assume 2FA is required
            navigate('/two-factor-verify', {
              state: {
                email: values.email,
                twoFactorType: 'authenticator' // Default to authenticator
              }
            });
            return;
          }
        }

        // If we get here, the response format is unexpected
        console.error('Unexpected login response format:', response);
        setError('Invalid response from server. Please try again or contact support.');
      } catch (err) {
        console.error('Login error:', err);
        setError(err.response?.data?.message || 'Login failed');
      } finally {
        setLoading(false);
      }
    },
  });

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Container component="main" maxWidth="lg" sx={{ mt: { xs: 4, md: 8 }, mb: 4 }}>
      <Grid container spacing={4} justifyContent="center">
        {/* Left side - Branding (visible on larger screens) */}
        {!isMobile && (
          <Grid item md={5} lg={4}>
            <Box
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                p: 4,
              }}
            >
              <Box sx={{ mb: 6 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    mb: 3
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
                      p: 1.5,
                      borderRadius: 2,
                      mr: 1.5,
                    }}
                  >
                    <HomeIcon sx={{ fontSize: 28 }} />
                  </Box>
                  <Typography variant="h4" component="h1" fontWeight="600">
                    Prescripto
                  </Typography>
                </Box>
                <Typography
                  variant="h3"
                  component="h2"
                  fontWeight="bold"
                  sx={{
                    mb: 2,
                    color: theme.palette.primary.main,
                  }}
                >
                  Healthcare Made Simple
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                  Log in to access your appointments, medical information, and more.
                </Typography>
              </Box>

              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  background: theme.palette.mode === 'dark'
                    ? 'rgba(106, 90, 205, 0.1)'
                    : 'rgba(106, 90, 205, 0.05)',
                  backdropFilter: 'blur(10px)',
                  border: theme.palette.mode === 'dark'
                    ? '1px solid rgba(255, 255, 255, 0.1)'
                    : '1px solid rgba(106, 90, 205, 0.2)',
                }}
              >
                <Typography variant="body1" sx={{ fontStyle: 'italic', mb: 2 }}>
                  "Secure access to healthcare information empowers both patients and providers."
                </Typography>
                <Typography variant="subtitle2" sx={{ textAlign: 'right', color: 'primary.main' }}>
                  — Healthcare Innovation
                </Typography>
              </Paper>
            </Box>
          </Grid>
        )}

        {/* Right side - Login Form */}
        <Grid item xs={12} sm={10} md={7} lg={5}>
          <Paper
            elevation={3}
            sx={{
              borderRadius: 4,
              overflow: 'hidden',
              p: 4,
              boxShadow: theme.palette.mode === 'dark'
                ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                : '0 8px 32px rgba(106, 90, 205, 0.1)',
              border: theme.palette.mode === 'dark'
                ? '1px solid rgba(255, 255, 255, 0.05)'
                : 'none',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
            {/* Mobile Logo */}
            {isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: theme.palette.mode === 'dark'
                      ? 'linear-gradient(45deg, #6A5ACD 30%, #7B68EE 90%)'
                      : 'linear-gradient(45deg, #6A5ACD 30%, #7B68EE 90%)',
                    color: 'white',
                    p: 1,
                    borderRadius: 2,
                    mr: 1.5,
                  }}
                >
                  <HomeIcon sx={{ fontSize: 24 }} />
                </Box>
                <Typography variant="h5" component="h1" fontWeight="600" color="primary">
                  Prescripto
                </Typography>
              </Box>
            )}

            <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 4,
                  height: 32,
                  bgcolor: 'primary.main',
                  borderRadius: 1
                }}
              />
              <Typography component="h1" variant="h4" fontWeight="bold" gutterBottom color="text.primary" sx={{ mb: 0 }}>
                Log In
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Enter your credentials to access your account
            </Typography>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Email Address
                </Typography>
                <TextField
                  fullWidth
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  error={formik.touched.email && Boolean(formik.errors.email)}
                  helperText={formik.touched.email && formik.errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" />
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  sx={{
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(106, 90, 205, 0.05)',
                    borderRadius: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Box>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  Password
                </Typography>
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  type={showPassword ? 'text' : 'password'}
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  error={formik.touched.password && Boolean(formik.errors.password)}
                  helperText={formik.touched.password && formik.errors.password}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                          sx={{ color: theme.palette.error.main }}
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  variant="outlined"
                  sx={{
                    bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(106, 90, 205, 0.05)',
                    borderRadius: 2,
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    }
                  }}
                />
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="rememberMe"
                      checked={formik.values.rememberMe}
                      onChange={formik.handleChange}
                      color="primary"
                      size="small"
                    />
                  }
                  label={<Typography variant="body2">Remember me</Typography>}
                />
                <Typography variant="body2" component={Link} to="/forgot-password" color="primary" sx={{ textDecoration: 'none' }}>
                  Forgot password?
                </Typography>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  mt: 4,
                  mb: 2,
                  py: 1.5,
                  fontSize: '1rem',
                  borderRadius: 25,
                  background: theme.palette.mode === 'dark'
                    ? 'linear-gradient(45deg, #6A5ACD 30%, #7B68EE 90%)'
                    : 'linear-gradient(45deg, #6A5ACD 30%, #7B68EE 90%)',
                  boxShadow: '0 4px 14px rgba(106, 90, 205, 0.3)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(106, 90, 205, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
              </Button>

              <Box sx={{ mt: 3, mb: 3, display: 'flex', alignItems: 'center' }}>
                <Divider sx={{ flexGrow: 1 }} />
                <Typography variant="body2" color="text.secondary" sx={{ mx: 2 }}>
                  OR
                </Typography>
                <Divider sx={{ flexGrow: 1 }} />
              </Box>

              <GoogleLoginButton
                variant="login"
                onError={(errorMessage) => setError(errorMessage)}
              />

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Link to="/register" style={{
                    textDecoration: 'none',
                    color: theme.palette.primary.main,
                    fontWeight: 600
                  }}>
                    Sign up now
                  </Link>
                </Typography>
              </Box>
            </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}