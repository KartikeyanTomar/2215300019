import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import TopUsers from './pages/TopUsers';
import TrendingPosts from './pages/TrendingPosts';
import Feed from './pages/Feed';
import Navigation from './components/Navigation';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PostAnalytics from './pages/PostAnalytics';
import UserAnalytics from './pages/UserAnalytics';
import EngagementAnalytics from './pages/EngagementAnalytics';
import { checkAuth } from './services/authService';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const isAuth = await checkAuth();
        setIsAuthenticated(isAuth);
        if (!isAuth) {
          navigate('/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        navigate('/login');
      }
    };

    verifyAuth();
  }, [navigate]);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Social Media Analytics
              </Typography>
              <Button color="inherit" component={RouterLink} to="/">
                Feed
              </Button>
              <Button color="inherit" component={RouterLink} to="/top-users">
                Top Users
              </Button>
              <Button color="inherit" component={RouterLink} to="/trending-posts">
                Trending Posts
              </Button>
            </Toolbar>
          </AppBar>
          <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Navigation />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/post-analytics"
                element={
                  <PrivateRoute>
                    <PostAnalytics />
                  </PrivateRoute>
                }
              />
              <Route
                path="/user-analytics"
                element={
                  <PrivateRoute>
                    <UserAnalytics />
                  </PrivateRoute>
                }
              />
              <Route
                path="/engagement-analytics"
                element={
                  <PrivateRoute>
                    <EngagementAnalytics />
                  </PrivateRoute>
                }
              />
              <Route path="/top-users" element={<TopUsers />} />
              <Route path="/trending-posts" element={<TrendingPosts />} />
            </Routes>
          </Container>
        </Box>
      </Router>
    </ThemeProvider>
  );
};

export default App; 