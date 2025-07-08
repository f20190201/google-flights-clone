// Test data for development and testing purposes

export const sampleFlightSearch = {
  tripType: 'roundtrip',
  originSkyId: 'NYCA',
  destinationSkyId: 'LOND',
  originEntityId: '27537542',
  destinationEntityId: '27544008',
  originName: 'New York',
  destinationName: 'London',
  departureDate: '2024-07-01',
  returnDate: '2024-07-08',
  adults: '1',
  cabinClass: 'economy'
};

export const sampleURLParams = () => {
  const params = new URLSearchParams(sampleFlightSearch);
  return `/results?${params.toString()}`;
};

// Generate a test URL for quick testing
export const generateTestURL = () => {
  const baseURL = window.location.origin;
  return `${baseURL}${sampleURLParams()}`;
};

// Popular test routes
export const testRoutes = [
  {
    name: 'New York to London',
    params: {
      tripType: 'roundtrip',
      originSkyId: 'NYCA',
      destinationSkyId: 'LOND',
      originEntityId: '27537542',
      destinationEntityId: '27544008',
      originName: 'New York',
      destinationName: 'London',
      departureDate: '2024-07-01',
      returnDate: '2024-07-08',
      adults: '1',
      cabinClass: 'economy'
    }
  },
  {
    name: 'Los Angeles to Tokyo',
    params: {
      tripType: 'oneway',
      originSkyId: 'LAXA',
      destinationSkyId: 'TYOA',
      originEntityId: '27537533',
      destinationEntityId: '27537578',
      originName: 'Los Angeles',
      destinationName: 'Tokyo',
      departureDate: '2024-07-15',
      adults: '2',
      cabinClass: 'business'
    }
  }
];

export const logTestInstructions = () => {
  console.log('=== FLIGHT SEARCH TEST INSTRUCTIONS ===');
  console.log('1. Fill out the search form with origin and destination');
  console.log('2. Click "Search Flights" to navigate to results page');
  console.log('3. URL will contain all search parameters for persistence');
  console.log('4. Results page will call the API and display flights');
  console.log('');
  console.log('Sample test URL:', generateTestURL());
  console.log('');
  console.log('Available test routes:');
  testRoutes.forEach((route, index) => {
    const params = new URLSearchParams(route.params);
    console.log(`${index + 1}. ${route.name}: /results?${params.toString()}`);
  });
  console.log('==========================================');
}; 