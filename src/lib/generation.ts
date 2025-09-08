import {
  GenerationRequest,
  GenerationResult,
  TaskStatus,
  ApiError,
} from './types';
import { authService } from './auth';
import { formatError } from './utils';

interface TaskCreationResponse {
  taskId: string;
  status: 'PENDING';
  statusUrl: string;
  resultUrl: string;
}

class GenerationService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
  }

  async startGeneration(request: GenerationRequest): Promise<TaskCreationResponse> {
    try {
      const response = await authService.authenticatedRequest('/api/v1/generate/async', {
        method: 'POST',
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok) {
        const error: ApiError = data;
        throw new Error(error.message || 'Content generation failed');
      }

      return data;
    } catch (error) {
      throw new Error(formatError(error));
    }
  }

  async getTaskStatus(taskId: string): Promise<TaskStatus> {
    try {
      const response = await authService.authenticatedRequest(`/api/v1/generate/status/${taskId}`);
      
      const data = await response.json();

      if (!response.ok) {
        const error: ApiError = data;
        throw new Error(error.message || 'Failed to get task status');
      }

      return data;
    } catch (error) {
      throw new Error(formatError(error));
    }
  }

  async getTaskResult(taskId: string): Promise<GenerationResult> {
    try {
      const response = await authService.authenticatedRequest(`/api/v1/generate/result/${taskId}`);
      
      const data = await response.json();

      if (!response.ok) {
        const error: ApiError = data;
        throw new Error(error.message || 'Failed to get task result');
      }

      return data;
    } catch (error) {
      throw new Error(formatError(error));
    }
  }

  /**
   * Utility method to poll task until completion with timeout and configurable intervals
   */
  async waitForCompletion(
    taskId: string, 
    options: {
      pollInterval?: number;
      timeout?: number;
      onStatusChange?: (status: TaskStatus) => void;
    } = {}
  ): Promise<GenerationResult> {
    const { 
      pollInterval = 2000, 
      timeout = 300000, // 5 minutes
      onStatusChange 
    } = options;

    const startTime = Date.now();

    return new Promise((resolve, reject) => {
      const poll = async () => {
        try {
          // Check for timeout
          if (Date.now() - startTime > timeout) {
            reject(new Error('Task timeout - generation took too long'));
            return;
          }

          const status = await this.getTaskStatus(taskId);
          
          // Notify of status change if callback provided
          if (onStatusChange) {
            onStatusChange(status);
          }
          
          if (status.status === 'COMPLETED') {
            if (status.result) {
              resolve(status.result);
            } else {
              // Fallback: fetch result separately
              const result = await this.getTaskResult(taskId);
              resolve(result);
            }
          } else if (status.status === 'FAILED') {
            reject(new Error(status.error || 'Content generation failed'));
          } else {
            // Continue polling for PENDING or IN_PROGRESS
            setTimeout(poll, pollInterval);
          }
        } catch (error) {
          reject(error);
        }
      };
      
      poll();
    });
  }

  /**
   * Start generation and return task ID for tracking
   */
  async initiateGeneration(request: GenerationRequest): Promise<string> {
    const response = await this.startGeneration(request);
    return response.taskId;
  }

  /**
   * Check if a task is still running
   */
  async isTaskRunning(taskId: string): Promise<boolean> {
    try {
      const status = await this.getTaskStatus(taskId);
      return status.status === 'PENDING' || status.status === 'IN_PROGRESS';
    } catch (error) {
      return false;
    }
  }

  /**
   * Get task progress as a percentage (estimated based on status)
   */
  getTaskProgress(status: TaskStatus): number {
    switch (status.status) {
      case 'PENDING':
        return 10;
      case 'IN_PROGRESS':
        // Estimate progress based on time elapsed
        const createdAt = new Date(status.createdAt).getTime();
        const now = Date.now();
        const elapsed = now - createdAt;
        // Assume average generation takes 2 minutes, cap at 90%
        const estimatedProgress = Math.min(10 + (elapsed / 120000) * 80, 90);
        return Math.round(estimatedProgress);
      case 'COMPLETED':
        return 100;
      case 'FAILED':
        return 0;
      default:
        return 0;
    }
  }
}

// Create a singleton instance
export const generationService = new GenerationService();
export default GenerationService;