import React from 'react';
import { Container, Typography } from '@mui/material';

function Orders() {
  return (
    <Container maxWidth="sm" sx={{ pt: 2, pb: 10 }}>
      <Typography variant="h5" fontWeight={600} mb={1}>Orders</Typography>
      <Typography>Your orders will appear here.</Typography>
    </Container>
  );
}

export default Orders;
