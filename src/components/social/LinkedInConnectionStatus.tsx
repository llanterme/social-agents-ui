'use client';

import { useEffect } from 'react';
import { useLinkedInConnection } from '@/hooks/useLinkedIn';
import { useAuth } from '@/context/AuthContext';
import { AlertCircle, RefreshCw } from 'lucide-react';

export function LinkedInConnectionStatus() {
  const { user, isLoading } = useAuth();
  const { connectionStatus, refetchStatus } = useLinkedInConnection();

  useEffect(() => {
    // Only check status if user is authenticated
    if (!user || isLoading) return;

    // Don't call refetchStatus directly - let the query handle it
    // The query will automatically run when enabled becomes true

    // Check periodically (only if authenticated)
    const interval = setInterval(() => {
      // Only refetch if we have a token
      if (typeof window !== 'undefined' && localStorage.getItem('accessToken')) {
        refetchStatus();
      }
    }, 5 * 60 * 1000); // Every 5 minutes

    return () => clearInterval(interval);
  }, [user, isLoading, refetchStatus]);

  // Check if token is expiring soon (within 7 days)
  const isExpiringSoon = () => {
    if (!connectionStatus?.connectionDetails?.expiresAt) return false;
    const expiryDate = new Date(connectionStatus.connectionDetails.expiresAt);
    const daysUntilExpiry = (expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
    return daysUntilExpiry < 7 && daysUntilExpiry > 0;
  };

  // Check if token is expired
  const isExpired = () => {
    if (!connectionStatus?.connectionDetails?.expiresAt) return false;
    const expiryDate = new Date(connectionStatus.connectionDetails.expiresAt);
    return expiryDate.getTime() < Date.now();
  };

  // Don't show anything if user is not authenticated or connection status is not available
  if (!user || isLoading || !connectionStatus?.connected || isExpired()) {
    return null;
  }

  if (isExpiringSoon()) {
    return (
      <div className="fixed bottom-4 right-4 max-w-sm bg-amber-50 border border-amber-200 rounded-lg shadow-lg p-4 z-50">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-amber-800">LinkedIn Connection Expiring Soon</h4>
            <p className="text-xs text-amber-700 mt-1">
              Your LinkedIn connection will expire soon. Please reconnect to continue posting.
            </p>
            <button
              onClick={() => window.location.href = '/profile'}
              className="mt-2 inline-flex items-center space-x-1 text-xs font-medium text-amber-700 hover:text-amber-800"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Reconnect Now</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}