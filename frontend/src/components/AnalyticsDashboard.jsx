import React from 'react';
import { Paper, Typography, Grid, Box } from '@mui/material';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

const AnalyticsDashboard = ({ tasks }) => {
    if (!tasks || tasks.length === 0) {
        return (
            <Box sx={{ textAlign: 'center', py: 8, opacity: 0.6 }}>
                <Typography variant="h6" color="#fff">No tasks available for analytics</Typography>
                <Typography variant="body2" color="#B0B3C7">Create tasks to see insights here.</Typography>
            </Box>
        );
    }

    // 1. Calculate Status Distribution
    const statusCounts = tasks.reduce((acc, task) => {
        const s = task.status || 'To Do';
        acc[s] = (acc[s] || 0) + 1;
        return acc;
    }, {});

    const statusData = Object.keys(statusCounts).map(key => ({
        name: key,
        value: statusCounts[key]
    }));

    // Colors for Status
    const COLORS = ['#00E5FF', '#7C4DFF', '#FFC400', '#00E676', '#FF1744'];

    // 2. Calculate Task Distribution by Assignee
    const assigneeCounts = tasks.reduce((acc, task) => {
        const name = task.assignedTo?.name || 'Unassigned';
        acc[name] = (acc[name] || 0) + 1;
        return acc;
    }, {});

    const assigneeData = Object.keys(assigneeCounts).map(key => ({
        name: key,
        tasks: assigneeCounts[key]
    }));

    // Custom Tooltip for Glass Effect
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '10px',
                    borderRadius: '8px',
                    color: '#fff'
                }}>
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{label}</p>
                    <p style={{ margin: 0, color: '#00E5FF' }}>{`${payload[0].name}: ${payload[0].value}`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <Box sx={{ mt: 2 }}>
            <Grid container spacing={4}>
                {/* Status Chart */}
                <Grid item xs={12} md={6}>
                    <Paper
                        className="glass-panel"
                        sx={{
                            p: 3,
                            height: 400,
                            borderRadius: 4,
                            bgcolor: 'rgba(30, 41, 59, 0.4)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}
                    >
                        <Typography variant="h6" fontWeight="bold" sx={{ color: '#fff', mb: 2 }}>
                            Task Status Breakdown
                        </Typography>
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
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                                <Legend wrapperStyle={{ color: '#fff' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Assignee Chart */}
                <Grid item xs={12} md={6}>
                    <Paper
                        className="glass-panel"
                        sx={{
                            p: 3,
                            height: 400,
                            borderRadius: 4,
                            bgcolor: 'rgba(30, 41, 59, 0.4)'
                        }}
                    >
                        <Typography variant="h6" fontWeight="bold" sx={{ color: '#fff', mb: 2, textAlign: 'center' }}>
                            Workload by Team Member
                        </Typography>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={assigneeData}>
                                <XAxis
                                    dataKey="name"
                                    stroke="#B0B3C7"
                                    tick={{ fill: '#B0B3C7' }}
                                />
                                <YAxis stroke="#B0B3C7" />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                                    contentStyle={{ backgroundColor: '#0F172A', borderColor: 'rgba(255,255,255,0.1)', color: '#fff' }}
                                />
                                <Bar dataKey="tasks" fill="url(#colorGradient)" radius={[4, 4, 0, 0]}>
                                    {assigneeData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>

                {/* Summary Cards */}
                <Grid item xs={12}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(0, 229, 255, 0.1)', border: '1px solid rgba(0, 229, 255, 0.2)', textAlign: 'center' }}>
                                <Typography variant="h3" fontWeight="bold" sx={{ color: '#00E5FF' }}>
                                    {tasks.length}
                                </Typography>
                                <Typography variant="subtitle2" sx={{ color: '#B0B3C7', textTransform: 'uppercase' }}>Total Tasks</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(124, 77, 255, 0.1)', border: '1px solid rgba(124, 77, 255, 0.2)', textAlign: 'center' }}>
                                <Typography variant="h3" fontWeight="bold" sx={{ color: '#7C4DFF' }}>
                                    {tasks.filter(t => t.status === 'Completed').length}
                                </Typography>
                                <Typography variant="subtitle2" sx={{ color: '#B0B3C7', textTransform: 'uppercase' }}>Completed</Typography>
                            </Paper>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Paper sx={{ p: 3, borderRadius: 3, bgcolor: 'rgba(255, 196, 0, 0.1)', border: '1px solid rgba(255, 196, 0, 0.2)', textAlign: 'center' }}>
                                <Typography variant="h3" fontWeight="bold" sx={{ color: '#FFC400' }}>
                                    {tasks.filter(t => t.status === 'In Progress').length}
                                </Typography>
                                <Typography variant="subtitle2" sx={{ color: '#B0B3C7', textTransform: 'uppercase' }}>In Progress</Typography>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </Box>
    );
};

export default AnalyticsDashboard;
