import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { styled } from '@mui/system';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupIcon from '@mui/icons-material/Group';
import TimelineIcon from '@mui/icons-material/Timeline';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Section = styled(Box)({
    padding: '80px 0',
    background: 'transparent', // Dark theme
    position: 'relative',
    zIndex: 2,
});

const SectionTitle = styled(Typography)({
    fontWeight: 800,
    textAlign: 'center',
    marginBottom: '60px',
    color: '#fff', // White text
    fontSize: '2.5rem',
});

const FeatureCard = styled(Paper)({
    padding: '30px',
    textAlign: 'center',
    height: '280px', // Strict height
    width: '100%',
    maxWidth: '533px', // User requested width
    margin: '0 auto', // Center in grid cell
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.03)', // Glass effect
    backdropFilter: 'blur(10px)',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    transition: 'all 0.3s ease',
    '&:hover': {
        transform: 'translateY(-10px)',
        background: 'rgba(255, 255, 255, 0.05)',
        borderColor: '#00E5FF',
        boxShadow: '0 10px 30px rgba(0, 229, 255, 0.2)',
    },
});

const IconWrapper = styled(Box)({
    color: '#00E5FF', // Cyan accent
    marginBottom: '20px',
    '& svg': {
        fontSize: '3rem',
        filter: 'drop-shadow(0 0 10px rgba(0, 229, 255, 0.5))',
    },
});

const features = [
    {
        title: 'Task Management',
        description: 'Create tasks, assign them to team members, and track progress effortlessly.',
        icon: <AssignmentIcon />,
    },
    {
        title: 'Team Collaboration',
        description: 'Discuss ideas, share files, and keep everyone in the loop with real-time updates.',
        icon: <GroupIcon />,
    },
    {
        title: 'Project Timelines',
        description: 'Visualize project schedules and deadlines with interactive Gantt charts and calendars.',
        icon: <TimelineIcon />,
    },
    {
        title: 'Clear Visibility',
        description: 'Get a bird\'s-eye view of all your projects and team performance in one place.',
        icon: <VisibilityIcon />,
    },
];

const Features = () => {
    return (
        <Section>
            <Container maxWidth="lg">
                <SectionTitle variant="h3">
                    Everything you need to manage projects
                </SectionTitle>
                <Grid container spacing={4} alignItems="stretch">
                    {features.map((feature) => (
                        <Grid item xs={12} sm={6} md={6} lg={6} key={feature.title}>
                            <FeatureCard>
                                <IconWrapper>{feature.icon}</IconWrapper>
                                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                                    {feature.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {feature.description}
                                </Typography>
                            </FeatureCard>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Section>
    );
};

export default Features;
