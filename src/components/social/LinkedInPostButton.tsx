'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Linkedin, Send, CheckCircle, AlertCircle, Loader2, ExternalLink } from 'lucide-react';
import { useLinkedInPost, useLinkedInConnection } from '@/hooks/useLinkedIn';
import { cn } from '@/lib/utils';

interface LinkedInPostButtonProps {
  content: string;
  imagePath?: string;
  onSuccess?: (postUrl: string) => void;
  onError?: (error: string) => void;
  className?: string;
}

export function LinkedInPostButton({
  content,
  imagePath,
  onSuccess,
  onError,
  className
}: LinkedInPostButtonProps) {
  const { connectionStatus, refetchStatus } = useLinkedInConnection();
  const { post, isPosting, postError, postData, reset } = useLinkedInPost();
  const [postUrl, setPostUrl] = useState<string | null>(null);

  const handlePost = async () => {
    // Reset previous state
    reset();
    setPostUrl(null);

    // Check connection status first
    const status = await refetchStatus();
    if (!status.data?.connected) {
      const errorMsg = 'LinkedIn is not connected. Please connect your account first.';
      onError?.(errorMsg);
      return;
    }

    try {
      post(
        { text: content, imagePath },
        {
          onSuccess: (data) => {
            setPostUrl(data.postUrl);
            onSuccess?.(data.postUrl);
          },
          onError: (error) => {
            const errorMsg = error.message || 'Failed to post to LinkedIn';
            onError?.(errorMsg);
          }
        }
      );
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'An unexpected error occurred';
      onError?.(errorMsg);
    }
  };

  // If not connected, show connect prompt
  if (!connectionStatus?.connected) {
    return (
      <Button
        variant="outline"
        className={cn("flex items-center space-x-2", className)}
        disabled
        title="Connect LinkedIn account to enable posting"
      >
        <Linkedin className="h-4 w-4" />
        <span>LinkedIn (Not Connected)</span>
      </Button>
    );
  }

  // If post was successful
  if (postData && postUrl) {
    return (
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className={cn(
            "flex items-center space-x-2 border-green-200 text-green-600",
            className
          )}
          disabled
        >
          <CheckCircle className="h-4 w-4" />
          <span>Posted to LinkedIn</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open(postUrl, '_blank')}
          className="flex items-center space-x-1"
        >
          <ExternalLink className="h-3 w-3" />
          <span>View</span>
        </Button>
      </div>
    );
  }

  // If there's an error
  if (postError) {
    return (
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          className={cn(
            "flex items-center space-x-2 border-red-200 text-red-600",
            className
          )}
          onClick={handlePost}
        >
          <AlertCircle className="h-4 w-4" />
          <span>Retry LinkedIn Post</span>
        </Button>
      </div>
    );
  }

  // Default state - ready to post
  return (
    <Button
      onClick={handlePost}
      disabled={isPosting || !content}
      className={cn(
        "flex items-center space-x-2 bg-[#0077B5] hover:bg-[#006097]",
        className
      )}
    >
      {isPosting ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Posting...</span>
        </>
      ) : (
        <>
          <Send className="h-4 w-4" />
          <span>Post to LinkedIn</span>
        </>
      )}
    </Button>
  );
}