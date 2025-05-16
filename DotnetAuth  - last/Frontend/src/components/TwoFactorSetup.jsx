import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  TextField,
  CircularProgress,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  useTheme,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import QrCodeIcon from '@mui/icons-material/QrCode';
import EmailIcon from '@mui/icons-material/Email';
import SecurityIcon from '@mui/icons-material/Security';
import { QRCodeSVG } from 'qrcode.react';
import authService from '../services/authService';

const steps = ['Select Method', 'Setup', 'Verify'];

export default function TwoFactorSetup({ open, onClose }) {
  const [activeStep, setActiveStep] = useState(0);
  const [twoFactorType, setTwoFactorType] = useState('authenticator');
  const [setupResponse, setSetupResponse] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const theme = useTheme();

  // Fetch user email when component mounts
  useEffect(() => {
    if (open) {
      const fetchUserEmail = async () => {
        try {
          const userData = await authService.getCurrentUser();
          if (userData && userData.email) {
            setUserEmail(userData.email);
          }
        } catch (err) {
          console.error('Error fetching user email:', err);
        }
      };

      fetchUserEmail();
    }
  }, [open]);

  const handleNext = async () => {
    if (activeStep === 0) {
      // Start 2FA setup
      setLoading(true);
      setError('');
      try {
        const response = await authService.setup2fa(twoFactorType);
        console.log('2FA Setup Response:', response);

        if (response.success) {
          // Make sure we have a valid QR code URL
          if (twoFactorType === 'authenticator' && response.qrCodeUrl) {
            console.log('QR Code URL:', response.qrCodeUrl);
          }

          setSetupResponse(response);
          setActiveStep(1);
        } else {
          setError(response.message || 'Failed to setup 2FA');
        }
      } catch (err) {
        console.error('2FA Setup Error:', err);
        setError(err.response?.data?.message || 'Failed to setup 2FA');
      } finally {
        setLoading(false);
      }
    } else if (activeStep === 1) {
      // Verify 2FA setup
      setLoading(true);
      setError('');
      try {
        const response = await authService.verify2faSetup(verificationCode);
        if (response.success) {
          setRecoveryCodes(response.recoveryCodes);
          setActiveStep(2);
        } else {
          setError(response.message || 'Failed to verify 2FA setup');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to verify 2FA setup');
      } finally {
        setLoading(false);
      }
    } else {
      // Finish with success
      handleClose(true);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleClose = (success = false) => {
    const currentType = success ? twoFactorType : null;
    setActiveStep(0);
    setTwoFactorType('authenticator');
    setSetupResponse(null);
    setVerificationCode('');
    setRecoveryCodes([]);
    setError('');
    onClose(success, currentType);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Choose your preferred two-factor authentication method:
            </Typography>
            <FormControl component="fieldset" sx={{ mt: 2 }}>
              <RadioGroup
                value={twoFactorType}
                onChange={(e) => setTwoFactorType(e.target.value)}
              >
                <FormControlLabel
                  value="authenticator"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <QrCodeIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body1">Authenticator App</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Use an app like Google Authenticator or Authy
                        </Typography>
                      </Box>
                    </Box>
                  }
                  sx={{ mb: 2 }}
                />
                <FormControlLabel
                  value="email"
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <EmailIcon sx={{ mr: 1, color: 'primary.main' }} />
                      <Box>
                        <Typography variant="body1">Email</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Receive verification codes via email
                        </Typography>
                      </Box>
                    </Box>
                  }
                  sx={{ mb: 2 }}
                />

              </RadioGroup>
            </FormControl>
          </Box>
        );
      case 1:
        return (
          <Box sx={{ mt: 2 }}>
            {twoFactorType === 'authenticator' && setupResponse && (
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="subtitle1" gutterBottom>
                  Scan this QR code with your authenticator app:
                </Typography>
                <Box sx={{ my: 3, display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                  {setupResponse.qrCodeUrl ? (
                    <QRCodeSVG
                      value={setupResponse.qrCodeUrl}
                      size={200}
                      level="M"
                      includeMargin={true}
                      bgColor={theme.palette.mode === 'dark' ? '#333' : '#fff'}
                      fgColor={theme.palette.mode === 'dark' ? '#fff' : '#000'}
                    />
                  ) : (
                    <Box sx={{
                      width: 200,
                      height: 200,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px dashed',
                      borderColor: 'text.disabled',
                      borderRadius: 1
                    }}>
                      <Typography color="text.secondary">
                        QR Code not available
                      </Typography>
                    </Box>
                  )}

                  {/* Generate a QR code from the secret if qrCodeUrl is not provided */}
                  {!setupResponse.qrCodeUrl && setupResponse.secret && (
                    <Box sx={{ mt: 2 }}>
                      <Alert severity="info" sx={{ mb: 2 }}>
                        <Typography variant="body2">
                          Using the secret key to generate QR code
                        </Typography>
                      </Alert>
                      <QRCodeSVG
                        value={`otpauth://totp/DotnetAuth:${userEmail || 'user'}?secret=${setupResponse.secret}&issuer=DotnetAuth`}
                        size={200}
                        level="M"
                        includeMargin={true}
                        bgColor={theme.palette.mode === 'dark' ? '#333' : '#fff'}
                        fgColor={theme.palette.mode === 'dark' ? '#fff' : '#000'}
                      />
                    </Box>
                  )}
                </Box>
                <Typography variant="subtitle2" gutterBottom>
                  Or enter this code manually:
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                  <Typography variant="body1" sx={{ fontFamily: 'monospace', letterSpacing: 1 }}>
                    {setupResponse.secret}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => copyToClipboard(setupResponse.secret)}
                    sx={{ ml: 1 }}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            )}

            {(twoFactorType === 'email' || twoFactorType === 'sms') && setupResponse && (
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  {twoFactorType === 'email'
                    ? 'A verification code has been sent to your email.'
                    : 'A verification code has been sent to your phone.'}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {twoFactorType === 'email'
                    ? 'Check your inbox and spam folder for the code.'
                    : 'Check your phone for the SMS with the code.'}
                </Typography>
                {/* Notification about email delivery */}
                {twoFactorType === 'email' && (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2">
                      A verification code has been sent to your email address. Please check your inbox and spam folder.
                    </Typography>
                  </Alert>
                )}
              </Box>
            )}

            <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
              Enter the verification code:
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              sx={{ mt: 1 }}
            />
          </Box>
        );
      case 2:
        return (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Two-factor authentication has been enabled successfully!
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Please save these recovery codes in a safe place. You can use them to regain access to your account if you lose access to your two-factor authentication device.
            </Typography>

            <Paper
              elevation={1}
              sx={{
                p: 2,
                mt: 2,
                mb: 3,
                borderRadius: 2,
                bgcolor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
              }}
            >
              <List dense disablePadding>
                {recoveryCodes.map((code, index) => (
                  <ListItem
                    key={index}
                    secondaryAction={
                      <IconButton edge="end" size="small" onClick={() => copyToClipboard(code)}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    }
                    sx={{ py: 0.5 }}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          variant="body2"
                          sx={{ fontFamily: 'monospace', letterSpacing: 1 }}
                        >
                          {code}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>

            <Button
              variant="outlined"
              size="small"
              startIcon={<ContentCopyIcon />}
              onClick={() => copyToClipboard(recoveryCodes.join('\n'))}
              sx={{ mb: 2 }}
            >
              Copy All Codes
            </Button>
          </Box>
        );
      default:
        return null;
    }
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
            : '0 8px 32px rgba(106, 90, 205, 0.1)',
        }
      }}
    >
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <SecurityIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            Set Up Two-Factor Authentication
          </Typography>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {renderStepContent()}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={handleClose}
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          Cancel
        </Button>
        <Box sx={{ flex: '1 1 auto' }} />
        {activeStep > 0 && (
          <Button
            onClick={handleBack}
            variant="outlined"
            sx={{ borderRadius: 2, mr: 1 }}
            disabled={loading}
          >
            Back
          </Button>
        )}
        <Button
          onClick={handleNext}
          variant="contained"
          sx={{
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
          disabled={loading}
        >
          {loading ? (
            <CircularProgress size={24} color="inherit" />
          ) : activeStep === steps.length - 1 ? (
            'Finish'
          ) : (
            'Next'
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
