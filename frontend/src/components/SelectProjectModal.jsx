import React, { useEffect, useState } from 'react';
import { Modal, Box, Typography, List, ListItem, ListItemText, ListItemAvatar, Avatar, CircularProgress, Button } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: '#1E2538',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: 24,
    borderRadius: 2,
    p: 4,
    color: '#fff',
    maxHeight: '80vh',
    overflowY: 'auto'
};

const SelectProjectModal = ({ open, onClose }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (open) {
            fetchProjects();
        }
    }, [open]);

    const fetchProjects = async () => {
        setLoading(true);
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/projects`, {
                headers: { Authorization: `Bearer ${storedUser.token}` },
            });
            const data = await response.json();
            if (response.ok) setProjects(data);
        } catch (error) {
            console.error('Error fetching projects:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelect = (projectId) => {
        navigate(`/collab/${projectId}`);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={style}>
                <Typography variant="h6" component="h2" gutterBottom fontWeight="bold">
                    Select a Project to Collaborate
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                    Choose a workspace to open the whiteboard.
                </Typography>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : projects.length === 0 ? (
                    <Typography align="center" sx={{ py: 3, color: 'text.secondary' }}>No projects found.</Typography>
                ) : (
                    <List sx={{ width: '100%', bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 1 }}>
                        {projects.map((project) => (
                            <ListItem
                                button
                                key={project._id}
                                onClick={() => handleSelect(project._id)}
                                sx={{
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
                                    borderBottom: '1px solid rgba(255,255,255,0.05)'
                                }}
                            >
                                <ListItemAvatar>
                                    <Avatar sx={{ bgcolor: 'transparent', color: '#00E5FF' }}>
                                        <FolderIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={project.name}
                                    secondary={<Typography variant="caption" color="text.secondary">{project.description?.substring(0, 30)}...</Typography>}
                                />
                            </ListItem>
                        ))}
                    </List>
                )}

                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button onClick={onClose} sx={{ color: '#aaa' }}>Cancel</Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default SelectProjectModal;
