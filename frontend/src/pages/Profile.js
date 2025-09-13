
import React, { useState } from 'react';
import { Container, Box, Typography, Card, CardContent, Grid, Chip, Divider, Avatar, LinearProgress, Fade, Stack, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import DirectionsBikeIcon from '@mui/icons-material/DirectionsBike';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WarningIcon from '@mui/icons-material/Warning';
import StarIcon from '@mui/icons-material/Star';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';

const DRIVER_CONTEXT = {
  profile: {
    name: "Ramesh Kumar",
    city: "Bangalore",
    joined_date: "2023-08-15",
    vehicle: { type: "Bike", model: "Honda Shine", registration: "KA-01-AB-1234" },
    rating: 4.78,
    phone: "+91-98xxxxxx45"
  },
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
  },
  penalties: [
    { id: "PEN_01", reason: "Late Delivery", amount: 50, details: "30 min delay" },
    { id: "PEN_02", reason: "Helmet Not Worn", amount: 100, details: "Warned by traffic cam" }
  ],
  rewards: [
    { id: "REW_01", reason: "Weekly Target Achieved", amount: 200, details: "Completed 60 trips this week" },
    { id: "REW_02", reason: "5-Star Streak", amount: 150, details: "10 consecutive 5-star ratings" }
  ],
  shifts: [
    { date: "2025-09-12", start: "08:00", end: "18:00" },
    { date: "2025-09-13", start: "09:00", end: "17:00" }
  ],
  goals: {
    weekly_trips_target: 70,
    weekly_trips_done: 33,
    weekly_earnings_target: 9000
  }
};

// Sample leaderboard data
const LEADERBOARD = [
  { name: "Amit Singh", earnings: 6500 },
  { name: "Priya Sharma", earnings: 5900 },
  { name: "Ramesh Kumar", earnings: Object.values(DRIVER_CONTEXT.earnings).reduce((acc, e) => acc + e.total_earnings, 0) },
  { name: "Sunil Verma", earnings: 4800 },
  { name: "Neha Gupta", earnings: 4300 }
];

// Sort leaderboard and get rank
const sortedLeaderboard = [...LEADERBOARD].sort((a, b) => b.earnings - a.earnings);
const driverRank = sortedLeaderboard.findIndex(l => l.name === DRIVER_CONTEXT.profile.name) + 1;
const driverEarnings = sortedLeaderboard.find(l => l.name === DRIVER_CONTEXT.profile.name)?.earnings;


