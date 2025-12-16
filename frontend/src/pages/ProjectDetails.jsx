import React, { useEffect, useState, useRef } from 'react';
import { Container, Typography, Button, Box, Grid, Paper, Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, CircularProgress, Link, Tabs, Tab, IconButton, Tooltip, Chip } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import DescriptionIcon from '@mui/icons-material/Description';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';
import PersonIcon from '@mui/icons-material/Person';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Delete as DeleteIcon, ExitToApp as ExitToAppIcon } from '@mui/icons-material';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import API_BASE_URL from '../config';

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [tasks, setTasks] = useState([]); // Added tasks state
    const [uploading, setUploading] = useState(false);
    const [tabValue, setTabValue] = useState(0); // Added tab state
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (id) {
            fetchProjectDetails();
            fetchDocuments();
            fetchTasks(); // Added fetch
        }
    }, [id]);

    const fetchProjectDetails = async () => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        try {
            const response = await fetch(`${API_BASE_URL}/api/projects/${id}`, {
                headers: { Authorization: `Bearer ${storedUser.token}` },
            });
            const data = await response.json();
            if (response.ok) setProject(data);
        } catch (error) {
            console.error('Error fetching project:', error);
        }
    };

    const fetchTasks = async () => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        try {
            const response = await fetch(`${API_BASE_URL}/api/tasks/${id}`, {
                headers: { Authorization: `Bearer ${storedUser.token}` },
            });
            const data = await response.json();
            if (response.ok) setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const fetchDocuments = async () => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        try {
            const response = await fetch(`${API_BASE_URL}/api/documents/${id}`, {
                headers: { Authorization: `Bearer ${storedUser.token}` },
            });
            const data = await response.json();
            if (response.ok) setDocuments(data);
        } catch (error) {
            console.error('Error fetching docs:', error);
        }
    };

    const handleFileSelect = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploading(true);
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch(`${API_BASE_URL}/api/documents/${id}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${storedUser.token}` },
                body: formData, // No Content-Type header when sending FormData!
            });

            if (response.ok) {
                fetchDocuments();
            } else {
                alert("Upload failed. Check Cloudinary keys!");
            }
        } catch (error) {
            console.error("Upload Error:", error);
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveMember = async (memberId) => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const isSelf = memberId === storedUser._id;
        const confirmMsg = isSelf ? "Are you sure you want to leave this project?" : "Are you sure you want to remove this member?";

        if (!window.confirm(confirmMsg)) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/projects/${id}/remove-member`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${storedUser.token}`
                },
                body: JSON.stringify({ memberId })
            });

            if (response.ok) {
                if (isSelf) {
                    alert('You have left the project.');
                    navigate('/projects/board'); // Redirect to board
                } else {
                    alert('Member removed successfully.');
                    fetchProjectDetails(); // Refresh list
                }
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to remove member');
            }
        } catch (error) {
            console.error('Error removing member:', error);
            alert('An error occurred.');
        }
    };

    if (!project) return <Typography sx={{ p: 4, color: '#fff' }}>Loading...</Typography>;

    return (
        <Container maxWidth="xl" sx={{ mt: 4, pb: 5 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                    <Button
                        onClick={() => navigate('/projects/board')}
                        sx={{ color: 'text.secondary', mb: 1, p: 0, '&:hover': { bgcolor: 'transparent', color: '#fff' } }}
                    >
                        ← Back to Board
                    </Button>
                    <Typography variant="h3" fontWeight="bold" sx={{ color: '#fff' }}>
                        {project.name}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    onClick={() => navigate(`/collab/${id}`)}
                    sx={{
                        background: 'linear-gradient(45deg, #00E5FF, #7C4DFF)',
                        color: '#fff',
                        px: 3, py: 1,
                        fontWeight: 'bold',
                        boxShadow: '0 4px 15px rgba(0, 229, 255, 0.4)'
                    }}
                >
                    Open Live Whiteboard
                </Button>
            </Box>

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.1)', mb: 3 }}>
                <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)} textColor="primary" indicatorColor="primary">
                    <Tab label="Overview" />
                    <Tab label="Team" />
                    <Tab label="Documents" />
                    <Tab label="Analytics" />
                </Tabs>
            </Box>

            {/* Tab 0: Overview (Project Info + Leader) */}
            {tabValue === 0 && (
                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <Paper sx={{ p: 3, bgcolor: '#1E2538', color: '#fff', borderRadius: 2, mb: 3 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <DescriptionIcon sx={{ color: '#00E5FF' }} />
                                <Typography variant="h6" fontWeight="bold">Project Details</Typography>
                            </Box>
                            <Typography variant="body1" sx={{ color: '#B0B3C7', lineHeight: 1.6 }}>
                                {project.description || "No description provided."}
                            </Typography>
                            <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="caption" color="text.secondary">Start Date</Typography>
                                    <Typography variant="body2">{project.startDate ? new Date(project.startDate).toLocaleDateString() : 'N/A'}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="caption" color="text.secondary">Due Date</Typography>
                                    <Typography variant="body2">{project.endDate ? new Date(project.endDate).toLocaleDateString() : 'N/A'}</Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Paper sx={{ p: 3, bgcolor: '#1E2538', color: '#fff', borderRadius: 2 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                                <PersonIcon sx={{ color: '#7C4DFF' }} />
                                <Typography variant="h6" fontWeight="bold">Leading Team</Typography>
                            </Box>
                            <List dense>
                                <ListItem sx={{ px: 0 }}>
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: '#7C4DFF' }}>{project.manager?.name?.[0] || 'M'}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={project.manager?.name || 'Unknown'}
                                        secondary={<Typography variant="caption" color="text.secondary">{project.manager?.email}</Typography>}
                                    />
                                </ListItem>
                            </List>
                        </Paper>
                    </Grid>
                </Grid>
            )}

            {/* Tab 1: Team Members */}
            {tabValue === 1 && (
                <Paper sx={{ p: 3, bgcolor: '#1E2538', color: '#fff', borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <PersonIcon sx={{ color: '#7C4DFF' }} />
                        <Typography variant="h6" fontWeight="bold">Team Members</Typography>
                    </Box>
                    <List dense>
                        {project.members && project.members.length > 0 ? (
                            project.members.map((member) => (
                                <ListItem
                                    key={member._id}
                                    sx={{ px: 0 }}
                                    secondaryAction={
                                        (() => {
                                            const currentUser = JSON.parse(localStorage.getItem('user'));
                                            const currentUserId = currentUser?._id;
                                            const managerId = project.manager?._id;
                                            const memberId = member._id;

                                            const isManager = managerId && currentUserId && (managerId.toString() === currentUserId.toString());
                                            const isSelf = memberId && currentUserId && (memberId.toString() === currentUserId.toString());

                                            // Only show if:
                                            // 1. I am the Manager (can remove anyone except myself? logic handled in click) -> Manager can remove anyone. 
                                            // 2. I am the Member (can leave, i.e., remove myself)
                                            // UI Distinction: Manager Removing Self -> "Leave"?

                                            // Requirements: "only for the team leade"
                                            // Interpreting as: Manager needs to see the remove button.

                                            if (!isManager && !isSelf) return null;

                                            return (
                                                <Tooltip title={isSelf ? "Leave Project" : "Remove Member"}>
                                                    <IconButton
                                                        edge="end"
                                                        aria-label="delete"
                                                        onClick={() => handleRemoveMember(memberId)}
                                                        sx={{ color: isSelf ? '#FF9800' : '#F44336' }}
                                                    >
                                                        {isSelf ? <ExitToAppIcon /> : <DeleteIcon />}
                                                    </IconButton>
                                                </Tooltip>
                                            );
                                        })()
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.1)' }}>{member.name?.[0]}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={member.name}
                                        secondary={<Typography variant="caption" color="text.secondary">{member.email}</Typography>}
                                    />
                                </ListItem>
                            ))
                        ) : (
                            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>No members added yet.</Typography>
                        )}
                    </List>
                </Paper>
            )}

            {/* Tab 2: Documents */}
            {tabValue === 2 && (
                <Paper sx={{ p: 3, bgcolor: '#1E2538', color: '#fff', borderRadius: 2, minHeight: '500px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <InsertDriveFileIcon sx={{ color: '#FF9800' }} />
                            <Typography variant="h6" fontWeight="bold">Documents</Typography>
                        </Box>

                        <Box>
                            <input
                                type="file"
                                hidden
                                ref={fileInputRef}
                                onChange={handleFileSelect}
                            />
                            <Button
                                variant="outlined"
                                startIcon={uploading ? <CircularProgress size={20} /> : <CloudUploadIcon />}
                                onClick={() => fileInputRef.current.click()}
                                disabled={uploading}
                                sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.3)', '&:hover': { borderColor: '#fff' } }}
                            >
                                {uploading ? "Uploading..." : "Upload Document"}
                            </Button>
                        </Box>
                    </Box>

                    <Grid container spacing={2}>
                        {documents.length > 0 ? (
                            documents.map((doc) => (
                                <Grid item xs={12} sm={6} md={4} key={doc._id}>
                                    <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 2, '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' }, transition: 'all 0.2s' }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                                            <InsertDriveFileIcon sx={{ color: '#aaa', fontSize: 30 }} />
                                            <Box sx={{ overflow: 'hidden' }}>
                                                <Typography variant="subtitle2" noWrap title={doc.originalName}>{doc.originalName}</Typography>
                                                <Typography variant="caption" color="text.secondary">{new Date(doc.createdAt).toLocaleDateString()}</Typography>
                                            </Box>
                                        </Box>
                                        <Button
                                            size="small"
                                            startIcon={<DownloadIcon />}
                                            fullWidth
                                            component={Link}
                                            href={doc.fileUrl}
                                            target="_blank"
                                            sx={{ color: '#B0B3C7', borderColor: 'rgba(255,255,255,0.1)' }}
                                            variant="outlined"
                                        >
                                            Download
                                        </Button>
                                    </Paper>
                                </Grid>
                            ))
                        ) : (
                            <Box sx={{ width: '100%', textAlign: 'center', py: 8, opacity: 0.5 }}>
                                <InsertDriveFileIcon sx={{ fontSize: 60, mb: 2 }} />
                                <Typography>No documents uploaded yet.</Typography>
                                <Typography variant="caption">Upload mockups, specs, or assets here.</Typography>
                            </Box>
                        )}
                    </Grid>
                </Paper>
            )}

            {/* Tab 3: Analytics */}
            {tabValue === 3 && (
                <AnalyticsDashboard tasks={tasks} />
            )}
        </Container>
    );
};

export default ProjectDetails;
