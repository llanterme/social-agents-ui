'use client';

import { ReactNode, useState } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Breadcrumbs } from '@/components/navigation/Breadcrumbs';
import { SessionWarning } from '@/components/session/SessionWarning';
import { useAuth } from '@/context/AuthContext';
import { useSessionManager } from '@/hooks/useSessionManager';

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
}

export function Layout({ children, showSidebar = true }: LayoutProps) {
  const { isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Initialize session management (only when authenticated)
  useSessionManager({
    timeoutMinutes: 30,
    warningMinutes: 5,
    checkIntervalSeconds: 30
  });

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="h-screen flex flex-col">
      <Header onMenuClick={toggleMobileMenu} />
      <div className="flex flex-1 overflow-hidden">
        {showSidebar && isAuthenticated && (
          <Sidebar 
            isOpen={isMobileMenuOpen} 
            onClose={closeMobileMenu}
          />
        )}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-6">
            {isAuthenticated && <Breadcrumbs className="mb-6" />}
            {children}
          </div>
        </main>
      </div>
      {/* Session timeout warning */}
      <SessionWarning />
    </div>
  );
}

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}