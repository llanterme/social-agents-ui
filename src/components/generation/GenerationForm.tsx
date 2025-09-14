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
    <div className={cn("w-full", className)}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
        {/* Enhanced Header */}
        <div className="text-center space-y-3 pb-2 border-b border-gray-100">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4">
            <span className="text-2xl">✨</span>
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Let&apos;s Create Something Amazing
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tell us your topic and preferences, and we&apos;ll craft engaging, platform-optimized content with stunning visuals
          </p>
        </div>

        {/* Enhanced Generation Status */}
        {(isGenerating || isCompleted || isFailed) && (
          <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {isGenerating && (
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                {isCompleted && (
                  <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-teal-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">✓</span>
                  </div>
                )}
                {isFailed && (
                  <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-lg">✗</span>
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900">
                  {isGenerating && 'Creating Your Content...'}
                  {isCompleted && 'Content Ready!'}
                  {isFailed && 'Something Went Wrong'}
                </h3>
              </div>
              {activeTaskId && (
                <span className="text-xs font-mono bg-white/50 px-2 py-1 rounded-lg text-gray-600">
                  ID: {activeTaskId.slice(-8)}
                </span>
              )}
            </div>

            {/* Enhanced Progress Bar */}
            {isGenerating && (
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
            )}

            {/* Enhanced Success Message */}
            {isCompleted && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center space-x-2 text-green-800">
                  <span className="text-lg">🎉</span>
                  <span className="font-medium">Your content has been generated successfully!</span>
                </div>
                <p className="text-green-700 text-sm mt-1 ml-7">You&apos;ll be redirected to view the results shortly.</p>
              </div>
            )}

            {/* Enhanced Error Message */}
            {(isFailed || error) && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-3">
                <div className="flex items-start space-x-2 text-red-800">
                  <span className="text-lg">⚠️</span>
                  <div>
                    <p className="font-medium">Generation failed</p>
                    <p className="text-sm text-red-700 mt-1">
                      {error?.message || currentStatus?.error || 'An error occurred during generation.'}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRetry}
                  disabled={!isFormValid}
                  className="border-red-300 text-red-700 hover:bg-red-50"
                >
                  Try Again
                </Button>
              </div>
            )}

            {/* Enhanced Cancel Button */}
            {isGenerating && (
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCancel}
                  className="bg-white/50 hover:bg-white/80"
                >
                  Cancel Generation
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Enhanced Form Fields */}
        <div className="space-y-8">
          <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-8 space-y-8">
            <TopicInput
              control={form.control}
              name="topic"
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
        </div>

        {/* Enhanced Form Actions */}
        <div className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              type="submit"
              disabled={!canSubmit}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed sm:min-w-[250px]"
            >
              {isStartingGeneration && (
                <div className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              )}
              {isStartingGeneration ? 'Starting Generation...' : '✨ Generate Content'}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={isGenerating || isStartingGeneration}
              className="px-6 py-3 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
            >
              Reset Form
            </Button>
          </div>
        </div>

        {/* Enhanced Form Validation Summary */}
        {Object.keys(form.formState.errors).length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-red-600 text-lg">⚠️</span>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold text-red-800">
                  Please fix the following errors:
                </h4>
                <ul className="text-sm text-red-700 space-y-1">
                  {Object.entries(form.formState.errors).map(([field, error]) => (
                    <li key={field} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                      <span>{error.message}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}