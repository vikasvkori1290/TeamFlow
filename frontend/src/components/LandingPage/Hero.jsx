import React from 'react';
import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';

const HeroSection = styled(Box)({
    padding: '120px 0 100px', // Adjusted for "just below nav bar"
    background: 'transparent',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column', // Stack vertically
    alignItems: 'center',    // Center horizontally
    justifyContent: 'flex-start', // Start from top
    color: '#fff',
    position: 'relative',
    zIndex: 1,
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
            <Container maxWidth="lg" sx={{ textAlign: 'center' }}>
                <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
                    <HeroTitle variant="h1">
                        Welcome to TeamFlow
                    </HeroTitle>
                    <HeroSubtitle sx={{ mx: 'auto' }}>
                        Your project management solution.
                    </HeroSubtitle>
                </Box>
            </Container>
        </HeroSection>
    );
};

export default Hero;
