import React from 'react';
import { Container, Card, CardContent, Typography, Grid, Chip, Box, Divider } from '@mui/material';

// Import DRIVER_CONTEXT from Profile.js if possible, else duplicate for demo
const DRIVER_CONTEXT = {
  earnings: {
    "2025-09-12": {
      total_earnings: 1800,
      expenses: { fuel: 300, commission: 100, toll: 50 },
      net_earnings: 1350,
      completed_trips: 12,
      cash_collected: 900,
      wallet_balance: 450
    },
    "2025-09-13": {
      total_earnings: 2150,
      expenses: { fuel: 350, commission: 110, parking: 30 },
      net_earnings: 1660,
      completed_trips: 15,
      cash_collected: 1200,
      wallet_balance: 520
    },
    "2025-09-14": {
      total_earnings: 1620,
      expenses: { fuel: 280, commission: 95 },
      net_earnings: 1245,
      completed_trips: 11,
      cash_collected: 700,
      wallet_balance: 420
    }
  }
};

function EarningsDashboard() {
  const { earnings } = DRIVER_CONTEXT;
  const dates = Object.keys(earnings).sort().reverse();

  return (
    <Container maxWidth="sm" sx={{ pt: 4, pb: 10 }}>
      <Typography variant="h4" fontWeight={700} mb={3} color="primary">Earnings Dashboard</Typography>
      {dates.map(date => (
        <Card key={date} sx={{ mb: 3, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight={600} mb={1}>{date}</Typography>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={6}><Typography fontWeight={600}>Total: ₹{earnings[date].total_earnings}</Typography></Grid>
              <Grid item xs={6}><Typography fontWeight={600}>Net: ₹{earnings[date].net_earnings}</Typography></Grid>
              <Grid item xs={6}><Typography>Trips: {earnings[date].completed_trips}</Typography></Grid>
              <Grid item xs={6}><Typography>Cash: ₹{earnings[date].cash_collected}</Typography></Grid>
              <Grid item xs={6}><Typography>Wallet: ₹{earnings[date].wallet_balance}</Typography></Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Expenses</Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {Object.entries(earnings[date].expenses).map(([k, v]) => (
                    <Chip key={k} label={`${k}: ₹${v}`} color="default" size="small" />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Container>
  );
}

export default EarningsDashboard;
