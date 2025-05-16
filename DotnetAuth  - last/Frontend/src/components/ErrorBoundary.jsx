import React from 'react';
import { Box, Typography, Button, Container, Paper } from '@mui/material';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
    this.handleRefresh = this.handleRefresh.bind(this);
  }

  static getDerivedStateFromError() {
    // Just set hasError to true, we'll get the actual error in componentDidCatch
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRefresh() {
    // Clear any cached state that might be causing the error
    localStorage.removeItem('lastError');
    window.location.reload();
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 4,
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '50vh'
            }}
          >
            <Typography variant="h4" color="error" gutterBottom>
              Something went wrong
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              The application encountered an error. Please try refreshing the page.
            </Typography>
            {this.state.error && (
              <Box
                sx={{
                  mt: 2,
                  mb: 4,
                  p: 2,
                  bgcolor: 'rgba(0,0,0,0.05)',
                  borderRadius: 2,
                  maxWidth: '100%',
                  overflow: 'auto'
                }}
              >
                <Typography variant="body2" component="pre" sx={{ color: 'error.main', fontSize: '0.8rem' }}>
                  {this.state.error.toString()}
                </Typography>
              </Box>
            )}
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={this.handleRefresh}
              sx={{ mt: 2 }}
            >
              Refresh Page
            </Button>
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}