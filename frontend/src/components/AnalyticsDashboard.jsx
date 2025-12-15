import React, { useMemo } from 'react';
import { Box, Grid, Paper, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AnalyticsDashboard = ({ tasks }) => {

    // Process Data for Pie Chart (Status Distribution)
    const statusData = useMemo(() => {
        const counts = { 'To Do': 0, 'In Progress': 0, 'Pending Review': 0, 'Done': 0 };
        tasks.forEach(task => {
            if (counts[task.status] !== undefined) {
                counts[task.status]++;
            }
        });
        return Object.keys(counts).map(key => ({ name: key, value: counts[key] })).filter(d => d.value > 0);
    }, [tasks]);

    // Process Data for Bar Chart (Team Workload)
    const workloadData = useMemo(() => {
        const counts = {};
        tasks.forEach(task => {
            const assignee = task.assignedTo?.name || 'Unassigned';
            counts[assignee] = (counts[assignee] || 0) + 1;
        });
        return Object.keys(counts).map(key => ({ name: key, tasks: counts[key] }));
    }, [tasks]);

    if (!tasks || tasks.length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                    No tasks available to generate analytics.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1, mt: 2 }}>
            <Grid container spacing={3}>
                {/* Status Distribution */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: 400, bgcolor: '#1E2538', color: '#fff' }}>
                        <Typography variant="h6" gutterBottom>Task Status Distribution</Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    paddingAngle={5}
                                    dataKey="value"
                                    label
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: '#333', borderColor: '#444' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Team Workload */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 3, height: 400, bgcolor: '#1E2538', color: '#fff' }}>
                        <Typography variant="h6" gutterBottom>Team Workload</Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={workloadData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                                <XAxis dataKey="name" stroke="#ccc" />
                                <YAxis stroke="#ccc" />
                                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.1)' }} contentStyle={{ backgroundColor: '#333', borderColor: '#444' }} />
                                <Bar dataKey="tasks" fill="#82ca9d" barSize={50} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Summary Metrics */}
                <Grid item xs={12}>
                    <Paper sx={{ p: 3, bgcolor: '#1E2538', display: 'flex', justifyContent: 'space-around' }}>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h3" color="primary">{tasks.length}</Typography>
                            <Typography variant="subtitle1" color="text.secondary">Total Tasks</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h3" color="success.main">
                                {tasks.filter(t => t.status === 'Done').length}
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary">Completed</Typography>
                        </Box>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h3" color="warning.main">
                                {Math.round((tasks.filter(t => t.status === 'Done').length / tasks.length) * 100) || 0}%
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary">Completion Rate</Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AnalyticsDashboard;
