# Google Flights Clone

A modern flight booking website clone built with React, Material-UI, and Tailwind CSS, featuring comprehensive mock flight data and a professional UI matching Google Flights design.

***IMPORTANT:*** Since APIs could not be integrated due to payment issues, only a few airports are supported for search like **San Francisco, New York, Chicago, Miami, Denver etc**

## Features

### 🔍 Flight Search Interface
- **Complete Search Form**: Origin, destination, dates, passengers, and class selection
- **Trip Type Selection**: Round trip, one-way, and multi-city options
- **Smart Airport Search**: Autocomplete with debounced search and loading states
- **Date Pickers**: Departure and return date selection with validation
- **Passenger Count**: Support for 1-9 passengers
- **Travel Class**: Economy, Premium Economy, Business, and First Class

### ✈️ Flight Results & Mock Data System
- **Google Flights UI**: Exact replica of Google Flights results interface
- **Smart Sorting**: "Best" vs "Cheapest" sorting with dynamic pricing
- **Filter Bar**: Complete filter options (Stops, Airlines, Bags, Price, etc.)
- **Flight Cards**: Professional cards with airline logos, times, emissions data
- **Emissions Tracking**: CO2 emissions with percentage comparisons and color coding
- **URL State Persistence**: All search parameters stored in URL for refresh/back navigation
- **Expandable Details**: View complete flight segments and connections
- **Track Prices**: Price tracking interface with date grid and price graph options
- **Mock Data Engine**: Realistic flight data generation with 14+ airlines

### 🎨 User Experience
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Clean, Google Flights-inspired design
- **Loading States**: Smooth loading indicators and skeleton screens
- **Navigation**: Easy navigation between search and results pages
- **Popular Destinations**: Quick selection of popular travel destinations

## Tech Stack

- **React 18**: Frontend framework with hooks
- **React Router**: Client-side routing and navigation
- **Material-UI v5**: Component library for consistent design
- **Tailwind CSS**: Utility-first CSS framework
- **Day.js**: Date manipulation library
- **Material-UI Date Pickers**: Enhanced date selection components
- **localStorage**: Mock data persistence and management

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd google-flights-clone
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
src/
├── components/
│   ├── Header.js              # Navigation header with routing
│   ├── FlightSearch.js        # Main flight search component
│   └── FlightResults.js       # Flight results display component
├── services/
│   └── mockFlightService.js   # Mock flight data generation and search
├── utils/
│   └── testData.js            # Test data and utilities
├── App.js                     # Main app with routing
├── index.js                  # Entry point
└── index.css                 # Global styles
```

## Mock Data System

This application uses a comprehensive mock data system that generates realistic flight data:

### Features
- **14+ Airlines**: Air India, IndiGo, British Airways, Lufthansa, Delta, American Airlines, etc.
- **Major Airports**: BBI, BLR, DEL, BOM, JFK, LAX, LHR, CDG, DUB, FRA
- **Dynamic Pricing**: Realistic price generation based on airline, time, and stops
- **Emissions Data**: CO2 emissions with percentage comparisons (80-280 kg CO2e)
- **Flight Variations**: Mix of nonstop and connecting flights (0-2 stops)
- **Round Trip Support**: Automatic return flight generation

### Data Generation Logic

The mock service (`src/services/mockFlightService.js`) generates:

```javascript
// Realistic flight characteristics
- Flight duration: 2-10 hours based on route and stops
- Departure times: Random 24-hour distribution
- Price factors: Airline prestige, departure time, stops
- Emissions: Realistic CO2 calculations with categories
- Flight numbers: Realistic 4-digit flight numbers
```

### Real API Integration (Optional)

To integrate with real flight data:
1. Install axios: `npm install axios`
2. Get API key from [RapidAPI Sky Scrapper](https://rapidapi.com/3b-data-3b-data-default/api/sky-scrapper)
3. Replace `searchMockFlights` calls with real API service

## Usage Guide

### Searching for Flights

1. **Select Trip Type**: Choose Round trip, One way, or Multi-city
2. **Enter Airports**: Use the autocomplete to search and select origin/destination
3. **Choose Dates**: Select departure date (and return date for round trips)
4. **Set Passengers & Class**: Configure traveler count and cabin class
5. **Search**: Click "Search Flights" to find available flights

### Viewing Results

- **Flight Cards**: Each result shows airline, timing, duration, and price
- **Expandable Details**: Click "Flight Details" to see complete flight segments
- **URL Persistence**: Results page URL contains all search parameters
- **Navigation**: Use browser back button or header logo to return to search

### URL Structure

Search parameters are preserved in the URL for easy sharing and bookmarking:

```
/results?tripType=roundtrip&originSkyId=NYCA&destinationSkyId=LOND&departureDate=2024-07-01&returnDate=2024-07-08&adults=1&cabinClass=economy
```

## Development Features

- **Mock Data Engine**: Comprehensive flight data generation with realistic variations
- **localStorage Persistence**: Mock data stored locally for consistent experience
- **Smart Flight Generation**: 8-12 flights per route with varied characteristics
- **Test Data Utility**: Automatic test instructions logged to console
- **Error Handling**: Comprehensive error states and user feedback
- **Loading States**: Realistic API delay simulation (1-2 seconds)
- **Google Flights UI**: Pixel-perfect recreation of Google Flights interface
- **Responsive Design**: Mobile-first approach with desktop optimization

## Flight Data Structure

The application generates and handles comprehensive flight data including:

- **Itineraries**: Complete flight journeys with realistic pricing (₹200-₹1000)
- **Legs**: Individual flight segments (outbound/return for round trips)
- **Segments**: Detailed flight information per airline with flight numbers
- **Carriers**: 14+ airline information with official logos
- **Timing**: Realistic departure/arrival times with accurate durations
- **Emissions**: CO2 data with percentage comparisons and color coding
- **Pricing**: Dynamic pricing based on airline, time, and route factors
- **Stops**: Realistic distribution of nonstop vs connecting flights

## License

This project is for educational purposes.
