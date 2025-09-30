'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Linkedin, Link2, Unlink, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLinkedInConnection } from '@/hooks/useLinkedIn';

export function LinkedInConnection() {
  const [isMounted, setIsMounted] = useState(false);
  const {
    connectionStatus,
    isChecking,
    connect,
    disconnect,
    isConnecting,
    isDisconnecting,
    error
  } = useLinkedInConnection();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only render on client side
  if (!isMounted) {
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Linkedin className="h-5 w-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">LinkedIn Connection</h2>
        </div>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      </Card>
    );
  }

  const handleConnect = async () => {
    await connect();
  };

  const handleDisconnect = async () => {
    if (window.confirm('Are you sure you want to disconnect your LinkedIn account?')) {
      await disconnect();
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Linkedin className="h-5 w-5 text-blue-600" />
        <h2 className="text-lg font-semibold text-gray-900">LinkedIn Connection</h2>
      </div>

      {isChecking ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : (
        <div className="space-y-4">
          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-md">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div>
            <Label>Connection Status</Label>
            <div className="mt-2">
              <div className={cn(
                "inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium",
                connectionStatus?.connected
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              )}>
                <div className={cn(
                  "w-2 h-2 rounded-full mr-2",
                  connectionStatus?.connected ? "bg-green-500" : "bg-gray-400"
                )} />
                {connectionStatus?.connected ? 'Connected' : 'Not Connected'}
              </div>
            </div>
          </div>

          {connectionStatus?.connected && connectionStatus.connectionDetails && (
            <>
              <div>
                <Label>LinkedIn Profile ID</Label>
                <div className="px-3 py-2 border rounded-md bg-gray-50 font-mono text-sm mt-1">
                  {connectionStatus.connectionDetails.providerUserId || 'N/A'}
                </div>
              </div>

              {connectionStatus.connectionDetails.connectedAt && (
                <div>
                  <Label>Connected Since</Label>
                  <div className="px-3 py-2 border rounded-md bg-gray-50 text-sm mt-1">
                    {formatDate(connectionStatus.connectionDetails.connectedAt)}
                  </div>
                </div>
              )}

              {connectionStatus.connectionDetails.expiresAt && (
                <div>
                  <Label>Token Expires</Label>
                  <div className="px-3 py-2 border rounded-md bg-gray-50 text-sm mt-1">
                    {formatDate(connectionStatus.connectionDetails.expiresAt)}
                    {new Date(connectionStatus.connectionDetails.expiresAt) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
                      <span className="ml-2 text-amber-600 text-xs font-medium">
                        (Expires soon - reconnect recommended)
                      </span>
                    )}
                  </div>
                </div>
              )}

              <div>
                <Label>Permissions</Label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {connectionStatus.connectionDetails.scopes?.map((scope, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {scope}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="pt-4">
            {connectionStatus?.connected ? (
              <Button
                onClick={handleDisconnect}
                disabled={isDisconnecting}
                variant="outline"
                className="w-full flex items-center justify-center space-x-2 border-red-200 text-red-600 hover:bg-red-50"
              >
                {isDisconnecting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Unlink className="h-4 w-4" />
                )}
                <span>{isDisconnecting ? 'Disconnecting...' : 'Disconnect LinkedIn'}</span>
              </Button>
            ) : (
              <Button
                onClick={handleConnect}
                disabled={isConnecting}
                className="w-full flex items-center justify-center space-x-2 bg-[#0077B5] hover:bg-[#006097]"
              >
                {isConnecting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Link2 className="h-4 w-4" />
                )}
                <span>{isConnecting ? 'Connecting...' : 'Connect LinkedIn Account'}</span>
              </Button>
            )}
          </div>

          {!connectionStatus?.connected && (
            <p className="text-xs text-gray-500 text-center">
              Connect your LinkedIn account to post generated content directly to your LinkedIn profile
            </p>
          )}
        </div>
      )}
    </Card>
  );
}