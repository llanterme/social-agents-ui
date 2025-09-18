'use client';

import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { linkedInService, LinkedInConnectionStatus, LinkedInPostRequest, LinkedInPostResponse } from '@/lib/linkedin';

export function useLinkedInConnection() {
  const [isConnecting, setIsConnecting] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const queryClient = useQueryClient();

  // Check for token on client side and listen for changes
  useEffect(() => {
    const checkToken = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        setHasToken(!!token);
      }
    };

    // Initial check
    checkToken();

    // Listen for storage changes (login/logout in other tabs)
    window.addEventListener('storage', checkToken);

    // Check on focus (in case token changed in same tab)
    window.addEventListener('focus', checkToken);

    return () => {
      window.removeEventListener('storage', checkToken);
      window.removeEventListener('focus', checkToken);
    };
  }, []);

  // Check connection status
  const {
    data: connectionStatus,
    isLoading: isChecking,
    error: statusError,
    refetch: refetchStatus
  } = useQuery<LinkedInConnectionStatus>({
    queryKey: ['linkedin-connection-status'],
    queryFn: async () => {
      // Double-check token exists before calling service
      if (typeof window === 'undefined' || !localStorage.getItem('accessToken')) {
        return { connected: false, message: 'Not authenticated' };
      }
      return linkedInService.checkConnectionStatus();
    },
    refetchInterval: hasToken ? 60000 : false, // Only refresh if authenticated
    retry: false, // Don't retry on auth errors
    enabled: hasToken, // Only run if authenticated
  });

  // Connect mutation
  const connect = async () => {
    setIsConnecting(true);
    try {
      // Don't pass redirect_uri - let backend handle the OAuth callback
      const response = await linkedInService.initiateConnection();
      if (response.authorizationUrl) {
        // Redirect to LinkedIn OAuth with backend's callback URL
        window.location.href = response.authorizationUrl;
      }
    } catch (error) {
      console.error('Failed to initiate LinkedIn connection:', error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  // Disconnect mutation
  const disconnectMutation = useMutation({
    mutationFn: () => linkedInService.disconnect(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['linkedin-connection-status'] });
      queryClient.invalidateQueries({ queryKey: ['connections'] });
    },
  });

  return {
    connectionStatus,
    isChecking,
    connect,
    disconnect: disconnectMutation.mutate,
    isConnecting,
    isDisconnecting: disconnectMutation.isPending,
    error: statusError?.message || disconnectMutation.error?.message,
    refetchStatus,
  };
}

export function useLinkedInPost() {
  const queryClient = useQueryClient();

  const postMutation = useMutation<LinkedInPostResponse, Error, LinkedInPostRequest>({
    mutationFn: (request) => linkedInService.postToLinkedIn(request),
    onSuccess: (data) => {
      // Optionally invalidate any relevant queries
      queryClient.invalidateQueries({ queryKey: ['content-history'] });
    },
  });

  return {
    post: postMutation.mutate,
    postAsync: postMutation.mutateAsync,
    isPosting: postMutation.isPending,
    postError: postMutation.error,
    postData: postMutation.data,
    reset: postMutation.reset,
  };
}