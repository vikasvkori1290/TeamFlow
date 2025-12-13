import React from 'react';
import { Container, Typography, Grid, Paper, Button } from '@mui/material';
import { AddCircle, Assignment, Folder } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const TaskManagement = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h3" fontWeight="bold" gutterBottom sx={{ color: '#fff', mb: 4 }}>
                Task Management
            </Typography>
            <Grid container spacing={4}>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 4, bgcolor: '#1E2538', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <AddCircle sx={{ fontSize: 60, color: '#00E5FF', mb: 2 }} />
                        <Typography variant="h5" fontWeight="bold" gutterBottom>Assign Task</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                            Assign new tasks to your team members from your projects.
                        </Typography>
                        <Button variant="contained" onClick={() => navigate('/task/assign')} sx={{ bgcolor: '#00E5FF', color: '#000', mt: 'auto', width: '100%' }}>
                            Go to Assign
                        </Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 4, bgcolor: '#1E2538', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Assignment sx={{ fontSize: 60, color: '#FFC400', mb: 2 }} />
                        <Typography variant="h5" fontWeight="bold" gutterBottom>Review Tasks</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                            Review and approve tasks submitted by your team.
                        </Typography>
                        <Button variant="contained" onClick={() => navigate('/task/complete')} color="warning" sx={{ mt: 'auto', width: '100%' }}>
                            Go to Review
                        </Button>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 4, bgcolor: '#1E2538', textAlign: 'center', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Folder sx={{ fontSize: 60, color: '#00E676', mb: 2 }} />
                        <Typography variant="h5" fontWeight="bold" gutterBottom>View My Tasks</Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 3, flexGrow: 1 }}>
                            View tasks assigned to you and track your progress.
                        </Typography>
                        <Button variant="contained" onClick={() => navigate('/task/view')} color="success" sx={{ mt: 'auto', width: '100%' }}>
                            View Tasks
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default TaskManagement;
