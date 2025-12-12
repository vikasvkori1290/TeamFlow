import React from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Header from './components/LandingPage/Header';
import Hero from './components/LandingPage/Hero';
import Features from './components/LandingPage/Features';
import Footer from './components/LandingPage/Footer';

const theme = createTheme({
  typography: {
    fontFamily: [
      '"Inter"',
      '"Roboto"',
      '"Helvetica"',
      '"Arial"',
      'sans-serif',
    ].join(','),
    h1: {
      fontWeight: 800,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  palette: {
    primary: {
      main: '#2E7D32',
    },
    background: {
      default: '#ffffff',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Header />
      <Hero />
      <Features />
      <Footer />
    </ThemeProvider>
  );
}

export default App;
