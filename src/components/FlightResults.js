import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  Avatar,
  IconButton,
  Collapse,
  Tab,
  Tabs,
  Paper,
  Stack,
  Badge,
} from '@mui/material';
import {
  FlightTakeoff,
  FlightLand,
  ArrowBack,
  ExpandMore,
  ExpandLess,
  FilterList,
  TrendingUp,
  CalendarToday,
  ShowChart,
  Eco,
  Schedule,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { searchMockFlights } from '../services/mockFlightService';
import FilterModal from './FilterModal';
import {
  StopsFilter,
  AirlinesFilter,
  PriceFilter,
  TimesFilter,
  EmissionsFilter,
  DurationFilter,
  BagsFilter,
} from './QuickFilters';
import { applyFilters, getDefaultFilters, getActiveFilterCount } from '../utils/filterUtils';

dayjs.extend(duration);

const FlightResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [flightData, setFlightData] = useState(null);
  const [expandedFlight, setExpandedFlight] = useState(null);
  const [sortBy, setSortBy] = useState('best');
  const [filters, setFilters] = useState(getDefaultFilters());
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  // Get search parameters from URL with fallbacks
  const searchData = {
    originSkyId: searchParams.get('originSkyId') || searchParams.get('originName') || 'BLR',
    destinationSkyId: searchParams.get('destinationSkyId') || searchParams.get('destinationName') || 'DEL',
    originEntityId: searchParams.get('originEntityId') || '123456',
    destinationEntityId: searchParams.get('destinationEntityId') || '123457',
    originName: searchParams.get('originName') || 'Bengaluru',
    destinationName: searchParams.get('destinationName') || 'Delhi',
    departureDate: searchParams.get('departureDate') || new Date().toISOString().split('T')[0],
    returnDate: searchParams.get('returnDate'),
    adults: searchParams.get('adults') || '1',
    cabinClass: searchParams.get('cabinClass') || 'economy',
    tripType: searchParams.get('tripType') || 'roundtrip',
  };

  console.log('FlightResults: Search parameters:', searchData);

  useEffect(() => {
    // Always search for flights, using fallback data if needed
    searchFlightsData();
  }, [searchParams]);

  // Add debugging useEffect for filters
  useEffect(() => {
    console.log('Filters changed:', filters);
    if (flightData?.data?.itineraries?.length > 0) {
      console.log('Sample flight data structure:', flightData.data.itineraries[0]);
      console.log('Sample leg stopCount:', flightData.data.itineraries[0]?.legs?.[0]?.stopCount);
    }
  }, [filters, flightData]);

  const searchFlightsData = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await searchMockFlights(searchData);
      
      if (result.success) {
        setFlightData(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Error searching flights:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (minutes) => {
    const dur = dayjs.duration(minutes, 'minutes');
    const hours = dur.hours();
    const mins = dur.minutes();
    return `${hours} hr ${mins} min`;
  };

  const formatTime = (dateTime) => {
    return dayjs(dateTime).format('h:mm A');
  };

  const formatDate = (dateTime) => {
    return dayjs(dateTime).format('MMM D');
  };

  const handleBackToSearch = () => {
    navigate('/');
  };

  const toggleFlightDetails = (flightId) => {
    setExpandedFlight(expandedFlight === flightId ? null : flightId);
  };

  const handleSortChange = (event, newValue) => {
    setSortBy(newValue);
  };

  const getSortedFlights = () => {
    if (!flightData?.data?.itineraries) return [];
    
    // Apply filters first
    const filteredFlights = applyFilters(flightData.data.itineraries, filters);
    
    if (sortBy === 'cheapest') {
      return filteredFlights.sort((a, b) => a.price.raw - b.price.raw);
    } else {
      // Best = combination of price, duration, and stops
      return filteredFlights.sort((a, b) => {
        const scoreA = (a.price.raw / 1000) + (a.legs[0].durationInMinutes / 60) + (a.legs[0].stopCount * 2);
        const scoreB = (b.price.raw / 1000) + (b.legs[0].durationInMinutes / 60) + (b.legs[0].stopCount * 2);
        return scoreA - scoreB;
      });
    }
  };

  const getCheapestPrice = () => {
    if (!flightData?.data?.itineraries) return null;
    const prices = flightData.data.itineraries.map(f => f.price.raw);
    return Math.min(...prices);
  };

  const getEmissionColor = (category) => {
    switch (category) {
      case 'low': return '#34a853';
      case 'high': return '#ea4335';
      default: return '#fbbc04';
    }
  };

  const getEmissionText = (percentage) => {
    if (percentage < -10) return 'emissions';
    if (percentage > 10) return 'emissions';
    return 'Avg emissions';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button onClick={handleBackToSearch} startIcon={<ArrowBack />}>
          Back to Search
        </Button>
      </Box>
    );
  }

  if (!flightData || !flightData.data || !flightData.data.itineraries || flightData.data.itineraries.length === 0) {
    return (
      <Box sx={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={handleBackToSearch} sx={{ mr: 2 }}>
            <ArrowBack />
          </IconButton>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 600, color: '#202124' }}>
              {searchData.originName} → {searchData.destinationName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {formatDate(searchData.departureDate)} • {searchData.adults} passenger{searchData.adults > 1 ? 's' : ''} • {searchData.cabinClass}
            </Typography>
          </Box>
        </Box>
        
        <Alert severity="info" sx={{ mb: 2 }}>
          Loading flight data... If this persists, try refreshing the page.
        </Alert>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
          <CircularProgress />
        </Box>
      </Box>
    );
  }

  const sortedFlights = getSortedFlights();
  const cheapestPrice = getCheapestPrice();

  return (
    <Box sx={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 1 }}>
        <IconButton onClick={handleBackToSearch} sx={{ mr: { xs: 1, md: 2 } }}>
          <ArrowBack />
        </IconButton>
        <Box sx={{ minWidth: 0, flex: 1 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, color: '#202124', fontSize: { xs: '1.2rem', md: '1.5rem' } }}>
            {searchData.originName} → {searchData.destinationName}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
            {formatDate(searchData.departureDate)} • {searchData.adults} passenger{searchData.adults > 1 ? 's' : ''} • {searchData.cabinClass}
          </Typography>
        </Box>
      </Box>

      {/* Filters Bar */}
      <Box sx={{ mb: 3 }}>
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: 'wrap', gap: 1, overflowX: { xs: 'auto', md: 'visible' }, pb: { xs: 1, md: 0 } }}>
          <Badge badgeContent={getActiveFilterCount(filters)} color="primary" invisible={getActiveFilterCount(filters) === 0}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setFilterModalOpen(true)}
              sx={{ borderRadius: '20px', textTransform: 'none' }}
            >
              All filters
            </Button>
          </Badge>
          
          <StopsFilter 
            filters={filters} 
            onFiltersChange={setFilters} 
          />
          
          <AirlinesFilter 
            filters={filters} 
            onFiltersChange={setFilters}
            flights={flightData?.data?.itineraries || []}
          />
          
          <BagsFilter 
            filters={filters} 
            onFiltersChange={setFilters} 
          />
          
          <PriceFilter 
            filters={filters} 
            onFiltersChange={setFilters} 
          />
          
          <TimesFilter 
            filters={filters} 
            onFiltersChange={setFilters} 
          />
          
          <EmissionsFilter 
            filters={filters} 
            onFiltersChange={setFilters} 
          />
          
          <Button variant="outlined" sx={{ borderRadius: '20px', textTransform: 'none' }}>
            Connecting airports
          </Button>
          
          <DurationFilter 
            filters={filters} 
            onFiltersChange={setFilters} 
          />
        </Stack>
      </Box>

      {/* Sort Tabs */}
      <Box sx={{ mb: 3 }}>
        <Grid container spacing={{ xs: 1, md: 2 }}>
          <Grid item xs={6}>
            <Paper
              sx={{
                p: { xs: 1.5, md: 2 },
                backgroundColor: sortBy === 'best' ? '#e8f0fe' : '#f8f9fa',
                border: sortBy === 'best' ? '2px solid #1976d2' : '1px solid #dadce0',
                cursor: 'pointer',
                borderRadius: '8px'
              }}
              onClick={() => setSortBy('best')}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#202124', fontSize: { xs: '1rem', md: '1.25rem' } }}>
                Best
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                Ranked based on price and convenience
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6}>
            <Paper
              sx={{
                p: { xs: 1.5, md: 2 },
                backgroundColor: sortBy === 'cheapest' ? '#e8f0fe' : '#f8f9fa',
                border: sortBy === 'cheapest' ? '2px solid #1976d2' : '1px solid #dadce0',
                cursor: 'pointer',
                borderRadius: '8px'
              }}
              onClick={() => setSortBy('cheapest')}
            >
              <Typography variant="h6" sx={{ fontWeight: 600, color: '#202124', fontSize: { xs: '1rem', md: '1.25rem' } }}>
                Cheapest
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
                from ₹{cheapestPrice?.toLocaleString()}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Top departing flights header */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#202124', mb: 1 }}>
          Top departing flights
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          Ranked based on price and convenience
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Prices include required taxes + fees for {searchData.adults} adult. Optional charges and bag fees may apply.
        </Typography>
      </Box>

      {/* Flight Results */}
      <Box sx={{ mb: 4 }}>
        {sortedFlights.map((flight, index) => (
          <Card key={flight.id} sx={{ mb: 2, border: '1px solid #dadce0', borderRadius: '8px', '&:hover': { boxShadow: 2 } }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              {flight.legs.map((leg, legIndex) => (
                <Box key={leg.id} sx={{ mb: legIndex < flight.legs.length - 1 ? 3 : 0 }}>
                  {/* Desktop Layout */}
                  <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Grid container spacing={2} alignItems="center">
                      {/* Airline Logo */}
                      <Grid item xs={1}>
                        <Avatar
                          src={leg.carriers.marketing[0]?.logoUrl}
                          sx={{ width: 32, height: 32 }}
                        />
                      </Grid>

                      {/* Flight Times */}
                      <Grid item xs={2}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#202124' }}>
                          {formatTime(leg.departure)} – {formatTime(leg.arrival)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {leg.carriers.marketing[0]?.name}
                        </Typography>
                      </Grid>

                      {/* Duration */}
                      <Grid item xs={2}>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#202124' }}>
                          {formatDuration(leg.durationInMinutes)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {leg.origin.displayCode}–{leg.destination.displayCode}
                        </Typography>
                      </Grid>

                      {/* Stops */}
                      <Grid item xs={2}>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#202124' }}>
                          {leg.stopCount === 0 ? 'Nonstop' : `${leg.stopCount} stop${leg.stopCount > 1 ? 's' : ''}`}
                        </Typography>
                      </Grid>

                      {/* Emissions */}
                      <Grid item xs={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: '#202124' }}>
                            {flight.sustainabilityData?.totalEmissions || 0} kg CO2e
                          </Typography>
                        </Box>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: getEmissionColor(flight.sustainabilityData?.emissionCategory || 'medium'),
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5
                          }}
                        >
                          {flight.sustainabilityData?.emissionPercentage > 0 ? '+' : ''}{flight.sustainabilityData?.emissionPercentage || 0}% {getEmissionText(flight.sustainabilityData?.emissionPercentage || 0)}
                        </Typography>
                      </Grid>

                      {/* Price */}
                      <Grid item xs={2}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#202124', textAlign: 'right' }}>
                          {flight.price.formatted}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right' }}>
                          {searchData.tripType === 'roundtrip' ? 'round trip' : 'one way'}
                        </Typography>
                      </Grid>

                      {/* Expand Button */}
                      <Grid item xs={1}>
                        <IconButton 
                          onClick={() => toggleFlightDetails(flight.id)}
                          size="small"
                        >
                          {expandedFlight === flight.id ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Mobile Layout */}
                  <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      {/* Left: Airline and Times */}
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Avatar
                            src={leg.carriers.marketing[0]?.logoUrl}
                            sx={{ width: 24, height: 24 }}
                          />
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                            {leg.carriers.marketing[0]?.name}
                          </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#202124', fontSize: '1rem' }}>
                          {formatTime(leg.departure)} – {formatTime(leg.arrival)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                          {leg.origin.displayCode}–{leg.destination.displayCode}
                        </Typography>
                      </Box>
                      
                      {/* Right: Price and Expand */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: '#202124', fontSize: '1rem' }}>
                            {flight.price.formatted}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                            {searchData.tripType === 'roundtrip' ? 'round trip' : 'one way'}
                          </Typography>
                        </Box>
                        <IconButton 
                          onClick={() => toggleFlightDetails(flight.id)}
                          size="small"
                        >
                          {expandedFlight === flight.id ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </Box>
                    </Box>
                    
                    {/* Bottom: Duration, Stops, Emissions */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#202124', fontSize: '0.875rem' }}>
                        {formatDuration(leg.durationInMinutes)}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#202124', fontSize: '0.875rem' }}>
                        {leg.stopCount === 0 ? 'Nonstop' : `${leg.stopCount} stop${leg.stopCount > 1 ? 's' : ''}`}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#202124', fontSize: '0.875rem' }}>
                        {flight.sustainabilityData?.totalEmissions || 0} kg CO2e
                      </Typography>
                    </Box>
                  </Box>

                  {/* Expanded Flight Details */}
                  <Collapse in={expandedFlight === flight.id}>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ pl: 5 }}>
                      {leg.segments.map((segment, segIndex) => (
                        <Box key={segment.id} sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {segment.marketingCarrier.name} {segment.flightNumber}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatTime(segment.departure)} - {formatTime(segment.arrival)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {segment.origin.name} → {segment.destination.name}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Collapse>
                </Box>
              ))}
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Track Prices Section */}
      <Paper sx={{ p: { xs: 2, md: 3 }, mb: 3, backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: { xs: 'wrap', md: 'nowrap' } }}>
          <TrendingUp sx={{ color: '#1976d2', display: { xs: 'none', md: 'block' } }} />
          <Box sx={{ flex: { xs: '1 1 100%', md: 'initial' }, mb: { xs: 2, md: 0 } }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#202124', fontSize: { xs: '1rem', md: '1.25rem' } }}>
              Track prices
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.75rem', md: '0.875rem' } }}>
              Get notified when prices change for this route
            </Typography>
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'block' } }} />
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', width: { xs: '100%', md: 'auto' } }}>
            <Button
              variant="outlined"
              startIcon={<CalendarToday />}
              sx={{ 
                borderRadius: '20px', 
                textTransform: 'none',
                fontSize: { xs: '0.75rem', md: '0.875rem' },
                px: { xs: 2, md: 3 },
                flex: { xs: 1, md: 'initial' }
              }}
            >
              Date grid
            </Button>
            <Button
              variant="outlined"
              startIcon={<ShowChart />}
              sx={{ 
                borderRadius: '20px', 
                textTransform: 'none',
                fontSize: { xs: '0.75rem', md: '0.875rem' },
                px: { xs: 2, md: 3 },
                flex: { xs: 1, md: 'initial' }
              }}
            >
              Price graph
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Other departing flights section */}
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#202124', mb: 2 }}>
          Other departing flights
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          These flights may have different departure times or airports
        </Typography>
        
        {/* Show a subset of flights for "other departing flights" */}
        {sortedFlights.slice(Math.floor(sortedFlights.length / 2)).map((flight, index) => (
          <Card key={`other-${flight.id}`} sx={{ mb: 2, border: '1px solid #dadce0', borderRadius: '8px' }}>
            <CardContent sx={{ p: { xs: 2, md: 3 } }}>
              {flight.legs.slice(0, 1).map((leg) => (
                <Box key={leg.id}>
                  {/* Desktop Layout */}
                  <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={1}>
                        <Avatar
                          src={leg.carriers.marketing[0]?.logoUrl}
                          sx={{ width: 32, height: 32 }}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#202124' }}>
                          {formatTime(leg.departure)} – {formatTime(leg.arrival)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {leg.carriers.marketing[0]?.name}
                        </Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#202124' }}>
                          {formatDuration(leg.durationInMinutes)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {leg.origin.displayCode}–{leg.destination.displayCode}
                        </Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#202124' }}>
                          {leg.stopCount === 0 ? 'Nonstop' : `${leg.stopCount} stop${leg.stopCount > 1 ? 's' : ''}`}
                        </Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#202124' }}>
                          {flight.sustainabilityData?.totalEmissions || 0} kg CO2e
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ color: getEmissionColor(flight.sustainabilityData?.emissionCategory || 'medium') }}
                        >
                          {flight.sustainabilityData?.emissionPercentage > 0 ? '+' : ''}{flight.sustainabilityData?.emissionPercentage || 0}% emissions
                        </Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#202124', textAlign: 'right' }}>
                          {flight.price.formatted}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right' }}>
                          round trip
                        </Typography>
                      </Grid>
                      <Grid item xs={1}>
                        <IconButton 
                          onClick={() => toggleFlightDetails(flight.id)}
                          size="small"
                        >
                          {expandedFlight === flight.id ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>

                  {/* Mobile Layout */}
                  <Box sx={{ display: { xs: 'block', md: 'none' } }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      {/* Left: Airline and Times */}
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <Avatar
                            src={leg.carriers.marketing[0]?.logoUrl}
                            sx={{ width: 24, height: 24 }}
                          />
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                            {leg.carriers.marketing[0]?.name}
                          </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: '#202124', fontSize: '1rem' }}>
                          {formatTime(leg.departure)} – {formatTime(leg.arrival)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                          {leg.origin.displayCode}–{leg.destination.displayCode}
                        </Typography>
                      </Box>
                      
                      {/* Right: Price and Expand */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ textAlign: 'right' }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, color: '#202124', fontSize: '1rem' }}>
                            {flight.price.formatted}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                            round trip
                          </Typography>
                        </Box>
                        <IconButton 
                          onClick={() => toggleFlightDetails(flight.id)}
                          size="small"
                        >
                          {expandedFlight === flight.id ? <ExpandLess /> : <ExpandMore />}
                        </IconButton>
                      </Box>
                    </Box>
                    
                    {/* Bottom: Duration, Stops, Emissions */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#202124', fontSize: '0.875rem' }}>
                        {formatDuration(leg.durationInMinutes)}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#202124', fontSize: '0.875rem' }}>
                        {leg.stopCount === 0 ? 'Nonstop' : `${leg.stopCount} stop${leg.stopCount > 1 ? 's' : ''}`}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#202124', fontSize: '0.875rem' }}>
                        {flight.sustainabilityData?.totalEmissions || 0} kg CO2e
                      </Typography>
                    </Box>
                  </Box>

                  {/* Expanded Flight Details */}
                  <Collapse in={expandedFlight === flight.id}>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ pl: 5 }}>
                      {leg.segments.map((segment, segIndex) => (
                        <Box key={segment.id} sx={{ mb: 2 }}>
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {segment.marketingCarrier.name} {segment.flightNumber}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {formatTime(segment.departure)} - {formatTime(segment.arrival)}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {segment.origin.name} → {segment.destination.name}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Collapse>
                </Box>
              ))}
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Filter Modal */}
      <FilterModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        flights={flightData?.data?.itineraries || []}
      />
    </Box>
  );
};

export default FlightResults; 