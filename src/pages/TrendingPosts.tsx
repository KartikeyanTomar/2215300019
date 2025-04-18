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
  CardHeader,
  CardActions,
  IconButton
} from '@mui/material';
import { Favorite, Share, ChatBubble } from '@mui/icons-material';
import { apiService } from '../services/api';
import { User, Post, Comment } from '../types';

interface PostWithComments extends Post {
  commentCount: number;
  user: User;
}

const TrendingPosts: React.FC = () => {
  const [trendingPosts, setTrendingPosts] = useState<PostWithComments[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all users
      const usersData = await apiService.getUsers();
      const users = usersData.users;

      // Get all posts with comment counts
      const postsWithComments: PostWithComments[] = [];
      for (const user of users) {
        const userPosts = await apiService.getPosts(user.id);
        
        for (const post of userPosts.posts) {
          const postComments = await apiService.getComments(post.id);
          postsWithComments.push({
            ...post,
            commentCount: postComments.comments.length,
            user
          });
        }
      }

      // Find the maximum comment count
      const maxComments = Math.max(...postsWithComments.map(p => p.commentCount));

      // Filter posts with maximum comments
      const trending = postsWithComments.filter(p => p.commentCount === maxComments);

      setTrendingPosts(trending);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to load trending posts. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [fetchData]);

  if (loading && trendingPosts.length === 0) {
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
        Trending Posts
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Posts with the most comments
      </Typography>
      
      <Grid container spacing={3}>
        {trendingPosts.map((post) => (
          <Grid item xs={12} key={post.id}>
            <Card>
              <CardHeader
                avatar={
                  <Avatar 
                    alt={post.user.name} 
                    src={`https://i.pravatar.cc/150?u=${post.user.id}`}
                  />
                }
                title={post.user.name}
                subheader={new Date(post.timestamp).toLocaleString()}
              />
              <CardContent>
                <Typography variant="body1" paragraph>
                  {post.content}
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                  <Favorite />
                </IconButton>
                <IconButton aria-label="share">
                  <Share />
                </IconButton>
                <Box sx={{ flexGrow: 1 }} />
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ChatBubble sx={{ mr: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    {post.commentCount} comments
                  </Typography>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default TrendingPosts; 