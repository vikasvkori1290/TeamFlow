import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, MenuItem, Grid, IconButton, Avatar, Chip, Autocomplete, Select, FormControl, InputLabel } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import API_BASE_URL from '../config';

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

const EditProjectModal = ({ open, onClose, onProjectUpdated, project }) => {
    const [allUsers, setAllUsers] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        color: '#2E7D32',
        priority: 'Medium',
        manager: null,
        members: [],
    });

    useEffect(() => {
        if (open) {
            fetchUsers();
            if (project) {
                setFormData({
                    name: project.name || '',
                    description: project.description || '',
                    startDate: project.startDate ? project.startDate.split('T')[0] : '',
                    endDate: project.endDate ? project.endDate.split('T')[0] : '',
                    color: project.color || '#2E7D32',
                    priority: project.priority || 'Medium',
                    manager: project.manager || null,
                    members: project.members || [],
                });
            }
        }
    }, [open, project]);

    const fetchUsers = async () => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        try {
            const response = await fetch(`${API_BASE_URL}/api/users`, {
                headers: { Authorization: `Bearer ${storedUser.token}` },
            });
            const data = await response.json();
            if (response.ok) setAllUsers(data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleColorSelect = (color) => {
        setFormData({ ...formData, color });
    };

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleUpdate = async () => {
        setLoading(true);
        setError('');
        const storedUser = JSON.parse(localStorage.getItem('user'));
        try {
            const response = await fetch(`${API_BASE_URL}/api/projects/${project._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${storedUser.token}`,
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();

            if (response.ok) {
                onProjectUpdated();
                onClose();
            } else {
                setError(data.message || 'Failed to update project');
            }
        } catch (error) {
            console.error('Error updating project:', error);
            setError('Server error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">Edit Project</Typography>
                    <IconButton onClick={onClose} sx={{ color: '#fff' }}><CloseIcon /></IconButton>
                </Box>

                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Project Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            InputProps={{ style: { color: '#fff' } }}
                            InputLabelProps={{ style: { color: '#B0B3C7' } }}
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
                            InputProps={{ style: { color: '#fff' } }}
                            InputLabelProps={{ style: { color: '#B0B3C7' } }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth
                            type="date"
                            label="Start Date"
                            name="startDate"
                            InputLabelProps={{ shrink: true, style: { color: '#B0B3C7' } }}
                            InputProps={{ style: { color: '#fff' } }}
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
                            InputLabelProps={{ shrink: true, style: { color: '#B0B3C7' } }}
                            InputProps={{ style: { color: '#fff' } }}
                            value={formData.endDate}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <FormControl fullWidth>
                            <InputLabel style={{ color: '#B0B3C7' }}>Priority</InputLabel>
                            <Select
                                name="priority"
                                value={formData.priority}
                                label="Priority"
                                onChange={handleChange}
                                sx={{ color: '#fff', '.MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(255,255,255,0.2)' } }}
                            >
                                <MenuItem value="Low">Low</MenuItem>
                                <MenuItem value="Medium">Medium</MenuItem>
                                <MenuItem value="High">High</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6}>
                        {/* Spacer for color label alignment logic if needed, or put color here */}
                        <Typography variant="subtitle2" gutterBottom sx={{ color: '#B0B3C7' }}>Theme Color</Typography>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            {colors.slice(0, 5).map((c) => ( // limit visual clutter
                                <Box
                                    key={c}
                                    onClick={() => handleColorSelect(c)}
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: '50%',
                                        bgcolor: c,
                                        cursor: 'pointer',
                                        border: formData.color === c ? '3px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                                    }}
                                />
                            ))}
                        </Box>
                    </Grid>

                    {/* Manager Selection */}
                    <Grid item xs={12}>
                        <Autocomplete
                            fullWidth
                            options={allUsers}
                            getOptionLabel={(option) => option.name || ''}
                            value={formData.manager}
                            isOptionEqualToValue={(option, value) => option._id === value._id}
                            onChange={(event, newValue) => {
                                setFormData({ ...formData, manager: newValue });
                            }}
                            renderInput={(params) => <TextField {...params} label="Project Manager" fullWidth InputLabelProps={{ style: { color: '#B0B3C7' } }} InputProps={{ ...params.InputProps, style: { color: '#fff' } }} />}
                            renderOption={(props, option) => (
                                <Box component="li" {...props}>
                                    <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: 'primary.main' }}>{option.name[0]}</Avatar>
                                    {option.name}
                                </Box>
                            )}
                        />
                    </Grid>

                    {/* Team Members Selection */}
                    <Grid item xs={12}>
                        <Autocomplete
                            multiple
                            fullWidth
                            options={allUsers}
                            getOptionLabel={(option) => option.name || ''}
                            value={formData.members}
                            isOptionEqualToValue={(option, value) => option._id === value._id}
                            onChange={(event, newValue) => {
                                setFormData({ ...formData, members: newValue });
                            }}
                            renderInput={(params) => <TextField {...params} label="Team Members" fullWidth InputLabelProps={{ style: { color: '#B0B3C7' } }} InputProps={{ ...params.InputProps, style: { color: '#fff' } }} />}
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
                                        sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                                    />
                                ))
                            }
                        />
                        {/* Note: Autocomplete creates specific UI issues with complex styling in dark mode sometimes, handling generically. */}
                    </Grid>
                    {error && (
                        <Grid item xs={12}>
                            <Typography color="error" variant="body2">{error}</Typography>
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <Button variant="contained" fullWidth onClick={handleUpdate} disabled={!formData.name || loading}>
                            {loading ? 'Updating...' : 'Update Project'}
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        </Modal>
    );
};

export default EditProjectModal;
