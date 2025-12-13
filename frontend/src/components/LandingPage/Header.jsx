import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, Menu, MenuItem, Badge, IconButton, Popover, List, ListItem, ListItemText, Divider, Avatar, ListItemAvatar } from '@mui/material';
import { styled } from '@mui/system';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Notifications as NotificationsIcon, Circle as CircleIcon, Menu as MenuIcon } from '@mui/icons-material';
import CreateProjectModal from '../CreateProjectModal';

const StyledAppBar = styled(AppBar)({
    backgroundColor: '#0B0F19', // Dark background
    boxShadow: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    color: '#fff',
});

const Logo = styled(Typography)({
    fontWeight: 700,
    fontSize: '1.5rem',
    background: 'linear-gradient(45deg, #00E5FF, #7C4DFF)', // Gradient Text
    backgroundClip: 'text',
    textFillColor: 'transparent',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    flexGrow: 1,
    cursor: 'pointer',
    textDecoration: 'none',
});

const NavButton = styled(Button)({
    textTransform: 'none',
    fontWeight: 500,
    color: '#B0B3C7',
    marginLeft: '1rem',
    '&:hover': {
        color: '#00E5FF',
        backgroundColor: 'rgba(0, 229, 255, 0.05)',
    },
});

const SignUpButton = styled(Button)({
    textTransform: 'none',
    fontWeight: 600,
    background: 'linear-gradient(45deg, #00E5FF, #7C4DFF)',
    color: '#fff',
    marginLeft: '1rem',
    padding: '8px 24px',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0, 229, 255, 0.3)',
    '&:hover': {
        boxShadow: '0 6px 16px rgba(124, 77, 255, 0.4)',
    },
});

const Header = () => {
    const [user, setUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [notifAnchorEl, setNotifAnchorEl] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            fetchNotifications(JSON.parse(storedUser));
        } else {
            setUser(null);
        }
    }, [location]);

    const fetchNotifications = async (currentUser) => {
        if (!currentUser) return;
        try {
            const response = await fetch('http://localhost:5000/api/notifications', {
                headers: { Authorization: `Bearer ${currentUser.token}` },
            });
            const data = await response.json();
            if (response.ok) {
                setNotifications(data);
                setUnreadCount(data.filter(n => !n.read).length);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleNotifOpen = (event) => {
        setNotifAnchorEl(event.currentTarget);
    };

    const handleNotifClose = () => {
        setNotifAnchorEl(null);
    };

    const handleNavigate = (path) => {
        navigate(path);
        handleMenuClose();
    };

    const onLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    const markAsRead = async (id) => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        try {
            await fetch(`http://localhost:5000/api/notifications/${id}/read`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${storedUser.token}` },
            });
            // Update local state
            const updatedNotifs = notifications.map(n => n._id === id ? { ...n, read: true } : n);
            setNotifications(updatedNotifs);
            setUnreadCount(updatedNotifs.filter(n => !n.read).length);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <StyledAppBar position="fixed">
            <Container maxWidth="lg">
                <Toolbar disableGutters sx={{ height: 80 }}>
                    <Link to="/" style={{ flexGrow: 1, display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                        <img src="/logo.png" alt="TeamFlow" style={{ height: '40px' }} />
                    </Link>

                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                        <NavButton onClick={() => navigate('/')}>Home</NavButton>
                        <NavButton>Features</NavButton>
                        <NavButton>Pricing</NavButton>
                        {user ? (
                            <>
                                <NavButton onClick={() => navigate('/projects/board')}>Projects</NavButton>

                                <IconButton onClick={handleNotifOpen} sx={{ ml: 2, color: '#B0B3C7' }}>
                                    <Badge badgeContent={unreadCount} color="error">
                                        <NotificationsIcon />
                                    </Badge>
                                </IconButton>
                                <Popover
                                    open={Boolean(notifAnchorEl)}
                                    anchorEl={notifAnchorEl}
                                    onClose={handleNotifClose}
                                    anchorOrigin={{
                                        vertical: 'bottom',
                                        horizontal: 'right',
                                    }}
                                    transformOrigin={{
                                        vertical: 'top',
                                        horizontal: 'right',
                                    }}
                                >
                                    <Box sx={{ width: 320, maxHeight: 400, overflow: 'auto' }}>
                                        <Typography variant="subtitle1" sx={{ p: 2, fontWeight: 'bold' }}>Notifications</Typography>
                                        <Divider />
                                        {notifications.length === 0 ? (
                                            <Typography sx={{ p: 2, color: 'text.secondary' }}>No notifications</Typography>
                                        ) : (
                                            <List>
                                                {notifications.map((notif) => (
                                                    <ListItem
                                                        key={notif._id}
                                                        alignItems="flex-start"
                                                        button
                                                        onClick={() => markAsRead(notif._id)}
                                                        sx={{ bgcolor: notif.read ? 'inherit' : 'rgba(46, 125, 50, 0.08)' }}
                                                    >
                                                        <ListItemText
                                                            primary={notif.message}
                                                            secondary={new Date(notif.createdAt).toLocaleDateString()}
                                                        />
                                                        {!notif.read && <CircleIcon sx={{ fontSize: 10, color: 'primary.main', mt: 1 }} />}
                                                    </ListItem>
                                                ))}
                                            </List>
                                        )}
                                    </Box>
                                </Popover>

                                <NavButton onClick={onLogout} sx={{ color: '#d32f2f', '&:hover': { color: '#b71c1c', backgroundColor: 'rgba(211, 47, 47, 0.04)' } }}>Log Out</NavButton>
                            </>
                        ) : (
                            <>
                                <NavButton component={Link} to="/login">Login</NavButton>
                                <SignUpButton variant="contained" component={Link} to="/signup">Sign Up</SignUpButton>
                            </>
                        )}
                    </Box>
                </Toolbar>
            </Container>
            <CreateProjectModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                onProjectCreated={() => {
                    // Refresh logic if needed, or just let the modal close
                    if (location.pathname.includes('/projects')) {
                        window.location.reload();
                    }
                }}
            />
        </StyledAppBar>
    );
};

export default Header;
