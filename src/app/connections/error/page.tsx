'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, User, RefreshCw } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function ConnectionErrorPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const provider = searchParams.get('provider');
  const error = searchParams.get('error');

  const getProviderName = (provider: string | null) => {
    switch (provider) {
      case 'linkedin':
        return 'LinkedIn';
      case 'twitter':
        return 'Twitter';
      case 'instagram':
        return 'Instagram';
      default:
        return 'Social Media';
    }
  };

  const getErrorMessage = (error: string | null) => {
    if (error?.includes('expired')) {
      return 'Your session expired. Please try connecting again.';
    }
    if (error?.includes('cancelled') || error?.includes('denied')) {
      return 'Connection was cancelled. You can try again when ready.';
    }
    if (error?.includes('permission')) {
      return 'Required permissions were not granted. Please try again and allow all requested permissions.';
    }
    return error || 'An unexpected error occurred while connecting your account.';
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Card className="w-full max-w-md p-8">
            <div className="text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>

              <h2 className="text-xl font-semibold text-gray-900">
                Connection Failed
              </h2>

              <p className="text-gray-600">
                Failed to connect your {getProviderName(provider)} account.
              </p>

              <p className="text-sm text-gray-500">
                {getErrorMessage(error)}
              </p>

              <div className="flex gap-3 justify-center pt-2">
                <Button
                  onClick={() => router.push('/profile')}
                  className="flex items-center space-x-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Try Again</span>
                </Button>
                <Button
                  onClick={() => router.push('/profile')}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <User className="h-4 w-4" />
                  <span>Back to Profile</span>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}