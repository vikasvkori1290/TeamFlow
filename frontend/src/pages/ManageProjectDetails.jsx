import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper, IconButton, Button, List, ListItem, ListItemAvatar, Avatar, ListItemText, Divider, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from '@mui/material';
import { ArrowBack, PersonAdd, Delete } from '@mui/icons-material';

const ManageProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [invitations, setInvitations] = useState([]);
    const [inviteEmail, setInviteEmail] = useState('');
    const [openInvite, setOpenInvite] = useState(false);
    const [error, setError] = useState('');

    const storedUser = JSON.parse(localStorage.getItem('user'));

    const fetchData = async () => {
        try {
            // Fetch Project Details
            const projRes = await fetch(`http://localhost:5000/api/projects/${id}`, {
                headers: { Authorization: `Bearer ${storedUser.token}` }
            });
            if (projRes.ok) setProject(await projRes.json());
            else navigate('/projects/list'); // Fallback

            // Fetch Pending Invitations
            const invRes = await fetch(`http://localhost:5000/api/invitations/project/${id}`, {
                headers: { Authorization: `Bearer ${storedUser.token}` }
            });
            if (invRes.ok) setInvitations(await invRes.json());

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id]);

    const handleInvite = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/invitations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${storedUser.token}`
                },
                body: JSON.stringify({ recipientEmail: inviteEmail, projectId: id })
            });
            const data = await res.json();
            if (res.ok) {
                setOpenInvite(false);
                setInviteEmail('');
                fetchData(); // Refresh list
            } else {
                setError(data.message || 'Failed to send invitation');
            }
        } catch (err) {
            setError('Error sending invitation');
        }
    };

    const handleRemoveMember = async (memberId) => {
        if (!confirm('Are you sure you want to remove this member?')) return;
        try {
            const newMembers = project.members.filter(m => m._id !== memberId).map(m => m._id);
            const res = await fetch(`http://localhost:5000/api/projects/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${storedUser.token}`
                },
                body: JSON.stringify({ members: newMembers })
            });
            if (res.ok) fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleRevokeInvite = async (invId) => {
        if (!confirm('Revoke this invitation?')) return;
        try {
            await fetch(`http://localhost:5000/api/invitations/${invId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${storedUser.token}` }
            });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteProject = async () => {
        if (!confirm('Are you sure you want to delete this project? This cannot be undone.')) return;
        try {
            await fetch(`http://localhost:5000/api/projects/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${storedUser.token}` }
            });
            navigate('/projects/list');
        } catch (err) {
            console.error(err);
        }
    };

    if (!project) return <Box sx={{ p: 4, color: '#fff' }}>Loading...</Box>;

    return (
        <Container maxWidth="xl" sx={{ mt: 4, pb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton onClick={() => navigate('/projects/list')} sx={{ color: 'text.secondary', mr: 2 }}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="h4" fontWeight="bold">Manage {project.name}</Typography>
            </Box>

            <Paper sx={{ p: 4, bgcolor: '#1E2538', color: '#fff', mb: 4, borderRadius: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Team Members</Typography>
                    <Button variant="contained" startIcon={<PersonAdd />} onClick={() => setOpenInvite(true)}>
                        Invite Member
                    </Button>
                </Box>
                <Divider sx={{ mb: 2, borderColor: 'rgba(255,255,255,0.1)' }} />

                {/* Active Members */}
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Active Members</Typography>
                <List>
                    {project.members.map((member) => (
                        <ListItem key={member._id}
                            secondaryAction={
                                project.manager._id !== member._id && ( // Can't remove manager via this list? Or strictly self?
                                    <IconButton edge="end" color="error" onClick={() => handleRemoveMember(member._id)}>
                                        <Delete />
                                    </IconButton>
                                )
                            }
                        >
                            <ListItemAvatar>
                                <Avatar>{member.name[0]}</Avatar>
                            </ListItemAvatar>
                            <ListItemText
                                primary={member.name}
                                secondary={member.email}
                                secondaryTypographyProps={{ color: 'text.secondary' }}
                            />
                        </ListItem>
                    ))}
                    {project.members.length === 0 && <Typography color="text.secondary">No members yet.</Typography>}
                </List>

                {/* Pending Invitations */}
                {invitations.length > 0 && (
                    <>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 3 }} gutterBottom>Pending Invitations</Typography>
                        <List>
                            {invitations.map((inv) => (
                                <ListItem key={inv._id}
                                    secondaryAction={
                                        <Button size="small" color="error" onClick={() => handleRevokeInvite(inv._id)}>
                                            Revoke
                                        </Button>
                                    }
                                >
                                    <ListItemText
                                        primary={inv.recipientEmail}
                                        secondary="Invitation Sent"
                                        secondaryTypographyProps={{ color: 'text.secondary' }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </>
                )}
            </Paper>

            <Box sx={{ mt: 4 }}>
                <Button
                    variant="outlined"
                    color="error"
                    fullWidth
                    size="large"
                    onClick={handleDeleteProject}
                >
                    Delete Project
                </Button>
            </Box>

            {/* Invite Modal */}
            <Dialog open={openInvite} onClose={() => setOpenInvite(false)}>
                <DialogTitle>Invite Member</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        To invite a user to this project, please enter their email address here.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Email Address"
                        type="email"
                        fullWidth
                        variant="standard"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                    />
                    {error && <Typography color="error" variant="caption">{error}</Typography>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenInvite(false)}>Cancel</Button>
                    <Button onClick={handleInvite}>Invite</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ManageProjectDetails;
