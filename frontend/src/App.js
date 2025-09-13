
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper, Box, Typography, AppBar, Toolbar, Container } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import { useState } from 'react';

function Home() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      setResponse(data.reply);
    } catch (err) {
      setResponse('Error connecting to AI backend');
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="sm" sx={{ pt: 2, pb: 10 }}>
      <Typography variant="h5" fontWeight={600} mb={1}>Home</Typography>
      <Typography mb={3}>Welcome to Porter App!</Typography>
      <Box mt={2}>
        <Typography variant="subtitle1" fontWeight={500}>AI Chat Demo</Typography>
        <Box display="flex" gap={1} mt={1}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Type a message..."
            style={{ flex: 1, padding: '12px', fontSize: '16px', borderRadius: '8px', border: '1px solid #ccc' }}
          />
          <button onClick={handleSend} disabled={loading || !input} style={{ padding: '12px 20px', borderRadius: '8px', background: '#1976d2', color: '#fff', border: 'none', fontWeight: 500 }}>
            {loading ? 'Sending...' : 'Send'}
          </button>
        </Box>
        {response && (
          <Box mt={2} bgcolor="#e3f2fd" p={2} borderRadius={2}>
            <Typography variant="body1">{response}</Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
}
function Orders() {
  return (
    <Container maxWidth="sm" sx={{ pt: 2, pb: 10 }}>
      <Typography variant="h5" fontWeight={600} mb={1}>Orders</Typography>
      <Typography>Your orders will appear here.</Typography>
    </Container>
  );
}
function Profile() {
  return (
    <Container maxWidth="sm" sx={{ pt: 2, pb: 10 }}>
      <Typography variant="h5" fontWeight={600} mb={1}>Profile</Typography>
      <Typography>Manage your profile here.</Typography>
    </Container>
  );
}

function Navigation() {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    if (value === 0) navigate('/');
    if (value === 1) navigate('/orders');
    if (value === 2) navigate('/profile');
  }, [value, navigate]);
  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Orders" icon={<AssignmentIcon />} />
        <BottomNavigationAction label="Profile" icon={<AccountCircleIcon />} />
      </BottomNavigation>
    </Paper>
  );
}

function App() {
  return (
    <Router>
      <Box sx={{ minHeight: '100vh', bgcolor: '#fafafa', pb: 7 }}>
        <Box sx={{ width: '100%', bgcolor: '#ffecb3', color: '#795548', textAlign: 'center', py: 1, fontWeight: 600, fontSize: 16, letterSpacing: 1 }}>
          MOBILE PREVIEW
        </Box>
        <AppBar position="fixed" color="primary" sx={{ top: 32, left: 0, right: 0 }}>
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Porter App
            </Typography>
          </Toolbar>
        </AppBar>
        <Box sx={{ pt: 10 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Box>
        <Navigation />
      </Box>
    </Router>
  );
}

export default App;
