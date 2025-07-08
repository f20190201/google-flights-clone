import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
  Card,
  CardContent,
  Divider,
  InputAdornment,
  IconButton,
  Autocomplete,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  FlightTakeoff,
  FlightLand,
  Person,
  Search,
  SwapHoriz,
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { logTestInstructions } from '../utils/testData';
import { initializeMockFlightData } from '../services/mockFlightService';

// Mock API data for development (moved outside component to avoid re-renders)
const mockAirportData = [
  {
    "presentation": {
      "title": "New York",
      "suggestionTitle": "New York (Any)",
      "subtitle": "United States"
    },
    "navigation": {
      "entityId": "27537542",
      "entityType": "CITY",
      "localizedName": "New York",
      "relevantFlightParams": {
        "skyId": "NYCA",
        "entityId": "27537542",
        "flightPlaceType": "CITY",
        "localizedName": "New York"
      }
    }
  },
  {
    "presentation": {
      "title": "New York Newark",
      "suggestionTitle": "New York Newark (EWR)",
      "subtitle": "United States"
    },
    "navigation": {
      "entityId": "95565059",
      "entityType": "AIRPORT",
      "localizedName": "New York Newark",
      "relevantFlightParams": {
        "skyId": "EWR",
        "entityId": "95565059",
        "flightPlaceType": "AIRPORT",
        "localizedName": "New York Newark"
      }
    }
  },
  {
    "presentation": {
      "title": "New York John F. Kennedy",
      "suggestionTitle": "New York John F. Kennedy (JFK)",
      "subtitle": "United States"
    },
    "navigation": {
      "entityId": "95565058",
      "entityType": "AIRPORT",
      "localizedName": "New York John F. Kennedy",
      "relevantFlightParams": {
        "skyId": "JFK",
        "entityId": "95565058",
        "flightPlaceType": "AIRPORT",
        "localizedName": "New York John F. Kennedy"
      }
    }
  },
  {
    "presentation": {
      "title": "New York LaGuardia",
      "suggestionTitle": "New York LaGuardia (LGA)",
      "subtitle": "United States"
    },
    "navigation": {
      "entityId": "95565057",
      "entityType": "AIRPORT",
      "localizedName": "New York LaGuardia",
      "relevantFlightParams": {
        "skyId": "LGA",
        "entityId": "95565057",
        "flightPlaceType": "AIRPORT",
        "localizedName": "New York LaGuardia"
      }
    }
  },
  {
    "presentation": {
      "title": "Los Angeles",
      "suggestionTitle": "Los Angeles (Any)",
      "subtitle": "United States"
    },
    "navigation": {
      "entityId": "27537533",
      "entityType": "CITY",
      "localizedName": "Los Angeles",
      "relevantFlightParams": {
        "skyId": "LAXA",
        "entityId": "27537533",
        "flightPlaceType": "CITY",
        "localizedName": "Los Angeles"
      }
    }
  },
  {
    "presentation": {
      "title": "Los Angeles International",
      "suggestionTitle": "Los Angeles International (LAX)",
      "subtitle": "United States"
    },
    "navigation": {
      "entityId": "95565050",
      "entityType": "AIRPORT",
      "localizedName": "Los Angeles International",
      "relevantFlightParams": {
        "skyId": "LAX",
        "entityId": "95565050",
        "flightPlaceType": "AIRPORT",
        "localizedName": "Los Angeles International"
      }
    }
  },
  {
    "presentation": {
      "title": "Chicago",
      "suggestionTitle": "Chicago (Any)",
      "subtitle": "United States"
    },
    "navigation": {
      "entityId": "27537455",
      "entityType": "CITY",
      "localizedName": "Chicago",
      "relevantFlightParams": {
        "skyId": "CHIA",
        "entityId": "27537455",
        "flightPlaceType": "CITY",
        "localizedName": "Chicago"
      }
    }
  },
  {
    "presentation": {
      "title": "Chicago O'Hare",
      "suggestionTitle": "Chicago O'Hare (ORD)",
      "subtitle": "United States"
    },
    "navigation": {
      "entityId": "95565078",
      "entityType": "AIRPORT",
      "localizedName": "Chicago O'Hare",
      "relevantFlightParams": {
        "skyId": "ORD",
        "entityId": "95565078",
        "flightPlaceType": "AIRPORT",
        "localizedName": "Chicago O'Hare"
      }
    }
  },
  {
    "presentation": {
      "title": "Chicago Midway",
      "suggestionTitle": "Chicago Midway (MDW)",
      "subtitle": "United States"
    },
    "navigation": {
      "entityId": "95565077",
      "entityType": "AIRPORT",
      "localizedName": "Chicago Midway",
      "relevantFlightParams": {
        "skyId": "MDW",
        "entityId": "95565077",
        "flightPlaceType": "AIRPORT",
        "localizedName": "Chicago Midway"
      }
    }
  },
  {
    "presentation": {
      "title": "Miami",
      "suggestionTitle": "Miami (Any)",
      "subtitle": "United States"
    },
    "navigation": {
      "entityId": "27537534",
      "entityType": "CITY",
      "localizedName": "Miami",
      "relevantFlightParams": {
        "skyId": "MIAA",
        "entityId": "27537534",
        "flightPlaceType": "CITY",
        "localizedName": "Miami"
      }
    }
  },
  {
    "presentation": {
      "title": "Miami International",
      "suggestionTitle": "Miami International (MIA)",
      "subtitle": "United States"
    },
    "navigation": {
      "entityId": "95565066",
      "entityType": "AIRPORT",
      "localizedName": "Miami International",
      "relevantFlightParams": {
        "skyId": "MIA",
        "entityId": "95565066",
        "flightPlaceType": "AIRPORT",
        "localizedName": "Miami International"
      }
    }
  },
  {
    "presentation": {
      "title": "Bengaluru",
      "suggestionTitle": "Bengaluru (BLR)",
      "subtitle": "India"
    },
    "navigation": {
      "entityId": "27537101",
      "entityType": "AIRPORT",
      "localizedName": "Bengaluru",
      "relevantFlightParams": {
        "skyId": "BLR",
        "entityId": "27537101",
        "flightPlaceType": "AIRPORT",
        "localizedName": "Bengaluru"
      }
    }
  },
  {
    "presentation": {
      "title": "Delhi",
      "suggestionTitle": "Delhi (DEL)",
      "subtitle": "India"
    },
    "navigation": {
      "entityId": "27537102",
      "entityType": "AIRPORT",
      "localizedName": "Delhi",
      "relevantFlightParams": {
        "skyId": "DEL",
        "entityId": "27537102",
        "flightPlaceType": "AIRPORT",
        "localizedName": "Delhi"
      }
    }
  },
  {
    "presentation": {
      "title": "Mumbai",
      "suggestionTitle": "Mumbai (BOM)",
      "subtitle": "India"
    },
    "navigation": {
      "entityId": "27537103",
      "entityType": "AIRPORT",
      "localizedName": "Mumbai",
      "relevantFlightParams": {
        "skyId": "BOM",
        "entityId": "27537103",
        "flightPlaceType": "AIRPORT",
        "localizedName": "Mumbai"
      }
    }
  },
  {
    "presentation": {
      "title": "Bhubaneswar",
      "suggestionTitle": "Bhubaneswar (BBI)",
      "subtitle": "India"
    },
    "navigation": {
      "entityId": "27537100",
      "entityType": "AIRPORT",
      "localizedName": "Bhubaneswar",
      "relevantFlightParams": {
        "skyId": "BBI",
        "entityId": "27537100",
        "flightPlaceType": "AIRPORT",
        "localizedName": "Bhubaneswar"
      }
    }
  },
  {
    "presentation": {
      "title": "San Francisco",
      "suggestionTitle": "San Francisco (Any)",
      "subtitle": "United States"
    },
    "navigation": {
      "entityId": "27537550",
      "entityType": "CITY",
      "localizedName": "San Francisco",
      "relevantFlightParams": {
        "skyId": "SFOA",
        "entityId": "27537550",
        "flightPlaceType": "CITY",
        "localizedName": "San Francisco"
      }
    }
  },
  {
    "presentation": {
      "title": "San Francisco International",
      "suggestionTitle": "San Francisco International (SFO)",
      "subtitle": "United States"
    },
    "navigation": {
      "entityId": "95565095",
      "entityType": "AIRPORT",
      "localizedName": "San Francisco International",
      "relevantFlightParams": {
        "skyId": "SFO",
        "entityId": "95565095",
        "flightPlaceType": "AIRPORT",
        "localizedName": "San Francisco International"
      }
    }
  },
  {
    "presentation": {
      "title": "Las Vegas",
      "suggestionTitle": "Las Vegas (Any)",
      "subtitle": "United States"
    },
    "navigation": {
      "entityId": "27537515",
      "entityType": "CITY",
      "localizedName": "Las Vegas",
      "relevantFlightParams": {
        "skyId": "LASA",
        "entityId": "27537515",
        "flightPlaceType": "CITY",
        "localizedName": "Las Vegas"
      }
    }
  },
  {
    "presentation": {
      "title": "Las Vegas McCarran",
      "suggestionTitle": "Las Vegas McCarran (LAS)",
      "subtitle": "United States"
    },
    "navigation": {
      "entityId": "95565062",
      "entityType": "AIRPORT",
      "localizedName": "Las Vegas McCarran",
      "relevantFlightParams": {
        "skyId": "LAS",
        "entityId": "95565062",
        "flightPlaceType": "AIRPORT",
        "localizedName": "Las Vegas McCarran"
      }
    }
  },
  {
    "presentation": {
      "title": "Boston",
      "suggestionTitle": "Boston (Any)",
      "subtitle": "United States"
    },
    "navigation": {
      "entityId": "27537435",
      "entityType": "CITY",
      "localizedName": "Boston",
      "relevantFlightParams": {
        "skyId": "BOSA",
        "entityId": "27537435",
        "flightPlaceType": "CITY",
        "localizedName": "Boston"
      }
    }
  },
  {
    "presentation": {
      "title": "Boston Logan",
      "suggestionTitle": "Boston Logan (BOS)",
      "subtitle": "United States"
    },
    "navigation": {
      "entityId": "95565041",
      "entityType": "AIRPORT",
      "localizedName": "Boston Logan",
      "relevantFlightParams": {
        "skyId": "BOS",
        "entityId": "95565041",
        "flightPlaceType": "AIRPORT",
        "localizedName": "Boston Logan"
      }
    }
  },
  {
    "presentation": {
      "title": "Seattle",
      "suggestionTitle": "Seattle (Any)",
      "subtitle": "United States"
    },
    "navigation": {
      "entityId": "27537549",
      "entityType": "CITY",
      "localizedName": "Seattle",
      "relevantFlightParams": {
        "skyId": "SEAA",
        "entityId": "27537549",
        "flightPlaceType": "CITY",
        "localizedName": "Seattle"
      }
    }
  },
  {
    "presentation": {
      "title": "Seattle Tacoma",
      "suggestionTitle": "Seattle Tacoma (SEA)",
      "subtitle": "United States"
    },
    "navigation": {
      "entityId": "95565094",
      "entityType": "AIRPORT",
      "localizedName": "Seattle Tacoma",
      "relevantFlightParams": {
        "skyId": "SEA",
        "entityId": "95565094",
        "flightPlaceType": "AIRPORT",
        "localizedName": "Seattle Tacoma"
      }
    }
  },
  {
    "presentation": {
      "title": "Denver",
      "suggestionTitle": "Denver (Any)",
      "subtitle": "United States"
    },
    "navigation": {
      "entityId": "27537462",
      "entityType": "CITY",
      "localizedName": "Denver",
      "relevantFlightParams": {
        "skyId": "DENA",
        "entityId": "27537462",
        "flightPlaceType": "CITY",
        "localizedName": "Denver"
      }
    }
  },
  {
    "presentation": {
      "title": "Denver International",
      "suggestionTitle": "Denver International (DEN)",
      "subtitle": "United States"
    },
    "navigation": {
      "entityId": "95565046",
      "entityType": "AIRPORT",
      "localizedName": "Denver International",
      "relevantFlightParams": {
        "skyId": "DEN",
        "entityId": "95565046",
        "flightPlaceType": "AIRPORT",
        "localizedName": "Denver International"
      }
    }
  }
];

