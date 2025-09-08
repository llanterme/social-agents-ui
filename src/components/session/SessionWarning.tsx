'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle, Clock } from 'lucide-react';
import { useSessionManager } from '@/hooks/useSessionManager';

export function SessionWarning() {
  const [showWarning, setShowWarning] = useState(false);
  const [minutesRemaining, setMinutesRemaining] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const { extendSession } = useSessionManager();

  useEffect(() => {
    const handleSessionWarning = (event: CustomEvent) => {
      setMinutesRemaining(event.detail.minutesRemaining);
      setCountdown(event.detail.minutesRemaining * 60);
      setShowWarning(true);
    };

    const handleSessionTimeout = () => {
      setShowWarning(false);
    };

    const handleSessionExtended = () => {
      setShowWarning(false);
    };

    // Listen for session events
    window.addEventListener('sessionWarning', handleSessionWarning as EventListener);
    window.addEventListener('sessionTimeout', handleSessionTimeout);
    window.addEventListener('sessionExtended', handleSessionExtended);

    return () => {
      window.removeEventListener('sessionWarning', handleSessionWarning as EventListener);
      window.removeEventListener('sessionTimeout', handleSessionTimeout);
      window.removeEventListener('sessionExtended', handleSessionExtended);
    };
  }, []);

  // Countdown timer
  useEffect(() => {
    if (!showWarning || countdown <= 0) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          setShowWarning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showWarning, countdown]);

  const handleExtendSession = () => {
    extendSession();
    setShowWarning(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!showWarning) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-50">
      <Card className="max-w-md p-6 m-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-8 w-8 text-amber-500" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Session Expiring Soon
            </h2>
            <p className="text-sm text-gray-600">
              Your session will expire due to inactivity
            </p>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-center space-x-2 p-4 bg-amber-50 rounded-lg">
            <Clock className="h-5 w-5 text-amber-600" />
            <span className="text-2xl font-mono font-semibold text-amber-800">
              {formatTime(countdown)}
            </span>
          </div>
          <p className="text-center text-sm text-gray-600 mt-2">
            Time remaining until automatic logout
          </p>
        </div>

        <div className="flex space-x-3">
          <Button 
            onClick={handleExtendSession}
            className="flex-1"
          >
            Extend Session
          </Button>
          <Button 
            onClick={() => setShowWarning(false)}
            variant="outline"
            className="flex-1"
          >
            Dismiss
          </Button>
        </div>

        <p className="text-xs text-gray-500 text-center mt-4">
          Click "Extend Session" to continue working, or any activity will reset the timer.
        </p>
      </Card>
    </div>
  );
}