import React, { useEffect, useState, useCallback } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Grid, 
  Box, 
  CircularProgress,
  Alert,
  IconButton,
  CardActions
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { apiService } from '../services/api';
import { User, Post, Comment } from '../types';

/**
 * Feed component displays a list of social media posts with user information and comments.
 * It automatically refreshes every 30 seconds and provides manual refresh capability.
 */
const Feed: React.FC = () => {
  // State management for posts, users, comments, loading state, and errors
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [comments, setComments] = useState<Record<number, Comment[]>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetches and updates feed data including users, posts, and comments.
   * Handles loading states and error management.
   */
  const fetchData = useCallback(async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch users data
      const usersData = await apiService.getUsers();
      const usersMap: Record<string, User> = {};
      usersData.users.forEach((user: User) => {
        usersMap[user.id] = user;
      });
      setUsers(usersMap);

      // Fetch and combine posts from all users
      const allPosts: Post[] = [];
      for (const userId in usersMap) {
        const userPosts = await apiService.getPosts(userId);
        allPosts.push(...userPosts.posts);
      }

      // Sort posts by ID (newest first)
      const sortedPosts = allPosts.sort((a, b) => b.id - a.id);
      setPosts(sortedPosts);

      // Fetch comments for each post
      const commentsMap: Record<number, Comment[]> = {};
      for (const post of sortedPosts) {
        const postComments = await apiService.getComments(post.id);
        commentsMap[post.id] = postComments.comments;
      }
      setComments(commentsMap);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load feed data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Set up automatic refresh and cleanup
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [fetchData]);

  // Loading state UI
  if (loading && posts.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Error state UI
  if (error) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert 
          severity="error" 
          action={
            <IconButton color="inherit" size="small" onClick={fetchData}>
              <RefreshIcon />
            </IconButton>
          }
        >
          {error}
        </Alert>
      </Box>
    );
  }

  // Main feed UI
  return (
    <Box sx={{ pb: 7 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4" component="h1">
          Latest Posts
        </Typography>
        <IconButton onClick={fetchData} disabled={loading}>
          <RefreshIcon />
        </IconButton>
      </Box>
      
      <Grid container spacing={3}>
        {posts.map((post: Post) => (
          <Grid item xs={12} key={post.id}>
            <Card>
              <CardContent>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle1" color="primary">
                    {users[post.userId]?.name || 'Unknown User'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(post.timestamp).toLocaleString()}
                  </Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  {post.content}
                </Typography>
                <CardActions>
                  <Typography variant="body2" color="text.secondary">
                    {comments[post.id]?.length || 0} comments
                  </Typography>
                </CardActions>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Feed; 