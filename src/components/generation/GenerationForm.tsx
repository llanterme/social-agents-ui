'use client';

import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { TopicInput } from './TopicInput';
import { PlatformSelector } from './PlatformSelector';
import { ToneSelector } from './ToneSelector';
import { ImageCountSelector } from './ImageCountSelector';
import { useGeneration } from '@/hooks/useGeneration';
import { generationSchema, GenerationFormData } from '@/lib/validations';
import { GenerationRequest, TaskStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface GenerationFormProps {
  className?: string;
  onSuccess?: (taskId: string) => void;
  onError?: (error: Error) => void;
}

export function GenerationForm({ 
  className,
  onSuccess,
  onError 
}: GenerationFormProps) {
  const router = useRouter();

  const form = useForm<GenerationFormData>({
    resolver: zodResolver(generationSchema),
    defaultValues: {
      topic: '',
      platform: undefined,
      tone: undefined,
      imageCount: 1,
    },
    mode: 'onChange', // Enable real-time validation
  });

  const {
    startGeneration,
    cancelGeneration,
    retryGeneration,
    clearGeneration,
    activeTaskId,
    currentStatus,
    result,
    error,
    isGenerating,
    isCompleted,
    isFailed,
    progress,
    isStartingGeneration,
  } = useGeneration({
    onSuccess: (taskId) => {
      onSuccess?.(taskId);
      // Redirect to task tracking page
      router.push(`/tasks/${taskId}`);
    },
    onError: (err) => {
      onError?.(err);
    },
    onStatusChange: (status: TaskStatus) => {
      console.log('Task status changed:', status);
    },
  });

  const onSubmit = async (data: GenerationFormData) => {
    try {
      // Clear any previous results
      clearGeneration();
      
      // Prepare the request data
      const request: GenerationRequest = {
        topic: data.topic.trim(),
        platform: data.platform,
        tone: data.tone,
        imageCount: data.imageCount || 1,
      };

      // Start generation
      startGeneration(request);
    } catch (err) {
      console.error('Form submission error:', err);
    }
  };

  const handleReset = () => {
    form.reset();
    clearGeneration();
  };

  const handleCancel = () => {
    cancelGeneration();
  };

  const handleRetry = () => {
    const formData = form.getValues();
    if (form.formState.isValid) {
      const request: GenerationRequest = {
        topic: formData.topic.trim(),
        platform: formData.platform,
        tone: formData.tone,
        imageCount: formData.imageCount || 1,
      };
      retryGeneration(request);
    }
  };

  // Auto-save form data to localStorage
  useEffect(() => {
    const subscription = form.watch((data) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('generationFormData', JSON.stringify(data));
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  // Load form data from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('generationFormData');
      if (savedData) {
        try {
          const parsedData = JSON.parse(savedData);
          form.reset(parsedData);
        } catch (error) {
          console.error('Failed to load saved form data:', error);
        }
      }
    }
  }, [form]);

  const isFormValid = form.formState.isValid;
  const canSubmit = isFormValid && !isGenerating && !isStartingGeneration;

  return (
    <Card className={cn("w-full max-w-4xl mx-auto p-6", className)}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Generate Content</h1>
          <p className="text-muted-foreground">
            Create AI-powered content for your chosen platform. Fill in the details below to get started.
          </p>
        </div>

        {/* Generation Status */}
        {(isGenerating || isCompleted || isFailed) && (
          <Card className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">
                {isGenerating && 'Generating Content...'}
                {isCompleted && 'Generation Complete!'}
                {isFailed && 'Generation Failed'}
              </h3>
              {activeTaskId && (
                <span className="text-xs font-mono text-muted-foreground">
                  Task: {activeTaskId}
                </span>
              )}
            </div>

            {/* Progress Bar */}
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

            {/* Success Message */}
            {isCompleted && (
              <div className="text-sm text-green-600">
                Your content has been generated successfully! You'll be redirected to view the results.
              </div>
            )}

            {/* Error Message */}
            {(isFailed || error) && (
              <div className="space-y-2">
                <div className="text-sm text-destructive">
                  {error?.message || currentStatus?.error || 'An error occurred during generation.'}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  disabled={!isFormValid}
                >
                  Retry Generation
                </Button>
              </div>
            )}

            {/* Cancel Button */}
            {isGenerating && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCancel}
              >
                Cancel Generation
              </Button>
            )}
          </Card>
        )}

        {/* Form Fields */}
        <div className="space-y-6">
          <TopicInput
            control={form.control}
            name="topic"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PlatformSelector
              control={form.control}
              name="platform"
            />

            <ToneSelector
              control={form.control}
              name="tone"
            />
          </div>

          <ImageCountSelector
            control={form.control}
            name="imageCount"
          />
        </div>

        {/* Form Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
          <Button
            type="submit"
            disabled={!canSubmit}
            className="flex-1 sm:flex-initial sm:min-w-[200px]"
          >
            {isStartingGeneration && (
              <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent" />
            )}
            {isStartingGeneration ? 'Starting Generation...' : 'Generate Content'}
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={handleReset}
            disabled={isGenerating || isStartingGeneration}
          >
            Reset Form
          </Button>
        </div>

        {/* Form Validation Summary */}
        {Object.keys(form.formState.errors).length > 0 && (
          <Card className="p-4 border-destructive">
            <h4 className="font-medium text-destructive mb-2">
              Please fix the following errors:
            </h4>
            <ul className="text-sm text-destructive space-y-1">
              {Object.entries(form.formState.errors).map(([field, error]) => (
                <li key={field}>• {error.message}</li>
              ))}
            </ul>
          </Card>
        )}
      </form>
    </Card>
  );
}