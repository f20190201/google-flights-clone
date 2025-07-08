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
  Card,
  CardContent,
  Grid,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Radio,
  RadioGroup,
  FormControlLabel
} from '@mui/material';
import {
  Close,
  AirlineSeatReclineExtra,
  Wifi,
  Restaurant,
  Tv,
  LocalBar,
  BusinessCenter,
  Luggage,
  CheckCircle,
  Schedule,
  EventSeat,
  Headset,
  RoomService
} from '@mui/icons-material';

const ClassSelector = ({ open, onClose, onConfirm, initialClass }) => {
  const [selectedClass, setSelectedClass] = useState(initialClass || 'economy');

  const classOptions = [
    {
      id: 'economy',
      name: 'Economy',
      subtitle: 'Value for money',
      price: 'Base fare',
      color: '#2196F3',
      features: [
        { icon: <EventSeat />, text: 'Standard seat (17-18" width)' },
        { icon: <Luggage />, text: '7kg cabin + 15kg check-in baggage' },
        { icon: <Restaurant />, text: 'Complimentary meal & beverages' },
        { icon: <Tv />, text: 'In-flight entertainment' },
        { icon: <Headset />, text: 'Personal reading light' }
      ],
      seatPitch: '28-32 inches',
      recline: '3-4 inches',
      baggage: '15kg included'
    },
    {
      id: 'premium',
      name: 'Premium Economy',
      subtitle: 'Extra comfort',
      price: '+30-50% from base',
      color: '#9C27B0',
      features: [
        { icon: <AirlineSeatReclineExtra />, text: 'Extra legroom (19-20" width)' },
        { icon: <Luggage />, text: '7kg cabin + 20kg check-in baggage' },
        { icon: <Restaurant />, text: 'Premium meals & complimentary drinks' },
        { icon: <Tv />, text: 'Larger HD entertainment screen' },
        { icon: <Wifi />, text: 'Priority Wi-Fi access' },
        { icon: <Schedule />, text: 'Priority check-in & boarding' }
      ],
      seatPitch: '34-38 inches',
      recline: '5-7 inches',
      baggage: '20kg included'
    },
    {
      id: 'business',
      name: 'Business Class',
      subtitle: 'Premium experience',
      price: '+150-300% from base',
      color: '#FF9800',
      features: [
        { icon: <AirlineSeatReclineExtra />, text: 'Lie-flat seats (20-22" width)' },
        { icon: <Luggage />, text: '10kg cabin + 30kg check-in baggage' },
        { icon: <Restaurant />, text: 'Gourmet dining & premium beverages' },
        { icon: <BusinessCenter />, text: 'Business lounge access' },
        { icon: <Wifi />, text: 'Complimentary high-speed Wi-Fi' },
        { icon: <RoomService />, text: 'Personal service & amenity kit' },
        { icon: <Schedule />, text: 'Fast-track security & priority boarding' }
      ],
      seatPitch: '60-80 inches',
      recline: 'Fully flat',
      baggage: '30kg included'
    },
    {
      id: 'first',
      name: 'First Class',
      subtitle: 'Ultimate luxury',
      price: '+300-500% from base',
      color: '#4CAF50',
      features: [
        { icon: <AirlineSeatReclineExtra />, text: 'Private suites (23-35" width)' },
        { icon: <Luggage />, text: '15kg cabin + 40kg check-in baggage' },
        { icon: <Restaurant />, text: 'Multi-course gourmet meals' },
        { icon: <LocalBar />, text: 'Premium champagne & fine wines' },
        { icon: <BusinessCenter />, text: 'Exclusive first-class lounge' },
        { icon: <Wifi />, text: 'Unlimited premium Wi-Fi' },
        { icon: <RoomService />, text: 'Dedicated flight attendant' },
        { icon: <Schedule />, text: 'Chauffeur service (select routes)' }
      ],
      seatPitch: '78-87 inches',
      recline: 'Fully flat bed',
      baggage: '40kg included'
    }
  ];

  const handleConfirm = () => {
    const selected = classOptions.find(cls => cls.id === selectedClass);
    onConfirm({
      id: selectedClass,
      name: selected.name,
      features: selected.features
    });
    onClose();
  };

  const ClassCard = ({ classOption, isSelected, onSelect }) => (
    <Card 
      sx={{ 
        cursor: 'pointer',
        border: isSelected ? `2px solid ${classOption.color}` : '1px solid #e0e0e0',
        boxShadow: isSelected ? `0 4px 12px ${classOption.color}30` : '0 2px 4px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        '&:hover': {
          boxShadow: `0 4px 12px ${classOption.color}20`,
          transform: 'translateY(-2px)'
        }
      }}
      onClick={onSelect}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: classOption.color }}>
              {classOption.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {classOption.subtitle}
            </Typography>
          </Box>
          <Radio
            checked={isSelected}
            onChange={onSelect}
            sx={{
              color: classOption.color,
              '&.Mui-checked': {
                color: classOption.color
              }
            }}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Chip 
            label={classOption.price} 
            size="small" 
            sx={{ 
              backgroundColor: `${classOption.color}15`,
              color: classOption.color,
              fontWeight: 600
            }}
          />
        </Box>

        {/* Seat Specifications */}
        <Box sx={{ mb: 2, p: 2, backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Seat Specifications
          </Typography>
          <Grid container spacing={1}>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">
                Seat Pitch
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {classOption.seatPitch}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="caption" color="text.secondary">
                Recline
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {classOption.recline}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Features */}
        <List dense sx={{ p: 0 }}>
          {classOption.features.slice(0, 4).map((feature, index) => (
            <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: '32px' }}>
                <Box sx={{ color: classOption.color, fontSize: '18px' }}>
                  {feature.icon}
                </Box>
              </ListItemIcon>
              <ListItemText
                primary={feature.text}
                primaryTypographyProps={{
                  variant: 'caption',
                  fontSize: '12px'
                }}
              />
            </ListItem>
          ))}
          {classOption.features.length > 4 && (
            <Typography variant="caption" color="text.secondary" sx={{ pl: 4 }}>
              +{classOption.features.length - 4} more amenities
            </Typography>
          )}
        </List>
      </CardContent>
    </Card>
  );

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="lg" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: '16px' }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Choose Travel Class
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Select your preferred cabin class and enjoy exclusive amenities
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <RadioGroup 
          value={selectedClass} 
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <Grid container spacing={3}>
            {classOptions.map((classOption) => (
              <Grid item xs={12} sm={6} lg={3} key={classOption.id}>
                <FormControlLabel
                  value={classOption.id}
                  control={<span />} // Hide the default radio button
                  label={
                    <ClassCard
                      classOption={classOption}
                      isSelected={selectedClass === classOption.id}
                      onSelect={() => setSelectedClass(classOption.id)}
                    />
                  }
                  sx={{ m: 0, width: '100%' }}
                />
              </Grid>
            ))}
          </Grid>
        </RadioGroup>

        {/* Detailed Features for Selected Class */}
        {selectedClass && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              What's Included in {classOptions.find(c => c.id === selectedClass)?.name}
            </Typography>
            <Grid container spacing={2}>
              {classOptions.find(c => c.id === selectedClass)?.features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircle 
                      fontSize="small" 
                      sx={{ color: classOptions.find(c => c.id === selectedClass)?.color }}
                    />
                    <Typography variant="body2">
                      {feature.text}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}

        {/* Comparison Note */}
        <Box sx={{ mt: 3, p: 2, backgroundColor: '#f0f7ff', borderRadius: '8px', border: '1px solid #e3f2fd' }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: '#1976d2' }}>
            💡 Pro Tip
          </Typography>
          <Typography variant="caption" color="#1976d2">
            Upgrade options and final pricing will be shown before payment. 
            Premium classes often include priority services that can save time during travel.
          </Typography>
        </Box>
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
          Select {classOptions.find(c => c.id === selectedClass)?.name}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ClassSelector; 