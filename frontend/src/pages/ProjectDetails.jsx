import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Box, Grid, Paper, Modal, TextField, MenuItem, Select, FormControl, InputLabel, InputAdornment } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import SearchIcon from '@mui/icons-material/Search';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#1E2538', // Dark theme modal
    color: '#fff',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
    border: '1px solid rgba(255,255,255,0.1)'
};

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
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

    const onDragEnd = async (result) => {
        const { destination, source, draggableId } = result;

        // Dropped outside or same position
        if (!destination) return;
        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        // Optimistic Update
        const newStatus = destination.droppableId;
        const updatedTasks = tasks.map(task =>
            task._id === draggableId ? { ...task, status: newStatus } : task
        );
        setTasks(updatedTasks);

        // API Call
        const storedUser = JSON.parse(localStorage.getItem('user'));
        try {
            await fetch(`http://localhost:5000/api/tasks/${draggableId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${storedUser.token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });
        } catch (error) {
            console.error('Error updating task status:', error);
            fetchTasks(); // Revert on error
        }
    };

    const filterTasks = (status) => {
        return tasks
            .filter((task) => task.status === status)
            .filter((task) => task.title.toLowerCase().includes(searchTerm.toLowerCase()));
    };

    const TaskColumn = ({ title, status, color }) => (
        <Grid item xs={12} md={3}>
            <Box sx={{ bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 4, p: 2, minHeight: '500px', height: '100%', border: '1px solid rgba(255,255,255,0.05)' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: 1 }}>
                        {title}
                    </Typography>
                    <Typography variant="caption" sx={{ bgcolor: color, color: '#fff', px: 1, borderRadius: 1, fontWeight: 'bold' }}>
                        {filterTasks(status).length}
                    </Typography>
                </Box>

                <Droppable droppableId={status}>
                    {(provided, snapshot) => (
                        <Box
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            sx={{
                                minHeight: '400px',
                                transition: 'background-color 0.2s ease',
                                bgcolor: snapshot.isDraggingOver ? 'rgba(255,255,255,0.05)' : 'transparent',
                                borderRadius: 2
                            }}
                        >
                            {filterTasks(status).map((task, index) => (
                                <Draggable key={task._id} draggableId={task._id} index={index}>
                                    {(provided, snapshot) => (
                                        <Paper
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            sx={{
                                                p: 2, mb: 2,
                                                borderLeft: `4px solid ${color}`,
                                                bgcolor: '#1E2538',
                                                color: '#fff',
                                                ...provided.draggableProps.style, // Essential for DnD
                                                opacity: snapshot.isDragging ? 0.8 : 1,
                                                boxShadow: snapshot.isDragging ? '0 10px 20px rgba(0,0,0,0.5)' : '0 2px 4px rgba(0,0,0,0.2)',
                                                '&:hover': { bgcolor: '#2C354A' }
                                            }}
                                        >
                                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>{task.title}</Typography>
                                            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{task.description}</Typography>
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="caption" sx={{
                                                    bgcolor: task.priority === 'High' ? 'rgba(211, 47, 47, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                                                    color: task.priority === 'High' ? '#FF5252' : 'text.secondary',
                                                    px: 1, py: 0.5, borderRadius: 1,
                                                    border: task.priority === 'High' ? '1px solid #FF5252' : 'none'
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
                                    )}
                                </Draggable>
                            ))}
                            {provided.placeholder}
                        </Box>
                    )}
                </Droppable>
            </Box>
        </Grid>
    );

    return (
        <Container maxWidth="xl" sx={{ mt: 2, pb: 5 }}>
            {/* Header & Controls */}
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', mb: 4, alignItems: 'center', gap: 2 }}>
                <Box>
                    <Button
                        onClick={() => navigate('/projects/board')}
                        sx={{ color: 'text.secondary', mb: 1, p: 0, justifyContent: 'flex-start', '&:hover': { bgcolor: 'transparent', color: '#fff' } }}
                    >
                        ← Back to Board
                    </Button>
                    <Typography variant="h4" fontWeight="bold" sx={{ background: 'linear-gradient(45deg, #FFF, #CCC)', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        {project?.name || 'Loading...'}
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', width: { xs: '100%', md: 'auto' } }}>
                    <TextField
                        placeholder="Search tasks..."
                        size="small"
                        variant="outlined"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        sx={{
                            width: 250,
                            '& .MuiOutlinedInput-root': {
                                color: '#fff',
                                bgcolor: 'rgba(255,255,255,0.05)',
                                '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ color: 'text.secondary' }} />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <Button
                        variant="contained"
                        onClick={() => setOpen(true)}
                        sx={{ background: 'linear-gradient(45deg, #00E5FF, #7C4DFF)', color: '#fff', px: 4 }}
                    >
                        Add Task
                    </Button>
                </Box>
            </Box>

            {/* Kanban Board */}
            <DragDropContext onDragEnd={onDragEnd}>
                <Grid container spacing={3}>
                    <TaskColumn title="To Do" status="To Do" color="#fff" />
                    <TaskColumn title="In Progress" status="In Progress" color="#2196f3" />
                    <TaskColumn title="Pending Review" status="Pending Review" color="#ff9800" />
                    <TaskColumn title="Done" status="Done" color="#4caf50" />
                </Grid>
            </DragDropContext>

            {/* Create Task Modal */}
            <Modal open={open} onClose={() => setOpen(false)}>
                <Box sx={style}>
                    <Typography variant="h6" mb={3} fontWeight="bold">Create New Task</Typography>
                    <TextField
                        fullWidth
                        label="Task Title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        margin="normal"
                        variant="filled"
                        sx={{ bgcolor: 'rgba(255,255,255,0.05)', input: { color: '#fff' }, label: { color: '#aaa' } }}
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        multiline
                        rows={3}
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        margin="normal"
                        variant="filled"
                        sx={{ bgcolor: 'rgba(255,255,255,0.05)', textarea: { color: '#fff' }, label: { color: '#aaa' } }}
                    />
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={6}>
                            <FormControl fullWidth variant="filled" sx={{ bgcolor: 'rgba(255,255,255,0.05)' }}>
                                <InputLabel sx={{ color: '#aaa' }}>Priority</InputLabel>
                                <Select
                                    value={newTask.priority}
                                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                                    sx={{ color: '#fff', svg: { color: '#fff' } }}
                                >
                                    <MenuItem value="Low">Low</MenuItem>
                                    <MenuItem value="Medium">Medium</MenuItem>
                                    <MenuItem value="High">High</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Due Date"
                                InputLabelProps={{ shrink: true, sx: { color: '#aaa' } }}
                                value={newTask.dueDate}
                                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                                variant="filled"
                                sx={{ bgcolor: 'rgba(255,255,255,0.05)', input: { color: '#fff' } }}
                            />
                        </Grid>
                    </Grid>

                    <Button fullWidth variant="contained" onClick={handleCreateTask} sx={{ mt: 4, py: 1.5, background: 'linear-gradient(45deg, #00E5FF, #7C4DFF)', fontWeight: 'bold' }}>
                        Create Task
                    </Button>
                </Box>
            </Modal>
        </Container>
    );
};

export default ProjectDetails;
