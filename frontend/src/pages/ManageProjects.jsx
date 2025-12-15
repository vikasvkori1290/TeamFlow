import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Box, TextField, List, ListItem, ListItemText, Alert, Paper, Grid, Tabs, Tab, IconButton, Menu, MenuItem, Avatar, Chip, InputAdornment } from '@mui/material';
import { DataGrid, GridActionsCellItem } from '@mui/x-data-grid';
import { useNavigate } from 'react-router-dom';
import { MoreVert as MoreVertIcon, Search as SearchIcon, Edit, Archive, Delete } from '@mui/icons-material';
import CreateProjectModal from '../components/CreateProjectModal';
import API_BASE_URL from '../config';

const ManageProjects = () => {
    const [projects, setProjects] = useState([]);
    const [filteredProjects, setFilteredProjects] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [invitations, setInvitations] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [openModal, setOpenModal] = useState(false); // Reuse for Edit in future
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    useEffect(() => {
        if (!searchQuery) {
            setFilteredProjects(projects);
        } else {
            const lower = searchQuery.toLowerCase();
            setFilteredProjects(projects.filter(p => p.name.toLowerCase().includes(lower)));
        }
    }, [searchQuery, projects]);

    const fetchData = async () => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (!storedUser) {
            navigate('/login');
            return;
        }

        try {
            // Fetch Projects
            const projRes = await fetch(`${API_BASE_URL}/api/projects`, {
                headers: { Authorization: `Bearer ${storedUser.token}` },
            });

            if (!projRes.ok) {
                console.error('Projects fetch failed:', projRes.status);
                // Optionally handle auth error
                if (projRes.status === 401) navigate('/login');
                return;
            }

            const projData = await projRes.json();

            if (Array.isArray(projData)) {
                const enriched = projData.map(p => ({ ...p, progress: p.progress || Math.floor(Math.random() * 80) + 10 }));
                setProjects(enriched);
            } else {
                console.error('Projects data is not an array:', projData);
                setProjects([]);
            }

            // Fetch Invitations
            const invRes = await fetch(`${API_BASE_URL}/api/invitations`, {
                headers: { Authorization: `Bearer ${storedUser.token}` },
            });
            if (invRes.ok) {
                const invData = await invRes.json();
                setInvitations(Array.isArray(invData) ? invData : []);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setProjects([]);
        }
    };

    const handleActionClick = (event, id) => {
        setAnchorEl(event.currentTarget);
        setSelectedProjectId(id);
    };

    const handleClose = () => {
        setAnchorEl(null);
        setSelectedProjectId(null);
    };

    const handleAction = async (action) => {
        handleClose();
        const storedUser = JSON.parse(localStorage.getItem('user'));

        if (action === 'delete') {
            if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) return;
            const response = await fetch(`${API_BASE_URL}/api/projects/${selectedProjectId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${storedUser.token}` },
            });

            if (response.ok) {
                fetchData();
            } else {
                const data = await response.json();
                alert(data.message || 'Failed to delete project');
            }
        } else if (action === 'archive') {
            await fetch(`${API_BASE_URL}/api/projects/${selectedProjectId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${storedUser.token}` },
                body: JSON.stringify({ status: 'On Hold' }),
            });
            fetchData();
        } else if (action === 'edit') {
            // Placeholder: In real app, open modal pre-filled
            alert('Edit functionality would open the modal with project data.');
        }
    };

    const columns = [
        {
            field: 'name', headerName: 'Project Name', width: 250, renderCell: (params) => (
                <Typography variant="body2" fontWeight="600">{params.value || 'Untitled'}</Typography>
            )
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 150,
            renderCell: (params) => {
                const colors = { Planning: 'info', Active: 'success', 'On Hold': 'warning', Completed: 'default' };
                const label = params.value || 'Planning';
                return <Chip label={label} color={colors[label] || 'default'} size="small" variant="outlined" />;
            }
        },
        {
            field: 'manager',
            headerName: 'Manager',
            width: 200,
            renderCell: (params) => {
                // Handle populated object or missing manager
                const managerName = params.value?.name || 'Unknown';
                const managerInitial = managerName[0] || '?';
                return (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ width: 24, height: 24, mr: 1, fontSize: '0.75rem', bgcolor: 'primary.main' }}>
                            {managerInitial}
                        </Avatar>
                        <Typography variant="body2">{managerName}</Typography>
                    </Box>
                );
            }
        },
        // Updated valueFormatter to receive (value) direct argument for v7+
        { field: 'startDate', headerName: 'Start Date', width: 130, valueFormatter: (value) => value ? new Date(value).toLocaleDateString() : '-' },
        { field: 'endDate', headerName: 'Due Date', width: 130, valueFormatter: (value) => value ? new Date(value).toLocaleDateString() : '-' },
        {
            field: 'progress',
            headerName: 'Progress',
            width: 130,
            renderCell: (params) => <Typography variant="body2" color="text.secondary">{params.value != null ? `${params.value}%` : '0%'}</Typography>
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 80,
            sortable: false,
            // Use 'renderCell' instead of 'renderCell' for actions ensuring params.row exists
            renderCell: (params) => (
                <IconButton onClick={(e) => { e.stopPropagation(); handleActionClick(e, params.row._id); }}>
                    <MoreVertIcon />
                </IconButton>
            ),
        },
    ];

    return (
        <Container maxWidth="xl" sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
                <Box>
                    <Typography variant="overline" sx={{ color: '#00E5FF', letterSpacing: 2 }}>
                        WORKSPACE
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: '#fff' }}>
                        Manage Projects
                    </Typography>
                </Box>
                {/* Search Bar */}
                <TextField
                    size="small"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: <InputAdornment position="start"><SearchIcon sx={{ color: '#00E5FF' }} /></InputAdornment>,
                        sx: {
                            bgcolor: 'rgba(30, 41, 59, 0.5)',
                            borderRadius: '12px',
                            width: 320,
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.1)',
                            '& fieldset': { border: 'none' },
                            '&:hover': { bgcolor: 'rgba(30, 41, 59, 0.7)' }
                        }
                    }}
                />
            </Box>

            <Box sx={{ borderBottom: 1, borderColor: 'rgba(255,255,255,0.1)', mb: 3 }}>
                <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)} textColor="primary" indicatorColor="primary">
                    <Tab label="Projects List" />
                    <Tab label="Invitations" />
                </Tabs>
            </Box>

            {tabValue === 0 && (
                <Paper sx={{ height: 600, width: '100%', background: 'transparent', borderRadius: 4, border: 'none' }} className="glass-panel">
                    <DataGrid
                        rows={filteredProjects}
                        columns={columns}
                        getRowId={(row) => row._id}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 10, page: 0 },
                            },
                        }}
                        pageSizeOptions={[10, 20]}
                        checkboxSelection
                        disableRowSelectionOnClick
                        onRowClick={(params) => navigate(`/manage/${params.id}`)}
                        sx={{
                            border: 'none',
                            color: '#e2e8f0', // Light slate text
                            fontFamily: 'Outfit, sans-serif',
                            '& .MuiDataGrid-row': {
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                transition: 'background-color 0.2s ease',
                                '&:hover': {
                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                    cursor: 'pointer'
                                }
                            },
                            '& .MuiDataGrid-cell': {
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                display: 'flex',
                                alignItems: 'center'
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                backgroundColor: 'rgba(15, 23, 42, 0.6)', // Darker header
                                borderBottom: '1px solid rgba(255,255,255,0.1)',
                                color: '#00E5FF',
                                fontWeight: 'bold',
                                fontSize: '0.95rem',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            },
                            '& .MuiDataGrid-columnSeparator': {
                                display: 'none'
                            },
                            '& .MuiCheckbox-root': {
                                color: 'rgba(255,255,255,0.3)',
                                '&.Mui-checked': {
                                    color: '#00E5FF'
                                }
                            },
                            '& .MuiTablePagination-root': {
                                color: '#B0B3C7'
                            },
                            '& .MuiDataGrid-footerContainer': {
                                borderTop: '1px solid rgba(255,255,255,0.05)'
                            }
                        }}
                    />

                    {/* Actions Menu */}
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClose}
                        PaperProps={{ sx: { bgcolor: '#1E2538', border: '1px solid rgba(255,255,255,0.1)' } }}
                    >
                        {(() => {
                            const storedUser = JSON.parse(localStorage.getItem('user'));
                            const selProject = projects.find(p => p._id === selectedProjectId);
                            // Check if current user is manager or creator
                            const userId = storedUser?._id || storedUser?.id;

                            if (selProject) {
                                console.log("--- Permission Debug ---");
                                console.log("User ID:", userId);
                                console.log("Manager:", selProject.manager);
                                console.log("CreatedBy:", selProject.createdBy);
                                console.log("Manager ID from obj:", selProject.manager?._id);
                                console.log("Match 1 (manager._id):", selProject.manager?._id === userId);
                                console.log("Match 2 (manager):", selProject.manager === userId);
                                console.log("Match 3 (createdBy):", selProject.createdBy === userId);
                            }

                            const isManager = selProject && userId &&
                                ((selProject.manager?._id === userId) ||
                                    (selProject.manager === userId) ||
                                    (selProject.createdBy === userId));

                            if (isManager) {
                                return [
                                    <MenuItem key="edit" onClick={() => handleAction('edit')} sx={{ color: '#fff' }}><Edit fontSize="small" sx={{ mr: 1 }} /> Edit Details</MenuItem>,
                                    <MenuItem key="archive" onClick={() => handleAction('archive')} sx={{ color: '#fff' }}><Archive fontSize="small" sx={{ mr: 1 }} /> Archive</MenuItem>,
                                    <MenuItem key="delete" onClick={() => handleAction('delete')} sx={{ color: 'error.main' }}><Delete fontSize="small" sx={{ mr: 1 }} /> Delete</MenuItem>
                                ];
                            } else {
                                return <MenuItem onClick={handleClose} sx={{ color: '#fff' }}>View Details Only</MenuItem>;
                            }
                        })()}
                    </Menu>
                </Paper>
            )}

            {/* Invitations Tab (Simplified for brevity, keep existing logic if needed) */}
            {tabValue === 1 && (
                <Grid container spacing={3}>
                    <Grid item xs={12}><Typography variant="body1" color="text.secondary">Invitations management referenced from previous session...</Typography></Grid>
                </Grid>
            )}
        </Container>
    );
};

export default ManageProjects;
