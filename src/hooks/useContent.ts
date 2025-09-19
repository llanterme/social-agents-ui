'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contentService, ContentItem } from '@/lib/content';

export function useContentList() {
  const {
    data: content,
    isLoading,
    error,
    refetch
  } = useQuery<ContentItem[]>({
    queryKey: ['content'],
    queryFn: () => contentService.getAllContent(),
    retry: false, // Don't retry on auth errors
  });

  return {
    content: content || [],
    isLoading,
    error: error?.message,
    refetch
  };
}

export function useContentById(id: number) {
  const {
    data: content,
    isLoading,
    error,
    refetch
  } = useQuery<ContentItem>({
    queryKey: ['content', id],
    queryFn: () => contentService.getContentById(id),
    retry: false,
    enabled: !!id,
  });

  return {
    content,
    isLoading,
    error: error?.message,
    refetch
  };
}

export function useDeleteContent() {
  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: (id: number) => contentService.deleteContent(id),
    onSuccess: (_, deletedId) => {
      // Remove the deleted item from the cache
      queryClient.setQueryData<ContentItem[]>(['content'], (oldData) => {
        return oldData?.filter(item => item.id !== deletedId) || [];
      });

      // Remove the specific content item from cache
      queryClient.removeQueries({ queryKey: ['content', deletedId] });

      // Invalidate the content list to ensure it's fresh
      queryClient.invalidateQueries({ queryKey: ['content'] });
    },
  });

  return {
    deleteContent: deleteMutation.mutate,
    deleteAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    deleteError: deleteMutation.error?.message,
    reset: deleteMutation.reset,
  };
}

export function useContentFilters() {
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'createdAt' | 'updatedAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const filterAndSortContent = (content: ContentItem[]) => {
    let filtered = [...content];

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        item.topic.toLowerCase().includes(searchLower) ||
        item.content.headline?.toLowerCase().includes(searchLower) ||
        item.content.body?.toLowerCase().includes(searchLower)
      );
    }

    // Apply platform filter
    if (platformFilter !== 'all') {
      filtered = filtered.filter(item => item.platform === platformFilter);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aValue = new Date(a[sortBy]).getTime();
      const bValue = new Date(b[sortBy]).getTime();

      if (sortOrder === 'desc') {
        return bValue - aValue;
      } else {
        return aValue - bValue;
      }
    });

    return filtered;
  };

  return {
    searchTerm,
    setSearchTerm,
    platformFilter,
    setPlatformFilter,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    filterAndSortContent,
  };
}