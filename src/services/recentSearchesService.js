import dayjs from 'dayjs';

const STORAGE_KEY = 'recentFlightSearches';
const MAX_RECENT_SEARCHES = 10;

export const recentSearchesService = {
  // Save a new search to recent searches
  saveSearch: (searchData) => {
    try {
      const searches = recentSearchesService.getRecentSearches();
      
      // Create search object with metadata
      const searchItem = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        origin: searchData.origin,
        destination: searchData.destination,
        departureDate: searchData.departureDate,
        returnDate: searchData.returnDate,
        tripType: searchData.tripType,
        passengers: searchData.passengers,
        travelClass: searchData.travelClass,
        passengerData: searchData.passengerData,
        classData: searchData.classData,
        route: `${searchData.origin?.presentation?.title} → ${searchData.destination?.presentation?.title}`,
        searchCount: 1
      };

      // Check if similar search already exists
      const existingIndex = searches.findIndex(search => 
        search.origin?.navigation?.relevantFlightParams?.skyId === searchData.origin?.navigation?.relevantFlightParams?.skyId &&
        search.destination?.navigation?.relevantFlightParams?.skyId === searchData.destination?.navigation?.relevantFlightParams?.skyId &&
        search.departureDate === searchData.departureDate &&
        search.tripType === searchData.tripType
      );

      if (existingIndex !== -1) {
        // Update existing search
        searches[existingIndex] = {
          ...searches[existingIndex],
          ...searchItem,
          searchCount: searches[existingIndex].searchCount + 1,
          timestamp: new Date().toISOString()
        };
      } else {
        // Add new search at the beginning
        searches.unshift(searchItem);
      }

      // Sort by timestamp (most recent first) and limit to MAX_RECENT_SEARCHES
      const sortedSearches = searches
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, MAX_RECENT_SEARCHES);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(sortedSearches));
      return searchItem;
    } catch (error) {
      console.error('Error saving recent search:', error);
      return null;
    }
  },

  // Get all recent searches
  getRecentSearches: () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const searches = JSON.parse(stored);
      
      // Filter out searches older than 30 days
      const thirtyDaysAgo = dayjs().subtract(30, 'day');
      return searches.filter(search => 
        dayjs(search.timestamp).isAfter(thirtyDaysAgo)
      );
    } catch (error) {
      console.error('Error loading recent searches:', error);
      return [];
    }
  },

  // Get popular destinations based on recent searches
  getPopularDestinations: () => {
    try {
      const searches = recentSearchesService.getRecentSearches();
      const destinationCounts = {};

      searches.forEach(search => {
        const destKey = search.destination?.navigation?.relevantFlightParams?.skyId;
        if (destKey) {
          if (!destinationCounts[destKey]) {
            destinationCounts[destKey] = {
              destination: search.destination,
              count: 0
            };
          }
          destinationCounts[destKey].count += search.searchCount || 1;
        }
      });

      return Object.values(destinationCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 6)
        .map(item => item.destination);
    } catch (error) {
      console.error('Error getting popular destinations:', error);
      return [];
    }
  },

  // Get popular routes
  getPopularRoutes: () => {
    try {
      const searches = recentSearchesService.getRecentSearches();
      const routeCounts = {};

      searches.forEach(search => {
        const routeKey = `${search.origin?.navigation?.relevantFlightParams?.skyId}-${search.destination?.navigation?.relevantFlightParams?.skyId}`;
        if (routeKey && routeKey !== 'undefined-undefined') {
          if (!routeCounts[routeKey]) {
            routeCounts[routeKey] = {
              route: search.route,
              origin: search.origin,
              destination: search.destination,
              count: 0,
              lastSearched: search.timestamp
            };
          }
          routeCounts[routeKey].count += search.searchCount || 1;
          // Update last searched if this search is more recent
          if (new Date(search.timestamp) > new Date(routeCounts[routeKey].lastSearched)) {
            routeCounts[routeKey].lastSearched = search.timestamp;
          }
        }
      });

      return Object.values(routeCounts)
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);
    } catch (error) {
      console.error('Error getting popular routes:', error);
      return [];
    }
  },

  // Delete a specific search
  deleteSearch: (searchId) => {
    try {
      const searches = recentSearchesService.getRecentSearches();
      const filteredSearches = searches.filter(search => search.id !== searchId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredSearches));
      return true;
    } catch (error) {
      console.error('Error deleting search:', error);
      return false;
    }
  },

  // Clear all recent searches
  clearAllSearches: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error('Error clearing searches:', error);
      return false;
    }
  },

  // Get search suggestions based on partial input
  getSearchSuggestions: (query) => {
    try {
      const searches = recentSearchesService.getRecentSearches();
      const suggestions = [];

      searches.forEach(search => {
        // Match against origin or destination
        const originMatch = search.origin?.presentation?.title?.toLowerCase().includes(query.toLowerCase());
        const destMatch = search.destination?.presentation?.title?.toLowerCase().includes(query.toLowerCase());
        
        if (originMatch || destMatch) {
          suggestions.push({
            type: 'recent',
            search,
            matchType: originMatch ? 'origin' : 'destination'
          });
        }
      });

      return suggestions.slice(0, 5);
    } catch (error) {
      console.error('Error getting search suggestions:', error);
      return [];
    }
  },

  // Format search for display
  formatSearchDisplay: (search) => {
    const formatDate = (dateStr) => {
      return dayjs(dateStr).format('MMM DD');
    };

    const formatPassengers = (passengerData) => {
      if (!passengerData) return '1 passenger';
      let result = `${passengerData.adults} adult${passengerData.adults > 1 ? 's' : ''}`;
      if (passengerData.children > 0) {
        result += `, ${passengerData.children} child${passengerData.children > 1 ? 'ren' : ''}`;
      }
      if (passengerData.infants > 0) {
        result += `, ${passengerData.infants} infant${passengerData.infants > 1 ? 's' : ''}`;
      }
      return result;
    };

    return {
      route: search.route,
      dates: search.tripType === 'roundtrip' 
        ? `${formatDate(search.departureDate)} - ${formatDate(search.returnDate)}`
        : formatDate(search.departureDate),
      passengers: formatPassengers(search.passengerData),
      class: search.classData?.name || 'Economy',
      tripType: search.tripType,
      searchCount: search.searchCount,
      lastSearched: dayjs(search.timestamp).fromNow()
    };
  }
};

export default recentSearchesService; 