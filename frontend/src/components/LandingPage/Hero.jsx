import React from 'react';
import { Box, Typography, Button, Container, Grid } from '@mui/material';
import { styled } from '@mui/system';

const HeroSection = styled(Box)({
    padding: '80px 0',
    backgroundColor: '#f9f9f9',
    display: 'flex',
    alignItems: 'center',
});

const HeroTitle = styled(Typography)({
    fontWeight: 800,
    fontSize: '3.5rem',
    lineHeight: 1.2,
    marginBottom: '20px',
    color: '#333',
});

const HeroSubtitle = styled(Typography)({
    fontSize: '1.25rem',
    color: '#666',
    marginBottom: '40px',
    maxWidth: '600px',
});

const CTAButton = styled(Button)({
    backgroundColor: '#2E7D32',
    color: '#fff',
    padding: '12px 30px',
    fontSize: '1.1rem',
    textTransform: 'none',
    fontWeight: 600,
    '&:hover': {
        backgroundColor: '#1B5E20',
    },
});

const Hero = () => {
    return (
        <HeroSection>
            <Container maxWidth="lg">
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <HeroTitle variant="h1">
                            The one place for all your projects and team collaboration.
                        </HeroTitle>
                        <HeroSubtitle>
                            Plan, collaborate, organize and deliver projects of all sizes, on time, using one project planning software with all the right tools put in one place.
                        </HeroSubtitle>
                        <CTAButton variant="contained" size="large">
                            Get Started for Free
                        </CTAButton>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        {/* Placeholder for Hero Image */}
                        <Box
                            sx={{
                                width: '100%',
                                height: '400px',
                                backgroundColor: '#e0e0e0',
                                borderRadius: '8px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#888',
                            }}
                        >
                            Hero Image Placeholder
                        </Box>
                    </Grid>
                </Grid>
            </Container>
        </HeroSection>
    );
};

export default Hero;
