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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
          {/* Enhanced Header Section */}
          <div className="bg-gradient-to-r from-slate-100 via-gray-50 to-blue-50 text-gray-900 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
              {/* Back Button */}
              <div className="mb-8">
                <Link href="/dashboard">
                  <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 border-gray-300">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Dashboard</span>
                  </Button>
                </Link>
              </div>

              {/* Hero Section */}
              <div className="text-center space-y-4">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
                  Generate Content
                  <span className="block text-2xl md:text-3xl font-normal mt-2 text-gray-600">
                    AI-Powered Content Creation
                  </span>
                </h1>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Create engaging, platform-optimized content with AI assistance. 
                  From social media posts to blog articles, we&apos;ve got you covered.
                </p>
              </div>
            </div>
          </div>

          {/* Content Container */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10 space-y-8">
            {/* Pre-selected Platform Notice */}
            {preSelectedPlatform && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 shadow-sm">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                  </div>
                  <p className="text-blue-800 font-medium">
                    Platform pre-selected: <span className="font-bold">{preSelectedPlatform.charAt(0).toUpperCase() + preSelectedPlatform.slice(1)}</span>
                    <span className="text-blue-600 font-normal ml-2">(you can change this below)</span>
                  </p>
                </div>
              </div>
            )}

            {/* Main Form Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-8">
                <GenerationForm
                  onSuccess={handleGenerationSuccess}
                  onError={handleGenerationError}
                />
              </div>
            </div>

            {/* Enhanced Help Section */}
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-3xl p-8 shadow-lg border border-gray-100">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">💡 Pro Tips for Amazing Content</h3>
                <p className="text-gray-600">Maximize your content&apos;s impact with these expert recommendations</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">💭</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Topic Ideas</h4>
                  </div>
                  <div className="space-y-3 ml-13">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Industry trends and insights</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">How-to guides and tutorials</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Personal experiences and stories</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">Product announcements</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-lg">🎯</span>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Platform Guidelines</h4>
                  </div>
                  <div className="space-y-4 ml-13">
                    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-blue-600">Twitter</span>
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <span className="text-sm text-gray-600">Short & punchy</span>
                      </div>
                      <p className="text-sm text-gray-700">Engaging posts with hashtags</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-blue-600">LinkedIn</span>
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <span className="text-sm text-gray-600">Professional</span>
                      </div>
                      <p className="text-sm text-gray-700">Insights and thought leadership</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-pink-600">Instagram</span>
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <span className="text-sm text-gray-600">Visual-first</span>
                      </div>
                      <p className="text-sm text-gray-700">Engaging captions for visuals</p>
                    </div>
                    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-semibold text-gray-800">Blog</span>
                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                        <span className="text-sm text-gray-600">In-depth</span>
                      </div>
                      <p className="text-sm text-gray-700">Detailed articles and guides</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}