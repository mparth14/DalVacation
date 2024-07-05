// src/FeedbackForm.js
import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, MenuItem, Container } from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: 4,
    padding: 4,
    backgroundColor: '#f7f7f7',
    borderRadius: '8px',
  },
  formField: {
    marginBottom: 16,
  },
}));

const FeedbackForm = () => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    roomType: '',
    roomId: '',
    recreationRoomId: '',
    customerId: '',
    feedbackText: '',
    rating: '',
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validate = () => {
    let tempErrors = {};
    tempErrors.roomType = formData.roomType ? "" : "This field is required.";
    if (formData.roomType === 'room') {
      tempErrors.roomId = formData.roomId ? "" : "This field is required.";
    } else if (formData.roomType === 'recreation') {
      tempErrors.recreationRoomId = formData.recreationRoomId ? "" : "This field is required.";
    }
    tempErrors.customerId = formData.customerId ? "" : "This field is required.";
    tempErrors.feedbackText = formData.feedbackText ? "" : "This field is required.";
    tempErrors.rating = formData.rating ? "" : "This field is required.";
    setErrors({
      ...tempErrors
    });

    return Object.values(tempErrors).every(x => x === "");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Form Submitted', formData);
      // Send data to backend
    }
  };

  return (
    <Container maxWidth="sm" className={classes.container}>
      <Typography variant="h4" gutterBottom>Feedback Form</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12} className={classes.formField}>
            <TextField
              fullWidth
              select
              label="Room Type"
              name="roomType"
              variant="outlined"
              value={formData.roomType}
              onChange={handleChange}
              error={!!errors.roomType}
              helperText={errors.roomType}
            >
              <MenuItem value="room">Room</MenuItem>
              <MenuItem value="recreation">Recreation Room</MenuItem>
            </TextField>
          </Grid>
          {formData.roomType === 'room' && (
            <Grid item xs={12} className={classes.formField}>
              <TextField
                fullWidth
                label="Room ID"
                name="roomId"
                variant="outlined"
                value={formData.roomId}
                onChange={handleChange}
                error={!!errors.roomId}
                helperText={errors.roomId}
              />
            </Grid>
          )}
          {formData.roomType === 'recreation' && (
            <Grid item xs={12} className={classes.formField}>
              <TextField
                fullWidth
                label="Recreation Room ID"
                name="recreationRoomId"
                variant="outlined"
                value={formData.recreationRoomId}
                onChange={handleChange}
                error={!!errors.recreationRoomId}
                helperText={errors.recreationRoomId}
              />
            </Grid>
          )}
          <Grid item xs={12} className={classes.formField}>
            <TextField
              fullWidth
              label="Customer ID"
              name="customerId"
              variant="outlined"
              value={formData.customerId}
              onChange={handleChange}
              error={!!errors.customerId}
              helperText={errors.customerId}
            />
          </Grid>
          <Grid item xs={12} className={classes.formField}>
            <TextField
              fullWidth
              label="Feedback"
              name="feedbackText"
              variant="outlined"
              multiline
              rows={4}
              value={formData.feedbackText}
              onChange={handleChange}
              error={!!errors.feedbackText}
              helperText={errors.feedbackText}
            />
          </Grid>
          <Grid item xs={12} className={classes.formField}>
            <TextField
              fullWidth
              select
              label="Rating"
              name="rating"
              variant="outlined"
              value={formData.rating}
              onChange={handleChange}
              error={!!errors.rating}
              helperText={errors.rating}
            >
              <MenuItem value={1}>1 - Very Poor</MenuItem>
              <MenuItem value={2}>2 - Poor</MenuItem>
              <MenuItem value={3}>3 - Average</MenuItem>
              <MenuItem value={4}>4 - Good</MenuItem>
              <MenuItem value={5}>5 - Excellent</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} className={classes.formField}>
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Submit Feedback
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default FeedbackForm;
