import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Paper,
  Grid,
  Alert,
  Snackbar
} from '@mui/material';

const AddEventForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [showError, setShowError] = useState(false);
  const [formData, setFormData] = useState({
    eventName: '',
    eventType: '',
    grade: '',
    date: '',
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    // If we have a selected date from the calendar, set it
    if (location.state?.selectedDate) {
      const selectedDate = new Date(location.state.selectedDate);
      setFormData(prev => ({
        ...prev,
        date: selectedDate.toISOString().split('T')[0]
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (!formData.eventName || !formData.eventType || !formData.grade || 
        !formData.date || !formData.startTime || !formData.endTime) {
      setError('All fields are required');
      return false;
    }

    const startTime = new Date(`2000-01-01T${formData.startTime}`);
    const endTime = new Date(`2000-01-01T${formData.endTime}`);
    
    if (endTime <= startTime) {
      setError('End time must be after start time');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShowError(false);

    if (!validateForm()) {
      setShowError(true);
      return;
    }

    try {
      // Get user ID from localStorage or your auth system
      const userId = localStorage.getItem('userId') || 'user123'; // Replace with actual user ID retrieval

      const response = await axios.post('http://localhost:5000/events/create', {
        ...formData,
        createdBy: userId
      });
      
      if (response.status === 201) {
        alert('Event created successfully!');
        navigate('/my-events');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error creating event');
      setShowError(true);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4, p: 3 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" gutterBottom>
          Add New Event
        </Typography>
        
        <Snackbar 
          open={showError} 
          autoHideDuration={6000} 
          onClose={() => setShowError(false)}
        >
          <Alert onClose={() => setShowError(false)} severity="error">
            {error}
          </Alert>
        </Snackbar>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Event Name"
                name="eventName"
                value={formData.eventName}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Event Type</InputLabel>
                <Select
                  name="eventType"
                  value={formData.eventType}
                  onChange={handleChange}
                  label="Event Type"
                >
                  <MenuItem value="Academic">Academic</MenuItem>
                  <MenuItem value="Sport">Sport</MenuItem>
                  <MenuItem value="Extra-Curricular">Extra-Curricular</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Grade"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
                inputProps={{
                  min: new Date().toISOString().split('T')[0]
                }}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="Start Time"
                name="startTime"
                type="time"
                value={formData.startTime}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                fullWidth
                label="End Time"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button 
                  variant="outlined" 
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="contained" 
                  color="primary"
                >
                  Submit
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AddEventForm; 