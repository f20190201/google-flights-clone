import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
  IconButton,
  Chip,
  Tooltip,
  Alert
} from '@mui/material';
import { 
  ChevronLeft, 
  ChevronRight, 
  Close,
  TrendingUp,
  TrendingDown,
  Info
} from '@mui/icons-material';
import dayjs from 'dayjs';
import { priceCalendarService } from '../services/priceCalendarService';

const PriceCalendar = ({ 
  open, 
  onClose, 
  onDateSelect, 
  selectedDate, 
  origin, 
  destination,
  minDate 
}) => {
  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf('month'));
  const [priceData, setPriceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [priceTrends, setPriceTrends] = useState(null);

  useEffect(() => {
    if (open && origin && destination) {
      loadPriceData();
      loadPriceTrends();
    }
  }, [open, currentMonth, origin, destination]);

  const loadPriceData = () => {
    setLoading(true);
    
    // Generate route key
    const route = `${origin?.navigation?.relevantFlightParams?.skyId || 'BLR'}-${destination?.navigation?.relevantFlightParams?.skyId || 'DEL'}`;
    
    // Get price data for current month and next month
    const startDate = currentMonth.format('YYYY-MM-DD');
    const endDate = currentMonth.add(2, 'month').endOf('month').format('YYYY-MM-DD');
    
    const prices = priceCalendarService.getPriceData(route, startDate, endDate);
    setPriceData(prices);
    setLoading(false);
  };

  const loadPriceTrends = () => {
    const route = `${origin?.navigation?.relevantFlightParams?.skyId || 'BLR'}-${destination?.navigation?.relevantFlightParams?.skyId || 'DEL'}`;
    const trends = priceCalendarService.getPriceTrends(route, 500000);
    setPriceTrends(trends);
  };

  const getDaysInMonth = (month) => {
    const startOfMonth = month.startOf('month');
    const endOfMonth = month.endOf('month');
    const startOfWeek = startOfMonth.startOf('week');
    const endOfWeek = endOfMonth.endOf('week');
    
    const days = [];
    let currentDay = startOfWeek;

    while (currentDay.isBefore(endOfWeek) || currentDay.isSame(endOfWeek, 'day')) {
      days.push(currentDay);
      currentDay = currentDay.add(1, 'day');
    }

    return days;
  };

  const getPriceInfo = (date) => {
    const dateKey = date.format('YYYY-MM-DD');
    return priceData[dateKey];
  };

  const getPriceColor = (category) => {
    switch (category) {
      case 'low': return '#34a853';
      case 'normal': return '#1976d2';
      case 'high': return '#ff9800';
      case 'very-high': return '#f44336';
      default: return '#666';
    }
  };

  const isDateSelectable = (date) => {
    const today = dayjs();
    const minSelectableDate = minDate ? dayjs(minDate) : today;
    return date.isAfter(minSelectableDate.subtract(1, 'day'));
  };

  const handleDateClick = (date) => {
    if (!isDateSelectable(date)) return;
    
    const priceInfo = getPriceInfo(date);
    if (!priceInfo?.available) return;

    onDateSelect(date);
    onClose();
  };

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, 'month'));
  };

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, 'month'));
  };

  const weekDays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const days = getDaysInMonth(currentMonth);

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: { borderRadius: '16px' }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Choose departure date
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {origin?.presentation?.title} → {destination?.presentation?.title}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {/* Price Trends Alert */}
        {priceTrends && (
          <Alert 
            severity={priceTrends.direction === 'down' ? 'success' : 'warning'}
            icon={priceTrends.direction === 'down' ? <TrendingDown /> : <TrendingUp />}
            sx={{ mb: 3 }}
          >
            <Typography variant="body2">
              Prices are trending {priceTrends.direction} by {priceTrends.percentage}%. 
              We predict prices will {priceTrends.prediction} with {priceTrends.confidence}% confidence.
            </Typography>
          </Alert>
        )}

        {/* Month Navigation */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <IconButton onClick={handlePrevMonth}>
            <ChevronLeft />
          </IconButton>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {currentMonth.format('MMMM YYYY')}
          </Typography>
          <IconButton onClick={handleNextMonth}>
            <ChevronRight />
          </IconButton>
        </Box>

        {/* Price Legend */}
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Chip 
            label="Best Price" 
            size="small" 
            sx={{ backgroundColor: '#34a853', color: 'white' }}
          />
          <Chip 
            label="Good Price" 
            size="small" 
            sx={{ backgroundColor: '#1976d2', color: 'white' }}
          />
          <Chip 
            label="Higher Price" 
            size="small" 
            sx={{ backgroundColor: '#ff9800', color: 'white' }}
          />
          <Chip 
            label="Peak Price" 
            size="small" 
            sx={{ backgroundColor: '#f44336', color: 'white' }}
          />
        </Box>

        {/* Calendar Grid */}
        <Box>
          {/* Week Days Header */}
          <Grid container spacing={0}>
            {weekDays.map((day, index) => (
              <Grid item xs={12/7} key={index}>
                <Box sx={{ 
                  textAlign: 'center', 
                  py: 1, 
                  fontWeight: 600,
                  color: '#666',
                  fontSize: '14px'
                }}>
                  {day}
                </Box>
              </Grid>
            ))}
          </Grid>

          {/* Calendar Days */}
          <Grid container spacing={0}>
            {days.map((day, index) => {
              const isCurrentMonth = day.month() === currentMonth.month();
              const isToday = day.isSame(dayjs(), 'day');
              const isSelected = selectedDate && day.isSame(selectedDate, 'day');
              const isSelectable = isDateSelectable(day);
              const priceInfo = getPriceInfo(day);

              return (
                <Grid item xs={12/7} key={index}>
                  <Tooltip
                    title={
                      priceInfo && isCurrentMonth ? (
                        <Box>
                          <Typography variant="caption">
                            {day.format('MMM D, YYYY')}
                          </Typography>
                          <br />
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {priceInfo.formatted}
                          </Typography>
                          {!priceInfo.available && (
                            <>
                              <br />
                              <Typography variant="caption" color="error">
                                Not available
                              </Typography>
                            </>
                          )}
                        </Box>
                      ) : ''
                    }
                    arrow
                  >
                    <Box
                      onClick={() => handleDateClick(day)}
                      sx={{
                        minHeight: '60px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: isSelectable && priceInfo?.available ? 'pointer' : 'not-allowed',
                        border: '1px solid transparent',
                        borderRadius: '8px',
                        m: 0.5,
                        opacity: !isCurrentMonth ? 0.3 : 1,
                        backgroundColor: isSelected ? '#1976d2' : 'transparent',
                        color: isSelected ? 'white' : 'inherit',
                        '&:hover': {
                          backgroundColor: isSelectable && priceInfo?.available && !isSelected 
                            ? 'rgba(25, 118, 210, 0.1)' 
                            : undefined,
                          border: isSelectable && priceInfo?.available && !isSelected 
                            ? '1px solid #1976d2' 
                            : undefined
                        }
                      }}
                    >
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: isToday ? 600 : 400,
                          color: isSelected ? 'white' : isToday ? '#1976d2' : 'inherit'
                        }}
                      >
                        {day.date()}
                      </Typography>
                      
                      {isCurrentMonth && priceInfo && (
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            fontWeight: 500,
                            color: isSelected ? 'white' : getPriceColor(priceInfo.category),
                            opacity: priceInfo.available ? 1 : 0.5
                          }}
                        >
                          {priceInfo.formatted}
                        </Typography>
                      )}

                      {isCurrentMonth && priceInfo && !priceInfo.available && (
                        <Typography variant="caption" sx={{ color: '#f44336', fontSize: '10px' }}>
                          N/A
                        </Typography>
                      )}
                    </Box>
                  </Tooltip>
                </Grid>
              );
            })}
          </Grid>
        </Box>

        {/* Footer Info */}
        <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Info fontSize="small" color="action" />
          <Typography variant="caption" color="text.secondary">
            Prices are estimates and may change. Select a date to see actual fares.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PriceCalendar; 