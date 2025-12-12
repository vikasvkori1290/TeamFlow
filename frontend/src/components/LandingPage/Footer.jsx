import React from 'react';
import { Box, Container, Typography, Grid, Link } from '@mui/material';
import { styled } from '@mui/system';

const FooterSection = styled(Box)({
    backgroundColor: '#333',
    color: '#fff',
    padding: '60px 0 20px',
});

const FooterLink = styled(Link)({
    color: '#bbb',
    display: 'block',
    marginBottom: '10px',
    textDecoration: 'none',
    '&:hover': {
        color: '#fff',
    },
});

const FooterTitle = styled(Typography)({
    fontWeight: 700,
    marginBottom: '20px',
    color: '#fff',
});

const Footer = () => {
    return (
        <FooterSection>
            <Container maxWidth="lg">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: '#2E7D32', marginBottom: '20px' }}>
                            TeamFlow
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#bbb', maxWidth: '300px' }}>
                            The ultimate project management and collaboration tool for teams to deliver work on time.
                        </Typography>
                    </Grid>
                    <Grid item xs={6} md={2}>
                        <FooterTitle variant="subtitle1">Product</FooterTitle>
                        <FooterLink href="#">Features</FooterLink>
                        <FooterLink href="#">Pricing</FooterLink>
                        <FooterLink href="#">Integrations</FooterLink>
                    </Grid>
                    <Grid item xs={6} md={2}>
                        <FooterTitle variant="subtitle1">Company</FooterTitle>
                        <FooterLink href="#">About Us</FooterLink>
                        <FooterLink href="#">Careers</FooterLink>
                        <FooterLink href="#">Contact</FooterLink>
                    </Grid>
                    <Grid item xs={6} md={2}>
                        <FooterTitle variant="subtitle1">Resources</FooterTitle>
                        <FooterLink href="#">Blog</FooterLink>
                        <FooterLink href="#">Help Center</FooterLink>
                        <FooterLink href="#">API Docs</FooterLink>
                    </Grid>
                    <Grid item xs={6} md={2}>
                        <FooterTitle variant="subtitle1">Legal</FooterTitle>
                        <FooterLink href="#">Privacy Policy</FooterLink>
                        <FooterLink href="#">Terms of Service</FooterLink>
                    </Grid>
                </Grid>
                <Box sx={{ borderTop: '1px solid #444', marginTop: '40px', paddingTop: '20px', textAlign: 'center' }}>
                    <Typography variant="body2" sx={{ color: '#888' }}>
                        © {new Date().getFullYear()} TeamFlow. All rights reserved.
                    </Typography>
                </Box>
            </Container>
        </FooterSection>
    );
};

export default Footer;
