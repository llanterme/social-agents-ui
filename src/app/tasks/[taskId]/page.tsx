'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useTaskTracking } from '@/hooks/useTaskTracking';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ArrowLeft, CheckCircle, XCircle, Clock } from 'lucide-react';
import Link from 'next/link';

export default function TaskPage() {
  const { user, isLoading, error } = useAuth();
  const params = useParams();
  const router = useRouter();
  const taskId = params?.taskId as string;

  const {
    currentStatus,
    result,
    error: generationError,
    isGenerating,
    isCompleted,
    isFailed,
    progress,
    isLoadingStatus,
  } = useTaskTracking({ taskId });

  // Redirect if no task ID
  useEffect(() => {
    if (!taskId) {
      router.push('/generate');
    }
  }, [taskId, router]);

  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p className="mt-2 text-muted-foreground">Loading task...</p>
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
              <p className="text-destructive">Error loading task: {error}</p>
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

  // Show loading state while task status is being loaded for the first time
  if (isLoadingStatus && !currentStatus) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p className="mt-2 text-muted-foreground">Loading task status...</p>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  const getStatusIcon = () => {
    if (isCompleted) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (isFailed) return <XCircle className="h-5 w-5 text-red-600" />;
    if (isGenerating) return <Loader2 className="h-5 w-5 animate-spin text-blue-600" />;
    return <Clock className="h-5 w-5 text-gray-600" />;
  };

  const getStatusText = () => {
    if (isCompleted) return 'Completed';
    if (isFailed) return 'Failed';
    if (currentStatus?.status === 'PENDING') return 'Pending';
    if (currentStatus?.status === 'IN_PROGRESS') return 'In Progress';
    return 'Unknown';
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          {/* Header with Back Button */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/generate">
                <Button variant="outline" size="sm" className="flex items-center space-x-2">
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Generator</span>
                </Button>
              </Link>
            </div>
            <div className="text-sm text-muted-foreground font-mono">
              Task ID: {taskId}
            </div>
          </div>

          {/* Task Status Card */}
          <Card className="max-w-4xl mx-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <CardTitle className="flex items-center space-x-2">
                    {getStatusIcon()}
                    <span>Content Generation Task</span>
                  </CardTitle>
                  <CardDescription>
                    Status: {getStatusText()}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Progress Bar for Running Tasks */}
              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {currentStatus?.status === 'PENDING' && 'Queued for processing...'}
                    {currentStatus?.status === 'IN_PROGRESS' && 'Creating content and images...'}
                  </div>
                </div>
              )}

              {/* Task Details */}
              {currentStatus && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Task Information</h4>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p><strong>Status:</strong> {currentStatus.status}</p>
                      <p><strong>Created:</strong> {new Date(currentStatus.createdAt).toLocaleString()}</p>
                      {currentStatus.completedAt && (
                        <p><strong>Completed:</strong> {new Date(currentStatus.completedAt).toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Error Display */}
              {(isFailed || generationError) && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
                  <h4 className="font-medium text-destructive mb-2">Generation Failed</h4>
                  <p className="text-sm text-destructive">
                    {generationError?.message || currentStatus?.error || 'An unknown error occurred'}
                  </p>
                </div>
              )}

              {/* Success Display */}
              {isCompleted && result && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-4">
                  <h4 className="font-medium text-green-800">Generation Completed Successfully!</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-sm">Topic:</h5>
                      <p className="text-sm text-muted-foreground">{result.topic}</p>
                    </div>
                    
                    {result.content && (
                      <div>
                        <h5 className="font-medium text-sm">Platform & Tone:</h5>
                        <p className="text-sm text-muted-foreground">
                          {result.content.platform} • {result.content.tone}
                        </p>
                      </div>
                    )}

                    {result.content && (
                      <div>
                        <h5 className="font-medium text-sm">Generated Content:</h5>
                        <div className="bg-background p-3 rounded border text-sm">
                          {result.content.headline && (
                            <p className="font-medium">{result.content.headline}</p>
                          )}
                          {result.content.body && (
                            <p className="mt-2">{result.content.body}</p>
                          )}
                          {result.content.cta && (
                            <p className="mt-2 text-sm font-medium text-primary">
                              {result.content.cta}
                            </p>
                          )}
                          {result.content.hashtags && result.content.hashtags.length > 0 && (
                            <p className="mt-2 text-blue-600">
                              {result.content.hashtags.join(' ')}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {result.image && result.image.localImageUrls && result.image.localImageUrls.length > 0 && (
                      <div>
                        <h5 className="font-medium text-sm">Generated Images:</h5>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                          {result.image.localImageUrls.map((url, index) => (
                            <img 
                              key={index} 
                              src={url} 
                              alt={`Generated image ${index + 1}`} 
                              className="rounded border max-h-48 object-cover"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4 border-t">
                {isCompleted && (
                  <Button asChild>
                    <Link href="/generate">Generate More Content</Link>
                  </Button>
                )}
                
                {isFailed && (
                  <Button asChild>
                    <Link href="/generate">Try Again</Link>
                  </Button>
                )}

                <Button variant="outline" asChild>
                  <Link href="/dashboard">Back to Dashboard</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Note about task tracking */}
          <div className="max-w-4xl mx-auto">
            <div className="text-xs text-muted-foreground text-center flex items-center justify-center space-x-2">
              <span>This page shows the status of your content generation task.</span>
              {isGenerating && (
                <>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span>Auto-refreshing every 2 seconds</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}