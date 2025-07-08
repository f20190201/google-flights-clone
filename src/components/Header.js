import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';

const Header = () => {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <AppBar 
      position="static" 
      elevation={1}
      sx={{ 
        backgroundColor: 'white', 
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)' 
      }}
    >
      <Toolbar sx={{ minHeight: '64px' }}>
        <Box 
          display="flex" 
          alignItems="center" 
          flexGrow={1}
          onClick={handleLogoClick}
          sx={{ 
            cursor: 'pointer',
            '&:hover': {
              opacity: 0.8
            }
          }}
        >
          <FlightTakeoffIcon 
            sx={{ 
              color: '#1976d2', 
              marginRight: 2,
              fontSize: '28px'
            }} 
          />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              color: '#424242', 
              fontWeight: 600,
              fontSize: '20px'
            }}
          >
            Google Flights
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 