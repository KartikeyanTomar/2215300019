import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';

const Navigation: React.FC = () => {
  const [value, setValue] = React.useState(0);

  return (
    <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction
          label="Feed"
          icon={<HomeIcon />}
          component={RouterLink}
          to="/"
        />
        <BottomNavigationAction
          label="Trending"
          icon={<TrendingUpIcon />}
          component={RouterLink}
          to="/trending-posts"
        />
        <BottomNavigationAction
          label="Top Users"
          icon={<PeopleIcon />}
          component={RouterLink}
          to="/top-users"
        />
      </BottomNavigation>
    </Paper>
  );
};

export default Navigation; 