'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { GenerationForm } from '@/components/generation/GenerationForm';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function GeneratePage() {
  const { user, isLoading, error } = useAuth();
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);

  // Handle client-side hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get pre-selected platform from URL params
  const preSelectedPlatform = searchParams?.get('platform') as 'twitter' | 'linkedin' | 'instagram' | 'blog' | null;

  const handleGenerationSuccess = (taskId: string) => {
    toast.success('Content generation started successfully!', {
      description: `Task ID: ${taskId}. You'll be redirected to track progress.`,
    });
  };

  const handleGenerationError = (error: Error) => {
    toast.error('Failed to start content generation', {
      description: error.message,
    });
  };

  // Show loading state while authentication is being checked
  if (isLoading || !isClient) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p className="mt-2 text-muted-foreground">Loading content generator...</p>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  // Show error state if there's an authentication error
  if (error) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-destructive">Error loading generator: {error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4"
                variant="outline"
              >
                Retry
              </Button>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  // Show loading state if user data is still being fetched
  if (!user) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p className="mt-2 text-muted-foreground">Loading user data...</p>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          {/* Header with Back Button */}
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="outline" size="sm" className="flex items-center space-x-2">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
            </Link>
          </div>

          {/* Pre-selected Platform Notice */}
          {preSelectedPlatform && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Platform pre-selected:</strong> {preSelectedPlatform.charAt(0).toUpperCase() + preSelectedPlatform.slice(1)}
                {' '}(you can change this below)
              </p>
            </div>
          )}

          {/* Generation Form */}
          <GenerationForm
            onSuccess={handleGenerationSuccess}
            onError={handleGenerationError}
          />

          {/* Help Section */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-muted/50 rounded-lg p-6 space-y-4">
              <h3 className="font-semibold">Tips for Better Content Generation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Topic Ideas:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Industry trends and insights</li>
                    <li>How-to guides and tutorials</li>
                    <li>Personal experiences and stories</li>
                    <li>Product announcements</li>
                  </ul>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">Platform Guidelines:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li><strong>Twitter:</strong> Short, engaging posts with hashtags</li>
                    <li><strong>LinkedIn:</strong> Professional insights and articles</li>
                    <li><strong>Instagram:</strong> Visual content with captions</li>
                    <li><strong>Blog:</strong> Long-form detailed articles</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}