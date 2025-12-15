import React, { useState, useEffect } from 'react';
import {
    Container, Typography, Box, Button, Grid, Paper, Chip,
    Dialog, DialogTitle, DialogContent, TextField, DialogActions,
    Link, Avatar, Alert
} from '@mui/material';
import { CheckCircle, Assignment, Person, Cancel, OpenInNew } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';

const CompleteTask = () => {
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        fetchReviewTasks();
    }, []);

    const fetchReviewTasks = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/tasks/manager-review`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            const data = await res.json();
            if (res.ok) {
                setTasks(data);
            } else {
                setError('Failed to fetch review tasks');
            }
        } catch (err) {
            console.error(err);
            setError('Error fetching tasks');
        }
    };

    const handleReview = async (taskId, decision) => {
        // decision: 'approve' -> Done, 'reject' -> In Progress (assigned back)
        const newStatus = decision === 'approve' ? 'Done' : 'In Progress';

        try {
            const res = await fetch(`${API_BASE_URL}/api/tasks/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${user.token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (res.ok) {
                setSuccess(`Task ${decision === 'approve' ? 'Approved' : 'Rejected'} successfully!`);
                fetchReviewTasks();
            } else {
                setError('Failed to update task');
            }
        } catch (err) {
            setError('Error updating task');
        }
    };

    return (
        <Container maxWidth="xl" sx={{ mt: 4 }}>
            <Typography variant="h4" fontWeight="bold" sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
                <CheckCircle sx={{ mr: 2, color: 'success.main' }} />
                Review Tasks
            </Typography>

            {success && <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>{success}</Alert>}
            {error && <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>{error}</Alert>}

            {tasks.length === 0 ? (
                <Box sx={{ textAlign: 'center', mt: 10, color: 'text.secondary' }}>
                    <Typography variant="h6">No tasks pending review.</Typography>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {tasks.map((task) => (
                        <Grid item xs={12} md={6} lg={4} key={task._id}>
                            <Paper sx={{ p: 3, bgcolor: '#1E2538', color: '#fff', height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                    <Chip label={task.project?.name} size="small" sx={{ bgcolor: 'rgba(0, 229, 255, 0.1)', color: '#00E5FF' }} />
                                    <Chip label="Pending Review" color="warning" size="small" />
                                </Box>

                                <Typography variant="h6" fontWeight="bold" gutterBottom>{task.title}</Typography>

                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="body2" color="#B0B3C7" sx={{ mr: 1 }}>Submitted by:</Typography>
                                    <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem', mr: 1 }}>{task.assignedTo?.name?.[0]}</Avatar>
                                    <Typography variant="body2">{task.assignedTo?.name}</Typography>
                                </Box>

                                <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2, mb: 2, flexGrow: 1 }}>
                                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>PROOF / SUBMISSION:</Typography>
                                    {task.proofUrl ? (
                                        <Link href={task.proofUrl} target="_blank" rel="noopener" sx={{ display: 'flex', alignItems: 'center', color: '#00E5FF' }}>
                                            Open Submission <OpenInNew sx={{ fontSize: 16, ml: 1 }} />
                                        </Link>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">No URL provided.</Typography>
                                    )}
                                    {task.submissionNotes && (
                                        <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic', bgcolor: 'rgba(0,0,0,0.2)', p: 1, borderRadius: 1 }}>
                                            Note: "{task.submissionNotes}"
                                        </Typography>
                                    )}
                                </Box>

                                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        fullWidth
                                        startIcon={<Cancel />}
                                        onClick={() => handleReview(task._id, 'reject')}
                                    >
                                        Reject
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="success"
                                        fullWidth
                                        startIcon={<CheckCircle />}
                                        onClick={() => handleReview(task._id, 'approve')}
                                    >
                                        Approve
                                    </Button>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Container>
    );
};

export default CompleteTask;
