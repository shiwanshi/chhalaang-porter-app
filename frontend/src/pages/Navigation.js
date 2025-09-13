import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import TodayIcon from '@mui/icons-material/Today';
import SchoolIcon from '@mui/icons-material/School';

function Navigation() {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);
  React.useEffect(() => {
    if (value === 0) navigate('/home');
    if (value === 1) navigate('/myday');
    if (value === 2) navigate('/learning');
    if (value === 3) navigate('/earnings');
    if (value === 4) navigate('/profile');
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
  <BottomNavigationAction label="My Day" icon={<TodayIcon />} />
  <BottomNavigationAction label="Learning" icon={<SchoolIcon />} />
  <BottomNavigationAction label="Earnings" icon={<AssignmentIcon />} />
  <BottomNavigationAction label="Profile" icon={<AccountCircleIcon />} />
      </BottomNavigation>
    </Paper>
  );
}

export default Navigation;
