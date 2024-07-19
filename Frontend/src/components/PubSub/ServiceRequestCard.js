import React from 'react';

// Define the inline styles
const styles = {
  card: {
    border: '1px solid #d1d5db', // Light gray border
    borderRadius: '0.5rem', // Rounded corners
    backgroundColor: '#ffffff', // White background
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Subtle shadow
    padding: '1.5rem', // Padding inside the card
    marginBottom: '1rem', // Space between cards
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto',
    alignItems: 'center',
    gap: '1rem',
  },
  idCircle: {
    backgroundColor: '#3490dc', // Primary color
    color: '#ffffff', // Text color
    borderRadius: '50%', // Circle shape
    width: '2.5rem', // Width of the circle
    height: '2.5rem', // Height of the circle
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '600', // Bold text
  },
  requester: {
    fontSize: '1.125rem', // Larger font size for the requester
    fontWeight: '600', // Bold text
  },
  assignee: {
    fontSize: '0.875rem', // Smaller font size for the assignee
    color: '#6b7280', // Gray color for text
  },
  createdAt: {
    fontSize: '0.875rem', // Smaller font size for creation date
    color: '#6b7280', // Gray color for text
  },
};

const ServiceRequestCard = ({ id, requester, assignee, createdAt, onClick }) => {
  return (
    <div style={styles.card}       onClick={onClick} // Handle click event
>
      <div style={styles.idCircle}>#{id}</div>
      <div>
        <div style={styles.requester}>{requester}</div>
        <div style={styles.assignee}>Assigned to: {assignee}</div>
        <div style={styles.createdAt}>Created: {createdAt}</div>
        </div>
    </div>
  );
};

export default ServiceRequestCard;
