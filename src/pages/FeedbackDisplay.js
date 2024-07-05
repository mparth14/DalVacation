// src/FeedbackDisplay.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  header: {
    backgroundColor: '#1976d2', // Use a hard-coded color value
    color: '#ffffff',
  },
  sentimentCell: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

const FeedbackDisplay = () => {
  const classes = useStyles();
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
      <Typography variant="h4" gutterBottom align="center">Feedback Summary</Typography>
      <Table className={classes.table} aria-label="feedback table">
        <TableHead>
          <TableRow>
            <TableCell className={classes.header}>Room ID</TableCell>
            <TableCell className={classes.header}>Feedback Text</TableCell>
            <TableCell className={classes.header}>Rating</TableCell>
            <TableCell className={classes.header}>Average Score</TableCell>
            <TableCell className={classes.header}>Average Magnitude</TableCell>
            <TableCell className={classes.header}>Overall Sentiment</TableCell>
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
                      <TableCell rowSpan={room.feedbacks.length} className={classes.sentimentCell}>
                        {room.average_score}
                      </TableCell>
                    )}
                    {index === 0 && (
                      <TableCell rowSpan={room.feedbacks.length} className={classes.sentimentCell}>
                        {room.average_magnitude}
                      </TableCell>
                    )}
                    {index === 0 && (
                      <TableCell rowSpan={room.feedbacks.length} className={classes.sentimentCell}>
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
    </TableContainer>
  );
};

export default FeedbackDisplay;
