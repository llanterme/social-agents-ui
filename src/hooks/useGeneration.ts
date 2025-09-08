'use client';

import { useState, useCallback } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { generationService } from '@/lib/generation';
import { GenerationRequest, TaskStatus, GenerationResult } from '@/lib/types';

interface UseGenerationOptions {
  onSuccess?: (taskId: string) => void;
  onError?: (error: Error) => void;
  onStatusChange?: (status: TaskStatus) => void;
}

export function useGeneration(options: UseGenerationOptions = {}) {
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const { onSuccess, onError, onStatusChange } = options;

  // Mutation for starting generation
  const generateMutation = useMutation({
    mutationFn: async (request: GenerationRequest) => {
      const response = await generationService.startGeneration(request);
      return response;
    },
    onSuccess: (data) => {
      setActiveTaskId(data.taskId);
      onSuccess?.(data.taskId);
    },
    onError: (error: Error) => {
      onError?.(error);
    },
  });

  // Query for task status (only runs when we have an active task)
  const taskStatusQuery = useQuery({
    queryKey: ['taskStatus', activeTaskId],
    queryFn: async () => {
      if (!activeTaskId) throw new Error('No active task');
      const status = await generationService.getTaskStatus(activeTaskId);
      onStatusChange?.(status);
      return status;
    },
    enabled: !!activeTaskId,
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
  });

  // Query for task result (only runs when task is completed)
  const taskResultQuery = useQuery({
    queryKey: ['taskResult', activeTaskId],
    queryFn: async () => {
      if (!activeTaskId) throw new Error('No active task');
      return generationService.getTaskResult(activeTaskId);
    },
    enabled: !!activeTaskId && taskStatusQuery.data?.status === 'COMPLETED',
    retry: 1,
  });

  // Start generation
  const startGeneration = useCallback((request: GenerationRequest) => {
    // Clear any previous task
    setActiveTaskId(null);
    
    // Start new generation
    return generateMutation.mutate(request);
  }, [generateMutation]);

  // Cancel current generation (clear task tracking)
  const cancelGeneration = useCallback(() => {
    setActiveTaskId(null);
  }, []);

  // Retry failed generation
  const retryGeneration = useCallback((request: GenerationRequest) => {
    setActiveTaskId(null);
    return generateMutation.mutate(request);
  }, [generateMutation]);

  // Clear completed generation
  const clearGeneration = useCallback(() => {
    setActiveTaskId(null);
  }, []);

  // Get current progress percentage
  const getProgress = useCallback(() => {
    if (!taskStatusQuery.data) return 0;
    return generationService.getTaskProgress(taskStatusQuery.data);
  }, [taskStatusQuery.data]);

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
  const error = generateMutation.error || 
                taskStatusQuery.error || 
                taskResultQuery.error ||
                (isFailed ? new Error(taskStatusQuery.data?.error || 'Generation failed') : null);

  return {
    // Actions
    startGeneration,
    cancelGeneration,
    retryGeneration,
    clearGeneration,

    // State
    activeTaskId,
    currentStatus,
    result,
    error,
    
    // Computed state
    isGenerating,
    isCompleted,
    isFailed,
    progress: getProgress(),

    // Loading states
    isStartingGeneration: generateMutation.isPending,
    isLoadingStatus: taskStatusQuery.isLoading,
    isLoadingResult: taskResultQuery.isLoading,

    // Raw query states (for advanced usage)
    generateMutation,
    taskStatusQuery,
    taskResultQuery,
  };
}