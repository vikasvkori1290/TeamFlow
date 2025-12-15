import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container, Badge, IconButton, Popover, List, ListItem, ListItemText, Divider, Avatar, ListItemAvatar } from '@mui/material';
import { styled } from '@mui/system';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Notifications as NotificationsIcon, Circle as CircleIcon } from '@mui/icons-material';
import CreateProjectModal from '../CreateProjectModal';
import SelectProjectModal from '../SelectProjectModal';
import API_BASE_URL from '../../config';

const StyledAppBar = styled(AppBar)({
    backgroundColor: '#0B0F19',
    boxShadow: 'none',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    color: '#fff',
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
    const [openCollabModal, setOpenCollabModal] = useState(false);
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
            const response = await fetch(`${API_BASE_URL}/api/notifications`, {
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

    const handleNotifOpen = (event) => setNotifAnchorEl(event.currentTarget);
    const handleNotifClose = () => setNotifAnchorEl(null);

    const onLogout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    const markAsRead = async (id) => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        try {
            await fetch(`${API_BASE_URL}/api/notifications/${id}/read`, {
                method: 'PUT',
                headers: { Authorization: `Bearer ${storedUser.token}` },
            });
            const updatedNotifs = notifications.map(n => n._id === id ? { ...n, read: true } : n);
            setNotifications(updatedNotifs);
            setUnreadCount(updatedNotifs.filter(n => !n.read).length);
        } catch (error) {
            console.error(error);
        }
    };

    const handleInvitationResponse = async (notification, status) => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const invitationId = notification.link;
        try {
            const response = await fetch(`${API_BASE_URL}/api/invitations/${invitationId}/respond`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${storedUser.token}` },
                body: JSON.stringify({ status })
            });
            if (response.ok) {
                await markAsRead(notification._id);
                if (status === 'accepted') window.location.reload();
            } else {
                alert('Failed to respond');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleRestrictedClick = (path) => {
        if (user) {
            navigate(path);
        } else {
            navigate('/signup');
        }
    };

    const handleCollabClick = () => {
        if (user) {
            setOpenCollabModal(true);
        } else {
            // Guest -> Go to Local Whiteboard
            navigate('/collab/local');
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
                        <NavButton onClick={() => {
                            const aboutSection = document.getElementById('about-us');
                            if (aboutSection) {
                                aboutSection.scrollIntoView({ behavior: 'smooth' });
                            }
                        }}>About Us</NavButton>
                        <NavButton onClick={() => handleRestrictedClick('/task')}>Tasks</NavButton>
                        <NavButton onClick={() => handleRestrictedClick('/projects/board')}>Projects</NavButton>
                        <NavButton onClick={handleCollabClick}>Collab</NavButton>

                        {user ? (
                            <>
                                <IconButton onClick={handleNotifOpen} sx={{ ml: 2, color: '#B0B3C7' }}>
                                    <Badge badgeContent={unreadCount} color="error">
                                        <NotificationsIcon />
                                    </Badge>
                                </IconButton>
                                <Popover
                                    open={Boolean(notifAnchorEl)}
                                    anchorEl={notifAnchorEl}
                                    onClose={handleNotifClose}
                                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                                >
                                    <Box sx={{ width: 320, maxHeight: 400, overflow: 'auto' }}>
                                        <Typography variant="subtitle1" sx={{ p: 2, fontWeight: 'bold' }}>Notifications</Typography>
                                        <Divider />
                                        {notifications.length === 0 ? <Typography sx={{ p: 2, color: 'text.secondary' }}>No notifications</Typography> : (
                                            <List sx={{ p: 0 }}>
                                                {notifications.map((notif) => (
                                                    <ListItem key={notif._id} alignItems="flex-start" sx={{ bgcolor: notif.read ? 'inherit' : 'rgba(46, 125, 50, 0.08)', flexDirection: 'column' }}>
                                                        <Box sx={{ display: 'flex', width: '100%', alignItems: 'flex-start' }} onClick={() => markAsRead(notif._id)}>
                                                            <ListItemText primary={notif.message} secondary={new Date(notif.createdAt).toLocaleDateString()} />
                                                            {!notif.read && <CircleIcon sx={{ fontSize: 10, color: 'primary.main', mt: 1 }} />}
                                                        </Box>
                                                        {notif.type === 'project_invite' && !notif.read && (
                                                            <Box sx={{ mt: 1, display: 'flex', gap: 1, width: '100%', justifyContent: 'flex-end' }}>
                                                                <Button size="small" variant="outlined" color="error" onClick={() => handleInvitationResponse(notif, 'rejected')}>Reject</Button>
                                                                <Button size="small" variant="contained" color="primary" onClick={() => handleInvitationResponse(notif, 'accepted')}>Accept</Button>
                                                            </Box>
                                                        )}
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
                    if (location.pathname.includes('/projects')) window.location.reload();
                }}
            />
            <SelectProjectModal
                open={openCollabModal}
                onClose={() => setOpenCollabModal(false)}
            />
        </StyledAppBar>
    );
};

export default Header;
