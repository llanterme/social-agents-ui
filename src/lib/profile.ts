import { User } from './types';
import { authService } from './auth';

export class ProfileService {

  async getProfile(): Promise<User> {
    const response = await authService.authenticatedRequest('/api/v1/auth/me');
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || 'Failed to fetch profile');
    }
    
    return response.json();
  }

  async updateProfile(updates: Partial<Pick<User, 'name' | 'surname' | 'email'>>): Promise<User> {
    const response = await authService.authenticatedRequest('/api/v1/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || 'Failed to update profile');
    }
    
    return response.json();
  }
}

export const profileService = new ProfileService();