import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Box, Button, TextField, MenuItem,
    List, ListItem, ListItemButton,
    ListItemText, ListItemAvatar, Avatar, Paper, Grid, Alert
} from '@mui/material';
import { AddCircle, Folder } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const AssignTask = () => {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [selectedProject, setSelectedProject] = useState(null);
    const [taskData, setTaskData] = useState({
        title: '',
        description: '',
        duration: '', // In hours
        assignedTo: '',
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/projects', {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                const data = await res.json();
                if (res.ok) {
                    // Filter only projects created by the admin (current user)
                    const adminProjects = data.filter(p => p.createdBy === user._id);
                    setProjects(adminProjects);

                    if (adminProjects.length === 0) {
                        setError('You have not created any projects yet. Please create one first.');
                    }
                } else {
                    setError('Failed to fetch projects');
                }
            } catch (err) {
                console.error(err);
                setError('Error fetching projects');
            }
        };

        if (user) {
            fetchProjects();
        } else {
            navigate('/login');
        }
    }, [navigate, user]);

    const handleProjectSelect = (project) => {
        setSelectedProject(project);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!taskData.title || !taskData.assignedTo) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            const res = await fetch('http://localhost:5000/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    ...taskData,
                    project: selectedProject._id,
                }),
            });

            if (res.ok) {
                setSuccess('Task assigned successfully!');
                setTaskData({ title: '', description: '', duration: '', assignedTo: '' });
                // Optional: Navigate away or ask to assign another
            } else {
                const data = await res.json();
                setError(data.message || 'Failed to assign task');
            }
        } catch (err) {
            setError('Error assigning task');
        }
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            {!selectedProject ? (
                // Project Selection View (No Modal)
                <Paper sx={{ p: 4, bgcolor: '#1E2538', color: '#fff' }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ mb: 3 }}>
                        Select Project
                    </Typography>

                    {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

                    <List>
                        {projects.length > 0 ? (
                            projects.map((project) => (
                                <ListItem key={project._id} disablePadding sx={{ mb: 1, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1 }}>
                                    <ListItemButton onClick={() => handleProjectSelect(project)} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
                                        <ListItemAvatar>
                                            <Avatar sx={{ bgcolor: project.color || 'primary.main' }}>
                                                <Folder />
                                            </Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={project.name}
                                            secondary={`Members: ${project.members.length}`}
                                            primaryTypographyProps={{ color: '#fff', fontWeight: 500 }}
                                            secondaryTypographyProps={{ color: 'rgba(255,255,255,0.6)' }}
                                        />
                                    </ListItemButton>
                                </ListItem>
                            ))
                        ) : (
                            <Box sx={{ p: 3, textAlign: 'center' }}>
                                <Typography color="text.secondary">No projects found created by you.</Typography>
                            </Box>
                        )}
                    </List>
                </Paper>
            ) : (
                // Task Assignment Form
                <Paper sx={{ p: 4, bgcolor: '#1E2538', color: '#fff' }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <AddCircle sx={{ mr: 2, color: 'primary.main' }} />
                        Assign Task
                    </Typography>

                    <Typography variant="subtitle1" sx={{ mb: 3, color: '#B0B3C7' }}>
                        Project: <Box component="span" sx={{ color: '#00E5FF', fontWeight: 'bold' }}>{selectedProject.name}</Box>
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

                    <Box component="form" onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Task Title"
                                    variant="outlined"
                                    value={taskData.title}
                                    onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                                    required
                                    sx={{ input: { color: '#fff' }, label: { color: '#B0B3C7' }, fieldset: { borderColor: 'rgba(255,255,255,0.2)' } }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Description"
                                    multiline
                                    rows={4}
                                    value={taskData.description}
                                    onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                                    sx={{ textarea: { color: '#fff' }, label: { color: '#B0B3C7' }, fieldset: { borderColor: 'rgba(255,255,255,0.2)' } }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Duration (Hours)"
                                    type="number"
                                    value={taskData.duration}
                                    onChange={(e) => setTaskData({ ...taskData, duration: e.target.value })}
                                    sx={{ input: { color: '#fff' }, label: { color: '#B0B3C7' }, fieldset: { borderColor: 'rgba(255,255,255,0.2)' } }}
                                />
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Assign To"
                                    value={taskData.assignedTo}
                                    onChange={(e) => setTaskData({ ...taskData, assignedTo: e.target.value })}
                                    required
                                    sx={{
                                        color: '#fff',
                                        '.MuiSelect-select': { color: '#fff' },
                                        label: { color: '#B0B3C7' },
                                        fieldset: { borderColor: 'rgba(255,255,255,0.2)' },
                                        svg: { color: '#fff' }
                                    }}
                                >
                                    {selectedProject.members.length > 0 ? (
                                        selectedProject.members.map((member) => (
                                            <MenuItem key={member._id} value={member._id}>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: '0.75rem' }}>
                                                        {member.name[0]}
                                                    </Avatar>
                                                    {member.name} ({member.email})
                                                </Box>
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>No members in project</MenuItem>
                                    )}
                                </TextField>
                            </Grid>

                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    sx={{
                                        mt: 2,
                                        bgcolor: '#00E5FF',
                                        color: '#000',
                                        fontWeight: 'bold',
                                        '&:hover': { bgcolor: '#00B8D4' }
                                    }}
                                >
                                    Assign Task
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                    <Button onClick={() => setSelectedProject(null)} sx={{ mt: 2, color: 'text.secondary' }}>
                        Change Project
                    </Button>
                </Paper>
            )}
        </Container>
    );
};

export default AssignTask;
