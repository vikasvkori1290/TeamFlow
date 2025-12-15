import React from 'react';
import { Box, Typography, Button, Container } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';

const HeroSection = styled(Box)({
    padding: '120px 0 100px',
    background: 'transparent',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
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
    const user = JSON.parse(localStorage.getItem('user'));

    return (
        <HeroSection>
            <Container maxWidth="lg" sx={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
                <Box sx={{ maxWidth: '900px', mx: 'auto', mt: 8 }}>
                    <Box sx={{ mb: 4, display: 'inline-block', px: 3, py: 1, borderRadius: '50px', background: 'rgba(0, 229, 255, 0.1)', border: '1px solid rgba(0, 229, 255, 0.2)' }}>
                        <Typography variant="body2" sx={{ color: '#00E5FF', fontWeight: 600, letterSpacing: 1 }}>
                            🚀 THE FUTURE OF COLLABORATION
                        </Typography>
                    </Box>
                    <HeroTitle variant="h1">
                        Synchronize <span className="text-gradient">Teams</span><br />
                        Maximise <span className="text-gradient">Flow</span>
                    </HeroTitle>
                    <HeroSubtitle sx={{ mx: 'auto' }}>
                        The all-in-one workspace for project management, real-time whiteboarding, and voice collaboration. Built for modern teams.
                    </HeroSubtitle>
                    <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
                        {user ? (
                            <CTAButton component={Link} to="/projects/board">
                                Go to Dashboard
                            </CTAButton>
                        ) : (
                            <>
                                <CTAButton component={Link} to="/signup">
                                    Get Started Free
                                </CTAButton>
                                <Button
                                    component={Link}
                                    to="/login"
                                    variant="outlined"
                                    sx={{
                                        color: '#fff',
                                        borderColor: 'rgba(255,255,255,0.2)',
                                        padding: '14px 40px',
                                        fontSize: '1.1rem',
                                        borderRadius: '12px',
                                        textTransform: 'none',
                                        '&:hover': {
                                            borderColor: '#fff',
                                            backgroundColor: 'rgba(255,255,255,0.05)'
                                        }
                                    }}
                                >
                                    Sign In
                                </Button>
                            </>
                        )}
                    </Box>
                </Box>
            </Container>

            {/* Abstract Background Elements */}
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '100%',
                height: '100%',
                zIndex: 0,
                background: 'radial-gradient(circle at 50% 50%, rgba(124, 77, 255, 0.15) 0%, rgba(15, 23, 42, 0) 70%)',
                filter: 'blur(60px)',
                pointerEvents: 'none'
            }} />
        </HeroSection>
    );
};

export default Hero;
