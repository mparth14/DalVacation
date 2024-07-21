// src/FeedbackDisplay.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Box
} from '@mui/material';

const FeedbackDisplay = ({ roomId }) => {
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

  const roomFeedbacks = feedbackData[roomId]?.feedbacks || [];
  const averageScore = feedbackData[roomId]?.average_score;
  const averageMagnitude = feedbackData[roomId]?.average_magnitude;
  const overallSentiment = feedbackData[roomId]?.overall_sentiment;

  return (
    <TableContainer component={Paper}>
      <Box mt={4} p={2}>
        <Typography variant="h5" gutterBottom align="center">Feedback</Typography>
        {roomFeedbacks.length > 0 ? (
          <Table aria-label="feedback table">
            <TableHead>
              <TableRow>
                <TableCell>Feedback Text</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Average Score</TableCell>
                <TableCell>Average Magnitude</TableCell>
                <TableCell>Overall Sentiment</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {roomFeedbacks.map((feedback, index) => (
                <TableRow key={feedback.feedbackId}>
                  <TableCell>{feedback.feedbackText}</TableCell>
                  <TableCell>{feedback.rating}</TableCell>
                  {index === 0 && (
                    <>
                      <TableCell rowSpan={roomFeedbacks.length} sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                        {averageScore}
                      </TableCell>
                      <TableCell rowSpan={roomFeedbacks.length} sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                        {averageMagnitude}
                      </TableCell>
                      <TableCell rowSpan={roomFeedbacks.length} sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                        {overallSentiment}
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography align="center" color="textSecondary">No feedback yet.</Typography>
        )}
      </Box>
    </TableContainer>
  );
};

export default FeedbackDisplay;
