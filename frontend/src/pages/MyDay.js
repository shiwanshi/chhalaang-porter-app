import React from 'react';
import { Container, Typography, Card, CardContent, Box, Avatar, Divider, Fade } from '@mui/material';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import Lottie from 'lottie-react';
import earningAnim from '../assets/earning-anim.json'; // You need to add a Lottie file here

// Example data, replace with real data from backend or context
const todayEarnings = {
  date: new Date().toLocaleDateString(),
  total: 1250,
  trips: 8,
  bonuses: 200,
  cash: 1050,
  breakdown: [
    { time: '08:00', amount: 150, desc: 'Trip 1' },
    { time: '10:30', amount: 200, desc: 'Trip 2' },
    { time: '12:00', amount: 100, desc: 'Trip 3' },
    { time: '14:15', amount: 250, desc: 'Trip 4' },
    { time: '16:00', amount: 150, desc: 'Trip 5' },
    { time: '17:30', amount: 100, desc: 'Trip 6' },
    { time: '19:00', amount: 200, desc: 'Trip 7' },
    { time: '20:30', amount: 100, desc: 'Trip 8' },
  ]
};

function MyDay() {
  // Animation states
  const [showTotal, setShowTotal] = React.useState(false);
  const [showBreakdown, setShowBreakdown] = React.useState(false);
  React.useEffect(() => {
    const timer1 = setTimeout(() => setShowTotal(true), 800);
    const timer2 = setTimeout(() => setShowBreakdown(true), 2200);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <Container maxWidth="sm" sx={{ pt: 4, pb: 8, minHeight: '100vh', background: 'linear-gradient(135deg, #fffde7 0%, #e3f2fd 100%)', borderRadius: 6, boxShadow: '0 8px 32px rgba(44,62,80,0.12)', px: { xs: 1, sm: 3 } }}>
      <Box textAlign="center" mb={3}>
        <Lottie animationData={earningAnim} loop={true} style={{ width: 180, margin: '0 auto' }} />
        <Typography variant="h4" fontWeight={900} color="#ff9800" mb={1} sx={{ letterSpacing: 2, textShadow: '0 2px 8px #ffe082' }}>
          My Day
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={2} sx={{ fontWeight: 500, fontSize: 20 }}>
          Earnings for {todayEarnings.date}
        </Typography>
      </Box>
      <Fade in={showTotal} timeout={1200}>
        <Card sx={{ mb: 4, boxShadow: 6, borderRadius: 4, background: 'rgba(255,255,255,0.98)' }}>
          <CardContent>
            <Typography variant="h2" fontWeight={900} color="success.main" mb={1} sx={{ textShadow: '0 2px 8px #c8e6c9', transition: 'all 0.5s' }}>
              ₹{todayEarnings.total}
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={2} sx={{ fontSize: 22, fontWeight: 700 }}>
              Total Earnings Today
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2" fontWeight={600}>Trips</Typography>
              <Typography variant="body2">{todayEarnings.trips}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2" fontWeight={600}>Bonuses</Typography>
              <Typography variant="body2">₹{todayEarnings.bonuses}</Typography>
            </Box>
            <Box display="flex" justifyContent="space-between">
              <Typography variant="body2" fontWeight={600}>Cash Received</Typography>
              <Typography variant="body2">₹{todayEarnings.cash}</Typography>
            </Box>
          </CardContent>
        </Card>
      </Fade>
      <Fade in={showBreakdown} timeout={1200}>
        <Box>
          <Typography variant="h6" fontWeight={700} mb={2} color="primary" sx={{ fontSize: 22 }}>
            Trip Breakdown
          </Typography>
          {todayEarnings.breakdown.map((trip, idx) => (
            <Fade in={showBreakdown} timeout={800 + idx * 200} key={idx}>
              <Card sx={{ mb: 2, boxShadow: 2, borderRadius: 3, bgcolor: '#fff', animation: 'slideIn 0.7s' }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Typography variant="body1" fontWeight={600}>{trip.desc}</Typography>
                    <Typography variant="body2" color="text.secondary">{trip.time}</Typography>
                  </Box>
                  <Typography variant="h6" color="success.main" fontWeight={700} mt={1} sx={{ fontSize: 20, transition: 'all 0.5s' }}>₹{trip.amount}</Typography>
                </CardContent>
              </Card>
            </Fade>
          ))}
        </Box>
      </Fade>
      <style>{`
        @keyframes slideIn {
          0% { transform: translateY(40px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </Container>
  );
}

export default MyDay;
