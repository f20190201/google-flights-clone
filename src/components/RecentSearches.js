import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  IconButton,
  Tooltip,
  Button,
  Collapse,
  Paper,
  Divider
} from '@mui/material';
import {
  History,
  TrendingUp,
  Delete,
  Clear,
  FlightTakeoff,
  ExpandMore,
  ExpandLess,
  Schedule,
  Person,
  EventSeat,
  Refresh
} from '@mui/icons-material';
import recentSearchesService from '../services/recentSearchesService';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const RecentSearches = ({ onSelectSearch }) => {
  const [recentSearches, setRecentSearches] = useState([]);
  const [popularRoutes, setPopularRoutes] = useState([]);
  const [showRecent, setShowRecent] = useState(true);
  const [showPopular, setShowPopular] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const recent = recentSearchesService.getRecentSearches();
    const popular = recentSearchesService.getPopularRoutes();
    setRecentSearches(recent);
    setPopularRoutes(popular);
  };

  const handleSelectSearch = (search) => {
    if (onSelectSearch) {
      onSelectSearch(search);
    }
  };

  const handleDeleteSearch = (searchId, event) => {
    event.stopPropagation();
    recentSearchesService.deleteSearch(searchId);
    loadData();
  };

  const handleClearAll = () => {
    recentSearchesService.clearAllSearches();
    loadData();
  };

  const SearchCard = ({ search, type = 'recent' }) => {
    const formatDisplay = recentSearchesService.formatSearchDisplay(search);
    
    return (
      <Card 
        sx={{ 
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-2px)'
          },
          border: '1px solid #e0e0e0'
        }}
        onClick={() => handleSelectSearch(search)}
      >
        <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                {formatDisplay.route}
              </Typography>
              
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                <Chip
                  icon={<Schedule />}
                  label={formatDisplay.dates}
                  size="small"
                  variant="outlined"
                  color="primary"
                />
                <Chip
                  icon={<Person />}
                  label={formatDisplay.passengers}
                  size="small"
                  variant="outlined"
                />
                <Chip
                  icon={<EventSeat />}
                  label={formatDisplay.class}
                  size="small"
                  variant="outlined"
                />
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" color="text.secondary">
                  {type === 'recent' ? formatDisplay.lastSearched : `${search.count} searches`}
                </Typography>
                {search.searchCount > 1 && type === 'recent' && (
                  <Chip 
                    label={`${search.searchCount}x`} 
                    size="small"
                    sx={{ 
                      height: '20px', 
                      fontSize: '10px',
                      backgroundColor: '#e3f2fd',
                      color: '#1976d2'
                    }}
                  />
                )}
              </Box>
            </Box>

            {type === 'recent' && (
              <Tooltip title="Remove">
                <IconButton
                  size="small"
                  onClick={(e) => handleDeleteSearch(search.id, e)}
                  sx={{ 
                    opacity: 0.6,
                    '&:hover': { opacity: 1, color: 'error.main' }
                  }}
                >
                  <Delete fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </CardContent>
      </Card>
    );
  };

  const SectionHeader = ({ 
    title, 
    icon, 
    count, 
    expanded, 
    onToggle, 
    onAction, 
    actionLabel, 
    actionIcon 
  }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
      <Button
        onClick={onToggle}
        startIcon={icon}
        endIcon={expanded ? <ExpandLess /> : <ExpandMore />}
        sx={{
          textTransform: 'none',
          color: '#333',
          fontWeight: 600,
          fontSize: '16px',
          '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' }
        }}
      >
        {title} {count > 0 && `(${count})`}
      </Button>
      
      {onAction && count > 0 && (
        <Tooltip title={actionLabel}>
          <IconButton onClick={onAction} size="small" color="error">
            {actionIcon}
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );

  if (recentSearches.length === 0 && popularRoutes.length === 0) {
    return (
      <Paper sx={{ p: 3, mt: 3, textAlign: 'center', backgroundColor: '#fafafa' }}>
        <History sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
        <Typography variant="body1" color="text.secondary">
          No recent searches yet
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Your recent searches will appear here for quick access
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <Box sx={{ mb: 4 }}>
          <SectionHeader
            title="Recent Searches"
            icon={<History />}
            count={recentSearches.length}
            expanded={showRecent}
            onToggle={() => setShowRecent(!showRecent)}
            onAction={handleClearAll}
            actionLabel="Clear All"
            actionIcon={<Clear />}
          />
          
          <Collapse in={showRecent}>
            <Grid container spacing={2}>
              {recentSearches.slice(0, 6).map((search) => (
                <Grid item xs={12} sm={6} md={4} key={search.id}>
                  <SearchCard search={search} type="recent" />
                </Grid>
              ))}
            </Grid>
          </Collapse>
        </Box>
      )}

      {/* Popular Routes */}
      {popularRoutes.length > 0 && (
        <Box>
          <SectionHeader
            title="Popular Routes"
            icon={<TrendingUp />}
            count={popularRoutes.length}
            expanded={showPopular}
            onToggle={() => setShowPopular(!showPopular)}
          />
          
          <Collapse in={showPopular}>
            <Grid container spacing={2}>
              {popularRoutes.slice(0, 6).map((route, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card 
                    sx={{ 
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                        transform: 'translateY(-2px)'
                      },
                      border: '1px solid #e0e0e0',
                      background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)'
                    }}
                    onClick={() => handleSelectSearch({
                      origin: route.origin,
                      destination: route.destination,
                      departureDate: dayjs().add(1, 'week').format('YYYY-MM-DD'),
                      returnDate: dayjs().add(1, 'week').add(3, 'day').format('YYYY-MM-DD'),
                      tripType: 'roundtrip'
                    })}
                  >
                    <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <FlightTakeoff color="primary" fontSize="small" />
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {route.route}
                        </Typography>
                      </Box>
                      
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip
                          label={`${route.count} searches`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <Typography variant="caption" color="text.secondary">
                          {dayjs(route.lastSearched).fromNow()}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Collapse>
        </Box>
      )}

      {/* Refresh Button */}
      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Button
          onClick={loadData}
          startIcon={<Refresh />}
          variant="outlined"
          size="small"
          sx={{ textTransform: 'none' }}
        >
          Refresh
        </Button>
      </Box>
    </Box>
  );
};

export default RecentSearches; 