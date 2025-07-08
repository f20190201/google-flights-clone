import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  Slider,
  Divider,
  Chip,
  Stack,
  Grid,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  IconButton,
  Tab,
  Tabs,
  Paper,
} from '@mui/material';
import {
  Close,
  FlightTakeoff,
  FlightLand,
  Schedule,
  LocalGasStation,
  AttachMoney,
} from '@mui/icons-material';

const FilterModal = ({ open, onClose, filters, onFiltersChange, flights }) => {
  const [localFilters, setLocalFilters] = useState(filters);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApplyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const handleResetFilters = () => {
    const resetFilters = {
      stops: { any: true, nonstop: false, oneStop: false, twoPlus: false },
      airlines: {},
      priceRange: [0, 2000],
      times: {
        departure: [0, 24],
        arrival: [0, 24]
      },
      duration: [0, 24],
      emissions: { any: true, low: false, medium: false, high: false },
      bags: { included: false, carryon: false, checked: false }
    };
    setLocalFilters(resetFilters);
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Get unique airlines from flights
  const getUniqueAirlines = () => {
    if (!flights || !flights.length) return [];
    const airlines = new Set();
    flights.forEach(flight => {
      flight.legs.forEach(leg => {
        leg.carriers.marketing.forEach(carrier => {
          airlines.add(JSON.stringify({ id: carrier.id, name: carrier.name }));
        });
      });
    });
    return Array.from(airlines).map(airline => JSON.parse(airline));
  };

  const formatTime = (hour) => {
    const h = Math.floor(hour);
    const m = Math.round((hour - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const StopsFilter = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Stops</Typography>
      <Stack spacing={1}>
        <FormControlLabel
          control={
            <Checkbox
              checked={localFilters.stops.any}
              onChange={(e) => setLocalFilters(prev => ({
                ...prev,
                stops: { ...prev.stops, any: e.target.checked }
              }))}
            />
          }
          label="Any number of stops"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={localFilters.stops.nonstop}
              onChange={(e) => setLocalFilters(prev => ({
                ...prev,
                stops: { ...prev.stops, nonstop: e.target.checked }
              }))}
            />
          }
          label="Nonstop only"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={localFilters.stops.oneStop}
              onChange={(e) => setLocalFilters(prev => ({
                ...prev,
                stops: { ...prev.stops, oneStop: e.target.checked }
              }))}
            />
          }
          label="1 stop or fewer"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={localFilters.stops.twoPlus}
              onChange={(e) => setLocalFilters(prev => ({
                ...prev,
                stops: { ...prev.stops, twoPlus: e.target.checked }
              }))}
            />
          }
          label="2+ stops"
        />
      </Stack>
    </Box>
  );

  const AirlinesFilter = () => {
    const airlines = getUniqueAirlines();
    
    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Airlines</Typography>
        <Stack spacing={1} sx={{ maxHeight: '300px', overflow: 'auto' }}>
          {airlines.map(airline => (
            <FormControlLabel
              key={airline.id}
              control={
                <Checkbox
                  checked={localFilters.airlines[airline.id] || false}
                  onChange={(e) => setLocalFilters(prev => ({
                    ...prev,
                    airlines: {
                      ...prev.airlines,
                      [airline.id]: e.target.checked
                    }
                  }))}
                />
              }
              label={airline.name}
            />
          ))}
        </Stack>
      </Box>
    );
  };

  const PriceFilter = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Price</Typography>
      <Box sx={{ px: 2 }}>
        <Slider
          value={localFilters.priceRange}
          onChange={(e, newValue) => setLocalFilters(prev => ({
            ...prev,
            priceRange: newValue
          }))}
          valueLabelDisplay="auto"
          min={0}
          max={2000}
          step={50}
          valueLabelFormat={(value) => `₹${value}`}
          sx={{ mt: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="body2">₹{localFilters.priceRange[0]}</Typography>
          <Typography variant="body2">₹{localFilters.priceRange[1]}</Typography>
        </Box>
      </Box>
    </Box>
  );

  const TimesFilter = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Times</Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <FlightTakeoff fontSize="small" />
          Departure times
        </Typography>
        <Box sx={{ px: 2 }}>
          <Slider
            value={localFilters.times.departure}
            onChange={(e, newValue) => setLocalFilters(prev => ({
              ...prev,
              times: { ...prev.times, departure: newValue }
            }))}
            valueLabelDisplay="auto"
            min={0}
            max={24}
            step={0.5}
            valueLabelFormat={(value) => formatTime(value)}
            sx={{ mt: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2">{formatTime(localFilters.times.departure[0])}</Typography>
            <Typography variant="body2">{formatTime(localFilters.times.departure[1])}</Typography>
          </Box>
        </Box>
      </Box>

      <Box>
        <Typography variant="subtitle1" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <FlightLand fontSize="small" />
          Arrival times
        </Typography>
        <Box sx={{ px: 2 }}>
          <Slider
            value={localFilters.times.arrival}
            onChange={(e, newValue) => setLocalFilters(prev => ({
              ...prev,
              times: { ...prev.times, arrival: newValue }
            }))}
            valueLabelDisplay="auto"
            min={0}
            max={24}
            step={0.5}
            valueLabelFormat={(value) => formatTime(value)}
            sx={{ mt: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2">{formatTime(localFilters.times.arrival[0])}</Typography>
            <Typography variant="body2">{formatTime(localFilters.times.arrival[1])}</Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );

  const DurationFilter = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Duration</Typography>
      <Box sx={{ px: 2 }}>
        <Slider
          value={localFilters.duration}
          onChange={(e, newValue) => setLocalFilters(prev => ({
            ...prev,
            duration: newValue
          }))}
          valueLabelDisplay="auto"
          min={0}
          max={24}
          step={0.5}
          valueLabelFormat={(value) => `${value}h`}
          sx={{ mt: 2 }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="body2">{localFilters.duration[0]}h</Typography>
          <Typography variant="body2">{localFilters.duration[1]}h</Typography>
        </Box>
      </Box>
    </Box>
  );

  const EmissionsFilter = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Emissions</Typography>
      <Stack spacing={1}>
        <FormControlLabel
          control={
            <Checkbox
              checked={localFilters.emissions.any}
              onChange={(e) => setLocalFilters(prev => ({
                ...prev,
                emissions: { ...prev.emissions, any: e.target.checked }
              }))}
            />
          }
          label="Any emissions level"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={localFilters.emissions.low}
              onChange={(e) => setLocalFilters(prev => ({
                ...prev,
                emissions: { ...prev.emissions, low: e.target.checked }
              }))}
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalGasStation sx={{ color: '#34a853', fontSize: '18px' }} />
              Low emissions
            </Box>
          }
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={localFilters.emissions.medium}
              onChange={(e) => setLocalFilters(prev => ({
                ...prev,
                emissions: { ...prev.emissions, medium: e.target.checked }
              }))}
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalGasStation sx={{ color: '#fbbc04', fontSize: '18px' }} />
              Average emissions
            </Box>
          }
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={localFilters.emissions.high}
              onChange={(e) => setLocalFilters(prev => ({
                ...prev,
                emissions: { ...prev.emissions, high: e.target.checked }
              }))}
            />
          }
          label={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LocalGasStation sx={{ color: '#ea4335', fontSize: '18px' }} />
              High emissions
            </Box>
          }
        />
      </Stack>
    </Box>
  );

  const BagsFilter = () => (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Bags</Typography>
      <Stack spacing={1}>
        <FormControlLabel
          control={
            <Checkbox
              checked={localFilters.bags.carryon}
              onChange={(e) => setLocalFilters(prev => ({
                ...prev,
                bags: { ...prev.bags, carryon: e.target.checked }
              }))}
            />
          }
          label="Carry-on bag included"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={localFilters.bags.checked}
              onChange={(e) => setLocalFilters(prev => ({
                ...prev,
                bags: { ...prev.bags, checked: e.target.checked }
              }))}
            />
          }
          label="Checked bag included"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={localFilters.bags.included}
              onChange={(e) => setLocalFilters(prev => ({
                ...prev,
                bags: { ...prev.bags, included: e.target.checked }
              }))}
            />
          }
          label="All bags included"
        />
      </Stack>
    </Box>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 0: return <StopsFilter />;
      case 1: return <AirlinesFilter />;
      case 2: return <BagsFilter />;
      case 3: return <PriceFilter />;
      case 4: return <TimesFilter />;
      case 5: return <EmissionsFilter />;
      case 6: return <DurationFilter />;
      default: return <StopsFilter />;
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Filters
        </Typography>
        <IconButton onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      
      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} variant="scrollable" scrollButtons="auto">
            <Tab label="Stops" />
            <Tab label="Airlines" />
            <Tab label="Bags" />
            <Tab label="Price" />
            <Tab label="Times" />
            <Tab label="Emissions" />
            <Tab label="Duration" />
          </Tabs>
        </Box>

        <Box sx={{ minHeight: '300px' }}>
          {renderTabContent()}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, gap: 2 }}>
        <Button onClick={handleResetFilters} variant="outlined">
          Reset
        </Button>
        <Button onClick={handleApplyFilters} variant="contained" size="large">
          Apply filters
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterModal; 