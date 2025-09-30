'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useContentList, useContentFilters, useDeleteContent } from '@/hooks/useContent';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Calendar,
  Eye,
  Trash2,
  Loader2,
  Plus,
  Clock,
  Hash,
  Image as ImageIcon
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { ContentItem } from '@/lib/content';

export default function ContentLibraryPage() {
  const router = useRouter();
  const { content, isLoading, error } = useContentList();
  const { deleteContent, isDeleting } = useDeleteContent();
  const {
    searchTerm,
    setSearchTerm,
    platformFilter,
    setPlatformFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filterAndSortContent,
  } = useContentFilters();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<ContentItem | null>(null);

  const filteredContent = filterAndSortContent(content);

  const handleDeleteClick = (item: ContentItem) => {
    setItemToDelete(item);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (itemToDelete) {
      try {
        await deleteContent(itemToDelete.id);
        setDeleteDialogOpen(false);
        setItemToDelete(null);
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

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'linkedin': return 'bg-blue-100 text-blue-800';
      case 'twitter': return 'bg-sky-100 text-sky-800';
      case 'instagram': return 'bg-pink-100 text-pink-800';
      case 'blog': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getToneColor = (tone: string) => {
    switch (tone.toLowerCase()) {
      case 'professional': return 'bg-blue-100 text-blue-800';
      case 'casual': return 'bg-green-100 text-green-800';
      case 'playful': return 'bg-purple-100 text-purple-800';
      case 'authoritative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-slate-100 via-gray-50 to-blue-50 text-gray-900 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                    Content Library
                  </h1>
                  <p className="text-lg text-gray-600 mt-2">
                    Manage all your AI-generated content
                  </p>
                </div>
                <Button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                  asChild
                >
                  <Link href="/generate">
                    <Plus className="h-4 w-4 mr-2" />
                    Generate New Content
                  </Link>
                </Button>
              </div>

              {/* Search and Filter Controls */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-end">
                  {/* Search */}
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search Content
                    </label>
                    <div className="relative">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="text"
                        placeholder="Search by topic, headline, or content..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Platform Filter */}
                  <div className="min-w-[180px]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Platform
                    </label>
                    <Select value={platformFilter} onValueChange={setPlatformFilter}>
                      <SelectTrigger>
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="All Platforms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Platforms</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="blog">Blog</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort By */}
                  <div className="min-w-[150px]">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sort By
                    </label>
                    <Select value={sortBy} onValueChange={(value: 'createdAt' | 'updatedAt') => setSortBy(value)}>
                      <SelectTrigger>
                        <Calendar className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="createdAt">Created Date</SelectItem>
                        <SelectItem value="updatedAt">Updated Date</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Sort Order */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Order
                    </label>
                    <Button
                      variant="outline"
                      onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                      className="flex items-center space-x-2"
                    >
                      {sortOrder === 'desc' ? (
                        <SortDesc className="h-4 w-4" />
                      ) : (
                        <SortAsc className="h-4 w-4" />
                      )}
                      <span>{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-blue-600" />
                  <p className="mt-2 text-gray-600">Loading your content...</p>
                </div>
              </div>
            ) : error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <p className="text-red-800">Error loading content: {error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  className="mt-4"
                  variant="outline"
                >
                  Retry
                </Button>
              </div>
            ) : filteredContent.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                {content.length === 0 ? (
                  <div>
                    <div className="text-6xl mb-4">📚</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Content Yet</h3>
                    <p className="text-gray-600 mb-6">
                      Start creating amazing AI-generated content for your social media platforms.
                    </p>
                    <Button
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                      asChild
                    >
                      <Link href="/generate">
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Content
                      </Link>
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No Results Found</h3>
                    <p className="text-gray-600 mb-4">
                      No content matches your current search and filter criteria.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm('');
                        setPlatformFilter('all');
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {/* Results Header */}
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">
                    Showing {filteredContent.length} of {content.length} items
                  </p>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredContent.map((item) => (
                    <Card key={item.id} className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 rounded-xl overflow-hidden">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-lg">{getPlatformIcon(item.platform)}</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPlatformColor(item.platform)}`}>
                                {item.platform}
                              </span>
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getToneColor(item.tone)}`}>
                                {item.tone}
                              </span>
                            </div>
                            <CardTitle className="text-lg font-bold text-gray-900 line-clamp-2">
                              {item.topic}
                            </CardTitle>
                            {item.content.headline && (
                              <CardDescription className="text-gray-600 line-clamp-2">
                                {item.content.headline}
                              </CardDescription>
                            )}
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        {/* Content Preview */}
                        {item.content.body && (
                          <p className="text-sm text-gray-700 line-clamp-3">
                            {item.content.body}
                          </p>
                        )}

                        {/* Meta Information */}
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          {item.image.localImageUrls.length > 0 && (
                            <div className="flex items-center space-x-1">
                              <ImageIcon className="h-3 w-3" />
                              <span>{item.image.localImageUrls.length}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                          </div>
                          {item.content.hashtags && item.content.hashtags.length > 0 && (
                            <div className="flex items-center space-x-1">
                              <Hash className="h-3 w-3" />
                              <span>{item.content.hashtags.length}</span>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/content/${item.id}`)}
                            className="flex-1"
                          >
                            <Eye className="h-3 w-3 mr-1" />
                            View
                          </Button>

                          <AlertDialog open={deleteDialogOpen && itemToDelete?.id === item.id} onOpenChange={setDeleteDialogOpen}>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteClick(item)}
                                className="text-red-600 hover:text-red-700 hover:border-red-300"
                                disabled={isDeleting}
                              >
                                {isDeleting && itemToDelete?.id === item.id ? (
                                  <Loader2 className="h-3 w-3 animate-spin" />
                                ) : (
                                  <Trash2 className="h-3 w-3" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Content</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{item.topic}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={handleDeleteConfirm}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}