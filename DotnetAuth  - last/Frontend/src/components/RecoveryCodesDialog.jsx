import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Divider,
  useTheme,
  Alert,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SecurityIcon from '@mui/icons-material/Security';

export default function RecoveryCodesDialog({ open, onClose, recoveryCodes }) {
  const theme = useTheme();
  const [copySuccess, setCopySuccess] = useState(false);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 3000);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
            Recovery Codes
          </Typography>
        </Box>
      </DialogTitle>

      <Divider />

      <DialogContent>
        <Typography variant="body1" paragraph>
          Please save these recovery codes in a safe place. You can use them to regain access to your account if you lose access to your two-factor authentication device.
        </Typography>

        <Typography variant="body2" color="text.secondary" paragraph>
          Each code can only be used once. <strong>Note: Generating new recovery codes invalidates all previous codes.</strong>
        </Typography>

        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2">
            Any previously generated recovery codes are now invalid. Only the codes shown below will work.
          </Typography>
        </Alert>

        {copySuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Copied to clipboard!
          </Alert>
        )}

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
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button
          onClick={onClose}
          variant="contained"
          color="primary"
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
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
