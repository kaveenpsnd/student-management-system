import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const EventRequests = () => {
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/events');
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleApprove = async (eventId) => {
    try {
      await axios.put(`http://localhost:5000/events/approve/${eventId}`);
      fetchEvents();
    } catch (error) {
      console.error('Error approving event:', error);
    }
  };

  const handleReject = async (eventId) => {
    try {
      await axios.put(`http://localhost:5000/events/reject/${eventId}`);
      fetchEvents();
    } catch (error) {
      console.error('Error rejecting event:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'warning';
      case 'Approved':
        return 'success';
      case 'Rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const renderEventCard = (event) => (
    <Card key={event._id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">{event.eventName}</Typography>
          <Chip 
            label={event.status} 
            color={getStatusColor(event.status)}
            size="small"
          />
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography color="textSecondary">Type: {event.eventType}</Typography>
            <Typography color="textSecondary">Grade: {event.grade}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography color="textSecondary">
              Date: {new Date(event.date).toLocaleDateString()}
            </Typography>
            <Typography color="textSecondary">
              Time: {event.startTime} - {event.endTime}
            </Typography>
          </Grid>
        </Grid>

        {event.status === 'Pending' && (
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button
              startIcon={<CheckCircleIcon />}
              variant="contained"
              color="success"
              onClick={() => handleApprove(event._id)}
            >
              Approve
            </Button>
            <Button
              startIcon={<CancelIcon />}
              variant="contained"
              color="error"
              onClick={() => handleReject(event._id)}
            >
              Reject
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Event Requests
      </Typography>

      <Grid container spacing={2}>
        {events.map(renderEventCard)}
      </Grid>
    </Box>
  );
};

export default EventRequests; 