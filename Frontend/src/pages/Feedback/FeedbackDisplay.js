// src/FeedbackDisplay.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box
} from '@mui/material';

const FeedbackDisplay = () => {
  const [feedbackData, setFeedbackData] = useState([]);

  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        const response = await axios.get('https://afgw5kak4u7rjeaua7mkym5uha0tdloj.lambda-url.us-west-1.on.aws/');
        setFeedbackData(response.data);
      } catch (error) {
        console.error('Error fetching feedback data:', error);
      }
    };

    fetchFeedbackData();
  }, []);

  return (
    <TableContainer component={Paper}>
      <Box mt={4} p={2}>
        <Typography variant="h4" gutterBottom align="center">Feedback Summary</Typography>
        <Table aria-label="feedback table">
          <TableHead>
            <TableRow>
              <TableCell sx={{ backgroundColor: '#1976d2', color: '#ffffff' }}>Room ID</TableCell>
              <TableCell sx={{ backgroundColor: '#1976d2', color: '#ffffff' }}>Feedback Text</TableCell>
              <TableCell sx={{ backgroundColor: '#1976d2', color: '#ffffff' }}>Rating</TableCell>
              <TableCell sx={{ backgroundColor: '#1976d2', color: '#ffffff' }}>Average Score</TableCell>
              <TableCell sx={{ backgroundColor: '#1976d2', color: '#ffffff' }}>Average Magnitude</TableCell>
              <TableCell sx={{ backgroundColor: '#1976d2', color: '#ffffff' }}>Overall Sentiment</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.keys(feedbackData).map((roomId) => {
              const room = feedbackData[roomId];
              return (
                <React.Fragment key={roomId}>
                  {room.feedbacks.map((feedback, index) => (
                    <TableRow key={feedback.feedbackId}>
                      <TableCell>{index === 0 ? roomId : ''}</TableCell>
                      <TableCell>{feedback.feedbackText}</TableCell>
                      <TableCell>{feedback.rating}</TableCell>
                      {index === 0 && (
                        <TableCell rowSpan={room.feedbacks.length} sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                          {room.average_score}
                        </TableCell>
                      )}
                      {index === 0 && (
                        <TableCell rowSpan={room.feedbacks.length} sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                          {room.average_magnitude}
                        </TableCell>
                      )}
                      {index === 0 && (
                        <TableCell rowSpan={room.feedbacks.length} sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                          {room.overall_sentiment}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>
      </Box>
    </TableContainer>
  );
};

export default FeedbackDisplay;
