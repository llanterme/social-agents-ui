'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Sparkles, 
  FileText, 
  History, 
  Settings,
  User,
  Twitter,
  Linkedin,
  Instagram,
  Globe
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Profile',
    href: '/profile',
    icon: User,
  },
  {
    name: 'Generate Content',
    href: '/generate',
    icon: Sparkles,
  },
  {
    name: 'Content Library',
    href: '/content',
    icon: FileText,
  },
  {
    name: 'History',
    href: '/history',
    icon: History,
  },
];

const platforms = [
  {
    name: 'Twitter',
    href: '/generate?platform=twitter',
    icon: Twitter,
  },
  {
    name: 'LinkedIn',
    href: '/generate?platform=linkedin',
    icon: Linkedin,
  },
  {
    name: 'Instagram',
    href: '/generate?platform=instagram',
    icon: Instagram,
  },
  {
    name: 'Blog',
    href: '/generate?platform=blog',
    icon: Globe,
  },
];

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    if (onClose && typeof window !== 'undefined' && window.innerWidth < 1024) {
      onClose();
    }
  }, [pathname, onClose]);

  // Prevent rendering on server to avoid hydration mismatch
  if (!isMounted) {
    return null;
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && onClose && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={cn(
          "flex h-full w-64 flex-col border-r bg-background transition-transform duration-300 ease-in-out",
          "lg:translate-x-0 lg:static lg:inset-0",
          "fixed inset-y-0 left-0 z-50",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
      <div className="flex-1 overflow-y-auto px-3 py-4">
        <nav className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
                  pathname === item.href && 'bg-accent text-accent-foreground'
                )}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-8">
          <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Quick Generate
          </h3>
          <nav className="mt-2 space-y-1">
            {platforms.map((platform) => {
              const Icon = platform.icon;
              return (
                <Link
                  key={platform.name}
                  href={platform.href}
                  className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <Icon className="mr-2 h-4 w-4" />
                  {platform.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      <div className="border-t p-3">
        <Link
          href="/settings"
          className={cn(
            'flex items-center rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
            pathname === '/settings' && 'bg-accent text-accent-foreground'
          )}
        >
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Link>
      </div>
    </div>
    </>
  );
}