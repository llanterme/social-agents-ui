'use client';

import { useAuth } from '@/context/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, FileText, History, TrendingUp, Users, Calendar, BarChart3, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isLoading, error } = useAuth();

  // Debug logging for authentication troubleshooting
  console.log('Dashboard auth state:', { hasUser: !!user, isLoading, error });

  // Show loading state while authentication is being checked
  if (isLoading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p className="mt-2 text-muted-foreground">Loading dashboard...</p>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  // Show error state if there's an authentication error
  if (error) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-destructive">Error loading dashboard: {error}</p>
              <Button 
                onClick={() => window.location.reload()} 
                className="mt-4"
                variant="outline"
              >
                Retry
              </Button>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  // Show loading state if user data is still being fetched
  if (!user) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto" />
              <p className="mt-2 text-muted-foreground">Loading user data...</p>
            </div>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          {/* Welcome Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-muted-foreground">
              Ready to create amazing content with AI? Let's get started.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <Link href="/generate">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Generate Content
                  </CardTitle>
                  <Sparkles className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">New</div>
                  <p className="text-xs text-muted-foreground">
                    Create AI-powered content
                  </p>
                </CardContent>
              </Link>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Content
                </CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  Pieces created this month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Platforms
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">
                  Twitter, LinkedIn, Instagram, Blog
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  This Week
                </CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">
                  +20% from last week
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity & Quick Start */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <History className="h-5 w-5" />
                  <span>Recent Activity</span>
                </CardTitle>
                <CardDescription>
                  Your latest content generation activities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">LinkedIn post generated</p>
                      <p className="text-xs text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Sparkles className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Twitter thread created</p>
                      <p className="text-xs text-muted-foreground">Yesterday</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="bg-purple-100 p-2 rounded-full">
                      <FileText className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Blog post drafted</p>
                      <p className="text-xs text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Link href="/history">
                    <Button variant="outline" size="sm">
                      View All Activity
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Quick Start Guide */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5" />
                  <span>Quick Start</span>
                </CardTitle>
                <CardDescription>
                  Get started with AI content generation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">1. Choose Your Platform</h4>
                    <p className="text-sm text-muted-foreground">
                      Select from Twitter, LinkedIn, Instagram, or Blog
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <h4 className="font-medium">2. Enter Your Topic</h4>
                    <p className="text-sm text-muted-foreground">
                      Describe what you want to create content about
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">3. Set the Tone</h4>
                    <p className="text-sm text-muted-foreground">
                      Choose professional, casual, playful, or authoritative
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium">4. Generate & Customize</h4>
                    <p className="text-sm text-muted-foreground">
                      AI creates content with images and insights
                    </p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <Link href="/generate">
                    <Button className="w-full">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Start Generating
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Platform Quick Access */}
          <Card>
            <CardHeader>
              <CardTitle>Generate Content by Platform</CardTitle>
              <CardDescription>
                Quick access to create content for specific platforms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { name: 'Twitter', href: '/generate?platform=twitter', color: 'blue' },
                  { name: 'LinkedIn', href: '/generate?platform=linkedin', color: 'blue' },
                  { name: 'Instagram', href: '/generate?platform=instagram', color: 'pink' },
                  { name: 'Blog', href: '/generate?platform=blog', color: 'green' },
                ].map((platform) => (
                  <Link key={platform.name} href={platform.href}>
                    <Button
                      variant="outline"
                      className="w-full h-16 flex flex-col items-center justify-center space-y-1"
                    >
                      <span className="font-medium">{platform.name}</span>
                      <span className="text-xs text-muted-foreground">
                        Generate content
                      </span>
                    </Button>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}