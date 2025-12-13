import React, { useEffect, useState } from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, IconButton, List, ListItem, ListItemAvatar, ListItemText, Avatar, Button } from '@mui/material';
import { MoreHoriz, UploadFile, Assessment, Close as CloseIcon, Description as DocIcon } from '@mui/icons-material';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
    { name: 'Mon', progress: 20 },
    { name: 'Tue', progress: 35 },
    { name: 'Wed', progress: 30 },
    { name: 'Thu', progress: 55 },
    { name: 'Fri', progress: 45 },
    { name: 'Sat', progress: 75 },
    { name: 'Sun', progress: 85 },
];

const Dashboard = () => {
    // Mock user
    const user = JSON.parse(localStorage.getItem('user')) || { name: 'Alex' };

    return (
        <Box>
            {/* Header Section */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" fontWeight="bold" sx={{ mb: 1, background: 'linear-gradient(45deg, #fff, #B0B3C7)', backgroundClip: 'text', textFillColor: 'transparent', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', width: 'fit-content' }}>
                    Welcome back, {user.name}!
                </Typography>
                <Typography variant="body1" color="text.secondary">Here's your daily overview</Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Project Progress Graph */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ height: 400, position: 'relative', overflow: 'visible' }}>
                        <CardContent sx={{ height: '100%', p: 0 }}>
                            <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between' }}>
                                <Box>
                                    <Typography variant="h6">Project Progress</Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                        <Box sx={{ position: 'relative', display: 'inline-flex', mr: 2 }}>
                                            <Typography variant="h4" fontWeight="bold" color="primary">75%</Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary">Completed</Typography>
                                    </Box>
                                </Box>
                                <IconButton sx={{ color: 'text.secondary' }}><MoreHoriz /></IconButton>
                            </Box>

                            <ResponsiveContainer width="100%" height="70%">
                                <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#00E5FF" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#00E5FF" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#5CA5B1', fontSize: 12 }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#5CA5B1', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#111625', borderColor: 'rgba(255,255,255,0.1)', borderRadius: 8 }}
                                        itemStyle={{ color: '#fff' }}
                                    />
                                    <Area type="monotone" dataKey="progress" stroke="#00E5FF" strokeWidth={3} fillOpacity={1} fill="url(#colorProgress)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Right Column Widgets */}
                <Grid item xs={12} md={4}>
                    <Grid container spacing={3} direction="column">

                        {/* Upcoming Deadlines */}
                        <Grid item>
                            <Card sx={{ bgcolor: '#1A1F2E' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography variant="h6" fontSize="1rem">Upcoming Deadlines</Typography>
                                    </Box>
                                    {/* Mock Task Item */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#111625', p: 1.5, borderRadius: 2, mb: 1 }}>
                                        <Avatar variant="rounded" sx={{ bgcolor: 'rgba(255, 82, 82, 0.1)', color: '#FF5252', mr: 2 }}><Assessment /></Avatar>
                                        <Box sx={{ flexGrow: 1 }}>
                                            <Typography variant="subtitle2">Mobile App Design</Typography>
                                            <Typography variant="caption" color="text.secondary">Due Tomorrow</Typography>
                                        </Box>
                                        <IconButton size="small"><CloseIcon fontSize="small" /></IconButton>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Team Activity */}
                        <Grid item>
                            <Card sx={{ bgcolor: '#1A1F2E' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                        <Typography variant="h6" fontSize="1rem">Team Activity</Typography>
                                    </Box>
                                    <List disablePadding>
                                        <ListItem disablePadding sx={{ mb: 2 }}>
                                            <ListItemAvatar><Avatar src="/static/images/avatar/1.jpg" /></ListItemAvatar>
                                            <ListItemText
                                                primary={<Typography variant="subtitle2">Santana Snider</Typography>}
                                                secondary={<Typography variant="caption" color="text.secondary">Created a new task</Typography>}
                                            />
                                            <Typography variant="caption" color="text.secondary">2m</Typography>
                                        </ListItem>
                                        <ListItem disablePadding>
                                            <ListItemAvatar><Avatar src="/static/images/avatar/2.jpg" /></ListItemAvatar>
                                            <ListItemText
                                                primary={<Typography variant="subtitle2">Dianne Russell</Typography>}
                                                secondary={<Typography variant="caption" color="text.secondary">Added a file</Typography>}
                                            />
                                            <Typography variant="caption" color="text.secondary">1h</Typography>
                                        </ListItem>
                                    </List>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Quick Links */}
                        <Grid item>
                            <Card sx={{ bgcolor: '#1A1F2E' }}>
                                <CardContent>
                                    <Typography variant="h6" fontSize="1rem" sx={{ mb: 2 }}>Quick Links</Typography>
                                    <Button fullWidth startIcon={<UploadFile />} sx={{ justifyContent: 'flex-start', color: 'text.secondary', mb: 1, '&:hover': { color: 'primary.main', bgcolor: 'rgba(0, 229, 255, 0.05)' } }}>
                                        Upload File
                                    </Button>
                                    <Button fullWidth startIcon={<Assessment />} sx={{ justifyContent: 'flex-start', color: 'text.secondary', '&:hover': { color: 'primary.main', bgcolor: 'rgba(0, 229, 255, 0.05)' } }}>
                                        View Reports
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>

                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Dashboard;
