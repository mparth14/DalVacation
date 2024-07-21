import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { firestore } from '../../config/firebaseConfig';
import ServiceRequestCard from './ServiceRequestCard'; // Import the ServiceRequestCard component
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { useLocation } from 'react-router-dom';

const RequestList = () => {
  const [requests, setRequests] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate
  const location = useLocation();
  const { userId, userType } = location.state || {};

  useEffect(() => {
    const requestsRef = collection(firestore, 'CommunicationLogs');
    let requestsQuery;
    if (userType === 'property-agents') {
      requestsQuery = query(requestsRef, where('AgentId', '==', userId));
    } else {
      requestsQuery = query(requestsRef, where('UserId', '==', userId));
    }

    const unsubscribe = onSnapshot(requestsQuery, snapshot => {
      const requestsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRequests(requestsData);
    });

    return () => unsubscribe();
  }, [userId, userType]);

  const handleCardClick = (requestData) => {
    navigate(`/chat/${requestData.id}`, { state: { requestData } });
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1rem' }}>
      <div style={{ backgroundColor: '#f9f9f9', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', padding: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem' }}>Service Requests</h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '1rem',
          maxHeight: '500px',
          overflowY: 'auto'
        }}>
          {requests.map(request => (
            <ServiceRequestCard
              key={request.id}
              id={request.id}
              requester={request.UserName || 'N/A'} // Default to 'N/A' if UserName is not available
              assignee={request.AgentName || 'N/A'} // Default to 'N/A' if AgentName is not available
              createdAt={request.Timestamp ? request.Timestamp.toDate().toLocaleString() : 'Unknown'} // Format timestamp
              onClick={() => handleCardClick(request)} // Pass complete request data
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RequestList;
