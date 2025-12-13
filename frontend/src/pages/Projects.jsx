import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Grid, Paper, IconButton, Avatar, AvatarGroup, LinearProgress, Chip as MuiChip } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import CreateProjectModal from '../components/CreateProjectModal';
import { FilterList, Sort, Add, CalendarToday, AccessTime } from '@mui/icons-material';

const Projects = () => {
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Kanban Columns
    const columns = ['Planning', 'Active', 'On Hold', 'Completed'];

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (!storedUser) {
            navigate('/login');
        } else {
            setUser(JSON.parse(storedUser));
            fetchProjects();
        }

        const searchParams = new URLSearchParams(location.search);
        if (searchParams.get('action') === 'create') {
            setOpenModal(true);
        }
    }, [navigate, location]);

    const fetchProjects = async () => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) return;
        try {
            const response = await fetch('http://localhost:5000/api/projects', {
                headers: { Authorization: `Bearer ${storedUser.token}` },
            });
            const data = await response.json();
            if (response.ok) {
                // Mock progress data for now if not in DB
                const enrichedData = data.map(p => ({
                    ...p,
                    progress: p.progress || Math.floor(Math.random() * 100) // Mocking progress
                }));
                setProjects(enrichedData);
            }
        } catch (error) {
            console.error('Error fetching projects:', error);
        }
    };

    const handleDragEnd = async (result) => {
        if (!result.destination) return;
        const { draggableId, destination } = result;
        const newStatus = destination.droppableId;

        const updatedProjects = projects.map(p =>
            p._id === draggableId ? { ...p, status: newStatus } : p
        );
        setProjects(updatedProjects);

        const storedUser = JSON.parse(localStorage.getItem('user'));
        try {
            await fetch(`http://localhost:5000/api/projects/${draggableId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${storedUser.token}` },
                body: JSON.stringify({ status: newStatus }),
            });
        } catch (error) {
            console.error('Failed to update status', error);
            fetchProjects();
        }
    };

    const getFilteredProjects = (status) => projects.filter(p => p.status === status);

    const isOverdue = (dateString) => {
        if (!dateString) return false;
        return new Date(dateString) < new Date();
    };

    if (!user) return null;

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
                <Typography variant="h4" fontWeight="bold">Projects Board</Typography>
                <Box>
                    <IconButton sx={{ mr: 1, color: 'text.secondary' }}><FilterList /></IconButton>
                    <IconButton sx={{ mr: 2, color: 'text.secondary' }}><Sort /></IconButton>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setOpenModal(true)}
                        sx={{ background: 'linear-gradient(45deg, #00E5FF, #7C4DFF)', color: '#fff' }}
                    >
                        New Project
                    </Button>
                </Box>
            </Box>

            <DragDropContext onDragEnd={handleDragEnd}>
                <Grid container spacing={3}>
                    {columns.map((column) => (
                        <Grid item xs={12} md={3} key={column}>
                            <Box sx={{ bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 4, p: 2, minHeight: '70vh' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 1 }}>{column}</Typography>
                                    <MuiChip size="small" label={getFilteredProjects(column).length} sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'text.secondary' }} />
                                </Box>

                                <Droppable droppableId={column}>
                                    {(provided) => (
                                        <Box ref={provided.innerRef} {...provided.droppableProps} sx={{ minHeight: '500px' }}>
                                            {getFilteredProjects(column).map((project, index) => (
                                                <Draggable key={project._id} draggableId={project._id} index={index}>
                                                    {(provided) => (
                                                        <Paper
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            onClick={() => navigate(`/project/${project._id}`)}
                                                            sx={{
                                                                p: 2, mb: 2,
                                                                bgcolor: '#1E2538',
                                                                cursor: 'pointer',
                                                                borderLeft: `4px solid ${project.color || '#00E5FF'}`,
                                                                '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 10px 20px rgba(0,0,0,0.4)', bgcolor: '#252D40' },
                                                                transition: 'all 0.2s',
                                                                position: 'relative',
                                                                overflow: 'hidden'
                                                            }}
                                                        >
                                                            <Typography variant="h6" fontSize="0.95rem" gutterBottom fontWeight="600">{project.name}</Typography>

                                                            {/* Progress Bar */}
                                                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                                                                <Box sx={{ width: '100%', mr: 1 }}>
                                                                    <LinearProgress variant="determinate" value={project.progress} sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: project.progress === 100 ? 'success.main' : 'primary.main' } }} />
                                                                </Box>
                                                                <Box sx={{ minWidth: 35 }}>
                                                                    <Typography variant="caption" color="text.secondary">{`${Math.round(project.progress)}%`}</Typography>
                                                                </Box>
                                                            </Box>

                                                            {/* Footer: Date and Team */}
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                                                <Box sx={{ display: 'flex', alignItems: 'center', color: isOverdue(project.endDate) ? 'error.main' : 'text.secondary' }}>
                                                                    <AccessTime sx={{ fontSize: 16, mr: 0.5 }} />
                                                                    <Typography variant="caption" fontWeight="500">
                                                                        {project.endDate ? new Date(project.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'No Due Date'}
                                                                    </Typography>
                                                                </Box>

                                                                <AvatarGroup max={4} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.75rem', borderColor: '#1E2538' } }}>
                                                                    {/* Manager */}
                                                                    {project.manager && <Avatar src={project.manager.avatar} alt={project.manager.name}>{project.manager.name?.[0]}</Avatar>}
                                                                    {/* Mocking other members if not fully populated yet */}
                                                                    {project.members && project.members.map((m, i) => (
                                                                        <Avatar key={i} src={m.avatar} alt={m.name}>{m.name?.[0]}</Avatar>
                                                                    ))}
                                                                    {/* Fallback to show at least one if manager exists */}
                                                                    {!project.members?.length && !project.manager && <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}>?</Avatar>}
                                                                </AvatarGroup>
                                                            </Box>
                                                        </Paper>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {provided.placeholder}
                                        </Box>
                                    )}
                                </Droppable>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </DragDropContext>

            <CreateProjectModal open={openModal} onClose={() => setOpenModal(false)} onProjectCreated={fetchProjects} />
        </Box>
    );
};

export default Projects;
