import React from 'react';
import { Container, Typography } from '@mui/material';

function Profile() {
  return (
    <Container maxWidth="sm" sx={{ pt: 2, pb: 10 }}>
      <Typography variant="h5" fontWeight={600} mb={1}>Profile</Typography>
      <Typography>Manage your profile here.</Typography>
    </Container>
  );
}

export default Profile;
