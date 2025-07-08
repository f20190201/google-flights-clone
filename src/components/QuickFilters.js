import React, { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Box,
  Typography,
  Divider,
  Slider,
  Stack,
  Badge,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

// Individual filter components that appear as dropdowns

export const StopsFilter = ({ filters, onFiltersChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStopChange = (stopType, checked) => {
    const newStops = { ...filters.stops, [stopType]: checked };
    
    // If any specific filter is checked, disable "any"
    const hasSpecificFilters = newStops.nonstop || newStops.oneStop || newStops.twoPlus;
    if (hasSpecificFilters) {
      newStops.any = false;
    } else {
      // If no specific filters, enable "any"
      newStops.any = true;
    }
    
    onFiltersChange({
      ...filters,
      stops: newStops
    });
  };

  const getActiveCount = () => {
    const activeFilters = Object.entries(filters.stops).filter(([key, value]) => key !== 'any' && value);
    return activeFilters.length;
  };

  return (
    <>
      <Badge badgeContent={getActiveCount()} color="primary" invisible={getActiveCount() === 0}>
        <Button
          variant="outlined"
          onClick={handleClick}
          endIcon={<ExpandMore />}
          sx={{ borderRadius: '20px', textTransform: 'none' }}
        >
          Stops
        </Button>
      </Badge>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <Box sx={{ p: 2, minWidth: 200 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Stops</Typography>
          <Stack spacing={1}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.stops.nonstop}
                  onChange={(e) => handleStopChange('nonstop', e.target.checked)}
                />
              }
              label="Nonstop only"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.stops.oneStop}
                  onChange={(e) => handleStopChange('oneStop', e.target.checked)}
                />
              }
              label="1 stop or fewer"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.stops.twoPlus}
                  onChange={(e) => handleStopChange('twoPlus', e.target.checked)}
                />
              }
              label="2+ stops"
            />
          </Stack>
        </Box>
      </Menu>
    </>
  );
};

