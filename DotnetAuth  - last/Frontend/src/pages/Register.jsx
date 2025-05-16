import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  FormHelperText,
  Paper,
  useTheme,
  useMediaQuery,
  InputAdornment,
  IconButton,
  Divider,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import authService from '../services/authService';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import BadgeIcon from '@mui/icons-material/Badge';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import GoogleLoginButton from '../components/GoogleLoginButton';

// Create a function to get the validation schema based on whether it's Google registration
const getValidationSchema = (isGoogleReg) => {
  // Base schema with fields required for both regular and Google registration
  const baseSchema = {
    gender: Yup.string().required('Gender is required'),
    role: Yup.string().required('Role is required'),
  };

  // Add fields required only for regular registration
  if (!isGoogleReg) {
    return Yup.object({
      ...baseSchema,
      firstName: Yup.string().required('First name is required'),
      lastName: Yup.string().required('Last name is required'),
      email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string()
        .min(12, 'Password must be at least 12 characters')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[0-9]/, 'Password must contain at least one number')
        .matches(/[^A-Za-z0-9]/, 'Password must contain at least one special character')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
    });
  }

  // For Google registration, we only need gender and role
  return Yup.object(baseSchema);
};

export default function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isGoogleRegistration, setIsGoogleRegistration] = useState(false);
  const [googleData, setGoogleData] = useState(null);
  const { login } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [initialValues, setInitialValues] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    role: '',
  });

  // Check if we have Google data from the login page
  useEffect(() => {
    if (location.state?.googleData) {
      const { firstName, lastName, email, idToken } = location.state.googleData;
      setIsGoogleRegistration(true);
      setGoogleData(location.state.googleData);

      // Update initial values with Google data
      setInitialValues({
        firstName: firstName || '',
        lastName: lastName || '',
        email: email || '',
        password: '',
        confirmPassword: '',
        gender: '',
        role: '',
      });
    }
  }, [location.state]);

  const formik = useFormik({
    initialValues,
    enableReinitialize: true, // This ensures form updates when initialValues change
    validationSchema: getValidationSchema(isGoogleRegistration),
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      try {
        let response;

        if (isGoogleRegistration && googleData) {
          // Register with Google
          response = await authService.googleRegister({
            idToken: googleData.idToken,
            gender: values.gender === 'Male' ? 0 : 1,
            role: values.role === 'Doctor' ? 1 : 2,
          });

          if (response.success) {
            // Google registration successful, log in the user
            login(response, response.accessToken);
            navigate('/profile');
          } else {
            setError(response.message || 'Google registration failed');
          }
        } else {
          // Regular registration
          response = await authService.register({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            password: values.password,
            gender: values.gender === 'Male' ? 0 : 1,
            role: values.role === 'Doctor' ? 1 : 2,
          });

          if (response.success) {
            // Pass both email and password to OTP verification
            navigate('/verify-otp', {
              state: {
                email: values.email,
                password: values.password,
                message: response.message
              }
            });
          } else {
            setError(response.message || 'Registration failed');
          }
        }
      } catch (err) {
        console.error('Registration error:', err);
        setError(err.response?.data?.message || 'Registration failed');
      } finally {
        setLoading(false);
      }
    },
  });

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  return (
    <Container component="main" maxWidth="lg" sx={{ mt: { xs: 4, md: 8 }, mb: 4 }}>
      <Grid container spacing={4} justifyContent="center">
        {/* Left side - Form */}
        <Grid item xs={12} sm={10} md={7} lg={7}>
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
                Create Account
              </Typography>
            </Box>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              Join our secure medical platform
            </Typography>

            {isGoogleRegistration && (
              <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                  Your Google account information has been pre-filled. Please select your <strong>Gender</strong> and <strong>Role</strong> to complete registration.
                </Typography>
              </Alert>
            )}

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <Box component="form" onSubmit={formik.handleSubmit}>
              <Grid container spacing={2}>
                {isGoogleRegistration ? (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        First Name (from Google)
                      </Typography>
                      <TextField
                        fullWidth
                        id="firstName"
                        name="firstName"
                        value={formik.values.firstName}
                        InputProps={{
                          readOnly: true,
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        variant="outlined"
                        sx={{
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(106, 90, 205, 0.1)' : 'rgba(106, 90, 205, 0.1)',
                          borderRadius: 2,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Last Name (from Google)
                      </Typography>
                      <TextField
                        fullWidth
                        id="lastName"
                        name="lastName"
                        value={formik.values.lastName}
                        InputProps={{
                          readOnly: true,
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        variant="outlined"
                        sx={{
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(106, 90, 205, 0.1)' : 'rgba(106, 90, 205, 0.1)',
                          borderRadius: 2,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          }
                        }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Email Address (from Google)
                      </Typography>
                      <TextField
                        fullWidth
                        id="email-display"
                        value={formik.values.email}
                        InputProps={{
                          readOnly: true,
                          startAdornment: (
                            <InputAdornment position="start">
                              <EmailIcon color="primary" />
                            </InputAdornment>
                          ),
                        }}
                        variant="outlined"
                        sx={{
                          bgcolor: theme.palette.mode === 'dark' ? 'rgba(106, 90, 205, 0.1)' : 'rgba(106, 90, 205, 0.1)',
                          borderRadius: 2,
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          }
                        }}
                      />
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        First Name
                      </Typography>
                      <TextField
                        fullWidth
                        id="firstName"
                        name="firstName"
                        placeholder="Enter your first name"
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                        helperText={formik.touched.firstName && formik.errors.firstName}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon color="action" />
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
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Last Name
                      </Typography>
                      <TextField
                        fullWidth
                        id="lastName"
                        name="lastName"
                        placeholder="Enter your last name"
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                        helperText={formik.touched.lastName && formik.errors.lastName}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon color="action" />
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
                    </Grid>
                  </>
                )}
                {!isGoogleRegistration && (
                  <Grid item xs={12}>
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
                  </Grid>
                )}
                {!isGoogleRegistration && (
                  <>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Password
                      </Typography>
                      <TextField
                        fullWidth
                        id="password"
                        name="password"
                        placeholder="Create a password"
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
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Confirm Password
                      </Typography>
                      <TextField
                        fullWidth
                        id="confirmPassword"
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon color="action" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                aria-label="toggle confirm password visibility"
                                onClick={handleToggleConfirmPasswordVisibility}
                                edge="end"
                                sx={{ color: theme.palette.error.main }}
                              >
                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                    </Grid>
                  </>
                )}
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Gender
                  </Typography>
                  <FormControl
                    fullWidth
                    error={formik.touched.gender && Boolean(formik.errors.gender)}
                    sx={{
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(106, 90, 205, 0.05)',
                      borderRadius: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  >
                    <InputLabel id="gender-label">Select gender</InputLabel>
                    <Select
                      labelId="gender-label"
                      id="gender"
                      name="gender"
                      value={formik.values.gender}
                      label="Select gender"
                      onChange={formik.handleChange}
                      startAdornment={
                        <InputAdornment position="start">
                          <BadgeIcon color="action" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="Male">Male</MenuItem>
                      <MenuItem value="Female">Female</MenuItem>
                    </Select>
                    {formik.touched.gender && formik.errors.gender && (
                      <FormHelperText>{formik.errors.gender}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Role
                  </Typography>
                  <FormControl
                    fullWidth
                    error={formik.touched.role && Boolean(formik.errors.role)}
                    sx={{
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(106, 90, 205, 0.05)',
                      borderRadius: 2,
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                      }
                    }}
                  >
                    <InputLabel id="role-label">Select role</InputLabel>
                    <Select
                      labelId="role-label"
                      id="role"
                      name="role"
                      value={formik.values.role}
                      label="Select role"
                      onChange={formik.handleChange}
                      startAdornment={
                        <InputAdornment position="start">
                          <HomeIcon color="action" />
                        </InputAdornment>
                      }
                    >
                      <MenuItem value="Doctor">Doctor</MenuItem>
                      <MenuItem value="Patient">Patient</MenuItem>
                    </Select>
                    {formik.touched.role && formik.errors.role && (
                      <FormHelperText>{formik.errors.role}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>

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
                {loading ? <CircularProgress size={24} color="inherit" /> : isGoogleRegistration ? 'Complete Google Registration' : 'Create Account'}
              </Button>

              {!isGoogleRegistration && (
                <>
                  <Box sx={{ mt: 3, mb: 3, display: 'flex', alignItems: 'center' }}>
                    <Divider sx={{ flexGrow: 1 }} />
                    <Typography variant="body2" color="text.secondary" sx={{ mx: 2 }}>
                      OR
                    </Typography>
                    <Divider sx={{ flexGrow: 1 }} />
                  </Box>

                  <GoogleLoginButton
                    variant="register"
                    onError={(errorMessage) => setError(errorMessage)}
                  />
                </>
              )}

              <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Link to="/login" style={{
                    textDecoration: 'none',
                    color: theme.palette.primary.main,
                    fontWeight: 600
                  }}>
                    Log in
                  </Link>
                </Typography>
              </Box>
            </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Right side - Branding (visible on larger screens) */}
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
                  Join Our Platform
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                  Create an account to access secure medical services and manage your health information.
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
      </Grid>
    </Container>
  );
}