import { Box, Button, Container, Grid, Typography } from '@mui/material';
import { Parallax, ParallaxProvider } from 'react-scroll-parallax';

import React from 'react';
import { useInView } from 'react-intersection-observer';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleSignUp = () => {
    navigate('/signup');
  };

  // Intersection Observer for animations
  const { ref: heroRef, inView: heroInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const { ref: featuresRef, inView: featuresInView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <ParallaxProvider>
      <Box sx={{ width: '100%', overflowX: 'hidden' }}>
        {/* Hero Section */}
        <Parallax translateY={[-20, 20]}>
          <Box
            ref={heroRef}
            sx={{
              height: '100vh',
              backgroundImage: 'url(/path/to/hero-image.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: heroInView ? 1 : 0,
              transition: 'opacity 1s ease-in-out',
            }}
          >
            <Container sx={{ textAlign: 'center' }}>
              <Typography
                variant="h2"
                sx={{
                  color: '#fff',
                  mb: 4,
                  fontWeight: 'bold',
                  transform: heroInView ? 'translateY(0)' : 'translateY(100px)',
                  opacity: heroInView ? 1 : 0,
                  transition: 'all 1s ease',
                }}
              >
                Welcome to Family Assistant
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: '#fff',
                  mb: 6,
                  transform: heroInView ? 'translateY(0)' : 'translateY(100px)',
                  opacity: heroInView ? 1 : 0,
                  transition: 'all 1s ease 0.2s',
                }}
              >
                Simplify family tasks with an intuitive interface and modern features.
              </Typography>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSignUp}
                sx={{ mr: 2 }}
              >
                Get Started
              </Button>
              <Button variant="outlined" color="primary" onClick={handleLogin}>
                Login
              </Button>
            </Container>
          </Box>
        </Parallax>

        {/* Features Section */}
        <Box
          ref={featuresRef}
          sx={{
            py: 8,
            backgroundColor: 'background.default',
            color: 'text.primary',
            opacity: featuresInView ? 1 : 0,
            transform: featuresInView ? 'translateY(0)' : 'translateY(50px)',
            transition: 'all 1s ease',
          }}
        >
          <Container>
            <Typography variant="h4" sx={{ textAlign: 'center', mb: 6 }}>
              Features
            </Typography>
            <Grid container spacing={4}>
              {/* Feature 1 */}
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', px: 2 }}>
                  <img
                    src="/path/to/icon1.svg"
                    alt="Feature 1"
                    style={{ width: 80, marginBottom: 16 }}
                  />
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Task Management
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Organize and assign tasks efficiently within your family.
                  </Typography>
                </Box>
              </Grid>
              {/* Feature 2 */}
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', px: 2 }}>
                  <img
                    src="/path/to/icon2.svg"
                    alt="Feature 2"
                    style={{ width: 80, marginBottom: 16 }}
                  />
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Shared Calendar
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Keep track of family events and schedules in one place.
                  </Typography>
                </Box>
              </Grid>
              {/* Feature 3 */}
              <Grid item xs={12} md={4}>
                <Box sx={{ textAlign: 'center', px: 2 }}>
                  <img
                    src="/path/to/icon3.svg"
                    alt="Feature 3"
                    style={{ width: 80, marginBottom: 16 }}
                  />
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Communication
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Stay connected with messaging and notifications.
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Additional Sections */}
        {/* For example, a "Get Started" or "About Us" section */}
        <Box
          sx={{
            py: 8,
            backgroundColor: 'background.paper',
            color: 'text.primary',
          }}
        >
          <Container>
            <Typography variant="h4" sx={{ textAlign: 'center', mb: 6 }}>
              Ready to Simplify Your Family Life?
            </Typography>
            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSignUp}
                sx={{ mr: 2 }}
              >
                Sign Up Now
              </Button>
              <Button variant="outlined" color="primary" onClick={handleLogin}>
                Login
              </Button>
            </Box>
          </Container>
        </Box>
      </Box>
    </ParallaxProvider>
  );
};

export default LandingPage;