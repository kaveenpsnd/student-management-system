import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplayIcon from '@mui/icons-material/Replay';

const MyEvents = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [events, setEvents] = useState([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  const fetchEvents = async (status) => {
    try {
      const response = await axios.get(`http://localhost:5000/events/my-events`, {
        params: {
          createdBy: 'user123', // Replace with actual user ID
          status: status
        }
      });
      setEvents(response.data);
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  useEffect(() => {
    const status = ['Pending', 'Approved', 'Rejected'][tabValue];
    fetchEvents(status);
  }, [tabValue]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEdit = (event) => {
    navigate(`/edit-event/${event._id}`, { state: { event } });
  };

  const handleDelete = (event) => {
    setSelectedEvent(event);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/events/${selectedEvent._id}`);
      setDeleteDialogOpen(false);
      fetchEvents('Pending');
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleReapply = (event) => {
    navigate('/add-event', { state: { event } });
  };

  const renderEventCard = (event) => (
    <Card key={event._id} sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6">{event.eventName}</Typography>
        <Typography color="textSecondary">Type: {event.eventType}</Typography>
        <Typography color="textSecondary">Grade: {event.grade}</Typography>
        <Typography color="textSecondary">
          Date: {new Date(event.date).toLocaleDateString()}
        </Typography>
        <Typography color="textSecondary">
          Time: {event.startTime} - {event.endTime}
        </Typography>
        
        {event.status === 'Pending' && (
          <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
            <Button
              startIcon={<EditIcon />}
              variant="outlined"
              onClick={() => handleEdit(event)}
            >
              Edit
            </Button>
            <Button
              startIcon={<DeleteIcon />}
              variant="outlined"
              color="error"
              onClick={() => handleDelete(event)}
            >
              Delete
            </Button>
          </Box>
        )}

        {event.status === 'Rejected' && (
          <Button
            startIcon={<ReplayIcon />}
            variant="contained"
            color="primary"
            onClick={() => handleReapply(event)}
            sx={{ mt: 2 }}
          >
            Re-apply
          </Button>
        )}
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        My Events
      </Typography>

      <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label="Pending" />
        <Tab label="Approved" />
        <Tab label="Rejected" />
      </Tabs>

      <Grid container spacing={2}>
        {events.map(renderEventCard)}
      </Grid>

      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this event?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MyEvents; 