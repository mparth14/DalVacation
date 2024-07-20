import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/system';

const StyledCard = styled(Card)({
  maxWidth: '80%',
  margin: 'auto',
  marginTop: '50px',
  boxShadow: '0 2px 10px rgba(0, 0, 0, 0.2)',
  borderRadius: '15px',
});

const StyledTypography = styled(Typography)({
  textAlign: 'center',
  marginBottom: '20px',
  fontWeight: 'bold',
});

const IframeContainer = styled(Box)({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const DashboardPage = () => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f7f7f7', padding: '20px' }}>
      <StyledCard>
        <CardContent>
          <StyledTypography variant="h5">
            User Statistics and Login Information
          </StyledTypography>
          <IframeContainer>
            <iframe
              width="100%"
              height="600"
              src="https://lookerstudio.google.com/embed/reporting/488e89e6-84a1-4f01-9683-c9daeaca49ec/page/Ema6D"
              frameBorder="0"
              style={{ border: 0 }}
              allowFullScreen
              sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
            ></iframe>
          </IframeContainer>
        </CardContent>
      </StyledCard>
    </Box>
  );
};

export default DashboardPage;
