import dayjs from 'dayjs';

// Service to generate and manage price calendar data
export const priceCalendarService = {
  // Generate price data for a date range
  generatePriceData(startDate, endDate, basePrice = 500000) {
    const prices = {};
    let currentDate = dayjs(startDate);
    const end = dayjs(endDate);

    while (currentDate.isBefore(end) || currentDate.isSame(end, 'day')) {
      const dateKey = currentDate.format('YYYY-MM-DD');
      
      // Generate realistic price variations based on different factors
      let price = basePrice;
      const dayOfWeek = currentDate.day();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      const isHoliday = isHolidayPeriod(currentDate);
      const isMonday = dayOfWeek === 1;
      const isFriday = dayOfWeek === 5;

      // Price modifiers
      if (isWeekend) price *= 1.2; // 20% higher on weekends
      if (isHoliday) price *= 1.4; // 40% higher during holidays
      if (isMonday || isFriday) price *= 1.1; // 10% higher on Mon/Fri
      
      // Add random variation (±15%)
      const randomVariation = 0.85 + (Math.random() * 0.3);
      price *= randomVariation;

      // Round to nearest 100
      price = Math.round(price / 100) * 100;

      prices[dateKey] = {
        price,
        formatted: formatPrice(price),
        category: getPriceCategory(price, basePrice),
        available: Math.random() > 0.05 // 95% availability
      };

      currentDate = currentDate.add(1, 'day');
    }

    return prices;
  },

  // Get cached price data or generate new
  getPriceData(route, startDate, endDate) {
    const cacheKey = `prices_${route}_${startDate}_${endDate}`;
    const cached = localStorage.getItem(cacheKey);
    
    if (cached) {
      const data = JSON.parse(cached);
      // Check if data is still fresh (24 hours)
      if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
        return data.prices;
      }
    }

    // Generate new price data
    const prices = this.generatePriceData(startDate, endDate);
    
    // Cache the data
    localStorage.setItem(cacheKey, JSON.stringify({
      prices,
      timestamp: Date.now()
    }));

    return prices;
  },

  // Get price trends for a specific route
  getPriceTrends(route, currentPrice) {
    const trends = {
      direction: Math.random() > 0.5 ? 'up' : 'down',
      percentage: Math.floor(Math.random() * 20) + 5, // 5-25%
      prediction: Math.random() > 0.6 ? 'increase' : 'stable',
      confidence: Math.floor(Math.random() * 30) + 70 // 70-100%
    };

    return trends;
  },

  // Track price alerts
  addPriceAlert(alertData) {
    const alerts = JSON.parse(localStorage.getItem('priceAlerts') || '[]');
    const newAlert = {
      id: Date.now().toString(),
      ...alertData,
      createdAt: new Date().toISOString(),
      isActive: true
    };
    
    alerts.push(newAlert);
    localStorage.setItem('priceAlerts', JSON.stringify(alerts));
    return newAlert;
  },

  // Get user's price alerts
  getUserAlerts() {
    return JSON.parse(localStorage.getItem('priceAlerts') || '[]');
  },

  // Check if any alerts should be triggered
  checkAlerts(currentPrices) {
    const alerts = this.getUserAlerts();
    const triggeredAlerts = [];

    alerts.forEach(alert => {
      if (!alert.isActive) return;
      
      const currentPrice = currentPrices[alert.route]?.[alert.date]?.price;
      if (currentPrice && currentPrice <= alert.targetPrice) {
        triggeredAlerts.push({
          ...alert,
          currentPrice,
          savings: alert.originalPrice - currentPrice
        });
      }
    });

    return triggeredAlerts;
  }
};

// Helper functions
function isHolidayPeriod(date) {
  const month = date.month();
  const day = date.date();
  
  // Indian holidays and peak travel periods
  return (
    (month === 11 && day >= 20) || // December holidays
    (month === 0 && day <= 5) ||   // New Year
    (month === 2 && day >= 15 && day <= 25) || // Holi period
    (month === 9 && day >= 15 && day <= 25) || // Diwali period
    (month === 7 && day === 15) || // Independence Day
    (month === 9 && day === 2)     // Gandhi Jayanti
  );
}

function formatPrice(price) {
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(1)}L`;
  } else if (price >= 1000) {
    return `₹${(price / 1000).toFixed(1)}K`;
  } else {
    return `₹${price}`;
  }
}

function getPriceCategory(price, basePrice) {
  const ratio = price / basePrice;
  if (ratio <= 0.9) return 'low';
  if (ratio <= 1.1) return 'normal';
  if (ratio <= 1.3) return 'high';
  return 'very-high';
}

export default priceCalendarService; 