import React, { useEffect, useState, useCallback } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider
} from '@mui/material';
import { apiService } from '../services/api';
import { User, Post, Comment } from '../types';

interface UserStats {
  user: User;
  totalComments: number;
}

const TopUsers: React.FC = () => {
  const [topUsers, setTopUsers] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all users
      const usersData = await apiService.getUsers();
      const users = usersData.users;

      // Calculate comment counts for each user
      const userStats: UserStats[] = [];
      for (const user of users) {
        let totalComments = 0;
        const userPosts = await apiService.getPosts(user.id);
        
        for (const post of userPosts.posts) {
          const postComments = await apiService.getComments(post.id);
          totalComments += postComments.comments.length;
        }

        userStats.push({ user, totalComments });
      }

      // Sort users by comment count and take top 5
      const sortedUsers = userStats
        .sort((a, b) => b.totalComments - a.totalComments)
        .slice(0, 5);

      setTopUsers(sortedUsers);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load top users data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading && topUsers.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 7 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Top Users
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Users with the most commented posts
      </Typography>
      
      <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
        {topUsers.map((userStat, index) => (
          <React.Fragment key={userStat.user.id}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Avatar alt={userStat.user.name} src={`https://i.pravatar.cc/150?u=${userStat.user.id}`} />
              </ListItemAvatar>
              <ListItemText
                primary={userStat.user.name}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      Total Comments: {userStat.totalComments}
                    </Typography>
                  </React.Fragment>
                }
              />
            </ListItem>
            {index < topUsers.length - 1 && <Divider variant="inset" component="li" />}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default TopUsers; 