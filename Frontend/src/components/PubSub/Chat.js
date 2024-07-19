import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { firestore } from '../../config/firebaseConfig';
import { useLocation, useParams } from 'react-router-dom';
import { AppBar, Box, Button, Container, TextField, Toolbar, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    width: '100%',
    backgroundColor: '#f5f5f5',
  },
  messageContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  messageBubble: {
    display: 'flex',
    flexDirection: 'column',
    borderRadius: '1.2rem',
    padding: '0.5rem 1rem',
    maxWidth: '70%',
    wordBreak: 'break-word',
  },
  userMessage: {
    backgroundColor: '#d1e7dd',
    alignSelf: 'flex-end',
    borderBottomRightRadius: '0',
  },
  otherMessage: {
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: '0',
  },
  inputContainer: {
    borderTop: '1px solid #cccccc',
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  textarea: {
    flexGrow: 1,
    marginRight: '1rem',
  },
  timestamp: {
    display: 'block',
    fontSize: '0.75rem',
    color: '#888888',
  },
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const location = useLocation();
  const { requestId } = useParams();

  const { requestData } = location.state;
  const userData = JSON.parse(sessionStorage.getItem('user')) || {};
    const userId = userData.user_id;
    const userType = userData.userType;

  useEffect(() => {
    const messagesRef = collection(firestore, 'CommunicationLogs', requestId, 'Messages');
    const q = query(messagesRef, orderBy('timestamp'));

    const unsubscribe = onSnapshot(q, snapshot => {
      const messagesData = snapshot.docs.map(doc => doc.data());
      setMessages(messagesData);
    });

    return () => unsubscribe();
  }, [requestId]);

  const handleSend = async () => {
    if (newMessage.trim() === '') return;

    const message = {
      text: newMessage,
      senderId: userId,
      timestamp: new Date(),
    };

    await addDoc(collection(firestore, 'CommunicationLogs', requestId, 'Messages'), message);
    setNewMessage('');
  };

  return (
    <div style={styles.container}>
      <AppBar sx={{ backgroundColor: 'white' }} position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight:'bold'}}>
            {requestData.UserName || 'N/A'}
          </Typography>
          <Typography variant="subtitle1" component="div" sx={{fontWeight:'bold'}}>
            Agent: {requestData.AgentName || 'N/A'}
          </Typography>
        </Toolbar>
      </AppBar>
      <div style={styles.messageContainer}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.messageBubble,
              ...(msg.senderId === userId ? styles.userMessage : styles.otherMessage),
            }}
          >
            <p>{msg.text}</p>
            <span style={styles.timestamp}>{new Date(msg.timestamp.toDate()).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>
      <div style={styles.inputContainer}>
        <TextField
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          variant="outlined"
          fullWidth
          multiline
          rows={2}
          style={styles.textarea}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSend}
          startIcon={<SendIcon />}
        >
          Send
        </Button>
      </div>
    </div>
  );
};

export default Chat;
