import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Divider,
  useTheme,
} from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import authService from '../services/authService';
import { useAuth } from '../contexts/AuthContext';

export default function ChangeEmail({ open, onClose, currentEmail }) {
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const { logout } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!newEmail) {
      setError('Please enter a new email address');
      return;
    }
    
    if (!password) {
      setError('Please enter your current password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await authService.changeEmail({
        newEmail,
        password
      });
      
      if (response.success) {
        // Navigate to OTP verification page with the necessary state
        navigate('/verify-otp', {
          state: {
            email: newEmail,
            password: password,
            message: 'Please verify your new email address with the code sent to your email.',
            isEmailChange: true,
            oldEmail: currentEmail
          }
        });
        
        // Close the dialog
        handleClose();
      } else {
        setError(response.message || 'Failed to change email');
      }
    } catch (err) {
      console.error('Error changing email:', err);
      setError(err.response?.data?.message || 'Failed to change email');
    } finally {
      setLoading(false);
    }
  };
  
  const handleClose = () => {
    setNewEmail('');
    setPassword('');
    setError('');
    setShowPassword(false);
    onClose();
  };
  
  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: theme.palette.mode === 'dark'
            ? '0 8px 32px rgba(0, 0, 0, 0.3)'
            : '0 8px 32px rgba(3, 169, 244, 0.1)',
        }
      }}
    >
      <DialogTitle>
        <Typography variant="h6" component="div">
          Change Email Address
        </Typography>
      </DialogTitle>
      
      <Divider />
      
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Your current email address is <Box component="span" fontWeight="medium" color="primary.main">{currentEmail}</Box>
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            New Email Address
          </Typography>
          <TextField
            required
            fullWidth
            id="newEmail"
            placeholder="Enter new email address"
            name="newEmail"
            type="email"
            autoFocus
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 3,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(3, 169, 244, 0.05)',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Current Password
          </Typography>
          <TextField
            required
            fullWidth
            id="password"
            placeholder="Enter your current password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 3,
              bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(3, 169, 244, 0.05)',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          
          <Alert severity="info" sx={{ mb: 3 }}>
            After changing your email, you will need to verify the new email address and then log in again with your new email.
          </Alert>
        </Box>
      </DialogContent>
      
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={handleClose}
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
          disabled={loading}
          sx={{
            borderRadius: 2,
            background: theme.palette.mode === 'dark'
              ? 'linear-gradient(45deg, #039BE5 30%, #4FC3F7 90%)'
              : 'linear-gradient(45deg, #03A9F4 30%, #4FC3F7 90%)',
            boxShadow: '0 4px 14px rgba(3, 169, 244, 0.3)',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(3, 169, 244, 0.4)',
              transform: 'translateY(-2px)',
            },
          }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Change Email'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
