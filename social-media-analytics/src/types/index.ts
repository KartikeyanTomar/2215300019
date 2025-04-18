export interface User {
  id: string;
  name: string;
  email: string;
  rollNo: string;
  accessCode: string;
  clientId: string;
  clientSecret: string;
}

export interface Post {
  id: number;
  userId: string;
  content: string;
  timestamp: string;
  likes: number;
  shares: number;
}

export interface Comment {
  id: number;
  postId: number;
  userId: string;
  content: string;
  timestamp: string;
}

export interface UserStats {
  user: User;
  totalComments: number;
}

export interface ApiResponse<T> {
  users: T[];
}

export interface PostAnalytics {
  totalPosts: number;
  averageLikes: number;
  averageShares: number;
  topPosts: Post[];
}

export interface UserAnalytics {
  totalUsers: number;
  activeUsers: number;
  topUsers: User[];
}

export interface EngagementAnalytics {
  totalEngagement: number;
  averageEngagement: number;
  topEngagedPosts: Post[];
} 