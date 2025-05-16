import { useEffect, useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme as useMuiTheme } from '@mui/material/styles';
import { useTheme as useCustomTheme } from '../contexts/ThemeContext';
import {
  Box,
  Button,
  Typography,
  Container,
  Paper,
  CircularProgress,
  Alert,
  Grid,
  Avatar,
  Divider,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  Tab,
  Tabs,
  useMediaQuery,
  Stack,
  Chip,
  Switch,
  FormControlLabel,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import Wc from '@mui/icons-material/Wc';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LogoutIcon from '@mui/icons-material/ExitToApp';
import EditIcon from '@mui/icons-material/Edit';
import SecurityIcon from '@mui/icons-material/Security';
import HistoryIcon from '@mui/icons-material/History';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import LockIcon from '@mui/icons-material/Lock';
import authService from '../services/authService';
import UserAvatar from '../components/UserAvatar';
import TwoFactorSetup from '../components/TwoFactorSetup';
import PasswordConfirmDialog from '../components/PasswordConfirmDialog';
import RecoveryCodesDialog from '../components/RecoveryCodesDialog';
import ChangeEmail from '../components/ChangeEmail';

export default function Profile() {
  const { logout, isAuthenticated } = useAuth();
  const { darkMode } = useCustomTheme();
  const [userData, setUserData] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [twoFactorDialogOpen, setTwoFactorDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);
  const [recoveryCodesDialogOpen, setRecoveryCodesDialogOpen] = useState(false);
  const [changeEmailDialogOpen, setChangeEmailDialogOpen] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorType, setTwoFactorType] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const theme = useMuiTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const fetchProfilePicture = async () => {
    try {
      const pictureData = await authService.getCurrentProfilePicture();
      console.log('Profile picture data:', pictureData);

      if (pictureData.success && pictureData.fileUrl) {
        // Use a direct path to the image on the server
        // This is a simpler approach that should work with the server's file structure
        const directPath = pictureData.fileUrl;
        console.log('Setting profile picture to direct path:', directPath);
        setProfilePicture(directPath);
      } else {
        console.log('No profile picture or invalid data:', pictureData);
        setProfilePicture(null);
      }
    } catch (pictureErr) {
      console.error('Failed to fetch profile picture:', pictureErr);
      setProfilePicture(null);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      // Fetch user data
      const userData = await authService.getCurrentUser();
      setUserData(userData);

      // Fetch 2FA status separately
      try {
        const twoFactorStatus = await authService.get2faStatus();
        if (twoFactorStatus.isEnabled) {
          setTwoFactorEnabled(true);
          setTwoFactorType(twoFactorStatus.type);
        } else {
          setTwoFactorEnabled(false);
          setTwoFactorType(null);
        }
      } catch (twoFactorErr) {
        console.error('Failed to fetch 2FA status:', twoFactorErr);
        // Don't set error here to allow the page to load
      }

      // Fetch profile picture
      await fetchProfilePicture();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    fetchData();
  }, [isAuthenticated, navigate]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      logout();
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Logout failed');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setUploadLoading(true);
      console.log('Uploading file:', file.name, file.type, file.size);

      const formData = new FormData();
      formData.append('Picture', file);

      // Use a direct approach to upload the file
      const response = await authService.uploadProfilePicture(file);
      console.log('Upload response:', response);

      if (response.success) {
        console.log('Upload successful, new profile picture URL:', response.fileUrl);

        // Use the direct file path from the server
        setProfilePicture(response.fileUrl);

        // Show success message
        setError(null);
        alert('Profile picture updated successfully!');

        // Force a refresh of the profile picture by reloading the data
        await fetchProfilePicture();
      } else {
        console.error('Upload failed:', response);
        setError(response.message || 'Failed to upload profile picture');
      }
    } catch (err) {
      console.error('Profile picture upload error:', err);
      setError(err.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="lg" sx={{ mt: { xs: 2, md: 4 }, mb: 4 }}>
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {userData && (
        <Grid container spacing={3}>
          {/* User Profile Header */}
          <Grid item xs={12}>
            <Paper
              elevation={3}
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                boxShadow: theme.palette.mode === 'dark'
                  ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                  : '0 8px 32px rgba(106, 90, 205, 0.1)',
                border: theme.palette.mode === 'dark'
                  ? '1px solid rgba(255, 255, 255, 0.05)'
                  : 'none',
              }}
            >
              {/* Cover Image */}
              <Box
                sx={{
                  height: { xs: 120, md: 200 },
                  width: '100%',
                  position: 'relative',
                  background: darkMode
                    ? 'linear-gradient(135deg, #483D8B 0%, #6A5ACD 100%)'
                    : 'linear-gradient(135deg, #6A5ACD 0%, #9370DB 100%)',
                }}
              >
                {/* Profile Picture using the UserAvatar component */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: { xs: '-50px', md: '-75px' },
                    left: { xs: 24, md: 40 },
                    zIndex: 2,
                  }}
                >
                  <Box sx={{ position: 'relative' }}>
                    <UserAvatar
                      profilePicture={profilePicture}
                      userName={userData?.fullName || 'User'}
                      size={isMobile ? 100 : 150}
                      showStatus={false}
                    />

                    {/* Camera icon for uploading */}
                    <IconButton
                      onClick={handleProfilePictureClick}
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        bgcolor: 'primary.main',
                        color: 'white',
                        width: 36,
                        height: 36,
                        border: '2px solid white',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                        }
                      }}
                    >
                      {uploadLoading ? (
                        <CircularProgress size={18} sx={{ color: 'white' }} />
                      ) : (
                        <CameraAltIcon sx={{ fontSize: 18 }} />
                      )}
                    </IconButton>
                  </Box>

                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Box>
              </Box>

              {/* User Info */}


              <Box sx={{
                pt: { xs: 7, md: 10 },
                pb: 2,
                px: { xs: 2, md: 4 },
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                alignItems: { xs: 'flex-start', md: 'center' },
                justifyContent: 'space-between'
              }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold" gutterBottom>
                    {userData.fullName}
                  </Typography>
                  <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                    {userData.email}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Chip
                      label={userData.role}
                      color="primary"
                      size="small"
                      sx={{ mr: 1 }}
                    />
                    <Chip
                      label={userData.gender}
                      color="secondary"
                      size="small"
                    />
                  </Box>
                </Box>

                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<EditIcon />}
                  sx={{
                    mt: { xs: 2, md: 0 },
                    borderRadius: 2,
                    borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(106, 90, 205, 0.5)',
                    color: theme.palette.mode === 'dark' ? 'white' : 'primary.main',
                    '&:hover': {
                      borderColor: theme.palette.mode === 'dark' ? 'white' : 'primary.main',
                      bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(106, 90, 205, 0.1)',
                    }
                  }}
                >
                  Edit Profile
                </Button>
              </Box>

              {/* Tabs */}
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  variant={isMobile ? "scrollable" : "fullWidth"}
                  scrollButtons={isMobile ? "auto" : false}
                  allowScrollButtonsMobile
                  sx={{ px: { xs: 1, md: 4 } }}
                >
                  <Tab
                    icon={<PersonIcon />}
                    label={isMobile ? "" : "Profile"}
                    iconPosition="start"
                  />
                  <Tab
                    icon={<SecurityIcon />}
                    label={isMobile ? "" : "Security"}
                    iconPosition="start"
                  />
                  <Tab
                    icon={<HistoryIcon />}
                    label={isMobile ? "" : "Activity"}
                    iconPosition="start"
                  />
                </Tabs>
              </Box>
            </Paper>
          </Grid>

          {/* Tab Content */}
          <Grid item xs={12}>
            {/* Profile Tab */}
            {activeTab === 0 && (
              <Grid container spacing={3}>
                {/* Personal Information */}
                <Grid item xs={12} md={6}>
                  <Card
                    elevation={3}
                    sx={{
                      borderRadius: 3,
                      height: '100%',
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                        : '0 8px 32px rgba(106, 90, 205, 0.1)',
                      border: theme.palette.mode === 'dark'
                        ? '1px solid rgba(255, 255, 255, 0.05)'
                        : 'none',
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" fontWeight="bold">
                          Personal Information
                        </Typography>
                        <Tooltip title="Edit">
                          <IconButton size="small">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <List disablePadding>
                        <ListItem sx={{ px: 0, py: 1.5 }}>
                          <ListItemIcon>
                            <PersonIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={<Typography variant="body2" color="text.secondary">Full Name</Typography>}
                            secondary={<Typography variant="body1">{userData.fullName}</Typography>}
                          />
                        </ListItem>
                        <ListItem sx={{ px: 0, py: 1.5 }}>
                          <ListItemIcon>
                            <EmailIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={<Typography variant="body2" color="text.secondary">Email</Typography>}
                            secondary={<Typography variant="body1">{userData.email}</Typography>}
                          />
                        </ListItem>
                        <ListItem sx={{ px: 0, py: 1.5 }}>
                          <ListItemIcon>
                            <BadgeIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={<Typography variant="body2" color="text.secondary">Role</Typography>}
                            secondary={<Typography variant="body1">{userData.role}</Typography>}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Account Information */}
                <Grid item xs={12} md={6}>
                  <Card
                    elevation={3}
                    sx={{
                      borderRadius: 3,
                      height: '100%',
                      boxShadow: theme.palette.mode === 'dark'
                        ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                        : '0 8px 32px rgba(106, 90, 205, 0.1)',
                      border: theme.palette.mode === 'dark'
                        ? '1px solid rgba(255, 255, 255, 0.05)'
                        : 'none',
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" fontWeight="bold">
                          Account Information
                        </Typography>
                      </Box>
                      <Divider sx={{ mb: 2 }} />
                      <List disablePadding>
                        <ListItem sx={{ px: 0, py: 1.5 }}>
                          <ListItemIcon>
                            <Wc color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={<Typography variant="body2" color="text.secondary">Gender</Typography>}
                            secondary={<Typography variant="body1">{userData.gender}</Typography>}
                          />
                        </ListItem>
                        <ListItem sx={{ px: 0, py: 1.5 }}>
                          <ListItemIcon>
                            <CalendarTodayIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={<Typography variant="body2" color="text.secondary">Created At</Typography>}
                            secondary={<Typography variant="body1">{new Date(userData.createAt).toLocaleDateString()}</Typography>}
                          />
                        </ListItem>
                        <ListItem sx={{ px: 0, py: 1.5 }}>
                          <ListItemIcon>
                            <CalendarTodayIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText
                            primary={<Typography variant="body2" color="text.secondary">Last Updated</Typography>}
                            secondary={<Typography variant="body1">{new Date(userData.updateAt).toLocaleDateString()}</Typography>}
                          />
                        </ListItem>
                      </List>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            )}

            {/* Security Tab */}
            {activeTab === 1 && (
              <Card
                elevation={3}
                sx={{
                  borderRadius: 3,
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                    : '0 8px 32px rgba(106, 90, 205, 0.1)',
                  border: theme.palette.mode === 'dark'
                    ? '1px solid rgba(255, 255, 255, 0.05)'
                    : 'none',
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Security Settings
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Stack spacing={3}>
                    <Box>
                      <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                        Change Password
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        It's a good idea to use a strong password that you don't use elsewhere
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        component={Link}
                        to="/reset-password"
                        sx={{
                          borderRadius: 2,
                          borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(106, 90, 205, 0.5)',
                          color: theme.palette.mode === 'dark' ? 'white' : 'primary.main',
                          '&:hover': {
                            borderColor: theme.palette.mode === 'dark' ? 'white' : 'primary.main',
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(106, 90, 205, 0.1)',
                          }
                        }}
                      >
                        Change Password
                      </Button>
                    </Box>

                    <Divider />

                    <Box>
                      <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                        Change Email Address
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        Your current email address is <Box component="span" fontWeight="medium" color="primary.main">{userData.email}</Box>
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<EmailIcon />}
                        onClick={() => setChangeEmailDialogOpen(true)}
                        sx={{
                          borderRadius: 2,
                          borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.3)' : 'rgba(106, 90, 205, 0.5)',
                          color: theme.palette.mode === 'dark' ? 'white' : 'primary.main',
                          '&:hover': {
                            borderColor: theme.palette.mode === 'dark' ? 'white' : 'primary.main',
                            bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(106, 90, 205, 0.1)',
                          }
                        }}
                      >
                        Change Email
                      </Button>
                    </Box>

                    <Divider />

                    <Box>
                      <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                        Two-Factor Authentication
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {twoFactorEnabled
                          ? `Two-factor authentication is enabled using ${twoFactorType}`
                          : 'Add an extra layer of security to your account'}
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={twoFactorEnabled}
                              onChange={() => {
                                if (!twoFactorEnabled) {
                                  setTwoFactorDialogOpen(true);
                                } else {
                                  // Handle disabling 2FA with password confirmation
                                  if (window.confirm('Are you sure you want to disable two-factor authentication? This will make your account less secure.')) {
                                    setPasswordDialogOpen(true);
                                  }
                                }
                              }}
                              color="primary"
                            />
                          }
                          label={twoFactorEnabled ? "Enabled" : "Disabled"}
                        />
                      </Box>

                      {!twoFactorEnabled && (
                        <Button
                          variant="outlined"
                          size="small"
                          color="primary"
                          startIcon={<SecurityIcon />}
                          onClick={() => setTwoFactorDialogOpen(true)}
                          sx={{
                            borderRadius: 2,
                            '&:hover': {
                              bgcolor: theme.palette.mode === 'dark' ? 'rgba(123,104,238,0.1)' : 'rgba(106,90,205,0.1)',
                            }
                          }}
                        >
                          Set Up 2FA
                        </Button>
                      )}

                      {twoFactorEnabled && (
                        <Box sx={{ mt: 2 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            color="primary"
                            sx={{
                              borderRadius: 2,
                              mr: 2,
                              '&:hover': {
                                bgcolor: theme.palette.mode === 'dark' ? 'rgba(123,104,238,0.1)' : 'rgba(106,90,205,0.1)',
                              }
                            }}
                            onClick={() => {
                              if (window.confirm('Are you sure you want to generate new recovery codes? This will invalidate all your existing recovery codes.')) {
                                (async () => {
                                  try {
                                    // Show loading state
                                    setLoading(true);

                                    // Generate new recovery codes
                                    const response = await authService.generateRecoveryCodes();
                                    console.log('Recovery codes response:', response);

                                    if (response.success && response.recoveryCodes) {
                                      // Store the recovery codes and open the dialog
                                      setRecoveryCodes(response.recoveryCodes);
                                      setRecoveryCodesDialogOpen(true);
                                    } else {
                                      setError(response.message || 'Failed to generate recovery codes');
                                    }
                                  } catch (err) {
                                    console.error('Error generating recovery codes:', err);
                                    setError(err.response?.data?.message || 'Failed to generate recovery codes');
                                  } finally {
                                    setLoading(false);
                                  }
                                })();
                              }
                            }}
                          >
                            Generate New Recovery Codes
                          </Button>

                          <Button
                            variant="outlined"
                            size="small"
                            color="error"
                            sx={{
                              borderRadius: 2,
                              '&:hover': {
                                bgcolor: 'rgba(211,47,47,0.1)',
                              }
                            }}
                            onClick={() => {
                              if (window.confirm('Are you sure you want to disable two-factor authentication? This will make your account less secure.')) {
                                // Open password confirmation dialog
                                setPasswordDialogOpen(true);
                              }
                            }}
                          >
                            Disable 2FA
                          </Button>
                        </Box>
                      )}
                    </Box>

                    {/* 2FA Setup Dialog */}
                    <TwoFactorSetup
                      open={twoFactorDialogOpen}
                      onClose={(success, type) => {
                        setTwoFactorDialogOpen(false);
                        if (success) {
                          setTwoFactorEnabled(true);
                          if (type) {
                            setTwoFactorType(type);
                          }
                          // Refresh user data to get updated 2FA status
                          fetchData();
                        }
                      }}
                    />

                    {/* Password Confirmation Dialog for disabling 2FA */}
                    <PasswordConfirmDialog
                      open={passwordDialogOpen}
                      onClose={() => setPasswordDialogOpen(false)}
                      title="Disable Two-Factor Authentication"
                      message="Please enter your password to disable two-factor authentication."
                      onConfirm={async (password) => {
                        try {
                          const response = await authService.disable2fa(password);
                          if (response.success) {
                            setTwoFactorEnabled(false);
                            setTwoFactorType(null);
                            alert('Two-factor authentication has been disabled');
                            // Refresh user data to get updated 2FA status
                            fetchData();
                          } else {
                            throw new Error(response.message || 'Failed to disable 2FA');
                          }
                        } catch (err) {
                          console.error('Error disabling 2FA:', err);
                          throw new Error(err.response?.data?.message || err.message || 'Failed to disable 2FA');
                        }
                      }}
                    />

                    {/* Recovery Codes Dialog */}
                    <RecoveryCodesDialog
                      open={recoveryCodesDialogOpen}
                      onClose={() => setRecoveryCodesDialogOpen(false)}
                      recoveryCodes={recoveryCodes}
                    />

                    {/* Change Email Dialog */}
                    <ChangeEmail
                      open={changeEmailDialogOpen}
                      onClose={() => setChangeEmailDialogOpen(false)}
                      currentEmail={userData?.email}
                    />
                  </Stack>
                </CardContent>
              </Card>
            )}

            {/* Activity Tab */}
            {activeTab === 2 && (
              <Card
                elevation={3}
                sx={{
                  borderRadius: 3,
                  boxShadow: theme.palette.mode === 'dark'
                    ? '0 8px 32px rgba(0, 0, 0, 0.3)'
                    : '0 8px 32px rgba(106, 90, 205, 0.1)',
                  border: theme.palette.mode === 'dark'
                    ? '1px solid rgba(255, 255, 255, 0.05)'
                    : 'none',
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Recent Activity
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
                    Activity history will be displayed here
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Logout Button */}
          <Grid item xs={12}>
            <Box display="flex" justifyContent="center" mt={2}>
              <Button
                variant="contained"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={handleLogout}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 25,
                  boxShadow: '0 4px 14px rgba(211, 47, 47, 0.3)',
                  '&:hover': {
                    boxShadow: '0 6px 20px rgba(211, 47, 47, 0.4)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                Logout
              </Button>
            </Box>
          </Grid>
        </Grid>
      )}
    </Container>
  );
}