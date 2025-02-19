import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#9c27b0',
      light: '#ba68c8',
      dark: '#7b1fa2',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          '&:hover': {
            transform: 'scale(1.02)',
            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease-in-out',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
            transition: 'all 0.3s ease-in-out',
          },
        },
      },
    },
  },
});

export default theme;
