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

    useEffect(() => {
        fetchTasks();
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
            <Paper sx={{ p: 2, bgcolor: '#f5f5f5', minHeight: '400px' }}>
                <Typography variant="h6" gutterBottom sx={{ borderBottom: `3px solid ${color}`, pb: 1 }}>
                    {title} ({filterTasks(status).length})
                </Typography>
                {filterTasks(status).map((task) => (
                    <Paper key={task._id} sx={{ p: 2, mb: 2, borderLeft: `4px solid ${color}` }}>
                        <Typography variant="subtitle1" fontWeight="bold">{task.title}</Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>{task.description}</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="caption" sx={{ bgcolor: '#eee', p: 0.5, borderRadius: 1 }}>{task.priority}</Typography>
                            {task.dueDate && (
                                <Typography variant="caption" color="text.secondary">
                                    {new Date(task.dueDate).toLocaleDateString()}
                                </Typography>
                            )}
                        </Box>
                    </Paper>
                ))}
            </Paper>
        </Grid>
    );

    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Button variant="outlined" onClick={() => navigate('/dashboard')}>
                    Back to Dashboard
                </Button>
                <Button variant="contained" onClick={() => setOpen(true)}>
                    Add Task
                </Button>
            </Box>

            <Grid container spacing={2}>
                <TaskColumn title="To Do" status="To Do" color="#e0e0e0" />
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
