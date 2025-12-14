import React, { useEffect, useState, useRef } from 'react';
import { Container, Typography, Button, Box, Grid, Paper, Avatar, Divider, List, ListItem, ListItemAvatar, ListItemText, CircularProgress, Link } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import DescriptionIcon from '@mui/icons-material/Description';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';
import PersonIcon from '@mui/icons-material/Person';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [project, setProject] = useState(null);
    const [documents, setDocuments] = useState([]);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (id) {
            fetchProjectDetails();
            fetchDocuments();
        }
    }, [id]);

    const fetchProjectDetails = async () => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        try {
            const response = await fetch(`http://localhost:5000/api/projects/${id}`, {
                headers: { Authorization: `Bearer ${storedUser.token}` },
            });
            const data = await response.json();
            if (response.ok) setProject(data);
        } catch (error) {
            console.error('Error fetching project:', error);
        }
    };

    const fetchDocuments = async () => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        try {
            const response = await fetch(`http://localhost:5000/api/documents/${id}`, {
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
            const response = await fetch(`http://localhost:5000/api/documents/${id}`, {
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

            <Grid container spacing={4}>
                {/* Left Column: Info & Team */}
                <Grid item xs={12} md={4}>
                    {/* Project Description */}
                    <Paper sx={{ p: 3, bgcolor: '#1E2538', color: '#fff', borderRadius: 2, mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <DescriptionIcon sx={{ color: '#00E5FF' }} />
                            <Typography variant="h6" fontWeight="bold">Project Details</Typography>
                        </Box>
                        <Typography variant="body1" sx={{ color: '#B0B3C7', lineHeight: 1.6 }}>
                            {project.description || "No description provided."}
                        </Typography>
                        <Divider sx={{ my: 2, bgcolor: 'rgba(255,255,255,0.1)' }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="caption" color="text.secondary">Start Date</Typography>
                            <Typography variant="body2">{new Date(project.startDate).toLocaleDateString()}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                            <Typography variant="caption" color="text.secondary">Due Date</Typography>
                            <Typography variant="body2">{new Date(project.endDate).toLocaleDateString()}</Typography>
                        </Box>
                    </Paper>

                    {/* Team Members */}
                    <Paper sx={{ p: 3, bgcolor: '#1E2538', color: '#fff', borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                            <PersonIcon sx={{ color: '#7C4DFF' }} />
                            <Typography variant="h6" fontWeight="bold">Team</Typography>
                        </Box>

                        <Typography variant="subtitle2" sx={{ color: '#00E5FF', mb: 1, textTransform: 'uppercase', fontSize: '0.75rem' }}>Team Leader</Typography>
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

                        <Divider sx={{ my: 1, bgcolor: 'rgba(255,255,255,0.1)' }} />

                        <Typography variant="subtitle2" sx={{ color: '#aaa', mb: 1, mt: 2, textTransform: 'uppercase', fontSize: '0.75rem' }}>Members</Typography>
                        <List dense>
                            {project.members && project.members.length > 0 ? (
                                project.members.map((member) => (
                                    <ListItem key={member._id} sx={{ px: 0 }}>
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
                </Grid>

                {/* Right Column: Documents */}
                <Grid item xs={12} md={8}>
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
                                                    <Typography variant="subtitle2" noWrap title={doc.name}>{doc.name}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{new Date(doc.createdAt).toLocaleDateString()}</Typography>
                                                </Box>
                                            </Box>
                                            <Button
                                                size="small"
                                                startIcon={<DownloadIcon />}
                                                fullWidth
                                                component={Link}
                                                href={doc.url}
                                                target="_blank"
                                                sx={{ color: '#B0B3C7' }}
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
                </Grid>
            </Grid>
        </Container>
    );
};

export default ProjectDetails;
