import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Grid, Paper, IconButton, Avatar, AvatarGroup, LinearProgress, Chip as MuiChip, InputBase, Menu, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import CreateProjectModal from '../components/CreateProjectModal';
import EditProjectModal from '../components/EditProjectModal';
import InviteMemberModal from '../components/InviteMemberModal';
import { FilterList, Sort, Add, CalendarToday, AccessTime, Search, MoreVert, Dashboard, CheckCircle, Warning, Folder } from '@mui/icons-material';

const Projects = () => {
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);

    // Modals
    const [openModal, setOpenModal] = useState(false);
    const [openEditModal, setOpenEditModal] = useState(false);
    const [openInviteModal, setOpenInviteModal] = useState(false);

    // UI State
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [sortBy, setSortBy] = useState('Newest');

    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);

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
                const enrichedData = data.map(p => ({
                    ...p,
                    progress: p.progress || 0
                }));
                // Initial sort handled by effect/render logic
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

    const getProcessedProjects = () => {
        let processed = [...projects];

        // Filter by Search
        if (searchQuery) {
            processed = processed.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));
        }

        // Filter by Status (Toolbar)
        if (filterStatus !== 'All') {
            processed = processed.filter(p => p.status === filterStatus);
        }

        // Sort
        processed.sort((a, b) => {
            if (sortBy === 'Newest') return new Date(b.createdAt) - new Date(a.createdAt);
            if (sortBy === 'Oldest') return new Date(a.createdAt) - new Date(b.createdAt);
            if (sortBy === 'Name') return a.name.localeCompare(b.name);
            if (sortBy === 'Priority') {
                const priorityMap = { 'High': 3, 'Medium': 2, 'Low': 1 };
                return (priorityMap[b.priority] || 0) - (priorityMap[a.priority] || 0);
            }
            return 0;
        });

        return processed;
    };

    const processedProjects = getProcessedProjects();

    const getProjectsForColumn = (columnStatus) => {
        // We still need to respect the column status mainly
        return processedProjects.filter(p => p.status === columnStatus);
    };

    const getDaysLeft = (dateString) => {
        if (!dateString) return null;
        const today = new Date();
        const due = new Date(dateString);
        const diffTime = due - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const getDaysLeftColor = (days) => {
        if (days === null) return 'default';
        if (days < 0) return 'error'; // Overdue
        if (days <= 3) return 'warning'; // Urgent
        return 'success'; // Safe
    };

    const handleMenuOpen = (event, project) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
        setSelectedProject(project);
    };

    const handleMenuClose = (e) => {
        if (e) e.stopPropagation();
        setAnchorEl(null);
    };

    const handleEditOpen = () => {
        setOpenEditModal(true);
        handleMenuClose();
    };

    const handleDeleteProject = async (e) => {
        e.stopPropagation();
        if (!window.confirm(`Are you sure you want to delete ${selectedProject.name}?`)) {
            handleMenuClose();
            return;
        }

        const storedUser = JSON.parse(localStorage.getItem('user'));
        try {
            await fetch(`http://localhost:5000/api/projects/${selectedProject._id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${storedUser.token}` }
            });
            fetchProjects();
            handleMenuClose();
            setSelectedProject(null); // Clear selection
        } catch (error) {
            console.error('Error deleting project', error);
        }
    };

    // Calculate Stats
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'Active').length;
    const completedProjects = projects.filter(p => p.status === 'Completed').length;
    const urgentProjects = projects.filter(p => getDaysLeft(p.endDate) <= 3 && getDaysLeft(p.endDate) >= 0 && p.status !== 'Completed').length;

    const StatCard = ({ icon, title, value, color }) => (
        <Paper sx={{ p: 2, display: 'flex', alignItems: 'center', bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 3 }}>
            <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: `${color}20`, color: color, mr: 2 }}>{icon}</Box>
            <Box>
                <Typography variant="h4" fontWeight="bold">{value}</Typography>
                <Typography variant="body2" color="text.secondary">{title}</Typography>
            </Box>
        </Paper>
    );

    if (!user) return null;

    return (
        <Box>
            {/* Stats Dashboard */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={6} md={3}><StatCard icon={<Folder />} title="Total Projects" value={totalProjects} color="#00E5FF" /></Grid>
                <Grid item xs={6} md={3}><StatCard icon={<Dashboard />} title="Active" value={activeProjects} color="#7C4DFF" /></Grid>
                <Grid item xs={6} md={3}><StatCard icon={<CheckCircle />} title="Completed" value={completedProjects} color="#00E676" /></Grid>
                <Grid item xs={6} md={3}><StatCard icon={<Warning />} title="Urgent" value={urgentProjects} color="#FF3D00" /></Grid>
            </Grid>

            {/* Toolbar */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold">Projects Board</Typography>
                    <Typography variant="body2" color="text.secondary">Manage and track your projects</Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    {/* Search Field */}
                    <Box sx={{
                        bgcolor: 'rgba(255,255,255,0.05)',
                        borderRadius: 2,
                        px: 2,
                        py: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        border: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <Search sx={{ color: 'text.secondary', mr: 1 }} />
                        <InputBase
                            placeholder="Search projects..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            sx={{ color: '#fff' }}
                        />
                    </Box>

                    {/* Filter Status */}
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            displayEmpty
                            sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.05)', '.MuiOutlinedInput-notchedOutline': { border: 'none' } }}
                        >
                            <MenuItem value="All">All Status</MenuItem>
                            <MenuItem value="Planning">Planning</MenuItem>
                            <MenuItem value="Active">Active</MenuItem>
                            <MenuItem value="On Hold">On Hold</MenuItem>
                            <MenuItem value="Completed">Completed</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Sort By */}
                    <FormControl size="small" sx={{ minWidth: 120 }}>
                        <Select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            displayEmpty
                            sx={{ color: '#fff', bgcolor: 'rgba(255,255,255,0.05)', '.MuiOutlinedInput-notchedOutline': { border: 'none' } }}
                        >
                            <MenuItem value="Newest">Newest</MenuItem>
                            <MenuItem value="Oldest">Oldest</MenuItem>
                            <MenuItem value="Name">Name</MenuItem>
                            <MenuItem value="Priority">Priority</MenuItem>
                        </Select>
                    </FormControl>

                    <Button
                        variant="outlined"
                        onClick={() => setOpenInviteModal(true)}
                        sx={{ color: '#00E5FF', borderColor: '#00E5FF', borderRadius: 2, mr: 2, '&:hover': { borderColor: '#00E5FF', bgcolor: 'rgba(0, 229, 255, 0.1)' } }}
                    >
                        Invite Member
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setOpenModal(true)}
                        sx={{ background: 'linear-gradient(45deg, #00E5FF, #7C4DFF)', color: '#fff', px: 3, borderRadius: 2 }}
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
                                    <MuiChip size="small" label={getProjectsForColumn(column).length} sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'text.secondary' }} />
                                </Box>

                                <Droppable droppableId={column}>
                                    {(provided) => (
                                        <Box ref={provided.innerRef} {...provided.droppableProps} sx={{ minHeight: '500px' }}>
                                            {getProjectsForColumn(column).map((project, index) => {
                                                const daysLeft = getDaysLeft(project.endDate);
                                                return (
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
                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 1 }}>
                                                                    <Typography variant="h6" fontSize="0.95rem" fontWeight="600">{project.name}</Typography>
                                                                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, project)} sx={{ mt: -0.5, mr: -0.5, color: 'text.secondary' }}>
                                                                        <MoreVert fontSize="small" />
                                                                    </IconButton>
                                                                </Box>

                                                                {/* Priority Chip */}
                                                                <MuiChip
                                                                    label={project.priority || 'Medium'}
                                                                    size="small"
                                                                    sx={{
                                                                        height: 20,
                                                                        fontSize: '0.65rem',
                                                                        mb: 1.5,
                                                                        bgcolor: project.priority === 'High' ? 'rgba(255, 61, 0, 0.1)' : 'rgba(255,255,255,0.05)',
                                                                        color: project.priority === 'High' ? '#FF3D00' : 'text.secondary',
                                                                        border: project.priority === 'High' ? '1px solid rgba(255, 61, 0, 0.3)' : 'none'
                                                                    }}
                                                                />

                                                                {/* Progress Bar */}
                                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                                    <Box sx={{ width: '100%', mr: 1 }}>
                                                                        <LinearProgress variant="determinate" value={project.progress} sx={{ height: 6, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: project.progress === 100 ? 'success.main' : 'primary.main' } }} />
                                                                    </Box>
                                                                    <Typography variant="caption" color="text.secondary">{`${Math.round(project.progress)}%`}</Typography>
                                                                </Box>

                                                                {/* Footer: Date and Team */}
                                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                                                                    {project.endDate ? (
                                                                        <MuiChip
                                                                            icon={<AccessTime sx={{ fontSize: '14px !important' }} />}
                                                                            label={daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft} days left`}
                                                                            size="small"
                                                                            color={getDaysLeftColor(daysLeft)}
                                                                            variant="outlined"
                                                                            sx={{ fontSize: '0.7rem', height: 22 }}
                                                                        />
                                                                    ) : (
                                                                        <Typography variant="caption" color="text.secondary">No date</Typography>
                                                                    )}

                                                                    <AvatarGroup max={3} sx={{ '& .MuiAvatar-root': { width: 24, height: 24, fontSize: '0.75rem', borderColor: '#1E2538' } }}>
                                                                        {project.manager && <Avatar src={project.manager.avatar} alt={project.manager.name}>{project.manager.name?.[0]}</Avatar>}
                                                                    </AvatarGroup>
                                                                </Box>
                                                            </Paper>
                                                        )}
                                                    </Draggable>
                                                );
                                            })}
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
            <InviteMemberModal open={openInviteModal} onClose={() => setOpenInviteModal(false)} />

            {/* Edit Modal */}
            <EditProjectModal
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
                project={selectedProject}
                onProjectUpdated={fetchProjects}
            />

            {/* Quick Actions Menu */}
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{ sx: { bgcolor: '#1E2538', color: '#fff' } }}
            >
                <MenuItem onClick={handleEditOpen}>Edit Details</MenuItem>
                <MenuItem onClick={() => navigate(`/manage/${selectedProject?._id}`)}>Manage Members</MenuItem>
                <MenuItem onClick={handleDeleteProject} sx={{ color: 'error.main' }}>Delete Project</MenuItem>
            </Menu>
        </Box>
    );
};

export default Projects;
