// Mock flight service using localStorage for development and demo purposes

const MOCK_FLIGHT_DATA_KEY = 'mockFlightData';

// Generate comprehensive mock flight data
const generateMockFlightData = () => {
  const airlines = [
    { id: 'AI', name: 'Air India', logoUrl: 'https://logos.skyscnr.com/images/airlines/favicon/AI.png' },
    { id: 'IX', name: 'Air India Express', logoUrl: 'https://logos.skyscnr.com/images/airlines/favicon/IX.png' },
    { id: '6E', name: 'IndiGo', logoUrl: 'https://logos.skyscnr.com/images/airlines/favicon/6E.png' },
    { id: 'SG', name: 'SpiceJet', logoUrl: 'https://logos.skyscnr.com/images/airlines/favicon/SG.png' },
    { id: 'UK', name: 'Vistara', logoUrl: 'https://logos.skyscnr.com/images/airlines/favicon/UK.png' },
    { id: 'G8', name: 'GoAir', logoUrl: 'https://logos.skyscnr.com/images/airlines/favicon/G8.png' },
    { id: 'I5', name: 'AirAsia India', logoUrl: 'https://logos.skyscnr.com/images/airlines/favicon/I5.png' },
    { id: 'EI', name: 'Aer Lingus', logoUrl: 'https://logos.skyscnr.com/images/airlines/favicon/EI.png' },
    { id: 'BA', name: 'British Airways', logoUrl: 'https://logos.skyscnr.com/images/airlines/favicon/BA.png' },
    { id: 'LH', name: 'Lufthansa', logoUrl: 'https://logos.skyscnr.com/images/airlines/favicon/LH.png' },
    { id: 'AF', name: 'Air France', logoUrl: 'https://logos.skyscnr.com/images/airlines/favicon/AF.png' },
    { id: 'DL', name: 'Delta', logoUrl: 'https://logos.skyscnr.com/images/airlines/favicon/DL.png' },
    { id: 'AA', name: 'American Airlines', logoUrl: 'https://logos.skyscnr.com/images/airlines/favicon/AA.png' },
    { id: 'UA', name: 'United Airlines', logoUrl: 'https://logos.skyscnr.com/images/airlines/favicon/UA.png' }
  ];

  const airports = {
    'BBI': { code: 'BBI', name: 'Bhubaneswar', city: 'Bhubaneswar' },
    'BLR': { code: 'BLR', name: 'Bengaluru', city: 'Bengaluru' },
    'DEL': { code: 'DEL', name: 'Delhi', city: 'Delhi' },
    'BOM': { code: 'BOM', name: 'Mumbai', city: 'Mumbai' },
    'JFK': { code: 'JFK', name: 'John F. Kennedy', city: 'New York' },
    'LAX': { code: 'LAX', name: 'Los Angeles Intl', city: 'Los Angeles' },
    'LHR': { code: 'LHR', name: 'London Heathrow', city: 'London' },
    'CDG': { code: 'CDG', name: 'Charles de Gaulle', city: 'Paris' },
    'DUB': { code: 'DUB', name: 'Dublin Airport', city: 'Dublin' },
    'FRA': { code: 'FRA', name: 'Frankfurt', city: 'Frankfurt' },
    'MAA': { code: 'MAA', name: 'Chennai', city: 'Chennai' },
    'CCU': { code: 'CCU', name: 'Kolkata', city: 'Kolkata' },
    'HYD': { code: 'HYD', name: 'Hyderabad', city: 'Hyderabad' },
    'PNQ': { code: 'PNQ', name: 'Pune', city: 'Pune' },
    'GOI': { code: 'GOI', name: 'Goa', city: 'Goa' }
  };

  // Helper function to get airport info with fallback
  const getAirportInfo = (code) => {
    // Clean up the airport code - remove 'A' suffix if present
    const cleanCode = code ? code.replace(/A$/, '').toUpperCase() : '';
    
    if (airports[cleanCode]) {
      return airports[cleanCode];
    }
    
    // Fallback airport if code not found
    return {
      code: cleanCode || 'BLR',
      name: cleanCode ? `${cleanCode} Airport` : 'Bengaluru',
      city: cleanCode ? `${cleanCode} City` : 'Bengaluru'
    };
  };

  // Generate flight data for different routes
  const generateFlightsForRoute = (origin, destination, date, returnDate = null) => {
    console.log('Generating flights for:', { origin, destination, date, returnDate });
    
    const originAirport = getAirportInfo(origin);
    const destAirport = getAirportInfo(destination);
    const flights = [];

    // Generate 8-12 flights per route
    const flightCount = Math.floor(Math.random() * 5) + 8;
    
    for (let i = 0; i < flightCount; i++) {
      const airline = airlines[Math.floor(Math.random() * airlines.length)];
      const isNonstop = Math.random() > 0.4; // 60% nonstop flights
      const stopCount = isNonstop ? 0 : Math.floor(Math.random() * 2) + 1;
      
      // Generate realistic flight times
      const departureHour = Math.floor(Math.random() * 24);
      const departureMinute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
      const flightDuration = isNonstop ? 
        Math.floor(Math.random() * 180) + 120 : // 2-5 hours for nonstop
        Math.floor(Math.random() * 360) + 240;  // 4-10 hours for stops
      
      const departureTime = new Date(date);
      departureTime.setHours(departureHour, departureMinute, 0, 0);
      
      const arrivalTime = new Date(departureTime.getTime() + flightDuration * 60000);
      
      // Generate price based on various factors
      let basePrice = 200 + Math.floor(Math.random() * 800);
      if (!isNonstop) basePrice *= 0.8; // Stops are cheaper
      if (airline.id === 'AI' || airline.id === 'BA') basePrice *= 1.2; // Premium airlines
      if (departureHour >= 6 && departureHour <= 9) basePrice *= 1.1; // Morning premium
      
      const price = Math.floor(basePrice);
      
      // Generate emissions data
      const emissions = Math.floor(Math.random() * 200) + 80; // 80-280 kg CO2e
      const avgEmissions = 150;
      const emissionDiff = ((emissions - avgEmissions) / avgEmissions * 100);
      
      const legs = [];
      
      // Create outbound leg
      legs.push({
        id: `${originAirport.code}-${destAirport.code}-${date}-${i}`,
        origin: {
          id: originAirport.code,
          name: originAirport.name,
          displayCode: originAirport.code,
          city: originAirport.city
        },
        destination: {
          id: destAirport.code,
          name: destAirport.name,
          displayCode: destAirport.code,
          city: destAirport.city
        },
        departure: departureTime.toISOString(),
        arrival: arrivalTime.toISOString(),
        durationInMinutes: flightDuration,
        stopCount: stopCount,
        carriers: {
          marketing: [airline]
        },
        segments: [{
          id: `${originAirport.code}-${destAirport.code}-${departureTime.getTime()}`,
          origin: {
            flightPlaceId: originAirport.code,
            displayCode: originAirport.code,
            name: originAirport.name
          },
          destination: {
            flightPlaceId: destAirport.code,
            displayCode: destAirport.code,
            name: destAirport.name
          },
          departure: departureTime.toISOString(),
          arrival: arrivalTime.toISOString(),
          durationInMinutes: flightDuration,
          flightNumber: (Math.floor(Math.random() * 9000) + 1000).toString(),
          marketingCarrier: airline,
          operatingCarrier: airline
        }]
      });

      // Add return leg for round trips
      if (returnDate) {
        const returnDepartureTime = new Date(returnDate);
        returnDepartureTime.setHours(
          Math.floor(Math.random() * 24),
          Math.floor(Math.random() * 4) * 15,
          0, 0
        );
        const returnArrivalTime = new Date(returnDepartureTime.getTime() + flightDuration * 60000);
        
        legs.push({
          id: `${destAirport.code}-${originAirport.code}-${returnDate}-${i}`,
          origin: {
            id: destAirport.code,
            name: destAirport.name,
            displayCode: destAirport.code,
            city: destAirport.city
          },
          destination: {
            id: originAirport.code,
            name: originAirport.name,
            displayCode: originAirport.code,
            city: originAirport.city
          },
          departure: returnDepartureTime.toISOString(),
          arrival: returnArrivalTime.toISOString(),
          durationInMinutes: flightDuration,
          stopCount: stopCount,
          carriers: {
            marketing: [airline]
          },
          segments: [{
            id: `${destAirport.code}-${originAirport.code}-${returnDepartureTime.getTime()}`,
            origin: {
              flightPlaceId: destAirport.code,
              displayCode: destAirport.code,
              name: destAirport.name
            },
            destination: {
              flightPlaceId: originAirport.code,
              displayCode: originAirport.code,
              name: originAirport.name
            },
            departure: returnDepartureTime.toISOString(),
            arrival: returnArrivalTime.toISOString(),
            durationInMinutes: flightDuration,
            flightNumber: (Math.floor(Math.random() * 9000) + 1000).toString(),
            marketingCarrier: airline,
            operatingCarrier: airline
          }]
        });
      }

      // Determine flight tags
      const tags = [];
      if (i === 0) tags.push('cheapest');
      if (i === 1) tags.push('second_cheapest');
      if (i === 2) tags.push('third_cheapest');
      if (isNonstop && flightDuration < 180) tags.push('shortest');
      if (emissionDiff < -10) tags.push('low_emissions');

      flights.push({
        id: `flight-${originAirport.code}-${destAirport.code}-${i}`,
        price: {
          raw: price,
          formatted: `₹${price.toLocaleString()}`
        },
        legs: legs,
        sustainabilityData: {
          totalEmissions: emissions,
          emissionPercentage: Math.round(emissionDiff),
          emissionCategory: emissionDiff < -10 ? 'low' : emissionDiff > 10 ? 'high' : 'medium'
        },
        // Keep old format for backward compatibility
        emissions: {
          kg: emissions,
          percentage: Math.round(emissionDiff),
          category: emissionDiff < -10 ? 'low' : emissionDiff > 10 ? 'high' : 'avg'
        },
        tags: tags,
        score: Math.random(),
        duration: flightDuration,
        stops: stopCount,
        airline: airline.name
      });
    }

    console.log(`Generated ${flights.length} flights successfully`);
    return flights.sort((a, b) => a.price.raw - b.price.raw); // Sort by price
  };

  return {
    generateFlightsForRoute
  };
};

