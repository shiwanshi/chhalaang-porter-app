import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LoginSignup from './pages/LoginSignup';
import Home from './pages/Home';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Navigation from './pages/Navigation';
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
            <Route path="/" element={<LoginSignup />} />
            <Route path="/home" element={<Home />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Box>
        {/* Only show Navigation on logged-in pages */}
        {window.location.pathname !== '/' && <Navigation />}
      </Box>
    </Router>
  );
}

export default App;
