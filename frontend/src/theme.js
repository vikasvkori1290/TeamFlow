import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#00E5FF', // Cyan/Teal accent from image
        },
        secondary: {
            main: '#7C4DFF', // Purple accent
        },
        background: {
            default: '#0B0F19', // Deep dark blue/black background
            paper: '#111625',   // Slightly lighter for cards
        },
        text: {
            primary: '#ffffff',
            secondary: '#B0B3C7',
        },
        success: {
            main: '#00E676',
        },
        error: {
            main: '#FF5252',
        },
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: { fontWeight: 700 },
        h2: { fontWeight: 700 },
        h3: { fontWeight: 700 },
        h4: { fontWeight: 600 },
        h5: { fontWeight: 600 },
        h6: { fontWeight: 600 },
        button: { textTransform: 'none', fontWeight: 600 },
    },
    components: {
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: '#0B0F19',
                    backgroundImage: 'none',
                    boxShadow: 'none',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#0B0F19',
                    borderRight: '1px solid rgba(255, 255, 255, 0.05)',
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    borderRadius: 16, // Softer corners
                    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.25)',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                },
                contained: {
                    boxShadow: '0px 4px 12px rgba(0, 229, 255, 0.2)', // Glow effect for primary buttons
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    backgroundColor: '#111625',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                },
            },
        },
    },
});

export default theme;
