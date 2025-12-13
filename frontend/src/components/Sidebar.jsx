import React, { useState } from 'react';
import { Box, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material';
import { Home, AddCircle, Folder, Settings, Logout } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import CreateProjectModal from './CreateProjectModal';

const Sidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [openModal, setOpenModal] = useState(false);

    const handleCreateClick = () => {
        setOpenModal(true);
    };

    const menuItems = [
        { text: 'Home', icon: <Home />, path: '/dashboard' }, // Keeping standard Dashboard as Home logic or Widget view
        // User asked to "change the name of dashboard to create project". 
        // Assuming they mean the sidebar item that WAS "Dashboard" (which was the widgets view).
        // Since "Home" usually is the Dashboard, I will map "Create Project" to the Modal or Action.
        // But if I remove Dashboard link, they can't see the widgets.
        // I'll assume "Home" = Widget Dashboard.
        // "Create Project" = Open Modal.
        { text: 'Your Projects', icon: <Folder />, path: '/projects/board' },
        { text: 'Manage Project', icon: <Settings />, path: '/projects/list' },
    ];

    return (
        <Box sx={{ width: 260, height: '100vh', display: 'flex', flexDirection: 'column', p: 2 }}>
            {/* Logo Area */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, mt: 1, px: 2 }}>
                <img src="/logo.png" alt="TeamFlow" style={{ width: 32, height: 32, marginRight: 12 }} onError={(e) => e.target.style.display = 'none'} />
                <Typography variant="h5" sx={{ fontWeight: 'bold', background: 'linear-gradient(45deg, #00E5FF, #7C4DFF)', backgroundClip: 'text', textFillColor: 'transparent', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    TeamFlow
                </Typography>
            </Box>

            {/* Navigation */}
            <List sx={{ flexGrow: 1 }}>
                {/* Special Create Project Item */}
                <ListItem disablePadding sx={{ mb: 1 }}>
                    <ListItemButton
                        onClick={handleCreateClick}
                        sx={{
                            borderRadius: 2,
                            color: '#00E5FF',
                            bgcolor: 'rgba(0, 229, 255, 0.1)',
                            '&:hover': {
                                bgcolor: 'rgba(0, 229, 255, 0.2)',
                            },
                        }}
                    >
                        <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><AddCircle /></ListItemIcon>
                        <ListItemText primary="Create Project" primaryTypographyProps={{ fontWeight: 600 }} />
                    </ListItemButton>
                </ListItem>

                {menuItems.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton
                            onClick={() => navigate(item.path)}
                            sx={{
                                borderRadius: 2,
                                bgcolor: location.pathname === item.path ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                                color: location.pathname === item.path ? '#00E5FF' : '#B0B3C7',
                                '&:hover': {
                                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                                    color: '#fff',
                                },
                            }}
                        >
                            <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 500 }} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>

            {/* Bottom Actions */}
            <Box>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate('/login')} sx={{ borderRadius: 2, color: '#FF5252', '&:hover': { bgcolor: 'rgba(255, 82, 82, 0.1)' } }}>
                        <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}><Logout /></ListItemIcon>
                        <ListItemText primary="Log Out" primaryTypographyProps={{ fontWeight: 500 }} />
                    </ListItemButton>
                </ListItem>
            </Box>

            <CreateProjectModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onProjectCreated={() => {
                    // Refresh if on a project page
                    if (location.pathname.includes('/projects')) {
                        window.location.reload();
                    }
                }}
            />
        </Box>
    );
};

export default Sidebar;
