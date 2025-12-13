import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, MenuItem, Grid, IconButton, Avatar, Chip, Autocomplete } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: '#1E2538', // Dark background
    color: '#fff',
    boxShadow: 24,
    p: 4,
    borderRadius: 4,
    border: '1px solid rgba(255,255,255,0.1)'
};

const colors = [
    '#2E7D32', // Green
    '#1976D2', // Blue
    '#D32F2F', // Red
    '#ED6C02', // Orange
    '#9C27B0', // Purple
    '#0288D1', // Light Blue
    '#7B1FA2', // Violet
];

const CreateProjectModal = ({ open, onClose, onProjectCreated }) => {
    const [allUsers, setAllUsers] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        color: '#2E7D32',
        manager: null,
        members: [],
    });

    useEffect(() => {
        if (open) {
            fetchUsers();
        }
    }, [open]);

    const fetchUsers = async () => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        try {
            const response = await fetch('http://localhost:5000/api/users', {
                headers: { Authorization: `Bearer ${storedUser.token}` },
            });
            const data = await response.json();
            if (response.ok) setAllUsers(data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    };

    // Mocking user search for UI - in real app, fetch users from API
    const [memberInput, setMemberInput] = useState('');
    const [tempMembers, setTempMembers] = useState([]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleColorSelect = (color) => {
        setFormData({ ...formData, color });
    };

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleCreate = async () => {
        setLoading(true);
        setError('');
        const storedUser = JSON.parse(localStorage.getItem('user'));
        try {
            const response = await fetch('http://localhost:5000/api/projects', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${storedUser.token}`,
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();

            if (response.ok) {
                onProjectCreated();
                setFormData({ name: '', description: '', startDate: '', endDate: '', color: '#2E7D32', manager: null, members: [] });
                onClose();
            } else {
                setError(data.message || 'Failed to create project');
            }
        } catch (error) {
            console.error('Error creating project:', error);
            setError('Server error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">Create New Project</Typography>
                    <IconButton onClick={onClose}><CloseIcon /></IconButton>
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Project Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            multiline
                            rows={3}
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            type="date"
                            label="Start Date"
                            name="startDate"
                            InputLabelProps={{ shrink: true }}
                            value={formData.startDate}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            type="date"
                            label="End Date"
                            name="endDate"
                            InputLabelProps={{ shrink: true }}
                            value={formData.endDate}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Typography variant="subtitle2" gutterBottom>Project Color</Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {colors.map((c) => (
                                <Box
                                    key={c}
                                    onClick={() => handleColorSelect(c)}
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: '50%',
                                        bgcolor: c,
                                        cursor: 'pointer',
                                        border: formData.color === c ? '3px solid #333' : '1px solid #ccc',
                                    }}
                                />
                            ))}
                        </Box>
                    </Grid>
                    {/* Manager Selection */}
                    <Grid item xs={12}>
                        <Autocomplete
                            options={allUsers}
                            getOptionLabel={(option) => option.name}
                            value={formData.manager}
                            onChange={(event, newValue) => {
                                setFormData({ ...formData, manager: newValue });
                            }}
                            renderInput={(params) => <TextField {...params} label="Project Manager" />}
                            renderOption={(props, option) => (
                                <Box component="li" {...props}>
                                    <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: 'primary.main' }}>{option.name[0]}</Avatar>
                                    {option.name} ({option.email})
                                </Box>
                            )}
                        />
                    </Grid>

                    {/* Team Members Selection */}
                    <Grid item xs={12}>
                        <Autocomplete
                            multiple
                            options={allUsers}
                            getOptionLabel={(option) => option.name}
                            value={formData.members}
                            onChange={(event, newValue) => {
                                setFormData({ ...formData, members: newValue });
                            }}
                            renderInput={(params) => <TextField {...params} label="Team Members" />}
                            renderOption={(props, option) => (
                                <Box component="li" {...props}>
                                    <Avatar sx={{ width: 24, height: 24, mr: 1 }}>{option.name[0]}</Avatar>
                                    {option.name}
                                </Box>
                            )}
                            renderTags={(value, getTagProps) =>
                                value.map((option, index) => (
                                    <Chip
                                        avatar={<Avatar>{option.name[0]}</Avatar>}
                                        label={option.name}
                                        {...getTagProps({ index })}
                                    />
                                ))
                            }
                        />
                    </Grid>
                    {error && (
                        <Grid item xs={12}>
                            <Typography color="error" variant="body2">{error}</Typography>
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <Button variant="contained" fullWidth onClick={handleCreate} disabled={!formData.name || loading}>
                            {loading ? 'Creating...' : 'Create Project'}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
};

export default CreateProjectModal;
