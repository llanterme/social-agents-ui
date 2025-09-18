'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, User, Home } from 'lucide-react';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function ConnectionSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const provider = searchParams.get('provider');

  useEffect(() => {
    // Auto-redirect to profile after 3 seconds
    const timer = setTimeout(() => {
      router.push('/profile');
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

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

  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Card className="w-full max-w-md p-8">
            <div className="text-center space-y-6">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>

              <h2 className="text-xl font-semibold text-gray-900">
                Connection Successful!
              </h2>

              <p className="text-gray-600">
                Your {getProviderName(provider)} account has been successfully connected.
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
            </div>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}