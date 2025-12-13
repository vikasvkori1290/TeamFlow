import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Box, Button, Grid, Paper, Chip,
    Dialog, DialogTitle, DialogContent, TextField, DialogActions,
    IconButton, Alert
} from '@mui/material';
import { Assignment, CheckCircle, PlayArrow, UploadFile, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ViewTask = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [openSubmitDialog, setOpenSubmitDialog] = useState(false);
    const [submissionData, setSubmissionData] = useState({ proofUrl: '', notes: '' });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchMyTasks();
    }, []);

    const fetchMyTasks = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/tasks/my-tasks', {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            const data = await res.json();
            if (res.ok) {
                setTasks(data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleStartTask = async (task) => {
        try {
            const res = await fetch(`http://localhost:5000/api/tasks/${task._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ status: 'In Progress' }),
            });
            if (res.ok) {
                setSuccess('Task started!');
                fetchMyTasks();
            }
        } catch (err) {
            setError('Failed to start task');
        }
    };

    const handleSubmitClick = (task) => {
        setSelectedTask(task);
        setOpenSubmitDialog(true);
    };

    const handleSubmission = async () => {
        if (!submissionData.proofUrl) {
            setError('Please provide a proof link or file URL');
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/api/tasks/${selectedTask._id}/submit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({
                    proofUrl: submissionData.proofUrl,
                    submissionNotes: submissionData.notes,
                }),
            });

            if (res.ok) {
                setSuccess('Task submitted successfully!');
                setOpenSubmitDialog(false);
                setSubmissionData({ proofUrl: '', notes: '' });
                fetchMyTasks();
            } else {
                setError('Submission failed');
            }
        } catch (err) {
            setError('Error submitting task');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'To Do': return 'default';
            case 'In Progress': return 'primary';
            case 'Pending Review': return 'warning';
            case 'Done': return 'success';
            default: return 'default';
        }
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                <Assignment sx={{ mr: 2, color: 'primary.main' }} />
                My Tasks
            </Typography>

            {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>{success}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}

            <Grid container spacing={3}>
                {tasks.map((task) => (
                    <Grid item xs={12} md={6} lg={4} key={task._id}>
                        <Paper sx={{ p: 3, bgcolor: '#1E2538', color: '#fff', height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Chip label={task.status} color={getStatusColor(task.status)} size="small" />
                                <Chip label={task.priority} color={task.priority === 'High' ? 'error' : 'default'} variant="outlined" size="small" />
                            </Box>

                            <Typography variant="h6" fontWeight="bold" gutterBottom>{task.title}</Typography>
                            <Typography variant="body2" color="#B0B3C7" sx={{ mb: 2, flexGrow: 1 }}>{task.description}</Typography>

                            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                                <Typography variant="caption" display="block" color="#B0B3C7">Project: {task.project?.name}</Typography>
                                <Typography variant="caption" display="block" color="#B0B3C7">Due: {new Date(task.dueDate).toLocaleDateString()}</Typography>
                            </Box>

                            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                                {task.status === 'To Do' && (
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        color="primary"
                                        startIcon={<PlayArrow />}
                                        onClick={() => handleStartTask(task)}
                                    >
                                        Start
                                    </Button>
                                )}

                                {(task.status === 'In Progress' || task.status === 'To Do') && (
                                    <Button
                                        variant="outlined"
                                        fullWidth
                                        color="success"
                                        startIcon={<UploadFile />}
                                        onClick={() => handleSubmitClick(task)}
                                    >
                                        Submit
                                    </Button>
                                )}

                                {task.status === 'Pending Review' && (
                                    <Button fullWidth disabled variant="outlined">Under Review</Button>
                                )}
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

            {/* Submission Modal */}
            <Dialog open={openSubmitDialog} onClose={() => setOpenSubmitDialog(false)} PaperProps={{ sx: { bgcolor: '#1E2538', color: '#fff' } }}>
                <DialogTitle>Submit Task</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="#B0B3C7" sx={{ mb: 2 }}>
                        Attach your work proof (Link to Drive, Figma, GitHub, etc.)
                    </Typography>
                    <TextField
                        fullWidth
                        label="Proof URL / Link"
                        variant="outlined"
                        value={submissionData.proofUrl}
                        onChange={(e) => setSubmissionData({ ...submissionData, proofUrl: e.target.value })}
                        sx={{ mb: 2, input: { color: '#fff' }, label: { color: '#B0B3C7' }, fieldset: { borderColor: 'rgba(255,255,255,0.2)' } }}
                    />
                    <TextField
                        fullWidth
                        label="Notes (Optional)"
                        multiline
                        rows={3}
                        value={submissionData.notes}
                        onChange={(e) => setSubmissionData({ ...submissionData, notes: e.target.value })}
                        sx={{ input: { color: '#fff' }, textarea: { color: '#fff' }, label: { color: '#B0B3C7' }, fieldset: { borderColor: 'rgba(255,255,255,0.2)' } }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenSubmitDialog(false)} sx={{ color: '#B0B3C7' }}>Cancel</Button>
                    <Button onClick={handleSubmission} variant="contained" color="success">Submit</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ViewTask;
