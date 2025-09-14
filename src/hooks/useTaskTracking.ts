'use client';

import { useQuery } from '@tanstack/react-query';
import { generationService } from '@/lib/generation';
import { TaskStatus, GenerationResult } from '@/lib/types';

interface UseTaskTrackingOptions {
  taskId: string;
  onStatusChange?: (status: TaskStatus) => void;
}

export function useTaskTracking({ taskId, onStatusChange }: UseTaskTrackingOptions) {
  // Query for task status with polling
  const taskStatusQuery = useQuery({
    queryKey: ['taskStatus', taskId],
    queryFn: async () => {
      const status = await generationService.getTaskStatus(taskId);
      onStatusChange?.(status);
      return status;
    },
    enabled: !!taskId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      // Stop polling if task is completed or failed
      if (status === 'COMPLETED' || status === 'FAILED') {
        return false;
      }
      // Poll every 2 seconds for pending/in-progress tasks
      return 2000;
    },
    refetchIntervalInBackground: false,
    retry: (failureCount, error) => {
      // Stop retrying after 3 attempts
      return failureCount < 3;
    },
    staleTime: 0, // Always consider data stale so we refetch on focus
  });

  // Query for task result (only runs when task is completed)
  const taskResultQuery = useQuery({
    queryKey: ['taskResult', taskId],
    queryFn: async () => {
      return generationService.getTaskResult(taskId);
    },
    enabled: !!taskId && taskStatusQuery.data?.status === 'COMPLETED',
    retry: 1,
  });

  // Get current progress percentage
  const getProgress = () => {
    if (!taskStatusQuery.data) return 0;
    return generationService.getTaskProgress(taskStatusQuery.data);
  };

  // Check if generation is currently running
  const isGenerating = taskStatusQuery.data?.status === 'PENDING' || 
                      taskStatusQuery.data?.status === 'IN_PROGRESS';

  // Check if generation is completed
  const isCompleted = taskStatusQuery.data?.status === 'COMPLETED';

  // Check if generation failed
  const isFailed = taskStatusQuery.data?.status === 'FAILED';

  // Get current task status
  const currentStatus = taskStatusQuery.data;

  // Get generation result
  const result = taskResultQuery.data || taskStatusQuery.data?.result;

  // Get any errors
  const error = taskStatusQuery.error || 
                taskResultQuery.error ||
                (isFailed ? new Error(taskStatusQuery.data?.error || 'Generation failed') : null);

  return {
    // State
    currentStatus,
    result,
    error,
    
    // Computed state
    isGenerating,
    isCompleted,
    isFailed,
    progress: getProgress(),

    // Loading states
    isLoadingStatus: taskStatusQuery.isLoading,
    isLoadingResult: taskResultQuery.isLoading,
    
    // Refetch functions for manual refresh
    refetchStatus: taskStatusQuery.refetch,
    refetchResult: taskResultQuery.refetch,

    // Raw query states (for advanced usage)
    taskStatusQuery,
    taskResultQuery,
  };
}