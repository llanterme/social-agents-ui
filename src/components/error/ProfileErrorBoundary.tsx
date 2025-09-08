'use client';

import { ErrorBoundary } from './ErrorBoundary';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, RefreshCw, AlertCircle } from 'lucide-react';
import { useProfileActions } from '@/hooks/useProfile';

interface ProfileErrorFallbackProps {
  error: Error;
  resetError: () => void;
}

function ProfileErrorFallback({ error, resetError }: ProfileErrorFallbackProps) {
  const { refreshProfile } = useProfileActions();

  const handleRetry = () => {
    refreshProfile();
    resetError();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
      
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <AlertCircle className="h-8 w-8 text-red-500" />
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Profile Error
            </h2>
            <p className="text-sm text-gray-600">
              Unable to load or update your profile
            </p>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            {error.message === 'Network Error' 
              ? 'Check your internet connection and try again.'
              : error.message || 'An unexpected error occurred while accessing your profile.'
            }
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="group mb-4">
              <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-gray-900">
                Technical Details
              </summary>
              <pre className="mt-2 p-3 bg-gray-50 rounded text-xs overflow-auto">
                {error.stack}
              </pre>
            </details>
          )}
        </div>

        <div className="flex space-x-3">
          <Button onClick={handleRetry} className="flex items-center space-x-2">
            <RefreshCw className="h-4 w-4" />
            <span>Retry</span>
          </Button>
          <Button 
            onClick={() => window.location.reload()}
            variant="outline"
          >
            Reload Page
          </Button>
        </div>
      </Card>
    </div>
  );
}

interface ProfileErrorBoundaryProps {
  children: React.ReactNode;
}

export function ProfileErrorBoundary({ children }: ProfileErrorBoundaryProps) {
  const handleError = (error: Error, errorInfo: React.ErrorInfo) => {
    console.error('Profile Error:', error);
    console.error('Error Info:', errorInfo);
  };

  return (
    <ErrorBoundary
      fallback={(error, errorInfo, resetError) => (
        <ProfileErrorFallback error={error} resetError={resetError} />
      )}
      onError={handleError}
    >
      {children}
    </ErrorBoundary>
  );
}