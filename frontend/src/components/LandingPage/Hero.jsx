import React from 'react';
import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';

const HeroSection = styled(Box)({
    padding: '160px 0 100px', // Extra padding for fixed header
    background: 'radial-gradient(circle at 50% 50%, #111625 0%, #0B0F19 100%)', // Dark radial
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    color: '#fff',
});

const HeroTitle = styled(Typography)({
    fontWeight: 800,
    fontSize: '4rem',
    lineHeight: 1.1,
    marginBottom: '24px',
    background: 'linear-gradient(to right, #fff, #B0B3C7)',
    backgroundClip: 'text',
    textFillColor: 'transparent',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    letterSpacing: '-1px',
});

const HeroSubtitle = styled(Typography)({
    fontSize: '1.25rem',
    color: '#B0B3C7',
    marginBottom: '48px',
    maxWidth: '600px',
    lineHeight: 1.6,
});

const CTAButton = styled(Button)({
    background: 'linear-gradient(45deg, #00E5FF, #7C4DFF)',
    color: '#fff',
    padding: '14px 40px',
    fontSize: '1.1rem',
    textTransform: 'none',
    fontWeight: 700,
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 229, 255, 0.4)',
    '&:hover': {
        boxShadow: '0 6px 24px rgba(124, 77, 255, 0.5)',
        transform: 'translateY(-2px)',
    },
    transition: 'all 0.3s ease',
});

const Hero = () => {
    return (
        <HeroSection>
            <Container maxWidth="lg">
                <Grid container spacing={8} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <HeroTitle variant="h1">
                            The one place for all your projects and team collaboration.
                        </HeroTitle>
                        <HeroSubtitle>
                            Plan, collaborate, organize and deliver projects of all sizes, on time, using one project planning software with all the right tools put in one place.
                        </HeroSubtitle>
                        <CTAButton variant="contained" size="large" component={Link} to="/signup">
                            Get Started for Free
                        </CTAButton>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        {/* Hero Image / Graphic */}
                        <Box
                            sx={{
                                width: '100%',
                                height: '450px',
                                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%)',
                                borderRadius: '24px',
                                border: '1px solid rgba(255,255,255,0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                backdropFilter: 'blur(20px)',
                                boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Abstract Glow */}
                            <Box sx={{ position: 'absolute', width: '300px', height: '300px', background: '#7C4DFF', filter: 'blur(100px)', opacity: 0.2, top: '-50px', right: '-50px', borderRadius: '50%' }} />
                            <Box sx={{ position: 'absolute', width: '250px', height: '250px', background: '#00E5FF', filter: 'blur(100px)', opacity: 0.2, bottom: '-50px', left: '-50px', borderRadius: '50%' }} />

                            <Typography variant="h5" color="text.secondary" sx={{ zIndex: 1, fontWeight: 'bold', letterSpacing: 2 }}>TEAMFLOW UI</Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </HeroSection>
    );
};

export default Hero;
