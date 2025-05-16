import { Box, Container, Typography, Grid, Link, Divider, useTheme } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';

export default function Footer() {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(18, 18, 18, 0.9)' : 'rgba(249, 250, 251, 0.9)',
        borderTop: '1px solid',
        borderColor: theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: theme.palette.primary.main,
                  color: 'white',
                  p: 1,
                  borderRadius: 1,
                  mr: 1.5,
                }}
              >
                <HomeIcon sx={{ fontSize: 20 }} />
              </Box>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  fontWeight: 700,
                  letterSpacing: '.05rem',
                }}
              >
                Prescripto
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" paragraph>
              Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s.
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              COMPANY
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" underline="hover" color="text.secondary">
                About Us
              </Link>
              <Link href="#" underline="hover" color="text.secondary">
                Contact Us
              </Link>
              <Link href="#" underline="hover" color="text.secondary">
                Privacy Policy
              </Link>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              GET IN TOUCH
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              +1-202-555-0190
            </Typography>
            <Typography variant="body2" color="text.secondary">
              info@prescripto.com
            </Typography>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="subtitle1" fontWeight={600} gutterBottom>
              WORKING HOURS
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Monday - Friday: 9:00 AM - 6:00 PM
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Saturday: 9:00 AM - 2:00 PM
            </Typography>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        <Typography variant="body2" color="text.secondary" align="center">
          Copyright © {currentYear} Prescripto. All Rights Reserved.
        </Typography>
      </Container>
    </Box>
  );
}
