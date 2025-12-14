import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import theme from './theme';
import DashboardLayout from './layouts/DashboardLayout';
import LandingPage from './pages/LandingPage';
import Signup from './pages/Signup';
import Login from './pages/Login';

import Projects from './pages/Projects';
import ManageProjects from './pages/ManageProjects';
import ProjectDetails from './pages/ProjectDetails';
import ManageProjectDetails from './pages/ManageProjectDetails';
import TaskManagement from './pages/TaskManagement';
import AssignTask from './pages/AssignTask';
import ViewTask from './pages/ViewTask';
import CompleteTask from './pages/CompleteTask';
import CollabBoard from './pages/CollabBoard';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />

          {/* Full Screen Collab Board */}
          <Route path="/collab/:projectId" element={<CollabBoard />} />

          {/* Protected Dashboard Routes */}
          <Route element={<DashboardLayout />}>

            <Route path="/projects/board" element={<Projects />} />
            <Route path="/projects/list" element={<ManageProjects />} />
            <Route path="/manage/:id" element={<ManageProjectDetails />} />
            <Route path="/project/:id" element={<ProjectDetails />} />
            <Route path="/task" element={<TaskManagement />} />
            <Route path="/task/assign" element={<AssignTask />} />

            <Route path="/task/view" element={<ViewTask />} />
            <Route path="/task/complete" element={<CompleteTask />} />
          </Route>
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
