import { API_BASE_URL } from './api';
import { SafeStorage } from './storage';

export interface LinkedInConnectionStatus {
  connected: boolean;
  message: string;
  connectionDetails?: LinkedInConnection;
}

export interface LinkedInConnection {
  provider: string;
  providerUserId: string;
  connectedAt: string;
  expiresAt: string;
  active: boolean;
  scopes: string[];
}

export interface LinkedInPostRequest {
  id: number;
}

export interface LinkedInPostResponse {
  postId: string;
  state: string;
  postUrl: string;
  message: string;
}

export interface LinkedInConnectResponse {
  authorizationUrl: string;
  provider: string;
}

class LinkedInService {
  async checkConnectionStatus(): Promise<LinkedInConnectionStatus> {
    try {
      // Check if we're on client side and have a token
      if (typeof window === 'undefined') {
        return { connected: false, message: 'Server-side rendering' };
      }

      const token = SafeStorage.getItem('accessToken');
      if (!token) {
        // Return a default state instead of throwing
        return { connected: false, message: 'Not authenticated' };
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/connections/linkedin/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Token might be expired, return not connected
          return { connected: false, message: 'Authentication expired' };
        }
        throw new Error(`Failed to check LinkedIn connection status: ${response.statusText}`);
      }

      const data = await response.json();

      // If connected, fetch connection details
      if (data.connected) {
        try {
          const connections = await this.getAllConnections();
          const linkedInConnection = connections.find(c => c.provider === 'linkedin');
          return {
            ...data,
            connectionDetails: linkedInConnection
          };
        } catch (error) {
          // If we can't fetch connections, still return the status
          console.warn('Could not fetch connection details:', error);
          return data;
        }
      }

      return data;
    } catch (error) {
      console.error('Error checking LinkedIn connection status:', error);
      // Return a safe default instead of throwing
      return { connected: false, message: 'Error checking connection status' };
    }
  }

  async getAllConnections(): Promise<LinkedInConnection[]> {
    try {
      // Check if we're on client side and have a token
      if (typeof window === 'undefined') {
        return [];
      }

      const token = SafeStorage.getItem('accessToken');
      if (!token) {
        return [];
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/connections`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch connections: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching connections:', error);
      throw error;
    }
  }

  async initiateConnection(redirectUri?: string): Promise<LinkedInConnectResponse> {
    try {
      // Check if we're on client side and have a token
      if (typeof window === 'undefined') {
        throw new Error('LinkedIn connection can only be initiated on client side');
      }

      const token = SafeStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required to connect LinkedIn');
      }

      // Don't send redirect_uri parameter - let the backend handle it
      // The backend will use its own callback URL and redirect to frontend after processing
      const url = redirectUri
        ? `${API_BASE_URL}/api/v1/connections/linkedin/connect?redirect_uri=${encodeURIComponent(redirectUri)}`
        : `${API_BASE_URL}/api/v1/connections/linkedin/connect`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to initiate LinkedIn connection: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error initiating LinkedIn connection:', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      // Check if we're on client side and have a token
      if (typeof window === 'undefined') {
        throw new Error('LinkedIn disconnection can only be done on client side');
      }

      const token = SafeStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required to disconnect LinkedIn');
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/connections/linkedin`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to disconnect LinkedIn: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error disconnecting LinkedIn:', error);
      throw error;
    }
  }

  async postToLinkedIn(request: LinkedInPostRequest): Promise<LinkedInPostResponse> {
    try {
      // Check if we're on client side and have a token
      if (typeof window === 'undefined') {
        throw new Error('LinkedIn posting can only be done on client side');
      }

      const token = SafeStorage.getItem('accessToken');
      if (!token) {
        throw new Error('Authentication required to post to LinkedIn');
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/social/linkedin/post`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        if (response.status === 400) {
          const errorData = await response.json();
          if (errorData.message?.includes('connection not found')) {
            throw new Error('LinkedIn connection expired. Please reconnect your account.');
          }
        }
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || `Failed to post to LinkedIn: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error posting to LinkedIn:', error);
      throw error;
    }
  }
}

export const linkedInService = new LinkedInService();