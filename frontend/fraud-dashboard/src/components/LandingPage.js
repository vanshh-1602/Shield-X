import React from 'react';
import { Box, Container, Typography, Button, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import heroImage from '../assets/images/hero.png';

const HeroSection = styled(Box)(({ theme }) => ({
  background: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${heroImage})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  minHeight: '80vh',
  display: 'flex',
  alignItems: 'center',
  color: 'white',
  padding: theme.spacing(4),
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
  color: 'white',
  padding: '0 30px',
  height: 48,
}));

const LandingPage = () => {
  return (
    <Box>
      <HeroSection>
        <Container>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" gutterBottom>
                Shield X
              </Typography>
              <Typography variant="h4" gutterBottom>
                AI-Powered Fraud Detection
              </Typography>
              <Typography variant="h6" paragraph>
                Protect your transactions with advanced machine learning and real-time monitoring
              </Typography>
              <Box mt={4}>
                <GradientButton variant="contained" size="large">
                  Get Started
                </GradientButton>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </HeroSection>

      <Container>
        <Box py={8}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" gutterBottom>
                Real-time Detection
              </Typography>
              <Typography>
                Instantly analyze transactions using our advanced ML model with 97% accuracy
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" gutterBottom>
                Interactive Dashboard
              </Typography>
              <Typography>
                Monitor and manage transactions with our user-friendly interface
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="h5" gutterBottom>
                Secure & Reliable
              </Typography>
              <Typography>
                Enterprise-grade security with JWT authentication and data encryption
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
