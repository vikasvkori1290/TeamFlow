import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Box, Grid, Paper, Modal, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [open, setOpen] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        priority: 'Medium',
        dueDate: '',
    });

    const [project, setProject] = useState(null);

    useEffect(() => {
        const fetchProjectDetails = async () => {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            try {
                const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
                    headers: { Authorization: `Bearer ${storedUser.token}` },
                });
                const data = await response.json();
                if (response.ok) setProject(data);
            } catch (error) {
                console.error('Error fetching project:', error);
            }
        };

        if (id) {
            fetchProjectDetails();
            fetchTasks();
        }
    }, [id]);

    const fetchTasks = async () => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) return;

        try {
            const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
                headers: {
                    Authorization: `Bearer ${storedUser.token}`,
                },
            });
            const data = await response.json();
            if (response.ok) {
                setTasks(data);
            }
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleCreateTask = async () => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        try {
            const response = await fetch('http://localhost:5000/api/tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${storedUser.token}`,
                },
                body: JSON.stringify({ ...newTask, project: id }),
            });

            if (response.ok) {
                setNewTask({ title: '', description: '', priority: 'Medium', dueDate: '' });
                setOpen(false);
                fetchTasks();
            }
        } catch (error) {
            console.error('Error creating task:', error);
        }
    };

    const filterTasks = (status) => tasks.filter((task) => task.status === status);

    const TaskColumn = ({ title, status, color }) => (
        <Grid item xs={12} md={3}>
            <Box sx={{ bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 4, p: 2, minHeight: '200px', height: 'fit-content' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 1 }}>
                        {title}
                    </Typography>
                    <Typography variant="caption" sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'text.secondary', px: 1, borderRadius: 1 }}>
                        {filterTasks(status).length}
                    </Typography>
                </Box>

                {filterTasks(status).map((task) => (
                    <Paper
                        key={task._id}
                        sx={{
                            p: 2, mb: 2,
                            borderLeft: `4px solid ${color}`,
                            bgcolor: '#1E2538',
                            color: '#fff',
                            transition: 'transform 0.2s',
                            '&:hover': { transform: 'translateY(-2px)' }
                        }}
                    >
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>{task.title}</Typography>
                        <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>{task.description}</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" sx={{
                                bgcolor: task.priority === 'High' ? 'rgba(211, 47, 47, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                                color: task.priority === 'High' ? 'error.main' : 'text.secondary',
                                px: 1, py: 0.5, borderRadius: 1
                            }}>
                                {task.priority}
                            </Typography>
                            {task.dueDate && (
                                <Typography variant="caption" color="text.secondary">
                                    {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </Typography>
                            )}
                        </Box>
                    </Paper>
                ))}
            </Box>
        </Grid>
    );

    return (
        <Container maxWidth="xl" sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, alignItems: 'center' }}>
                <Box>
                    <Button
                        onClick={() => navigate('/projects/board')}
                        sx={{ color: 'text.secondary', mb: 1, p: 0, justifyContent: 'flex-start', '&:hover': { bgcolor: 'transparent', color: '#fff' } }}
                    >
                        ← Back to Board
                    </Button>
                    <Typography variant="h4" fontWeight="bold">{project?.name || 'Loading...'}</Typography>
                </Box>
                <Button
                    variant="contained"
                    onClick={() => setOpen(true)}
                    sx={{ background: 'linear-gradient(45deg, #00E5FF, #7C4DFF)', color: '#fff' }}
                >
                    Add Task
                </Button>
            </Box>

            <Grid container spacing={3}>
                <TaskColumn title="To Do" status="To Do" color="#fff" />
                <TaskColumn title="In Progress" status="In Progress" color="#2196f3" />
                <TaskColumn title="Pending Review" status="Pending Review" color="#ff9800" />
                <TaskColumn title="Done" status="Done" color="#4caf50" />
            </Grid>

            <Modal open={open} onClose={() => setOpen(false)}>
                <Box sx={style}>
                    <Typography variant="h6" mb={2}>Add New Task</Typography>
                    <TextField
                        fullWidth
                        label="Title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        multiline
                        rows={2}
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        margin="normal"
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Priority</InputLabel>
                        <Select
                            value={newTask.priority}
                            label="Priority"
                            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                        >
                            <MenuItem value="Low">Low</MenuItem>
                            <MenuItem value="Medium">Medium</MenuItem>
                            <MenuItem value="High">High</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        fullWidth
                        type="date"
                        label="Due Date"
                        InputLabelProps={{ shrink: true }}
                        value={newTask.dueDate}
                        onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                        margin="normal"
                    />
                    <Button fullWidth variant="contained" onClick={handleCreateTask} sx={{ mt: 2 }}>
                        Create Task
                    </Button>
                </Box>
            </Modal>
        </Container>
    );
};

export default ProjectDetails;
