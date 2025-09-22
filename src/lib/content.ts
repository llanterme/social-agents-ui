import { API_BASE_URL } from './api';
import { SafeStorage } from './storage';

export interface ContentItem {
  id: number;
  topic: string;
  platform: string;
  tone: string;
  imageCount: number;
  research: {
    topic?: string;
    points?: string[];      // For task results format
    sources?: string[];     // For task results format
    insights?: string[];    // For library content format
  };
  content: {
    platform: string;
    tone: string;
    headline: string;
    body: string;
    cta: string;
    hashtags?: string[];
  };
  image: {
    prompt: string;
    openAiImageUrls: string[];
    localImagePaths: string[];
    localImageUrls: string[];
  };
  createdAt: string;
  updatedAt: string;
}

export interface ContentListResponse extends Array<ContentItem> {}

export interface ContentError {
  message: string;
  status: number;
  timestamp: string;
}

class ContentService {
  async getAllContent(): Promise<ContentItem[]> {
    try {
      if (typeof window === 'undefined') {
        return [];
      }

      const token = SafeStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/content`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication expired');
        }
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to fetch content: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching content:', error);
      throw error;
    }
  }

  async getContentById(id: number): Promise<ContentItem> {
    try {
      if (typeof window === 'undefined') {
        throw new Error('Content can only be fetched on client side');
      }

      const token = SafeStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/content/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Content not found or you don\'t have permission to access it');
        }
        if (response.status === 401) {
          throw new Error('Authentication expired');
        }
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to fetch content: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching content by ID:', error);
      throw error;
    }
  }

  async deleteContent(id: number): Promise<void> {
    try {
      if (typeof window === 'undefined') {
        throw new Error('Content can only be deleted on client side');
      }

      const token = SafeStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/content/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Content not found or you don\'t have permission to delete it');
        }
        if (response.status === 401) {
          throw new Error('Authentication expired');
        }
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to delete content: ${response.statusText}`);
      }

      // 204 No Content - successful deletion
    } catch (error) {
      console.error('Error deleting content:', error);
      throw error;
    }
  }
}

export const contentService = new ContentService();