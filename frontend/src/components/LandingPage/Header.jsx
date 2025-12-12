import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { styled } from '@mui/system';
import { Link } from 'react-router-dom';

const StyledAppBar = styled(AppBar)({
    backgroundColor: '#ffffff',
    boxShadow: '0px 1px 5px rgba(0,0,0,0.1)',
    color: '#333',
});

const Logo = styled(Typography)({
    fontWeight: 700,
    fontSize: '1.5rem',
    color: '#2E7D32', // ProofHub-like green
    flexGrow: 1,
    cursor: 'pointer',
});

const NavButton = styled(Button)({
    textTransform: 'none',
    fontWeight: 500,
    color: '#333',
    marginLeft: '1rem',
    '&:hover': {
        backgroundColor: 'rgba(46, 125, 50, 0.04)',
        color: '#2E7D32',
    },
});

const SignUpButton = styled(Button)({
    textTransform: 'none',
    fontWeight: 600,
    backgroundColor: '#2E7D32',
    color: '#fff',
    marginLeft: '1rem',
    padding: '6px 20px',
    '&:hover': {
        backgroundColor: '#1B5E20',
    },
});

const Header = () => {
    return (
        <StyledAppBar position="static">
            <Container maxWidth="lg">
                <Toolbar disableGutters>
                    <Logo variant="h6" component={Link} to="/" sx={{ textDecoration: 'none', color: '#2E7D32' }}>TeamFlow</Logo>
                    <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                        <NavButton>Features</NavButton>
                        <NavButton>Pricing</NavButton>
                        <NavButton>Customers</NavButton>
                        <NavButton component={Link} to="/login">Login</NavButton>
                        <SignUpButton variant="contained" component={Link} to="/signup">Sign Up</SignUpButton>
                    </Box>
                </Toolbar>
            </Container>
        </StyledAppBar>
    );
};

export default Header;