export const AirlinesFilter = ({ filters, onFiltersChange, flights }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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

  const handleAirlineChange = (airlineId, checked) => {
    onFiltersChange({
      ...filters,
      airlines: { ...filters.airlines, [airlineId]: checked }
    });
  };

  const getActiveCount = () => {
    return Object.values(filters.airlines).filter(Boolean).length;
  };

  const airlines = getUniqueAirlines();

  return (
    <>
      <Badge badgeContent={getActiveCount()} color="primary" invisible={getActiveCount() === 0}>
        <Button
          variant="outlined"
          onClick={handleClick}
          endIcon={<ExpandMore />}
          sx={{ borderRadius: '20px', textTransform: 'none' }}
        >
          Airlines
        </Button>
      </Badge>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <Box sx={{ p: 2, minWidth: 250, maxHeight: 400, overflow: 'auto' }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Airlines</Typography>
          <Stack spacing={1}>
            {airlines.map(airline => (
              <FormControlLabel
                key={airline.id}
                control={
                  <Checkbox
                    checked={filters.airlines[airline.id] || false}
                    onChange={(e) => handleAirlineChange(airline.id, e.target.checked)}
                  />
                }
                label={airline.name}
              />
            ))}
          </Stack>
        </Box>
      </Menu>
    </>
  );
};

export const PriceFilter = ({ filters, onFiltersChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handlePriceChange = (event, newValue) => {
    onFiltersChange({
      ...filters,
      priceRange: newValue
    });
  };

  const isActive = () => {
    return filters.priceRange[0] > 0 || filters.priceRange[1] < 2000;
  };

  return (
    <>
      <Badge variant="dot" color="primary" invisible={!isActive()}>
        <Button
          variant="outlined"
          onClick={handleClick}
          endIcon={<ExpandMore />}
          sx={{ borderRadius: '20px', textTransform: 'none' }}
        >
          Price
        </Button>
      </Badge>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <Box sx={{ p: 3, minWidth: 300 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Price</Typography>
          <Slider
            value={filters.priceRange}
            onChange={handlePriceChange}
            valueLabelDisplay="auto"
            min={0}
            max={2000}
            step={50}
            valueLabelFormat={(value) => `₹${value}`}
            sx={{ mt: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2">₹{filters.priceRange[0]}</Typography>
            <Typography variant="body2">₹{filters.priceRange[1]}</Typography>
          </Box>
        </Box>
      </Menu>
    </>
  );
};

export const TimesFilter = ({ filters, onFiltersChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const formatTime = (hour) => {
    const h = Math.floor(hour);
    const m = Math.round((hour - h) * 60);
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  };

  const handleDepartureChange = (event, newValue) => {
    onFiltersChange({
      ...filters,
      times: { ...filters.times, departure: newValue }
    });
  };

  const handleArrivalChange = (event, newValue) => {
    onFiltersChange({
      ...filters,
      times: { ...filters.times, arrival: newValue }
    });
  };

  const isActive = () => {
    return filters.times.departure[0] > 0 || filters.times.departure[1] < 24 ||
           filters.times.arrival[0] > 0 || filters.times.arrival[1] < 24;
  };

  return (
    <>
      <Badge variant="dot" color="primary" invisible={!isActive()}>
        <Button
          variant="outlined"
          onClick={handleClick}
          endIcon={<ExpandMore />}
          sx={{ borderRadius: '20px', textTransform: 'none' }}
        >
          Times
        </Button>
      </Badge>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <Box sx={{ p: 3, minWidth: 350 }}>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>Times</Typography>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>Departure</Typography>
            <Slider
              value={filters.times.departure}
              onChange={handleDepartureChange}
              valueLabelDisplay="auto"
              min={0}
              max={24}
              step={0.5}
              valueLabelFormat={(value) => formatTime(value)}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2">{formatTime(filters.times.departure[0])}</Typography>
              <Typography variant="body2">{formatTime(filters.times.departure[1])}</Typography>
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>Arrival</Typography>
            <Slider
              value={filters.times.arrival}
              onChange={handleArrivalChange}
              valueLabelDisplay="auto"
              min={0}
              max={24}
              step={0.5}
              valueLabelFormat={(value) => formatTime(value)}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Typography variant="body2">{formatTime(filters.times.arrival[0])}</Typography>
              <Typography variant="body2">{formatTime(filters.times.arrival[1])}</Typography>
            </Box>
          </Box>
        </Box>
      </Menu>
    </>
  );
};

export const EmissionsFilter = ({ filters, onFiltersChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEmissionChange = (type, checked) => {
    onFiltersChange({
      ...filters,
      emissions: { ...filters.emissions, [type]: checked }
    });
  };

  const getActiveCount = () => {
    const activeFilters = Object.entries(filters.emissions).filter(([key, value]) => key !== 'any' && value);
    return activeFilters.length;
  };

  return (
    <>
      <Badge badgeContent={getActiveCount()} color="primary" invisible={getActiveCount() === 0}>
        <Button
          variant="outlined"
          onClick={handleClick}
          endIcon={<ExpandMore />}
          sx={{ borderRadius: '20px', textTransform: 'none' }}
        >
          Emissions
        </Button>
      </Badge>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <Box sx={{ p: 2, minWidth: 200 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Emissions</Typography>
          <Stack spacing={1}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.emissions.low}
                  onChange={(e) => handleEmissionChange('low', e.target.checked)}
                />
              }
              label="Low emissions"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.emissions.medium}
                  onChange={(e) => handleEmissionChange('medium', e.target.checked)}
                />
              }
              label="Average emissions"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.emissions.high}
                  onChange={(e) => handleEmissionChange('high', e.target.checked)}
                />
              }
              label="High emissions"
            />
          </Stack>
        </Box>
      </Menu>
    </>
  );
};

export const DurationFilter = ({ filters, onFiltersChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDurationChange = (event, newValue) => {
    onFiltersChange({
      ...filters,
      duration: newValue
    });
  };

  const isActive = () => {
    return filters.duration[0] > 0 || filters.duration[1] < 24;
  };

  return (
    <>
      <Badge variant="dot" color="primary" invisible={!isActive()}>
        <Button
          variant="outlined"
          onClick={handleClick}
          endIcon={<ExpandMore />}
          sx={{ borderRadius: '20px', textTransform: 'none' }}
        >
          Duration
        </Button>
      </Badge>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <Box sx={{ p: 3, minWidth: 300 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Duration</Typography>
          <Slider
            value={filters.duration}
            onChange={handleDurationChange}
            valueLabelDisplay="auto"
            min={0}
            max={24}
            step={0.5}
            valueLabelFormat={(value) => `${value}h`}
            sx={{ mt: 2 }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="body2">{filters.duration[0]}h</Typography>
            <Typography variant="body2">{filters.duration[1]}h</Typography>
          </Box>
        </Box>
      </Menu>
    </>
  );
};

export const BagsFilter = ({ filters, onFiltersChange }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleBagChange = (bagType, checked) => {
    onFiltersChange({
      ...filters,
      bags: { ...filters.bags, [bagType]: checked }
    });
  };

  const getActiveCount = () => {
    return Object.values(filters.bags).filter(Boolean).length;
  };

  return (
    <>
      <Badge badgeContent={getActiveCount()} color="primary" invisible={getActiveCount() === 0}>
        <Button
          variant="outlined"
          onClick={handleClick}
          endIcon={<ExpandMore />}
          sx={{ borderRadius: '20px', textTransform: 'none' }}
        >
          Bags
        </Button>
      </Badge>
      <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
        <Box sx={{ p: 2, minWidth: 200 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>Bags</Typography>
          <Stack spacing={1}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.bags.carryon}
                  onChange={(e) => handleBagChange('carryon', e.target.checked)}
                />
              }
              label="Carry-on bag included"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.bags.checked}
                  onChange={(e) => handleBagChange('checked', e.target.checked)}
                />
              }
              label="Checked bag included"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={filters.bags.included}
                  onChange={(e) => handleBagChange('included', e.target.checked)}
                />
              }
              label="All bags included"
            />
          </Stack>
        </Box>
      </Menu>
    </>
  );
}; 