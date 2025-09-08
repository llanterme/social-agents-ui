'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href: string;
  isCurrentPage?: boolean;
}

interface BreadcrumbsProps {
  className?: string;
}

const routeLabels: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/profile': 'Profile',
  '/generate': 'Generate Content',
  '/content': 'Content Library',
  '/history': 'History',
  '/settings': 'Settings',
  '/login': 'Login',
  '/register': 'Register',
};

function generateBreadcrumbs(pathname: string): BreadcrumbItem[] {
  // Always start with home
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/dashboard' }
  ];

  // Handle root paths
  if (pathname === '/' || pathname === '/dashboard') {
    breadcrumbs[0].isCurrentPage = true;
    return breadcrumbs;
  }

  // Split pathname into segments
  const segments = pathname.split('/').filter(Boolean);
  
  // Build breadcrumbs for each segment
  let currentPath = '';
  for (let i = 0; i < segments.length; i++) {
    currentPath += `/${segments[i]}`;
    
    const isLast = i === segments.length - 1;
    const label = routeLabels[currentPath] || segments[i].charAt(0).toUpperCase() + segments[i].slice(1);
    
    breadcrumbs.push({
      label,
      href: currentPath,
      isCurrentPage: isLast
    });
  }

  return breadcrumbs;
}

export function Breadcrumbs({ className }: BreadcrumbsProps) {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  // Don't show breadcrumbs on login/register pages
  if (pathname === '/login' || pathname === '/register') {
    return null;
  }

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center space-x-1', className)}>
      <ol className="flex items-center space-x-1 text-sm text-gray-500">
        {breadcrumbs.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <ChevronRight className="mx-2 h-4 w-4 text-gray-400" aria-hidden="true" />
            )}
            
            {item.isCurrentPage ? (
              <span 
                className="flex items-center font-medium text-gray-900"
                aria-current="page"
              >
                {index === 0 && <Home className="mr-1.5 h-4 w-4" />}
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="flex items-center text-gray-500 hover:text-gray-900 transition-colors duration-200"
              >
                {index === 0 && <Home className="mr-1.5 h-4 w-4" />}
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}