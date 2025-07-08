// Utility functions for filtering flights data

export const applyFilters = (flights, filters) => {
  if (!flights || !flights.length) return [];

  let filteredFlights = [...flights];

  // Apply stops filter
  filteredFlights = applyStopsFilter(filteredFlights, filters.stops);
  
  // Apply airlines filter
  filteredFlights = applyAirlinesFilter(filteredFlights, filters.airlines);
  
  // Apply price filter
  filteredFlights = applyPriceFilter(filteredFlights, filters.priceRange);
  
  // Apply times filter
  filteredFlights = applyTimesFilter(filteredFlights, filters.times);
  
  // Apply duration filter
  filteredFlights = applyDurationFilter(filteredFlights, filters.duration);
  
  // Apply emissions filter
  filteredFlights = applyEmissionsFilter(filteredFlights, filters.emissions);

  return filteredFlights;
};

const applyStopsFilter = (flights, stopsFilter) => {
  // If "any" is true (no specific filters selected), return all flights
  if (stopsFilter.any) return flights;
  
  // Check if any specific filters are active
  const hasActiveFilters = stopsFilter.nonstop || stopsFilter.oneStop || stopsFilter.twoPlus;
  if (!hasActiveFilters) return flights;
  
  console.log('Applying stops filter:', stopsFilter);
  console.log('Sample flight stopCount:', flights[0]?.legs[0]?.stopCount);
  
  return flights.filter(flight => {
    const stopCount = flight.legs[0]?.stopCount ?? 0;
    
    console.log(`Flight ${flight.id}: stopCount = ${stopCount}`);
    
    // Check each filter condition
    if (stopsFilter.nonstop && stopCount === 0) {
      console.log(`Nonstop match for flight ${flight.id}`);
      return true;
    }
    if (stopsFilter.oneStop && stopCount <= 1) {
      console.log(`One stop match for flight ${flight.id}`);
      return true;
    }
    if (stopsFilter.twoPlus && stopCount >= 2) {
      console.log(`Two+ stops match for flight ${flight.id}`);
      return true;
    }
    
    return false;
  });
};

const applyAirlinesFilter = (flights, airlinesFilter) => {
  const selectedAirlines = Object.keys(airlinesFilter).filter(airlineId => airlinesFilter[airlineId]);
  
  if (selectedAirlines.length === 0) return flights;
  
  return flights.filter(flight => {
    return flight.legs.some(leg => 
      leg.carriers.marketing.some(carrier => 
        selectedAirlines.includes(carrier.id)
      )
    );
  });
};

const applyPriceFilter = (flights, priceRange) => {
  const [minPrice, maxPrice] = priceRange;
  
  return flights.filter(flight => {
    const price = flight.price.raw;
    return price >= minPrice && price <= maxPrice;
  });
};

const applyTimesFilter = (flights, timesFilter) => {
  const { departure, arrival } = timesFilter;
  
  return flights.filter(flight => {
    const leg = flight.legs[0];
    
    // Check departure time
    const departureTime = new Date(leg.departure);
    const departureHour = departureTime.getHours() + departureTime.getMinutes() / 60;
    
    if (departureHour < departure[0] || departureHour > departure[1]) {
      return false;
    }
    
    // Check arrival time
    const arrivalTime = new Date(leg.arrival);
    const arrivalHour = arrivalTime.getHours() + arrivalTime.getMinutes() / 60;
    
    if (arrivalHour < arrival[0] || arrivalHour > arrival[1]) {
      return false;
    }
    
    return true;
  });
};

const applyDurationFilter = (flights, durationRange) => {
  const [minDuration, maxDuration] = durationRange;
  
  return flights.filter(flight => {
    const duration = flight.legs[0].durationInMinutes / 60; // Convert to hours
    return duration >= minDuration && duration <= maxDuration;
  });
};

const applyEmissionsFilter = (flights, emissionsFilter) => {
  if (emissionsFilter.any) return flights;
  
  const activeFilters = [];
  if (emissionsFilter.low) activeFilters.push('low');
  if (emissionsFilter.medium) activeFilters.push('medium');
  if (emissionsFilter.high) activeFilters.push('high');
  
  if (activeFilters.length === 0) return flights;
  
  return flights.filter(flight => {
    const emissions = flight.sustainabilityData?.totalEmissions || 0;
    
    // Define emission thresholds (in kg CO2e)
    const lowThreshold = 120;
    const highThreshold = 200;
    
    let emissionLevel;
    if (emissions <= lowThreshold) emissionLevel = 'low';
    else if (emissions <= highThreshold) emissionLevel = 'medium';
    else emissionLevel = 'high';
    
    return activeFilters.includes(emissionLevel);
  });
};

// Helper function to get default filter state
export const getDefaultFilters = () => ({
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
});

// Helper function to count active filters
export const getActiveFilterCount = (filters) => {
  let count = 0;
  
  // Count stops filters
  const stopsActive = Object.entries(filters.stops).filter(([key, value]) => key !== 'any' && value);
  count += stopsActive.length;
  
  // Count airline filters
  count += Object.values(filters.airlines).filter(Boolean).length;
  
  // Count price filter
  if (filters.priceRange[0] > 0 || filters.priceRange[1] < 2000) count++;
  
  // Count times filters
  if (filters.times.departure[0] > 0 || filters.times.departure[1] < 24 ||
      filters.times.arrival[0] > 0 || filters.times.arrival[1] < 24) count++;
  
  // Count duration filter
  if (filters.duration[0] > 0 || filters.duration[1] < 24) count++;
  
  // Count emissions filters
  const emissionsActive = Object.entries(filters.emissions).filter(([key, value]) => key !== 'any' && value);
  count += emissionsActive.length;
  
  return count;
}; 