const FlightSearch = () => {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState('roundtrip');
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [departureDate, setDepartureDate] = useState(dayjs());
  const [returnDate, setReturnDate] = useState(dayjs().add(7, 'day'));
  const [passengers, setPassengers] = useState(1);
  const [travelClass, setTravelClass] = useState('economy');
  
  // Autocomplete states
  const [originOptions, setOriginOptions] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [originLoading, setOriginLoading] = useState(false);
  const [destinationLoading, setDestinationLoading] = useState(false);
  const [originInputValue, setOriginInputValue] = useState('');
  const [destinationInputValue, setDestinationInputValue] = useState('');

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };



  // Initialize localStorage with mock data
  useEffect(() => {
    const existingData = localStorage.getItem('mockAirportData');
    if (!existingData) {
      localStorage.setItem('mockAirportData', JSON.stringify(mockAirportData));
    }
    
    // Initialize mock flight data
    initializeMockFlightData();
    
    // Log test instructions for developers
    logTestInstructions();
    
    // Add a test button to console for easy testing
    window.testFlightSearch = () => {
      const testParams = new URLSearchParams({
        tripType: 'roundtrip',
        originSkyId: 'BLR',
        destinationSkyId: 'DEL',
        originName: 'Bengaluru',
        destinationName: 'Delhi',
        departureDate: '2024-07-01',
        returnDate: '2024-07-08',
        adults: '1',
        cabinClass: 'economy'
      });
      navigate(`/results?${testParams.toString()}`);
    };
    
    console.log('🧪 Test function available: window.testFlightSearch() - Run this in console to test results page');
  }, []);

  // Mock API call function using localStorage
  const searchAirports = async (query) => {
    if (!query || query.length < 2) return [];
    
    try {
      // Get data from localStorage
      const storedData = localStorage.getItem('mockAirportData');
      const airportData = storedData ? JSON.parse(storedData) : mockAirportData;
      
      // Filter data based on query
      const filteredResults = airportData.filter(airport => 
        airport.presentation.title.toLowerCase().includes(query.toLowerCase()) ||
        airport.presentation.suggestionTitle.toLowerCase().includes(query.toLowerCase()) ||
        airport.navigation.relevantFlightParams.skyId.toLowerCase().includes(query.toLowerCase())
      );
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 200));
      
      return filteredResults;
    } catch (error) {
      console.error('Error searching airports:', error);
      return [];
    }
  };

  // Debounced search functions
  const debouncedOriginSearch = useCallback(
    debounce(async (query) => {
      if (query.length >= 2) {
        setOriginLoading(true);
        const results = await searchAirports(query);
        setOriginOptions(results);
        setOriginLoading(false);
      } else {
        setOriginOptions([]);
      }
    }, 500),
    []
  );

  const debouncedDestinationSearch = useCallback(
    debounce(async (query) => {
      if (query.length >= 2) {
        setDestinationLoading(true);
        const results = await searchAirports(query);
        setDestinationOptions(results);
        setDestinationLoading(false);
      } else {
        setDestinationOptions([]);
      }
    }, 500),
    []
  );

  // Handle input changes
  useEffect(() => {
    if (originInputValue) {
      debouncedOriginSearch(originInputValue);
    }
  }, [originInputValue, debouncedOriginSearch]);

  useEffect(() => {
    if (destinationInputValue) {
      debouncedDestinationSearch(destinationInputValue);
    }
  }, [destinationInputValue, debouncedDestinationSearch]);

  const handleTripTypeChange = (event, newTripType) => {
    if (newTripType !== null) {
      setTripType(newTripType);
    }
  };

  const handleSwapLocations = () => {
    const temp = origin;
    const tempInput = originInputValue;
    const tempOptions = originOptions;
    
    setOrigin(destination);
    setDestination(temp);
    setOriginInputValue(destinationInputValue);
    setDestinationInputValue(tempInput);
    setOriginOptions(destinationOptions);
    setDestinationOptions(tempOptions);
  };

  const handleSearch = () => {
    if (!origin || !destination) return;

    // Map travel class to API expected format
    const cabinClassMap = {
      'economy': 'economy',
      'premium': 'premium_economy',
      'business': 'business',
      'first': 'first'
    };

    const searchParams = new URLSearchParams({
      tripType,
      originSkyId: origin.navigation.relevantFlightParams.skyId,
      destinationSkyId: destination.navigation.relevantFlightParams.skyId,
      originEntityId: origin.navigation.entityId,
      destinationEntityId: destination.navigation.entityId,
      originName: origin.presentation.title,
      destinationName: destination.presentation.title,
      departureDate: departureDate.format('YYYY-MM-DD'),
      adults: passengers.toString(),
      cabinClass: cabinClassMap[travelClass] || 'economy',
    });

    // Add return date for round trips
    if (tripType === 'roundtrip') {
      searchParams.append('returnDate', returnDate.format('YYYY-MM-DD'));
    }

    // Navigate to results page with search parameters
    navigate(`/results?${searchParams.toString()}`);
  };

  return (
    <Box sx={{ maxWidth: '1000px', margin: '0 auto', padding: '0 16px' }}>
      <Box mb={4} textAlign="center">
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            marginBottom: 2, 
            color: '#424242', 
            fontWeight: 600,
            fontSize: { xs: '28px', md: '32px' }
          }}
        >
          Search Flights
        </Typography>
        <Typography 
          variant="subtitle1" 
          sx={{ 
            color: '#666', 
            fontSize: '16px' 
          }}
        >
          Find and book your perfect flight
        </Typography>
      </Box>

      <Card elevation={3} sx={{ marginBottom: 4 }}>
        <CardContent sx={{ padding: '32px' }}>
          {/* Trip Type Selection */}
          <Box mb={3}>
            <ToggleButtonGroup
              value={tripType}
              exclusive
              onChange={handleTripTypeChange}
              aria-label="trip type"
              sx={{ 
                marginBottom: 2,
                '& .MuiToggleButton-root': {
                  textTransform: 'none',
                  fontWeight: 500,
                  padding: '8px 24px',
                  borderRadius: '8px',
                  marginRight: '8px',
                  '&.Mui-selected': {
                    backgroundColor: '#1976d2',
                    color: 'white',
                  }
                }
              }}
            >
              <ToggleButton value="roundtrip" aria-label="round trip">
                Round Trip
              </ToggleButton>
              <ToggleButton value="oneway" aria-label="one way">
                One Way
              </ToggleButton>
              
            </ToggleButtonGroup>
          </Box>

          {/* Origin/Destination and Dates Layout */}
          <Grid container spacing={2} sx={{ marginBottom: 3 }}>
            {/* Origin and Departure Date Column */}
            <Grid item xs={12} md={5}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Autocomplete
                  fullWidth
                  options={originOptions}
                  value={origin}
                  onChange={(event, newValue) => setOrigin(newValue)}
                  inputValue={originInputValue}
                  onInputChange={(event, newInputValue) => setOriginInputValue(newInputValue)}
                  loading={originLoading}
                  getOptionLabel={(option) => option?.presentation?.suggestionTitle || ''}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} key={option.navigation.entityId}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {option.presentation.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.presentation.subtitle}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="From"
                      placeholder="Origin airport"
                      size="medium"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <FlightTakeoff sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <>
                            {originLoading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  noOptionsText="Type to search airports..."
                />
                <DatePicker
                  label="Departure Date"
                  value={departureDate}
                  onChange={(newValue) => setDepartureDate(newValue)}
                  renderInput={(params) => <TextField {...params} fullWidth size="medium" />}
                  minDate={dayjs()}
                />
              </Box>
            </Grid>
            
            {/* Swap Button */}
            <Grid item xs={12} md={2}>
              <Box display="flex" justifyContent="center" alignItems="normal" height="100%">
                <IconButton 
                  onClick={handleSwapLocations}
                  className="bg-blue-50 hover:bg-blue-100 transition-colors"
                  size="large"
                  sx={{ 
                    width: 48, 
                    height: 48,
                    border: '1px solid #e3f2fd'
                  }}
                >
                  <SwapHoriz className="text-google-blue" />
                </IconButton>
              </Box>
            </Grid>
            
            {/* Destination and Return Date Column */}
            <Grid item xs={12} md={5}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Autocomplete
                  fullWidth
                  options={destinationOptions}
                  value={destination}
                  onChange={(event, newValue) => setDestination(newValue)}
                  inputValue={destinationInputValue}
                  onInputChange={(event, newInputValue) => setDestinationInputValue(newInputValue)}
                  loading={destinationLoading}
                  getOptionLabel={(option) => option?.presentation?.suggestionTitle || ''}
                  renderOption={(props, option) => (
                    <Box component="li" {...props} key={option.navigation.entityId}>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {option.presentation.title}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {option.presentation.subtitle}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="To"
                      placeholder="Destination airport"
                      size="medium"
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <FlightLand sx={{ color: 'text.secondary' }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <>
                            {destinationLoading ? <CircularProgress color="inherit" size={20} /> : null}
                            {params.InputProps.endAdornment}
                          </>
                        ),
                      }}
                    />
                  )}
                  noOptionsText="Type to search airports..."
                />
                {tripType === 'roundtrip' && (
                  <DatePicker
                    label="Return Date"
                    value={returnDate}
                    onChange={(newValue) => setReturnDate(newValue)}
                    renderInput={(params) => <TextField {...params} fullWidth size="medium" />}
                    minDate={departureDate}
                  />
                )}
              </Box>
            </Grid>
          </Grid>
          <hr className='my-7' />

          {/* Passengers and Class */}
          <Grid container spacing={2} sx={{ marginBottom: 4 }} justifyContent="space-between" >
            <Grid item xs={12} md={5}>
              <FormControl fullWidth size="medium">
                <InputLabel>Passengers</InputLabel>
                <Select
                  value={passengers}
                  label="Passengers"
                  onChange={(e) => setPassengers(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <Person className="text-gray-500 ml-2" />
                    </InputAdornment>
                  }
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <MenuItem key={num} value={num}>
                      {num} {num === 1 ? 'Passenger' : 'Passengers'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={5}>
              <FormControl fullWidth size="medium">
                <InputLabel>Class</InputLabel>
                <Select
                  value={travelClass}
                  label="Class"
                  onChange={(e) => setTravelClass(e.target.value)}
                >
                  <MenuItem value="economy">Economy</MenuItem>
                  <MenuItem value="premium">Premium Economy</MenuItem>
                  <MenuItem value="business">Business</MenuItem>
                  <MenuItem value="first">First Class</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ marginY: 3 }} />

          {/* Search Button */}
          <Box display="flex" justifyContent="center" alignItems="center" mt={2} gap={2}>
            <Button
              variant="contained"
              size="large"
              onClick={handleSearch}
              startIcon={<Search />}
              disabled={!origin || !destination}
              sx={{
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
                padding: '12px 32px',
                fontSize: '16px',
                fontWeight: 600,
                borderRadius: '8px',
                textTransform: 'none',
                minWidth: '200px',
                boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                '&:hover': {
                  boxShadow: '0 6px 16px rgba(25, 118, 210, 0.4)',
                }
              }}
            >
              Search Flights
            </Button>
            
            {/* Test button for easy demo - smaller and more subtle */}
            <Button
              variant="text"
              size="small"
              onClick={() => {
                const testParams = new URLSearchParams({
                  tripType: 'roundtrip',
                  originSkyId: 'BLR',
                  destinationSkyId: 'DEL',
                  originName: 'Bengaluru',
                  destinationName: 'Delhi',
                  departureDate: '2024-07-01',
                  returnDate: '2024-07-08',
                  adults: '1',
                  cabinClass: 'economy'
                });
                navigate(`/results?${testParams.toString()}`);
              }}
              sx={{
                fontSize: '12px',
                fontWeight: 400,
                color: '#666',
                textTransform: 'none',
                padding: '4px 8px',
                '&:hover': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  color: '#1976d2'
                }
              }}
            >
              Test Demo
            </Button>
          </Box>
        </CardContent>
      </Card>

      
    </Box>
  );
};

export default FlightSearch; 