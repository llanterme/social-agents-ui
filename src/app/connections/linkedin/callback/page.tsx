'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2, Home, User } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function LinkedInCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Check URL parameters for success or error
    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    const state = searchParams.get('state');

    if (code) {
      // Success case - the backend should handle the actual callback
      // This page is just for user feedback
      setStatus('success');
      setMessage('Successfully connected your LinkedIn account!');

      // Redirect to profile after a short delay
      setTimeout(() => {
        router.push('/profile');
      }, 3000);
    } else if (error) {
      // Error case
      setStatus('error');
      setMessage(errorDescription || error || 'Failed to connect LinkedIn account');
    } else {
      // No parameters - likely a direct navigation
      setStatus('error');
      setMessage('Invalid callback. Please try connecting again.');
    }
  }, [searchParams, router]);

  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Card className="w-full max-w-md p-8">
            <div className="text-center space-y-6">
              {status === 'loading' && (
                <>
                  <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Processing LinkedIn Connection...
                  </h2>
                  <p className="text-gray-600">
                    Please wait while we complete the connection process.
                  </p>
                </>
              )}

              {status === 'success' && (
                <>
                  <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-10 w-10 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Connection Successful!
                  </h2>
                  <p className="text-gray-600">
                    {message}
                  </p>
                  <p className="text-sm text-gray-500">
                    Redirecting to your profile...
                  </p>
                  <div className="flex gap-3 justify-center pt-2">
                    <Button
                      onClick={() => router.push('/profile')}
                      className="flex items-center space-x-2"
                    >
                      <User className="h-4 w-4" />
                      <span>Go to Profile</span>
                    </Button>
                    <Button
                      onClick={() => router.push('/generate')}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <span>Generate Content</span>
                    </Button>
                  </div>
                </>
              )}

              {status === 'error' && (
                <>
                  <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <XCircle className="h-10 w-10 text-red-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Connection Failed
                  </h2>
                  <p className="text-gray-600">
                    {message}
                  </p>
                  <div className="flex gap-3 justify-center pt-2">
                    <Button
                      onClick={() => router.push('/profile')}
                      className="flex items-center space-x-2"
                    >
                      <User className="h-4 w-4" />
                      <span>Back to Profile</span>
                    </Button>
                    <Button
                      onClick={() => router.push('/dashboard')}
                      variant="outline"
                      className="flex items-center space-x-2"
                    >
                      <Home className="h-4 w-4" />
                      <span>Go to Dashboard</span>
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}