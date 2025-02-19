import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  useTheme,
} from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import SecurityIcon from '@mui/icons-material/Security';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const theme = useTheme();

  const isActive = (path) => location.pathname === path;

  const buttonStyle = (path) => ({
    color: 'white',
    mx: 1,
    px: 2,
    py: 1,
    borderRadius: '8px',
    background: isActive(path) 
      ? 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)'
      : 'transparent',
    '&:hover': {
      background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
      transition: 'all 0.2s ease-in-out',
    },
  });

  return (
    <AppBar 
      position="sticky" 
      sx={{
        background: 'linear-gradient(to right, #1a237e, #0d47a1)',
        boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
      }}
    >
      <Toolbar>
        <SecurityIcon sx={{ mr: 1 }} />
        <Typography
          variant="h6"
          component={RouterLink}
          to="/"
          sx={{
            textDecoration: 'none',
            color: 'inherit',
            flexGrow: 1,
            fontWeight: 700,
            letterSpacing: 1,
            '&:hover': {
              transform: 'translateY(-1px)',
              transition: 'transform 0.2s ease-in-out',
            },
          }}
        >
          Shield X
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Button
            component={RouterLink}
            to="/"
            sx={buttonStyle('/')}
          >
            Home
          </Button>
          {user && (
            <>
              <Button
                component={RouterLink}
                to="/dashboard"
                sx={buttonStyle('/dashboard')}
              >
                Dashboard
              </Button>
              <Button
                component={RouterLink}
                to="/transactions"
                sx={buttonStyle('/transactions')}
              >
                Transactions
              </Button>
            </>
          )}
          <Button
            component={RouterLink}
            to="/about"
            sx={buttonStyle('/about')}
          >
            About
          </Button>
          {user ? (
            <Button
              onClick={logout}
              sx={{
                ml: 2,
                px: 3,
                py: 1,
                borderRadius: '8px',
                background: 'linear-gradient(45deg, #d32f2f 30%, #f44336 90%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(45deg, #c62828 30%, #d32f2f 90%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(211, 47, 47, 0.3)',
                },
              }}
            >
              Logout
            </Button>
          ) : (
            <Button
              component={RouterLink}
              to="/login"
              sx={{
                ml: 2,
                px: 3,
                py: 1,
                borderRadius: '8px',
                background: 'linear-gradient(45deg, #7b1fa2 30%, #9c27b0 90%)',
                color: 'white',
                '&:hover': {
                  background: 'linear-gradient(45deg, #9c27b0 30%, #ba68c8 90%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(156, 39, 176, 0.3)',
                },
              }}
            >
              Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
