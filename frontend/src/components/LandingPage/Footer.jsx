import React from 'react';
import { Box, Container, Typography, Grid, Link } from '@mui/material';
import { styled } from '@mui/system';

import { LinkedIn, Instagram, GitHub, Email } from '@mui/icons-material';
import { IconButton, Stack } from '@mui/material';

const FooterSection = styled(Box)({
    padding: '40px 0 20px',
    background: 'transparent',
    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
    marginTop: 'auto',
    position: 'relative',
    zIndex: 10
});

const Footer = () => {
    return (
        <FooterSection>
            <Container maxWidth="lg">
                <Box sx={{ textAlign: 'center' }} id="about-us">
                    {/* About Us Section */}
                    <Box sx={{ mb: 6, maxWidth: '800px', mx: 'auto' }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ color: '#fff', mb: 2 }}>
                            Built for Builders
                        </Typography>
                        <Typography variant="body1" sx={{ color: '#B0B3C7', lineHeight: 1.8 }}>
                            At TeamFlow, we are crafting the operating system for high-velocity teams.
                            Whether you're a lean startup or a global enterprise, we build tools that bridge the gap between
                            ambition and execution. Our mission is to remove friction, amplify clarity, and let you focus on what matters most—creating.
                        </Typography>
                    </Box>

                    {/* Social Media & Contact */}
                    <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
                        <IconButton
                            href="https://linkedin.com"
                            target="_blank"
                            sx={{ color: '#B0B3C7', '&:hover': { color: '#0077b5', transform: 'translateY(-3px)' } }}
                        >
                            <LinkedIn fontSize="large" />
                        </IconButton>
                        <IconButton
                            href="https://instagram.com"
                            target="_blank"
                            sx={{ color: '#B0B3C7', '&:hover': { color: '#E1306C', transform: 'translateY(-3px)' } }}
                        >
                            <Instagram fontSize="large" />
                        </IconButton>
                        <IconButton
                            href="https://github.com"
                            target="_blank"
                            sx={{ color: '#B0B3C7', '&:hover': { color: '#fff', transform: 'translateY(-3px)' } }}
                        >
                            <GitHub fontSize="large" />
                        </IconButton>
                        <IconButton
                            href="mailto:contact@teamflow.com"
                            sx={{ color: '#B0B3C7', '&:hover': { color: '#EA4335', transform: 'translateY(-3px)' } }}
                        >
                            <Email fontSize="large" />
                        </IconButton>
                    </Stack>

                    <Typography variant="body2" sx={{ color: '#B0B3C7', opacity: 0.7 }}>
                        &copy; {new Date().getFullYear()} TeamFlow. All rights reserved.
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#B0B3C7', opacity: 0.5, mt: 1, display: 'block' }}>
                        Designed for efficiency. Built for teams.
                    </Typography>
                </Box>
            </Container>
        </FooterSection>
    );
};

export default Footer;
