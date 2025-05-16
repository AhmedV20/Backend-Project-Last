import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider, createTheme, Box, CircularProgress, CssBaseline } from '@mui/material';
import { Suspense, useMemo } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider, useTheme as useCustomTheme } from './contexts/ThemeContext';
import GoogleAuthProvider from './components/GoogleAuthProvider';
import Register from './pages/Register';
import Login from './pages/Login';
import VerifyOTP from './pages/VerifyOTP';
import TwoFactorVerify from './pages/TwoFactorVerify';
import VerifyGoogleTwoFactor from './pages/VerifyGoogleTwoFactor';
import RecoveryCode from './pages/RecoveryCode';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Home from './pages/Home';
import Doctors from './pages/Doctors';
import Services from './pages/Services';
import About from './pages/About';
import Contact from './pages/Contact';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const LoadingFallback = () => (
  <Box
    display="flex"
    justifyContent="center"
    alignItems="center"
    minHeight="100vh"
  >
    <CircularProgress />
  </Box>
);

// App content with theme applied
function AppContent() {
  const { darkMode } = useCustomTheme();

  // Create theme based on dark mode state
  const theme = useMemo(() =>
    createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
        primary: {
          // Purple theme based on Prescripto design
          main: darkMode ? '#7B68EE' : '#6A5ACD',
          light: darkMode ? '#9370DB' : '#7B68EE',
          dark: darkMode ? '#483D8B' : '#483D8B',
          contrastText: '#fff',
        },
        secondary: {
          main: darkMode ? '#FF80AB' : '#FF4081',
          light: darkMode ? '#FF9E80' : '#FF80AB',
          dark: darkMode ? '#F50057' : '#C51162',
          contrastText: '#fff',
        },
        error: {
          main: darkMode ? '#FF5252' : '#D32F2F',
        },
        success: {
          main: darkMode ? '#81C784' : '#388E3C',
        },
        background: {
          default: darkMode ? '#121212' : '#FFFFFF',
          paper: darkMode ? '#1E1E1E' : '#FFFFFF',
        },
        text: {
          primary: darkMode ? '#FFFFFF' : '#333333',
          secondary: darkMode ? '#BBBBBB' : '#666666',
        },
        divider: darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.06)',
      },
      typography: {
        fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
          fontWeight: 700,
          letterSpacing: '-0.015em',
        },
        h2: {
          fontWeight: 600,
          letterSpacing: '-0.01em',
        },
        h3: {
          fontWeight: 600,
          letterSpacing: '-0.01em',
        },
        h4: {
          fontWeight: 500,
          letterSpacing: '0',
        },
        h5: {
          fontWeight: 500,
          letterSpacing: '0',
        },
        h6: {
          fontWeight: 500,
          letterSpacing: '0',
        },
        button: {
          fontWeight: 500,
          textTransform: 'none',
          letterSpacing: '0.01em',
        },
        subtitle1: {
          letterSpacing: '0',
          fontWeight: 400,
        },
        subtitle2: {
          letterSpacing: '0',
          fontWeight: 400,
        },
        body1: {
          fontWeight: 400,
        },
        body2: {
          fontWeight: 400,
        },
      },
      shape: {
        borderRadius: 8,
      },
      components: {
        MuiButton: {
          defaultProps: {
            disableElevation: true,
          },
          styleOverrides: {
            root: {
              borderRadius: 25,
              padding: '8px 24px',
              transition: 'all 0.2s ease-in-out',
              position: 'relative',
              fontWeight: 500,
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 8px rgba(106, 90, 205, 0.3)',
              },
            },
            containedPrimary: {
              background: darkMode
                ? 'linear-gradient(45deg, #6A5ACD 30%, #7B68EE 90%)'
                : 'linear-gradient(45deg, #6A5ACD 30%, #7B68EE 90%)',
              boxShadow: '0 2px 8px rgba(106, 90, 205, 0.3)',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(106, 90, 205, 0.4)',
              },
            },
            contained: {
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              '&:hover': {
                boxShadow: '0 4px 8px rgba(0,0,0,0.15)',
              },
            },
            outlined: {
              borderWidth: '1px',
              '&:hover': {
                borderWidth: '1px',
                backgroundColor: 'rgba(106, 90, 205, 0.04)',
              },
            },
          },
        },
        MuiTextField: {
          styleOverrides: {
            root: {
              '& .MuiOutlinedInput-root': {
                borderRadius: 8,
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderWidth: 1,
                  borderColor: darkMode ? '#7B68EE' : '#6A5ACD',
                },
              },
            },
          },
        },
        MuiCard: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              boxShadow: darkMode
                ? '0 4px 12px rgba(0,0,0,0.2)'
                : '0 4px 12px rgba(0,0,0,0.05)',
              overflow: 'hidden',
            },
          },
        },
        MuiPaper: {
          styleOverrides: {
            root: {
              borderRadius: 12,
            },
          },
        },
        MuiAppBar: {
          styleOverrides: {
            root: {
              boxShadow: 'none',
              borderBottom: '1px solid',
              borderColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
            },
          },
        },
        MuiAvatar: {
          styleOverrides: {
            root: {
              boxShadow: darkMode
                ? '0 2px 8px rgba(0,0,0,0.2)'
                : '0 2px 8px rgba(0,0,0,0.05)',
            },
          },
        },
      },
    }), [darkMode]);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Box component="main" sx={{ flexGrow: 1 }}>
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/verify-otp" element={<VerifyOTP />} />
                  <Route path="/two-factor-verify" element={<TwoFactorVerify />} />
                  <Route path="/verify-google-2fa" element={<VerifyGoogleTwoFactor />} />
                  <Route path="/recovery-code" element={<RecoveryCode />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route
                    path="/reset-password"
                    element={
                      <ProtectedRoute>
                        <ResetPassword />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route path="/doctors" element={<Doctors />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/" element={<Home />} />
                </Routes>
              </Suspense>
            </Box>
            <Footer />
          </Box>
        </Router>
      </AuthProvider>
    </MuiThemeProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <GoogleAuthProvider>
        <AppContent />
      </GoogleAuthProvider>
    </ThemeProvider>
  );
}

export default App;
