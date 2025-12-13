import React from 'react';
import { Box, CssBaseline, AppBar, Toolbar, Typography, Avatar, IconButton, Badge } from '@mui/material';
import Sidebar from '../components/Sidebar';
import { Notifications, Search, Settings } from '@mui/icons-material';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
    // Mock user for header - normally from Context/LocalStore
    const user = JSON.parse(localStorage.getItem('user')) || { name: 'Guest' };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
            <CssBaseline />

            {/* Fixed Sidebar */}
            <Box component="nav" sx={{ width: 260, flexShrink: 0, borderRight: '1px solid rgba(255,255,255,0.05)' }}>
                <Sidebar />
            </Box>

            {/* Main Content Area */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <AppBar position="sticky" sx={{ width: '100%', bgcolor: 'background.default', borderBottom: 'none', py: 1 }}>
                    <Toolbar sx={{ justifyContent: 'space-between' }}>
                        {/* Search Bar Placeholder */}
                        <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#111625', borderRadius: 4, px: 2, py: 0.5, width: 400 }}>
                            <Search sx={{ color: 'text.secondary', mr: 1 }} />
                            <Typography sx={{ color: 'text.secondary', fontSize: '0.9rem' }}>Search tasks, files, or projects...</Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Box sx={{ textAlign: 'right', mr: 1 }}>
                                <Typography variant="subtitle2" sx={{ color: '#fff' }}>{user.name}</Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>Admin</Typography>
                            </Box>
                            <Avatar sx={{ bgcolor: 'primary.main', color: '#000', fontWeight: 'bold' }}>{user.name?.[0]}</Avatar>

                            <IconButton sx={{ color: 'text.secondary' }}><Settings /></IconButton>
                            <IconButton sx={{ color: 'text.secondary' }}>
                                <Badge badgeContent={3} color="primary" variant="dot">
                                    <Notifications />
                                </Badge>
                            </IconButton>
                        </Box>
                    </Toolbar>
                </AppBar>

                {/* Page Content */}
                <Box component="main" sx={{ flexGrow: 1, p: 4, overflow: 'auto' }}>
                    <Outlet />
                </Box>
            </Box>
        </Box>
    );
};

export default DashboardLayout;
