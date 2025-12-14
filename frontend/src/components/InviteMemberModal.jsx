import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, MenuItem, Select, FormControl, InputLabel } from '@mui/material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#1E2538', // Dark theme background
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

const InviteMemberModal = ({ open, onClose }) => {
    const [projects, setProjects] = useState([]);
    const [formData, setFormData] = useState({
        recipientEmail: '',
        projectId: '',
        skill: ''
    });

    useEffect(() => {
        if (open) {
            fetchMyProjects();
        }
    }, [open]);

    const fetchMyProjects = async () => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        try {
            const response = await fetch('http://localhost:5000/api/projects', {
                headers: { Authorization: `Bearer ${storedUser.token}` },
            });
            const data = await response.json();
            if (response.ok) {
                // Only allow inviting to projects where I am the manager or creator
                // Assuming the backend returns all projects I have access to, filter client side if needed
                // For now, let's show all projects returned (assuming 'Manage Project' logic)
                setProjects(data);
            }
        } catch (error) {
            console.error('Error loading projects', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        try {
            const response = await fetch('http://localhost:5000/api/invitations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${storedUser.token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                alert('Invitation sent successfully!');
                setFormData({ recipientEmail: '', projectId: '', skill: '' });
                onClose();
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to send invitation');
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong');
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" component="h2" mb={3}>
                    Invite Team Member
                </Typography>

                <TextField
                    fullWidth
                    label="Email Address"
                    name="recipientEmail"
                    value={formData.recipientEmail}
                    onChange={handleChange}
                    sx={{ mb: 2, '& .MuiInputBase-input': { color: '#fff' }, '& .MuiInputLabel-root': { color: 'text.secondary' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
                />

                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel sx={{ color: 'text.secondary' }}>Select Project</InputLabel>
                    <Select
                        name="projectId"
                        value={formData.projectId}
                        label="Select Project"
                        onChange={handleChange}
                        sx={{ color: '#fff', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' }, '& .MuiSvgIcon-root': { color: '#fff' } }}
                    >
                        {projects.map((project) => (
                            <MenuItem key={project._id} value={project._id}>
                                {project.name}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField
                    fullWidth
                    label="Skill / Role"
                    name="skill"
                    value={formData.skill}
                    onChange={handleChange}
                    placeholder="e.g. Frontend Dev, Designer"
                    sx={{ mb: 3, '& .MuiInputBase-input': { color: '#fff' }, '& .MuiInputLabel-root': { color: 'text.secondary' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
                />

                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSubmit}
                    sx={{
                        background: 'linear-gradient(45deg, #00E5FF, #7C4DFF)',
                        color: '#fff',
                        fontWeight: 'bold',
                        py: 1.5
                    }}
                >
                    Send Invitation
                </Button>
            </Box>
        </Modal>
    );
};

export default InviteMemberModal;
