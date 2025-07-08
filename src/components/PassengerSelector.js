import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  IconButton,
  Divider,
  Grid,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse
} from '@mui/material';
import {
  Close,
  Add,
  Remove,
  Person,
  ChildCare,
  ChildFriendly,
  Luggage,
  ExpandMore,
  ExpandLess,
  Info
} from '@mui/icons-material';

const PassengerSelector = ({ open, onClose, onConfirm, initialData }) => {
  const [adults, setAdults] = useState(initialData?.adults || 1);
  const [children, setChildren] = useState(initialData?.children || 0);
  const [infants, setInfants] = useState(initialData?.infants || 0);
  const [showBaggageInfo, setShowBaggageInfo] = useState(false);

  const totalPassengers = adults + children + infants;

  const handleCountChange = (type, increment) => {
    switch (type) {
      case 'adults':
        if (increment) {
          setAdults(Math.min(adults + 1, 9));
        } else {
          setAdults(Math.max(adults - 1, 1)); // At least 1 adult required
        }
        break;
      case 'children':
        if (increment) {
          setChildren(Math.min(children + 1, 8));
        } else {
          setChildren(Math.max(children - 1, 0));
        }
        break;
      case 'infants':
        if (increment) {
          setInfants(Math.min(infants + 1, adults)); // Infants can't exceed adults
        } else {
          setInfants(Math.max(infants - 1, 0));
        }
        break;
    }
  };

  const handleConfirm = () => {
    onConfirm({
      adults,
      children,
      infants,
      total: totalPassengers
    });
    onClose();
  };

  const CounterControl = ({ label, count, onIncrement, onDecrement, disabled, subtitle }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2 }}>
      <Box>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {label}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        )}
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton
          onClick={onDecrement}
          disabled={disabled?.decrement}
          size="small"
          sx={{
            border: '1px solid #ddd',
            '&:disabled': { opacity: 0.3 }
          }}
        >
          <Remove fontSize="small" />
        </IconButton>
        <Typography 
          variant="body1" 
          sx={{ 
            minWidth: '40px', 
            textAlign: 'center', 
            fontWeight: 600,
            fontSize: '18px'
          }}
        >
          {count}
        </Typography>
        <IconButton
          onClick={onIncrement}
          disabled={disabled?.increment}
          size="small"
          sx={{
            border: '1px solid #ddd',
            '&:disabled': { opacity: 0.3 }
          }}
        >
          <Add fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: '16px' }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Passengers
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Select the number of passengers
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Adults Counter */}
        <CounterControl
          label="Adults"
          subtitle="12+ years"
          count={adults}
          onIncrement={() => handleCountChange('adults', true)}
          onDecrement={() => handleCountChange('adults', false)}
          disabled={{
            decrement: adults <= 1,
            increment: adults >= 9
          }}
        />
        
        <Divider />

        {/* Children Counter */}
        <CounterControl
          label="Children"
          subtitle="2-11 years"
          count={children}
          onIncrement={() => handleCountChange('children', true)}
          onDecrement={() => handleCountChange('children', false)}
          disabled={{
            decrement: children <= 0,
            increment: children >= 8
          }}
        />
        
        <Divider />

        {/* Infants Counter */}
        <CounterControl
          label="Infants"
          subtitle="Under 2 years (on lap)"
          count={infants}
          onIncrement={() => handleCountChange('infants', true)}
          onDecrement={() => handleCountChange('infants', false)}
          disabled={{
            decrement: infants <= 0,
            increment: infants >= adults
          }}
        />

        {/* Passenger Summary */}
        <Paper sx={{ mt: 3, p: 2, backgroundColor: '#f8f9fa', border: '1px solid #e9ecef' }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            Passenger Summary
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip 
              icon={<Person />} 
              label={`${adults} Adult${adults > 1 ? 's' : ''}`} 
              size="small" 
              color="primary"
            />
            {children > 0 && (
              <Chip 
                icon={<ChildCare />} 
                label={`${children} Child${children > 1 ? 'ren' : ''}`} 
                size="small" 
                color="secondary"
              />
            )}
            {infants > 0 && (
              <Chip 
                icon={<ChildFriendly />} 
                label={`${infants} Infant${infants > 1 ? 's' : ''}`} 
                size="small" 
                color="info"
              />
            )}
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            Total: {totalPassengers} passenger{totalPassengers > 1 ? 's' : ''}
          </Typography>
        </Paper>

        {/* Baggage Information */}
        <Box sx={{ mt: 3 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => setShowBaggageInfo(!showBaggageInfo)}
            endIcon={showBaggageInfo ? <ExpandLess /> : <ExpandMore />}
            sx={{
              textTransform: 'none',
              py: 1.5,
              borderColor: '#e0e0e0',
              color: '#666'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Luggage fontSize="small" />
              <Typography variant="body2">
                Baggage Information
              </Typography>
            </Box>
          </Button>
          
          <Collapse in={showBaggageInfo}>
            <Paper sx={{ mt: 2, p: 2, backgroundColor: '#fafafa' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                Standard Baggage Allowance
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                      7 kg
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Cabin Baggage
                    </Typography>
                    <Typography variant="caption" display="block">
                      55 x 35 x 25 cm
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={12} sm={6}>
                  <Box sx={{ textAlign: 'center', p: 2, border: '1px solid #e0e0e0', borderRadius: '8px' }}>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 600 }}>
                      15 kg
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Check-in Baggage
                    </Typography>
                    <Typography variant="caption" display="block">
                      Per passenger
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <List dense sx={{ mt: 2 }}>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: '32px' }}>
                    <Info fontSize="small" color="info" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Additional baggage can be purchased at check-in"
                    primaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: '32px' }}>
                    <Info fontSize="small" color="info" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Infants are entitled to 10kg check-in baggage"
                    primaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0 }}>
                  <ListItemIcon sx={{ minWidth: '32px' }}>
                    <Info fontSize="small" color="info" />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Liquids in cabin baggage must be in containers ≤ 100ml"
                    primaryTypographyProps={{ variant: 'caption' }}
                  />
                </ListItem>
              </List>
            </Paper>
          </Collapse>
        </Box>

        {/* Important Notes */}
        <Paper sx={{ mt: 3, p: 2, backgroundColor: '#fff3cd', border: '1px solid #ffeaa7' }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#856404' }}>
            Important Notes
          </Typography>
          <Typography variant="caption" color="#856404">
            • At least one adult is required for booking<br />
            • Each infant must be accompanied by an adult<br />
            • Children traveling alone require special assistance
          </Typography>
        </Paper>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained"
          sx={{ minWidth: '100px' }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PassengerSelector; 