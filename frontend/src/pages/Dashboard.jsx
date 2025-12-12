import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
        } else {
            setUser(JSON.parse(storedUser));
        }
    }, [navigate]);

    const onLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    if (!user) {
        return null;
    }

    return (
        <Container>
            <Box sx={{ marginTop: 4 }}>
                <Typography variant="h4" gutterBottom>
                    Welcome, {user.name}!
                </Typography>
                <Typography variant="body1" gutterBottom>
                    This is your dashboard.
                </Typography>
                <Button variant="outlined" color="error" onClick={onLogout} sx={{ mt: 2 }}>
                    Log Out
                </Button>
            </Box>
        </Container>
    );
};

export default Dashboard;
