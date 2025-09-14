import { useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface SessionManagerOptions {
  timeoutMinutes?: number;
  warningMinutes?: number;
  checkIntervalSeconds?: number;
}

interface SessionState {
  lastActivity: number;
  isActive: boolean;
  timeRemaining: number;
  showWarning: boolean;
}

const DEFAULT_TIMEOUT_MINUTES = 30;
const DEFAULT_WARNING_MINUTES = 5;
const DEFAULT_CHECK_INTERVAL_SECONDS = 30;

export function useSessionManager(options: SessionManagerOptions = {}) {
  const {
    timeoutMinutes = DEFAULT_TIMEOUT_MINUTES,
    warningMinutes = DEFAULT_WARNING_MINUTES,
    checkIntervalSeconds = DEFAULT_CHECK_INTERVAL_SECONDS,
  } = options;

  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const isActiveRef = useRef<boolean>(true);

  // Activity tracking events
  const activityEvents = [
    'mousedown',
    'mousemove', 
    'keypress',
    'scroll',
    'touchstart',
    'click'
  ];

  const updateLastActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    
    // Store in localStorage for persistence across tabs
    if (typeof window !== 'undefined') {
      localStorage.setItem('lastActivity', Date.now().toString());
    }
  }, []);

  const resetTimer = useCallback(() => {
    if (!isAuthenticated) return;

    // Clear existing timers
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);

    updateLastActivity();

    const timeoutMs = timeoutMinutes * 60 * 1000;
    const warningMs = (timeoutMinutes - warningMinutes) * 60 * 1000;

    // Set warning timer
    warningTimeoutRef.current = setTimeout(() => {
      if (isActiveRef.current) {
        // Show warning notification
        console.log(`Session will expire in ${warningMinutes} minutes due to inactivity`);
        // You can dispatch a custom event here for UI components to listen to
        window.dispatchEvent(new CustomEvent('sessionWarning', {
          detail: { minutesRemaining: warningMinutes }
        }));
      }
    }, warningMs);

    // Set logout timer
    timeoutRef.current = setTimeout(async () => {
      if (isActiveRef.current) {
        console.log('Session expired due to inactivity');
        await handleSessionTimeout();
      }
    }, timeoutMs);
  }, [isAuthenticated, timeoutMinutes, warningMinutes, updateLastActivity]);

  const handleSessionTimeout = useCallback(async () => {
    isActiveRef.current = false;
    
    // Dispatch session timeout event
    window.dispatchEvent(new CustomEvent('sessionTimeout'));
    
    try {
      await logout();
    } catch (error) {
      console.error('Error during session timeout logout:', error);
    }
    
    router.push('/login?reason=timeout');
  }, [logout, router]);

  const extendSession = useCallback(() => {
    if (isAuthenticated) {
      resetTimer();
      // Dispatch session extended event
      window.dispatchEvent(new CustomEvent('sessionExtended'));
    }
  }, [isAuthenticated, resetTimer]);

  const checkCrossTabActivity = useCallback(() => {
    if (typeof window === 'undefined' || !isAuthenticated) return;

    const storedLastActivity = localStorage.getItem('lastActivity');
    if (storedLastActivity) {
      const storedTime = parseInt(storedLastActivity, 10);
      if (storedTime > lastActivityRef.current) {
        // Activity detected from another tab
        lastActivityRef.current = storedTime;
        resetTimer();
      }
    }
  }, [isAuthenticated, resetTimer]);

  // Initialize session management
  useEffect(() => {
    if (!isAuthenticated) {
      // Clean up timers when not authenticated
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      if (checkIntervalRef.current) clearTimeout(checkIntervalRef.current);
      return;
    }

    // Check for existing activity timestamp
    if (typeof window !== 'undefined') {
      const storedLastActivity = localStorage.getItem('lastActivity');
      if (storedLastActivity) {
        const storedTime = parseInt(storedLastActivity, 10);
        const timeSinceLastActivity = Date.now() - storedTime;
        const timeoutMs = timeoutMinutes * 60 * 1000;
        
        if (timeSinceLastActivity >= timeoutMs) {
          // Session should have expired
          handleSessionTimeout();
          return;
        }
        
        lastActivityRef.current = storedTime;
      }
    }

    isActiveRef.current = true;
    resetTimer();

    // Set up cross-tab activity check
    checkIntervalRef.current = setInterval(checkCrossTabActivity, checkIntervalSeconds * 1000);

    // Add activity listeners
    const handleActivity = () => {
      if (isActiveRef.current) {
        resetTimer();
      }
    };

    activityEvents.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    // Listen for visibility change (tab switching)
    const handleVisibilityChange = () => {
      if (!document.hidden && isActiveRef.current) {
        checkCrossTabActivity();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (warningTimeoutRef.current) clearTimeout(warningTimeoutRef.current);
      if (checkIntervalRef.current) clearTimeout(checkIntervalRef.current);
      
      activityEvents.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
      
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isAuthenticated, resetTimer, handleSessionTimeout, checkCrossTabActivity, timeoutMinutes, checkIntervalSeconds]);

  return {
    extendSession,
    resetTimer,
    isSessionActive: isActiveRef.current,
    lastActivity: lastActivityRef.current,
  };
}