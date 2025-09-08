'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, Twitter, Linkedin, Instagram, Globe } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <Layout showSidebar={false}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <Sparkles className="h-12 w-12 mx-auto animate-pulse" />
            <p className="mt-2 text-muted-foreground">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout showSidebar={false}>
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] space-y-8">
        <div className="text-center space-y-4 max-w-2xl">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Sparkles className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">
            AI Content Generator
          </h1>
          <p className="text-xl text-muted-foreground">
            Generate engaging, platform-optimized content with AI-powered insights and beautiful images
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-4xl">
          {[
            { icon: Twitter, name: 'Twitter', color: 'text-blue-500' },
            { icon: Linkedin, name: 'LinkedIn', color: 'text-blue-600' },
            { icon: Instagram, name: 'Instagram', color: 'text-pink-500' },
            { icon: Globe, name: 'Blog', color: 'text-green-500' },
          ].map((platform) => {
            const Icon = platform.icon;
            return (
              <Card key={platform.name} className="text-center">
                <CardHeader>
                  <Icon className={`h-8 w-8 mx-auto ${platform.color}`} />
                  <CardTitle className="text-lg">{platform.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Generate optimized content for {platform.name}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="flex space-x-4">
          <Link href="/register">
            <Button size="lg">
              Get Started
            </Button>
          </Link>
          <Link href="/login">
            <Button variant="outline" size="lg">
              Sign In
            </Button>
          </Link>
        </div>

        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle>Key Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-medium">AI-Powered Content</h4>
                <p className="text-muted-foreground">
                  Generate engaging content tailored to each platform
                </p>
              </div>
              <div>
                <h4 className="font-medium">Image Generation</h4>
                <p className="text-muted-foreground">
                  Create stunning visuals with DALL-E integration
                </p>
              </div>
              <div>
                <h4 className="font-medium">Web Research</h4>
                <p className="text-muted-foreground">
                  Get current insights with real-time web search
                </p>
              </div>
              <div>
                <h4 className="font-medium">Multi-Platform</h4>
                <p className="text-muted-foreground">
                  Optimize for Twitter, LinkedIn, Instagram, and blogs
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}