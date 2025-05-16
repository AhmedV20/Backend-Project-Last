import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Tooltip,
  Container,
  useMediaQuery,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  useTheme as useMuiTheme
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import { useState, useEffect } from 'react';
import UserAvatar from './UserAvatar';
import authService from '../services/authService';

export default function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const { darkMode, toggleDarkMode } = useCustomTheme();
  const navigate = useNavigate();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const [profilePicture, setProfilePicture] = useState(null);

  // Mobile menu state
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const isMobileMenuOpen = Boolean(mobileMenuAnchor);

  // Fetch profile picture
  useEffect(() => {
    if (isAuthenticated) {
      const fetchProfilePicture = async () => {
        try {
          const pictureData = await authService.getCurrentProfilePicture();
          console.log('Navbar - Profile picture data:', pictureData);

          if (pictureData.success && pictureData.fileUrl) {
            console.log('Navbar - Setting profile picture to:', pictureData.fileUrl);
            setProfilePicture(pictureData.fileUrl);
          } else {
            console.log('Navbar - No profile picture found or invalid data:', pictureData);
            setProfilePicture(null);
          }
        } catch (error) {
          console.error('Navbar - Failed to fetch profile picture:', error);
          setProfilePicture(null);
        }
      };

      fetchProfilePicture();
    } else {
      setProfilePicture(null);
    }
  }, [isAuthenticated]);

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const handleLogout = async () => {
    try {
      handleMobileMenuClose();
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleNavigate = (path) => {
    handleMobileMenuClose();
    navigate(path);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'transparent',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid',
        borderColor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        color: darkMode ? '#FFFFFF' : '#333333',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ py: 1 }}>
          {/* Logo and Brand */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              flexGrow: 1
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                background: darkMode
                  ? 'linear-gradient(45deg, #6A5ACD 30%, #7B68EE 90%)'
                  : 'linear-gradient(45deg, #6A5ACD 30%, #7B68EE 90%)',
                color: 'white',
                p: 1,
                borderRadius: 1,
                mr: 1.5,
              }}
            >
              <HomeIcon
                sx={{
                  display: { xs: 'flex' },
                  fontSize: 20
                }}
              />
            </Box>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              sx={{
                fontWeight: 600,
                letterSpacing: '.02rem',
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Prescripto
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              {/* Navigation Links */}
              <Button
                color="inherit"
                component={Link}
                to="/"
                sx={{
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  fontSize: '0.85rem',
                  letterSpacing: '0.05rem',
                  '&:hover': {
                    bgcolor: 'transparent',
                    color: 'primary.main',
                  }
                }}
              >
                HOME
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/doctors"
                sx={{
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  fontSize: '0.85rem',
                  letterSpacing: '0.05rem',
                  '&:hover': {
                    bgcolor: 'transparent',
                    color: 'primary.main',
                  }
                }}
              >
                ALL DOCTORS
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/about"
                sx={{
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  fontSize: '0.85rem',
                  letterSpacing: '0.05rem',
                  '&:hover': {
                    bgcolor: 'transparent',
                    color: 'primary.main',
                  }
                }}
              >
                ABOUT
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/contact"
                sx={{
                  fontWeight: 500,
                  textTransform: 'uppercase',
                  fontSize: '0.85rem',
                  letterSpacing: '0.05rem',
                  '&:hover': {
                    bgcolor: 'transparent',
                    color: 'primary.main',
                  }
                }}
              >
                CONTACT
              </Button>

              {/* Dark mode toggle */}
              <Tooltip title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
                <IconButton
                  color="inherit"
                  onClick={toggleDarkMode}
                  sx={{
                    ml: 1,
                    bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(106, 90, 205, 0.1)',
                    '&:hover': {
                      bgcolor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(106, 90, 205, 0.2)',
                    }
                  }}
                >
                  {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Tooltip>

              {isAuthenticated ? (
                <>
                  <Button
                    component={Link}
                    to="/profile"
                    sx={{
                      ml: 2,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      color: 'inherit',
                      '&:hover': {
                        bgcolor: 'rgba(106, 90, 205, 0.1)',
                      }
                    }}
                  >
                    {/* Profile picture */}
                    {profilePicture ? (
                      <Box sx={{ width: 32, height: 32, borderRadius: '50%', overflow: 'hidden' }}>
                        <img
                          src={profilePicture}
                          alt={user?.fullName || 'User'}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      </Box>
                    ) : (
                      <UserAvatar
                        profilePicture={null}
                        userName={user?.fullName || 'User'}
                        size={32}
                      />
                    )}
                    <Typography variant="body1" sx={{ ml: 1 }}>
                      {user?.fullName || 'Profile'}
                    </Typography>
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={handleLogout}
                    sx={{
                      ml: 1,
                      borderColor: darkMode ? 'rgba(255,255,255,0.3)' : 'rgba(106, 90, 205, 0.5)',
                      color: darkMode ? 'white' : 'primary.main',
                      '&:hover': {
                        borderColor: darkMode ? 'white' : 'primary.main',
                        bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(106, 90, 205, 0.1)',
                      }
                    }}
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="contained"
                    component={Link}
                    to="/register"
                    sx={{
                      ml: 2,
                      background: darkMode
                        ? 'linear-gradient(45deg, #6A5ACD 30%, #7B68EE 90%)'
                        : 'linear-gradient(45deg, #6A5ACD 30%, #7B68EE 90%)',
                      color: 'white',
                      fontWeight: 500,
                      textTransform: 'none',
                      fontSize: '0.9rem',
                      px: 3,
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(106, 90, 205, 0.4)',
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    Create account
                  </Button>
                </>
              )}
            </Box>
          ) : (
            // Mobile Navigation
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* Dark mode toggle */}
              <Tooltip title={darkMode ? "Switch to light mode" : "Switch to dark mode"}>
                <IconButton
                  color="inherit"
                  onClick={toggleDarkMode}
                  sx={{
                    mr: 1,
                    bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(106, 90, 205, 0.1)',
                    '&:hover': {
                      bgcolor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(106, 90, 205, 0.2)',
                    }
                  }}
                >
                  {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
                </IconButton>
              </Tooltip>

              {!isAuthenticated && (
                <Button
                  variant="contained"
                  component={Link}
                  to="/register"
                  sx={{
                    mr: 2,
                    background: darkMode
                      ? 'linear-gradient(45deg, #6A5ACD 30%, #7B68EE 90%)'
                      : 'linear-gradient(45deg, #6A5ACD 30%, #7B68EE 90%)',
                    color: 'white',
                    fontWeight: 500,
                    textTransform: 'none',
                    fontSize: '0.9rem',
                    px: 2,
                    py: 0.75,
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(106, 90, 205, 0.4)',
                    }
                  }}
                >
                  Create account
                </Button>
              )}

              <IconButton
                color="inherit"
                aria-label="menu"
                onClick={handleMobileMenuOpen}
                sx={{
                  bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(106, 90, 205, 0.1)',
                  '&:hover': {
                    bgcolor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(106, 90, 205, 0.2)',
                  }
                }}
              >
                <MenuIcon />
              </IconButton>

              <Menu
                anchorEl={mobileMenuAnchor}
                open={isMobileMenuOpen}
                onClose={handleMobileMenuClose}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    mt: 1.5,
                    minWidth: 200,
                    borderRadius: 2,
                    overflow: 'visible',
                    filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.2))',
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: 'background.paper',
                      transform: 'translateY(-50%) rotate(45deg)',
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                {isAuthenticated ? (
                  <>
                    <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center' }}>
                      {/* Profile picture for mobile menu */}
                      {profilePicture ? (
                        <Box sx={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden' }}>
                          <img
                            src={profilePicture}
                            alt={user?.fullName || 'User'}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </Box>
                      ) : (
                        <UserAvatar
                          profilePicture={null}
                          userName={user?.fullName || 'User'}
                          size={40}
                        />
                      )}
                      <Box sx={{ ml: 2 }}>
                        <Typography variant="subtitle1" fontWeight={600}>
                          {user?.fullName || 'User'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {user?.email || 'user@example.com'}
                        </Typography>
                      </Box>
                    </Box>
                    <Divider />
                    <MenuItem onClick={() => handleNavigate('/')}>
                      HOME
                    </MenuItem>
                    <MenuItem onClick={() => handleNavigate('/doctors')}>
                      ALL DOCTORS
                    </MenuItem>
                    <MenuItem onClick={() => handleNavigate('/about')}>
                      ABOUT
                    </MenuItem>
                    <MenuItem onClick={() => handleNavigate('/contact')}>
                      CONTACT
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => handleNavigate('/profile')}>
                      Profile
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>
                      Logout
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem onClick={() => handleNavigate('/')}>
                      HOME
                    </MenuItem>
                    <MenuItem onClick={() => handleNavigate('/doctors')}>
                      ALL DOCTORS
                    </MenuItem>
                    <MenuItem onClick={() => handleNavigate('/about')}>
                      ABOUT
                    </MenuItem>
                    <MenuItem onClick={() => handleNavigate('/contact')}>
                      CONTACT
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => handleNavigate('/login')}>
                      Login
                    </MenuItem>
                    <MenuItem
                      onClick={() => handleNavigate('/register')}
                      sx={{
                        color: 'primary.main',
                        fontWeight: 'bold',
                        bgcolor: darkMode ? 'rgba(106, 90, 205, 0.1)' : 'rgba(106, 90, 205, 0.1)',
                        borderRadius: 1,
                        my: 0.5,
                        '&:hover': {
                          bgcolor: darkMode ? 'rgba(106, 90, 205, 0.2)' : 'rgba(106, 90, 205, 0.2)',
                        }
                      }}
                    >
                      Create account
                    </MenuItem>
                  </>
                )}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
}