import React from 'react';
import { Container, Typography, Grid, Paper, Button, Box } from '@mui/material';
import { AddCircle, Assignment, Folder } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const TaskManagement = () => {
    const navigate = useNavigate();

    const options = [
        {
            title: "Assign Task",
            description: "Assign new tasks to your team members from your projects.",
            icon: <AddCircle sx={{ fontSize: 60, color: '#00E5FF', mb: 2 }} />,
            action: () => navigate('/task/assign'),
            btnText: "Go to Assign",
            btnColor: "info" // Mapped to theme
        },
        {
            title: "Review Tasks",
            description: "Review and approve tasks submitted by your team.",
            icon: <Assignment sx={{ fontSize: 60, color: '#FFC400', mb: 2 }} />,
            action: () => navigate('/task/complete'),
            btnText: "Go to Review",
            btnColor: "warning"
        },
        {
            title: "View My Tasks",
            description: "View tasks assigned to you and track your progress.",
            icon: <Folder sx={{ fontSize: 60, color: '#00E676', mb: 2 }} />,
            action: () => navigate('/task/view'),
            btnText: "View Tasks",
            btnColor: "success"
        }
    ];

    return (
        <Container maxWidth="lg" sx={{ mt: 8, mb: 10 }}>
            <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography variant="overline" sx={{ color: '#00E5FF', letterSpacing: 2 }}>
                    TASK CONTROL CENTER
                </Typography>
                <Typography variant="h3" fontWeight="bold" sx={{ color: '#fff', mt: 1 }}>
                    Manage Your <span className="text-gradient">Workflow</span>
                </Typography>
            </Box>

            <Grid container spacing={4}>
                {options.map((opt, index) => (
                    <Grid item xs={12} md={4} key={index}>
                        <Paper
                            className="glass-panel glow-hover"
                            sx={{
                                p: 4,
                                height: '100%',
                                borderRadius: 4,
                                textAlign: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                bgcolor: 'transparent',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {opt.icon}
                            <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ color: '#fff' }}>
                                {opt.title}
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#B0B3C7', mb: 4, flexGrow: 1, lineHeight: 1.6 }}>
                                {opt.description}
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={opt.action}
                                fullWidth
                                sx={{
                                    mt: 'auto',
                                    py: 1.5,
                                    borderRadius: '12px',
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 'bold',
                                    background: opt.btnColor === 'info' ? 'linear-gradient(45deg, #00E5FF, #00B0FF)' :
                                        opt.btnColor === 'warning' ? 'linear-gradient(45deg, #FFC400, #FF9100)' :
                                            'linear-gradient(45deg, #00E676, #00C853)',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
                                    }
                                }}
                            >
                                {opt.btnText}
                            </Button>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default TaskManagement;