const Profile = () => {
  const { profile, earnings, penalties, rewards, shifts, goals } = DRIVER_CONTEXT;
  const latestDate = Object.keys(earnings).sort().reverse()[0];
  const latestEarning = earnings[latestDate];
  const progressTrips = Math.min(100, Math.round((goals.weekly_trips_done / goals.weekly_trips_target) * 100));
  const [openLeaderboard, setOpenLeaderboard] = useState(false);

  const handleLeaderboardOpen = () => setOpenLeaderboard(true);
  const handleLeaderboardClose = () => setOpenLeaderboard(false);

  return (
    <Fade in timeout={700}>
      <Container maxWidth="sm" sx={{ pt: 0, pb: 8 }}>
        {/* Gradient Header with Leaderboard Rank Chip */}
        <Box sx={{
          background: 'linear-gradient(90deg, #1976d2 0%, #64b5f6 100%)',
          borderRadius: '0 0 32px 32px',
          py: 4,
          mb: 3,
          boxShadow: 3,
          position: 'relative',
        }}>
          <Box display="flex" flexDirection="column" alignItems="center">
            <Avatar sx={{ width: 96, height: 96, bgcolor: '#fff', boxShadow: 2, mb: 2 }}>
              <DirectionsBikeIcon sx={{ color: '#1976d2', fontSize: 56 }} />
            </Avatar>
            <Typography variant="h4" fontWeight={700} color="#fff">{profile.name}</Typography>
            <Typography color="#e3f2fd" fontWeight={500} mb={0.5}>{profile.city}</Typography>
            <Chip label={`⭐ ${profile.rating}`} color="warning" icon={<StarIcon />} sx={{ mt: 1, fontWeight: 600 }} />
            <Typography variant="body2" color="#e3f2fd" mt={1}>Joined: {profile.joined_date}</Typography>
            <Chip
              label={`Leaderboard Rank #${driverRank}`}
              color="primary"
              icon={<EmojiEventsIcon />}
              sx={{ mt: 2, fontWeight: 600, cursor: 'pointer', bgcolor: '#fff', color: '#1976d2' }}
              onClick={handleLeaderboardOpen}
            />
          </Box>
        </Box>

        {/* Leaderboard Dialog Popup */}
        <Dialog open={openLeaderboard} onClose={handleLeaderboardClose} maxWidth="xs" fullWidth>
          <DialogTitle>
            Leaderboard
            <IconButton onClick={handleLeaderboardClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
              <span aria-hidden="true">×</span>
            </IconButton>
          </DialogTitle>
          <DialogContent>
            <Typography fontWeight={600} color="text.primary" mb={2}>Rank #{driverRank} out of {LEADERBOARD.length}</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>Total Earnings: ₹{driverEarnings}</Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="subtitle2" color="text.secondary" mb={1}>Top Earners This Week</Typography>
            <Stack gap={1}>
              {sortedLeaderboard.map((d, idx) => (
                <Box key={d.name} display="flex" alignItems="center" gap={1}>
                  <Typography fontWeight={700} color={d.name === DRIVER_CONTEXT.profile.name ? 'primary.main' : 'text.primary'}>
                    {idx + 1}.
                  </Typography>
                  <Typography fontWeight={d.name === DRIVER_CONTEXT.profile.name ? 700 : 500} color={d.name === DRIVER_CONTEXT.profile.name ? 'primary.main' : 'text.primary'}>
                    {d.name}
                  </Typography>
                  <Chip label={`₹${d.earnings}`} color={d.name === DRIVER_CONTEXT.profile.name ? 'primary' : 'default'} size="small" />
                </Box>
              ))}
            </Stack>
          </DialogContent>
        </Dialog>

        {/* Glassmorphism Card for Contact & Vehicle */}
        <Card sx={{ mb: 3, boxShadow: 6, backdropFilter: 'blur(8px)', background: 'rgba(255,255,255,0.85)' }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={6}>
                <Stack direction="row" alignItems="center" gap={1}>
                  <PhoneAndroidIcon color="primary" />
                  <Typography variant="subtitle2" color="text.secondary">Phone</Typography>
                </Stack>
                <Typography fontWeight={500} fontSize={18}>{profile.phone}</Typography>
              </Grid>
              <Grid item xs={6}>
                <Stack direction="row" alignItems="center" gap={1}>
                  <DirectionsCarIcon color="primary" />
                  <Typography variant="subtitle2" color="text.secondary">Vehicle</Typography>
                </Stack>
                <Typography fontWeight={500} fontSize={18}>{profile.vehicle.type} - {profile.vehicle.model}</Typography>
                <Typography variant="body2" color="text.secondary">{profile.vehicle.registration}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Earnings Card */}
        <Card sx={{ mb: 3, boxShadow: 4, background: 'rgba(232,245,233,0.95)' }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} mb={2} color="primary">Latest Earnings <CalendarMonthIcon fontSize="small" sx={{ ml: 1, verticalAlign: 'middle' }} /> ({latestDate})</Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}><Typography fontWeight={600}>Total: ₹{latestEarning.total_earnings}</Typography></Grid>
              <Grid item xs={6}><Typography fontWeight={600}>Net: ₹{latestEarning.net_earnings}</Typography></Grid>
              <Grid item xs={6}><Typography>Trips: {latestEarning.completed_trips}</Typography></Grid>
              <Grid item xs={6}><Typography>Cash: ₹{latestEarning.cash_collected}</Typography></Grid>
              <Grid item xs={6}><Typography>Wallet: ₹{latestEarning.wallet_balance}</Typography></Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Expenses</Typography>
                <Box display="flex" gap={1} flexWrap="wrap">
                  {Object.entries(latestEarning.expenses).map(([k, v]) => (
                    <Chip key={k} label={`${k}: ₹${v}`} color="default" size="small" />
                  ))}
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Rewards & Penalties */}
        <Grid container spacing={2} mb={3}>
          <Grid item xs={12} sm={6}>
            <Card sx={{ boxShadow: 3, background: 'rgba(255,249,196,0.95)' }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} mb={1} color="success.main">Rewards</Typography>
                <Stack gap={1}>
                  {rewards.map(r => (
                    <Chip key={r.id} icon={<EmojiEventsIcon />} label={`${r.reason} (+₹${r.amount})`} color="success" sx={{ fontWeight: 600 }} />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card sx={{ boxShadow: 3, background: 'rgba(255,205,210,0.95)' }}>
              <CardContent>
                <Typography variant="h6" fontWeight={700} mb={1} color="error.main">Penalties</Typography>
                <Stack gap={1}>
                  {penalties.map(p => (
                    <Chip key={p.id} icon={<WarningIcon />} label={p.reason} color="error" sx={{ fontWeight: 600 }} />
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Shifts */}
        <Card sx={{ mb: 3, boxShadow: 2, background: 'rgba(227,242,253,0.95)' }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} mb={1} color="primary">Shifts</Typography>
            <Stack direction="row" gap={2} flexWrap="wrap">
              {shifts.map(s => (
                <Chip key={s.date} label={`${s.date}: ${s.start} - ${s.end}`} color="primary" sx={{ fontWeight: 600 }} />
              ))}
            </Stack>
          </CardContent>
        </Card>

        {/* Weekly Goals with Progress Bar */}
        <Card sx={{ boxShadow: 2, background: 'rgba(255,255,255,0.95)' }}>
          <CardContent>
            <Typography variant="h6" fontWeight={700} mb={2} color="primary">Weekly Goals</Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12}>
                <Typography fontWeight={600} mb={1}>Trips Progress</Typography>
                <LinearProgress variant="determinate" value={progressTrips} sx={{ height: 10, borderRadius: 5, mb: 1 }} />
                <Typography variant="body2" color="text.secondary">{goals.weekly_trips_done} / {goals.weekly_trips_target} trips</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography fontWeight={600}>Earnings Target</Typography>
                <Typography variant="h6" color="success.main">₹{goals.weekly_earnings_target}</Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Fade>
  );
};

export default Profile;
