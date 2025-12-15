import React from 'react';
import { Box, Container, Grid, Typography, Paper } from '@mui/material';
import SpeedIcon from '@mui/icons-material/Speed';
import GroupsIcon from '@mui/icons-material/Groups';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';

const visions = [
    {
        icon: <GroupsIcon sx={{ fontSize: 50, color: 'var(--primary)' }} />,
        title: "Seamless Collaboration",
        description: "Bridge the gap between ideas and execution with real-time whiteboards and voice chat."
    },
    {
        icon: <SpeedIcon sx={{ fontSize: 50, color: '#FF2E63' }} />,
        title: "High-Velocity Workflow",
        description: "Eliminate friction. Manage projects with tools designed for speed and clarity."
    },
    {
        icon: <AutoGraphIcon sx={{ fontSize: 50, color: 'var(--secondary)' }} />,
        title: "Intelligent Insights",
        description: "Make data-driven decisions with automated analytics and performance tracking."
    }
];

const VisionSection = () => {
    return (
        <Box sx={{ py: 10, position: 'relative', overflow: 'hidden' }}>
            {/* Background Decoration */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '600px',
                height: '600px',
                background: 'radial-gradient(circle, rgba(124, 77, 255, 0.1) 0%, rgba(0,0,0,0) 70%)',
                zIndex: 0
            }} />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                <Box textAlign="center" mb={8}>
                    <Typography variant="overline" sx={{ color: 'var(--primary)', letterSpacing: 3, fontWeight: 'bold' }}>
                        OUR VISION
                    </Typography>
                    <Typography variant="h3" fontWeight="bold" sx={{ mt: 2, mb: 2 }}>
                        Reimagining Team <span className="text-gradient">Productivity</span>
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
                        We believe in a workspace where tools don't just manage tasks, but amplify human potential.
                    </Typography>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4, justifyContent: 'center', alignItems: 'stretch' }}>
                    {visions.map((item, index) => (
                        <Box key={index} sx={{ flex: 1, width: '100%' }}>
                            <Paper
                                className="glass-panel glow-hover"
                                sx={{
                                    p: 4,
                                    height: '100%',
                                    borderRadius: 4,
                                    textAlign: 'center',
                                    transition: 'transform 0.3s ease',
                                    bgcolor: 'transparent',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                <Box sx={{ mb: 2 }}>
                                    {item.icon}
                                </Box>
                                <Typography variant="h5" fontWeight="bold" gutterBottom sx={{ fontSize: '1.25rem' }}>
                                    {item.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" lineHeight={1.6}>
                                    {item.description}
                                </Typography>
                            </Paper>
                        </Box>
                    ))}
                </Box>
            </Container>
        </Box>
    );
};

export default VisionSection;
