import { GenerationRequest, GenerationResult, TaskStatus } from './types';
import { authService } from './auth';

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9001';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  async startGeneration(
    request: GenerationRequest
  ): Promise<{ taskId: string; statusUrl: string; resultUrl: string }> {
    const response = await authService.authenticatedRequest(
      '/api/v1/generate/async',
      {
        method: 'POST',
        body: JSON.stringify(request),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Failed to start generation');
    }

    return response.json();
  }

  async getTaskStatus(taskId: string): Promise<TaskStatus> {
    const response = await authService.authenticatedRequest(
      `/api/v1/generate/status/${taskId}`
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Failed to get task status');
    }

    return response.json();
  }

  async getTaskResult(taskId: string): Promise<GenerationResult> {
    const response = await authService.authenticatedRequest(
      `/api/v1/generate/result/${taskId}`
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.message || 'Failed to get task result');
    }

    return response.json();
  }

  async waitForCompletion(
    taskId: string,
    pollInterval = 2000,
    maxAttempts = 180 // 6 minutes max wait time
  ): Promise<GenerationResult> {
    return new Promise((resolve, reject) => {
      let attempts = 0;

      const poll = async () => {
        try {
          attempts++;

          if (attempts > maxAttempts) {
            reject(new Error('Task completion timeout'));
            return;
          }

          const status = await this.getTaskStatus(taskId);

          if (status.status === 'COMPLETED') {
            if (status.result) {
              resolve(status.result);
            } else {
              // If result is not in status response, fetch it separately
              const result = await this.getTaskResult(taskId);
              resolve(result);
            }
          } else if (status.status === 'FAILED') {
            reject(new Error(status.error || 'Task failed'));
          } else {
            // Task is still pending or in progress
            setTimeout(poll, pollInterval);
          }
        } catch (error) {
          reject(error);
        }
      };

      poll();
    });
  }

  async getHealthStatus(): Promise<{
    status: string;
    timestamp: number;
    activeTasks: number;
    totalTasks: number;
  }> {
    const response = await fetch(`${this.baseUrl}/api/v1/health`);

    if (!response.ok) {
      throw new Error('Failed to get health status');
    }

    return response.json();
  }
}

// Create singleton instance
export const apiClient = new ApiClient();
export default ApiClient;