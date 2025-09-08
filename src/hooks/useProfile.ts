import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { User } from '@/lib/types';
import { profileService } from '@/lib/profile';
import { useAuth } from '@/context/AuthContext';

export const PROFILE_QUERY_KEY = ['profile'] as const;

export function useProfile() {
  const { isAuthenticated } = useAuth();
  
  return useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: () => profileService.getProfile(),
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 10, // 10 minutes
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    retry: (failureCount, error) => {
      // Don't retry on 401/403 errors (authentication/authorization)
      if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('403')) {
          return false;
        }
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (updates: Partial<Pick<User, 'name' | 'surname' | 'email'>>) =>
      profileService.updateProfile(updates),
    onSuccess: (updatedUser) => {
      // Update the profile cache
      queryClient.setQueryData(PROFILE_QUERY_KEY, updatedUser);
      
      // Invalidate and refetch profile data to ensure consistency
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
    onError: (error) => {
      console.error('Failed to update profile:', error);
    },
    retry: (failureCount, error) => {
      // Don't retry on validation errors (4xx)
      if (error instanceof Error) {
        if (error.message.includes('400') || 
            error.message.includes('401') || 
            error.message.includes('403') ||
            error.message.includes('422')) {
          return false;
        }
      }
      // Retry once for server errors (5xx) or network issues
      return failureCount < 1;
    },
    retryDelay: 2000, // Wait 2 seconds before retry
  });
}

export function useProfileActions() {
  const queryClient = useQueryClient();
  
  const refreshProfile = () => {
    queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
  };
  
  const clearProfileCache = () => {
    queryClient.removeQueries({ queryKey: PROFILE_QUERY_KEY });
  };
  
  return {
    refreshProfile,
    clearProfileCache,
  };
}