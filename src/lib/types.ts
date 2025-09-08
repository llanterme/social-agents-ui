export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  surname: string;
  roles: string[];
  active: boolean;
  createdAt: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  surname: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ApiError {
  message: string;
  status: number;
  timestamp: string;
  details?: Record<string, string>;
}

export interface GenerationRequest {
  topic: string;
  platform: 'twitter' | 'linkedin' | 'instagram' | 'blog';
  tone: 'professional' | 'casual' | 'playful' | 'authoritative';
  imageCount?: number;
}

export interface GenerationResult {
  topic: string;
  research: {
    topic: string;
    insights: string[];
    sources?: string[];
  };
  content: {
    platform: string;
    tone: string;
    headline: string;
    body: string;
    cta: string;
    hashtags: string[];
  };
  image: {
    prompt: string;
    openAiImageUrls: string[];
    localImageUrls: string[];
  };
}

export interface TaskStatus {
  taskId: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  createdAt: string;
  completedAt?: string;
  error?: string;
  result?: GenerationResult;
}