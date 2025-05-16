import { Box, Container, Typography, Grid, Paper } from '@mui/material';

export default function Services() {
  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          Our Services
        </Typography>
        <Typography variant="h6" color="text.secondary">
          This page is under construction. Check back soon for our complete list of services.
        </Typography>
      </Box>
      <Grid container justifyContent="center">
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 4, textAlign: 'center' }}>
            <Typography variant="body1">
              We're currently updating our services information. Please check back later or contact us for more details.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
