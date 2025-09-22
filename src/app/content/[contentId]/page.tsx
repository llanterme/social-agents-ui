'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useContentById, useDeleteContent } from '@/hooks/useContent';
import { Button } from '@/components/ui/button';
import { ImageModal } from '@/components/ui/image-modal';
import {
  Loader2,
  ArrowLeft,
  CheckCircle,
  Copy,
  Trash2,
  Library,
  Calendar
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Link from 'next/link';
import { LinkedInPostButton } from '@/components/social/LinkedInPostButton';
import { ResearchSection } from '@/components/content/ResearchSection';

export default function ContentDetailsPage() {
  const { user, isLoading, error } = useAuth();
  const params = useParams();
  const router = useRouter();
  const contentId = parseInt(params?.contentId as string);

  const { content, isLoading: isLoadingContent, error: contentError } = useContentById(contentId);
  const { deleteContent, isDeleting } = useDeleteContent();

  // Modal state
  const [selectedImage, setSelectedImage] = useState<{
    src: string;
    alt: string;
    title?: string;
  } | null>(null);

  // Copy and interaction state
  const [copiedContent, setCopiedContent] = useState(false);
  const [linkedInPostSuccess, setLinkedInPostSuccess] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Helper function to copy content
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedContent(true);
    setTimeout(() => setCopiedContent(false), 2000);
  };

  // Helper function to format content for copying
  const formatContentForCopy = () => {
    if (!content?.content) return '';

    let formattedContent = '';

    if (content.content.headline) {
      formattedContent += content.content.headline + '\n\n';
    }

    if (content.content.body) {
      formattedContent += content.content.body + '\n\n';
    }

    if (content.content.cta) {
      formattedContent += content.content.cta + '\n\n';
    }

    if (content.content.hashtags && content.content.hashtags.length > 0) {
      formattedContent += content.content.hashtags.join(' ');
    }

    return formattedContent.trim();
  };

  const handleDelete = async () => {
    if (content) {
      try {
        await deleteContent(content.id);
        setDeleteDialogOpen(false);
        router.push('/library');
      } catch (error) {
        console.error('Delete error:', error);
      }
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin': return '💼';
      case 'twitter': return '🐦';
      case 'instagram': return '📸';
      case 'blog': return '📝';
      default: return '📄';
    }
  };

  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p className="mt-2 text-muted-foreground">Loading...</p>
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
              <p className="text-destructive">Error: {error}</p>
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

  // Show loading state while content is being loaded
  if (isLoadingContent) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p className="mt-2 text-muted-foreground">Loading content...</p>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  // Show error state if content loading failed
  if (contentError || !content) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-destructive">
                {contentError || 'Content not found'}
              </p>
              <div className="flex gap-2 mt-4 justify-center">
                <Button variant="outline" asChild>
                  <Link href="/library">Back to Library</Link>
                </Button>
                <Button onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
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
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
              {/* Back Button */}
              <div className="mb-6">
                <Link href="/library">
                  <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-white hover:bg-gray-50 text-gray-700 border-gray-300">
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back to Library</span>
                  </Button>
                </Link>
              </div>

              {/* Hero Section */}
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getPlatformIcon(content.platform)}</span>
                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                      {content.topic}
                    </h1>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {content.platform}
                    </span>
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                      {content.tone}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Content ID</div>
                  <div className="text-sm font-mono bg-gray-100 px-3 py-1 rounded-lg text-gray-700">
                    #{content.id}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Container */}
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10 space-y-8">
            {/* Main Content Card */}
            <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="p-8 space-y-8">
                {/* Content Details */}
                <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-6">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-gray-600 to-slate-700 rounded-full flex items-center justify-center">
                      <Library className="h-5 w-5 text-white" />
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900">Content Information</h4>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Platform & Tone</div>
                      <div className="flex items-center space-x-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-sm font-medium">
                          {content.platform}
                        </span>
                        <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-lg text-sm font-medium">
                          {content.tone}
                        </span>
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Created</div>
                      <div className="font-medium text-gray-900">
                        {new Date(content.createdAt).toLocaleDateString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        {new Date(content.createdAt).toLocaleTimeString()}
                      </div>
                    </div>

                    <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Images Generated</div>
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-900">{content.image.localImageUrls.length}</span>
                        <span className="text-gray-600">image{content.image.localImageUrls.length !== 1 ? 's' : ''}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Research Insights */}
                {content.research && (
                  <ResearchSection research={content.research} />
                )}

                {/* Generated Content Display */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6 space-y-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-green-800">Generated Content</h4>
                      <p className="text-green-700">Your AI-generated content is ready to use</p>
                    </div>
                  </div>

                  {/* Generated Content */}
                  <div className="space-y-4">
                    <h5 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                      <span>📝</span>
                      <span>Content</span>
                    </h5>
                    <div className="bg-white border border-green-200 rounded-xl p-6 space-y-4">
                      {content.content.headline && (
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Headline</div>
                          <p className="text-xl font-bold text-gray-900">{content.content.headline}</p>
                        </div>
                      )}
                      {content.content.body && (
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Content</div>
                          <p className="text-gray-800 leading-relaxed">{content.content.body}</p>
                        </div>
                      )}
                      {content.content.cta && (
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Call to Action</div>
                          <p className="text-blue-700 font-medium">{content.content.cta}</p>
                        </div>
                      )}
                      {content.content.hashtags && content.content.hashtags.length > 0 && (
                        <div>
                          <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">Hashtags</div>
                          <div className="flex flex-wrap gap-2">
                            {content.content.hashtags.map((hashtag, index) => (
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
                          onClick={() => copyToClipboard(formatContentForCopy())}
                          variant="outline"
                          className="flex items-center space-x-2"
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
                        {content.platform === 'linkedin' && (
                          <LinkedInPostButton
                            contentId={content.id}
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
                </div>

                {/* Generated Images */}
                {content.image.localImageUrls.length > 0 && (
                  <div className="space-y-4">
                    <h5 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                      <span>🖼️</span>
                      <span>Generated Images</span>
                    </h5>
                    <div className="bg-white border border-green-200 rounded-xl p-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {content.image.localImageUrls.map((url, index) => (
                          <div key={index} className="relative group">
                            <button
                              onClick={() => setSelectedImage({
                                src: url,
                                alt: `Generated image ${index + 1}`,
                                title: `Generated Image ${index + 1} - ${content.topic}`
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

                {/* Action Buttons */}
                <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 border-t border-gray-100 space-y-4">
                  <h5 className="text-lg font-semibold text-gray-900 mb-4">Actions</h5>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300" asChild>
                      <Link href="/generate">✨ Generate More Content</Link>
                    </Button>

                    <Button variant="outline" className="px-6 py-3 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50 transition-all duration-300" asChild>
                      <Link href="/library">📚 Back to Library</Link>
                    </Button>

                    <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="px-6 py-3 rounded-xl border-red-300 text-red-600 hover:bg-red-50 transition-all duration-300"
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : (
                            <Trash2 className="h-4 w-4 mr-2" />
                          )}
                          Delete Content
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Content</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{content.topic}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDelete}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
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