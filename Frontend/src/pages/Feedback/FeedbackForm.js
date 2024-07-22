import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Typography, MenuItem, Container, Alert, Box } from '@mui/material';

const FeedbackForm = ({ roomId, isRecreation, handleClose, user }) => {

  const [formData, setFormData] = useState({
    roomType: isRecreation ? 'recreation' : 'room',
    roomId: isRecreation ? '' : roomId,
    recreationRoomId: isRecreation ? roomId : '',
    customerId: user ? user.email : '',
    feedbackText: '',
    rating: '',
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (roomId) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        roomId: isRecreation ? '' : roomId,
        recreationRoomId: isRecreation ? roomId : '',
        customerId: user ? user.email : '',
      }));
    }
  }, [roomId, isRecreation, user]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await fetch('https://zlj6scapvsqwrwrsx2pb3g6gga0pqksm.lambda-url.us-west-1.on.aws/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setSuccessMessage('Feedback submitted successfully');
          setFormData({
            roomType: isRecreation ? 'recreation' : 'room',
            roomId: isRecreation ? '' : roomId,
            recreationRoomId: isRecreation ? roomId : '',
            customerId: user ? user.email : '',
            feedbackText: '',
            rating: '',
          });
          setErrors({});
          handleClose();
        } else {
          console.error('Failed to submit feedback');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4} p={4} bgcolor="#f7f7f7" borderRadius="8px">
        <Typography variant="h4" gutterBottom>Feedback Form</Typography>
        {successMessage && <Alert severity="success">{successMessage}</Alert>}
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
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
                disabled
              >
                <MenuItem value="room">Room</MenuItem>
                <MenuItem value="recreation">Recreation Room</MenuItem>
              </TextField>
            </Grid>
            {formData.roomType === 'room' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Room ID"
                  name="roomId"
                  variant="outlined"
                  value={formData.roomId}
                  onChange={handleChange}
                  error={!!errors.roomId}
                  helperText={errors.roomId}
                  disabled
                />
              </Grid>
            )}
            {formData.roomType === 'recreation' && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Recreation Room ID"
                  name="recreationRoomId"
                  variant="outlined"
                  value={formData.recreationRoomId}
                  onChange={handleChange}
                  error={!!errors.recreationRoomId}
                  helperText={errors.recreationRoomId}
                  disabled
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Customer ID"
                name="customerId"
                variant="outlined"
                value={formData.customerId}
                onChange={handleChange}
                error={!!errors.customerId}
                helperText={errors.customerId}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
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
            <Grid item xs={12}>
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
            <Grid item xs={12}>
              <Button variant="contained" color="primary" type="submit" fullWidth>
                Submit Feedback
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
};

export default FeedbackForm;
