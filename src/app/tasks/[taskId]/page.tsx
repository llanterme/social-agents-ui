'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useTaskTracking } from '@/hooks/useTaskTracking';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ImageModal } from '@/components/ui/image-modal';
import { Loader2, ArrowLeft, CheckCircle, XCircle, Clock, Copy } from 'lucide-react';
import Link from 'next/link';
import { LinkedInPostButton } from '@/components/social/LinkedInPostButton';

export default function TaskPage() {
  const { user, isLoading, error } = useAuth();
  const params = useParams();
  const router = useRouter();
  const taskId = params?.taskId as string;

  // Modal state
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    alt: string;
    title?: string;
  } | null>(null);

  // Copy state
  const [copiedContent, setCopiedContent] = useState(false);
  const [linkedInPostSuccess, setLinkedInPostSuccess] = useState<string | null>(null);

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

  // Helper function to copy content
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedContent(true);
    setTimeout(() => setCopiedContent(false), 2000);
  };

  // Helper function to format content for LinkedIn
  const formatContentForLinkedIn = () => {
    if (!result?.content) return '';

    let formattedContent = '';

    if (result.content.headline) {
      formattedContent += result.content.headline + '\n\n';
    }

    if (result.content.body) {
      formattedContent += result.content.body + '\n\n';
    }

    if (result.content.cta) {
      formattedContent += result.content.cta + '\n\n';
    }

    if (result.content.hashtags && result.content.hashtags.length > 0) {
      formattedContent += result.content.hashtags.join(' ');
    }

    return formattedContent.trim();
  };

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
          {/* Enhanced Header Section */}
          <div className="bg-gradient-to-r from-slate-100 via-gray-50 to-blue-50 text-gray-900 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
              {/* Back Button */}
              <div className="mb-6">
                <Link href="/generate">
                  <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 border-gray-300">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Generator</span>
                  </Button>
                </Link>
              </div>

              {/* Hero Section */}
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon()}
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                      Content Generation Task
                    </h1>
                  </div>
                  <p className="text-lg text-gray-600">
                    Status: <span className="font-semibold">{getStatusText()}</span>
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Task ID</div>
                  <div className="text-sm font-mono bg-gray-100 px-3 py-1 rounded-lg text-gray-700">
                    {taskId.slice(-12)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Container */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10 space-y-8">
            {/* Main Status Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-8 space-y-8">
                {/* Enhanced Progress Section */}
                {isGenerating && (
                  <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <Loader2 className="h-5 w-5 text-white animate-spin" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">Creating Your Content...</h3>
                          <p className="text-sm text-gray-600">AI is working on your request</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {progress}%
                        </div>
                        <div className="text-xs text-gray-500">Complete</div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-xl p-4 space-y-3">
                      <div className="flex justify-between text-sm font-medium">
                        <span className="text-gray-700">Generation Progress</span>
                        <span className="text-blue-600">{progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div 
                          className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 ease-out" 
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                        <span>
                          {currentStatus?.status === 'PENDING' && 'Queued for processing...'}
                          {currentStatus?.status === 'IN_PROGRESS' && 'Creating content and images...'}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Enhanced Task Details */}
                {currentStatus && (
                  <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-slate-700 rounded-full flex items-center justify-center">
                        <span className="text-white text-lg">📋</span>
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900">Task Information</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Current Status</div>
                        <div className="flex items-center space-x-2">
                          {getStatusIcon()}
                          <span className="font-semibold text-gray-900">{currentStatus.status}</span>
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                        <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Created</div>
                        <div className="font-medium text-gray-900">
                          {new Date(currentStatus.createdAt).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          {new Date(currentStatus.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                      
                      {currentStatus.completedAt && (
                        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                          <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Completed</div>
                          <div className="font-medium text-gray-900">
                            {new Date(currentStatus.completedAt).toLocaleDateString()}
                          </div>
                          <div className="text-sm text-gray-600">
                            {new Date(currentStatus.completedAt).toLocaleTimeString()}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Enhanced Error Display */}
                {(isFailed || generationError) && (
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-2xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                        <XCircle className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <h4 className="text-lg font-semibold text-red-800">Generation Failed</h4>
                        <p className="text-sm text-red-600">Something went wrong during content creation</p>
                      </div>
                    </div>
                    <div className="bg-white border border-red-200 rounded-xl p-4">
                      <p className="text-sm text-red-700">
                        {generationError?.message || currentStatus?.error || 'An unknown error occurred'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Enhanced Success Display */}
                {isCompleted && result && (
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 space-y-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-green-800">Content Ready! 🎉</h4>
                        <p className="text-green-700">Your AI-generated content is complete and ready to use</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Topic Card */}
                      <div className="bg-white rounded-xl p-5 border border-green-200 shadow-sm">
                        <div className="text-xs text-green-600 uppercase tracking-wider mb-2 font-semibold">Topic</div>
                        <p className="text-gray-900 font-medium">{result.topic}</p>
                      </div>
                      
                      {/* Platform & Tone Card */}
                      {result.content && (
                        <div className="bg-white rounded-xl p-5 border border-green-200 shadow-sm">
                          <div className="text-xs text-green-600 uppercase tracking-wider mb-2 font-semibold">Platform & Tone</div>
                          <div className="flex items-center space-x-2">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-sm font-medium">
                              {result.content.platform}
                            </span>
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-lg text-sm font-medium">
                              {result.content.tone}
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {/* Images Count Card */}
                      {result.image && result.image.localImageUrls && (
                        <div className="bg-white rounded-xl p-5 border border-green-200 shadow-sm">
                          <div className="text-xs text-green-600 uppercase tracking-wider mb-2 font-semibold">Generated Images</div>
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold text-gray-900">{result.image.localImageUrls.length}</span>
                            <span className="text-gray-600">image{result.image.localImageUrls.length !== 1 ? 's' : ''}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Generated Content */}
                    {result.content && (
                      <div className="space-y-4">
                        <h5 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                          <span>📝</span>
                          <span>Generated Content</span>
                        </h5>
                        <div className="bg-white border border-green-200 rounded-xl p-6 space-y-4">
                          {result.content.headline && (
                            <div>
                              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Headline</div>
                              <p className="text-xl font-bold text-gray-900">{result.content.headline}</p>
                            </div>
                          )}
                          {result.content.body && (
                            <div>
                              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Content</div>
                              <p className="text-gray-800 leading-relaxed">{result.content.body}</p>
                            </div>
                          )}
                          {result.content.cta && (
                            <div>
                              <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Call to Action</div>
                              <p className="text-blue-700 font-medium">{result.content.cta}</p>
                            </div>
                          )}
                          {result.content.hashtags && result.content.hashtags.length > 0 && (
                            <div>
                              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Hashtags</div>
                              <div className="flex flex-wrap gap-2">
                                {result.content.hashtags.map((hashtag, index) => (
                                  <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                                    {hashtag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Social Sharing Actions */}
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <h6 className="text-sm font-semibold text-gray-900">Share Your Content</h6>
                            {linkedInPostSuccess && (
                              <span className="text-xs text-green-600 flex items-center space-x-1">
                                <CheckCircle className="h-3 w-3" />
                                <span>Posted to LinkedIn!</span>
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-3">
                            {/* Copy Content Button */}
                            <Button
                              onClick={() => copyToClipboard(formatContentForLinkedIn())}
                              variant="outline"
                              className="flex items-center space-x-2"
                              disabled={!result.content}
                            >
                              {copiedContent ? (
                                <>
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                  <span>Copied!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-4 w-4" />
                                  <span>Copy Content</span>
                                </>
                              )}
                            </Button>

                            {/* LinkedIn Post Button */}
                            {result.content.platform === 'linkedin' && (
                              <LinkedInPostButton
                                content={formatContentForLinkedIn()}
                                imagePath={result.image?.localImageUrls?.[0]}
                                onSuccess={(postUrl) => {
                                  setLinkedInPostSuccess(postUrl);
                                }}
                                onError={(error) => {
                                  console.error('LinkedIn posting error:', error);
                                }}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Generated Images */}
                    {result.image && result.image.localImageUrls && result.image.localImageUrls.length > 0 && (
                      <div className="space-y-4">
                        <h5 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                          <span>🖼️</span>
                          <span>Generated Images</span>
                        </h5>
                        <div className="bg-white border border-green-200 rounded-xl p-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {result.image.localImageUrls.map((url, index) => (
                              <div key={index} className="relative group">
                                <button
                                  onClick={() => setSelectedImage({
                                    src: url,
                                    alt: `Generated image ${index + 1}`,
                                    title: `Generated Image ${index + 1} - ${result.topic}`
                                  })}
                                  className="w-full focus:outline-none focus:ring-4 focus:ring-blue-200 focus:ring-opacity-50 rounded-xl"
                                >
                                  <img 
                                    src={url} 
                                    alt={`Generated image ${index + 1}`} 
                                    className="w-full h-48 object-cover rounded-xl border border-gray-200 shadow-sm group-hover:shadow-lg group-hover:scale-[1.02] transition-all duration-200 cursor-pointer"
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 rounded-xl flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 backdrop-blur-sm rounded-full p-2">
                                      <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                                      </svg>
                                    </div>
                                  </div>
                                </button>
                                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-medium text-gray-700">
                                  {index + 1}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Enhanced Action Buttons */}
                <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 border-t border-gray-100 space-y-4">
                  <h5 className="text-lg font-semibold text-gray-900 mb-4">What's Next?</h5>
                  <div className="flex flex-col sm:flex-row gap-4">
                    {isCompleted && (
                      <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                        <Link href="/generate">✨ Generate More Content</Link>
                      </Button>
                    )}
                    
                    {isFailed && (
                      <Button className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                        <Link href="/generate">🔄 Try Again</Link>
                      </Button>
                    )}

                    <Button variant="outline" className="px-6 py-3 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300" asChild>
                      <Link href="/dashboard">🏠 Back to Dashboard</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Enhanced Status Indicator */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="text-center space-y-3">
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                  <span className="text-sm">Real-time task monitoring</span>
                </div>
                <p className="text-sm text-gray-500">
                  This page automatically tracks your content generation progress
                </p>
                {isGenerating && (
                  <div className="flex items-center justify-center space-x-2 text-blue-600 bg-blue-50 rounded-lg py-2 px-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">Auto-refreshing every 2 seconds</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Image Modal */}
        <ImageModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          src={selectedImage?.src || ''}
          alt={selectedImage?.alt || ''}
          title={selectedImage?.title}
        />
      </Layout>
    </ProtectedRoute>
  );
}