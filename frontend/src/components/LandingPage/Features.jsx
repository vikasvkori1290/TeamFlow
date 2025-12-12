import React from 'react';
import { Box, Container, Typography, Grid, Paper } from '@mui/material';
import { styled } from '@mui/system';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupIcon from '@mui/icons-material/Group';
import TimelineIcon from '@mui/icons-material/Timeline';
import VisibilityIcon from '@mui/icons-material/Visibility';

const Section = styled(Box)({
    padding: '80px 0',
    backgroundColor: '#fff',
});

const SectionTitle = styled(Typography)({
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: '60px',
    color: '#333',
});

const FeatureCard = styled(Paper)({
    padding: '30px',
    textAlign: 'center',
    height: '100%',
    boxShadow: 'none',
    border: '1px solid #eee',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    '&:hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
    },
});

const IconWrapper = styled(Box)({
    color: '#2E7D32',
    marginBottom: '20px',
    '& svg': {
        fontSize: '3rem',
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
                <Grid container spacing={4}>
                    {features.map((feature, index) => (
                        <Grid item xs={12} md={3} key={index}>
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