// Initialize mock data in localStorage
export const initializeMockFlightData = () => {
  try {
    const existingData = localStorage.getItem(MOCK_FLIGHT_DATA_KEY);
    if (!existingData) {
      const mockData = generateMockFlightData();
      localStorage.setItem(MOCK_FLIGHT_DATA_KEY, JSON.stringify(mockData));
      console.log('Mock flight data initialized successfully');
    }
  } catch (error) {
    console.error('Error initializing mock flight data:', error);
  }
};

// Mock flight search function
export const searchMockFlights = async (searchParams) => {
  console.log('Mock flight search called with params:', searchParams);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

  try {
    // Always initialize mock data
    initializeMockFlightData();
    const mockDataGenerator = generateMockFlightData();
    
    // Extract and clean parameters with fallbacks
    const originCode = searchParams.originSkyId || searchParams.originName || 'BLR';
    const destinationCode = searchParams.destinationSkyId || searchParams.destinationName || 'DEL';
    const departureDate = searchParams.departureDate || new Date().toISOString().split('T')[0];
    const returnDate = searchParams.returnDate;
    
    console.log('Processed search params:', {
      originCode,
      destinationCode,
      departureDate,
      returnDate
    });
    
    const flights = mockDataGenerator.generateFlightsForRoute(
      originCode,
      destinationCode,
      departureDate,
      returnDate
    );

    const response = {
      status: true,
      timestamp: Date.now(),
      sessionId: Math.random().toString(36).substr(2, 9),
      data: {
        context: {
          status: 'complete',
          totalResults: flights.length
        },
        itineraries: flights
      }
    };

    console.log('Mock flight search successful, returning:', response);
    return {
      success: true,
      data: response
    };

  } catch (error) {
    console.error('Mock flight search error:', error);
    
    // Instead of failing, return a basic successful response
    const fallbackResponse = {
      status: true,
      timestamp: Date.now(),
      sessionId: Math.random().toString(36).substr(2, 9),
      data: {
        context: {
          status: 'complete',
          totalResults: 0
        },
        itineraries: []
      }
    };
    
    return {
      success: true,
      data: fallbackResponse
    };
  }
}; 