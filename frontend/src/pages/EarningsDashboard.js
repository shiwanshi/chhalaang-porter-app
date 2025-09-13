import React, { useState } from 'react';
import { Container, Card, CardContent, Typography, Grid, Chip, Box, Divider, Avatar, LinearProgress, Stack } from '@mui/material';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';

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
  const [hindiMode, setHindiMode] = useState(false);
  // Calculate totals for summary
  const totalEarnings = dates.reduce((acc, d) => acc + earnings[d].total_earnings, 0);
  const totalTrips = dates.reduce((acc, d) => acc + earnings[d].completed_trips, 0);
  const totalNet = dates.reduce((acc, d) => acc + earnings[d].net_earnings, 0);

  return (
    <Container maxWidth="sm" sx={{ pt: 0, pb: 10 }}>
      <Box display="flex" justifyContent="flex-end" mb={2}>
        <button
          onClick={() => setHindiMode(m => !m)}
          style={{
            background: hindiMode ? '#ffd600' : '#1976d2',
            color: hindiMode ? '#1976d2' : '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 18px',
            fontWeight: 700,
            fontSize: '16px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            cursor: 'pointer',
            zIndex: 2000
          }}
        >
          {hindiMode ? 'Show English Dashboard' : 'हिंदी में देखें'}
        </button>
      </Box>
      {hindiMode ? (
        <>
          {/* Hindi Dashboard */}
          <Box sx={{
            background: 'linear-gradient(90deg, #ff9800 0%, #ffd600 100%)',
            borderRadius: '0 0 32px 32px',
            py: 4,
            mb: 4,
            boxShadow: 3,
            position: 'relative',
            color: '#fff',
            textAlign: 'center',
            fontFamily: 'Mukti, Arial, sans-serif'
          }}>
            <Typography variant="h4" fontWeight={700} mb={1} sx={{ fontSize: 32 }}>💰 कमाई का डैशबोर्ड</Typography>
            <Typography variant="h5" fontWeight={700} mb={1} sx={{ fontSize: 28 }}>आज तक कुल कमाई: <span style={{ color: '#fffde7', fontWeight: 900 }}>₹{totalEarnings}</span></Typography>
            <Typography variant="h6" fontWeight={700} mb={1} sx={{ fontSize: 24 }}>सफर पूरे: <span style={{ color: '#fffde7', fontWeight: 900 }}>{totalTrips}</span></Typography>
            <Typography variant="h6" fontWeight={700} mb={1} sx={{ fontSize: 24 }}>हाथ में बचत: <span style={{ color: '#fffde7', fontWeight: 900 }}>₹{totalNet}</span></Typography>
            <Typography variant="body2" mb={1} sx={{ fontSize: 18 }}>नीचे हर दिन की कमाई दिख रही है 👇</Typography>
          </Box>
          {dates.map(date => {
            const day = earnings[date];
            return (
              <Card key={date} sx={{ mb: 3, boxShadow: 6, background: 'rgba(255,249,196,0.98)', borderRadius: 4 }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Typography variant="h6" fontWeight={700} sx={{ fontSize: 22 }}>📅 {date}</Typography>
                    <Chip label={`सफर: ${day.completed_trips}`} color="primary" sx={{ fontSize: 18, fontWeight: 700 }} />
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}><Typography fontWeight={700} sx={{ fontSize: 22 }}>💵 कुल: ₹{day.total_earnings}</Typography></Grid>
                    <Grid item xs={6}><Typography fontWeight={700} sx={{ fontSize: 22 }}>🟢 बचत: ₹{day.net_earnings}</Typography></Grid>
                    <Grid item xs={6}><Typography fontWeight={700} sx={{ fontSize: 20 }}>🪙 नकद: ₹{day.cash_collected}</Typography></Grid>
                    <Grid item xs={6}><Typography fontWeight={700} sx={{ fontSize: 20 }}>👛 वॉलेट: ₹{day.wallet_balance}</Typography></Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: 18, fontWeight: 700 }}>खर्चे:</Typography>
                      <Stack direction="row" gap={1} flexWrap="wrap">
                        {Object.entries(day.expenses).map(([k, v]) => (
                          <Chip key={k} label={`${k}: ₹${v}`} color="default" size="medium" sx={{ fontSize: 16, fontWeight: 700 }} />
                        ))}
                      </Stack>
                    </Grid>
                  </Grid>
                  <Divider sx={{ mt: 2, mb: 1 }} />
                  <Typography variant="body2" sx={{ fontSize: 18, color: '#ff9800', fontWeight: 700 }}>
                    {`कुल कमाई में से खर्चे घटाकर बचत निकली है।`}
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
        </>
      ) : (
        <>
          {/* English Dashboard (previous design) */}
          <Box sx={{
            background: 'linear-gradient(90deg, #43cea2 0%, #185a9d 100%)',
            borderRadius: '0 0 32px 32px',
            py: 4,
            mb: 4,
            boxShadow: 3,
            position: 'relative',
            color: '#fff',
            textAlign: 'center'
          }}>
            <Avatar sx={{ bgcolor: '#fff', color: '#43cea2', width: 72, height: 72, mx: 'auto', mb: 2 }}>
              <MonetizationOnIcon sx={{ fontSize: 44 }} />
            </Avatar>
            <Typography variant="h4" fontWeight={700} mb={1}>Earnings Dashboard</Typography>
            <Typography variant="h6" fontWeight={500} mb={1}>Total Earnings: ₹{totalEarnings}</Typography>
            <Typography variant="body1" fontWeight={500} mb={1}>Total Trips: {totalTrips}</Typography>
            <Typography variant="body2" fontWeight={400} mb={1}>Net Earnings: ₹{totalNet}</Typography>
          </Box>
          {dates.map(date => {
            const day = earnings[date];
            const netPercent = Math.round((day.net_earnings / day.total_earnings) * 100);
            return (
              <Card key={date} sx={{ mb: 3, boxShadow: 6, backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.92)' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <CalendarMonthIcon color="primary" />
                    <Typography variant="h6" fontWeight={700}>{date}</Typography>
                    <Chip label={`Trips: ${day.completed_trips}`} color="primary" />
                  </Box>
                  <Divider sx={{ mb: 2 }} />
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={6}><Typography fontWeight={600}>Total: ₹{day.total_earnings}</Typography></Grid>
                    <Grid item xs={6}><Typography fontWeight={600}>Net: ₹{day.net_earnings}</Typography></Grid>
                    <Grid item xs={6}><Typography>Cash: ₹{day.cash_collected}</Typography></Grid>
                    <Grid item xs={6}><Typography>Wallet: ₹{day.wallet_balance}</Typography></Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Net Earnings Progress</Typography>
                      <LinearProgress variant="determinate" value={netPercent} sx={{ height: 8, borderRadius: 5, mb: 1 }} />
                      <Typography variant="body2" color="text.secondary">{netPercent}% of total earnings</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary">Expenses</Typography>
                      <Stack direction="row" gap={1} flexWrap="wrap">
                        {Object.entries(day.expenses).map(([k, v]) => (
                          <Chip key={k} label={`${k}: ₹${v}`} color="default" size="small" />
                        ))}
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            );
          })}
        </>
      )}
    </Container>
  );
}

export default EarningsDashboard;
