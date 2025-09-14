'use client';

import { UserProfile } from '@/components/profile/UserProfile';
import { ProfileErrorBoundary } from '@/components/error/ProfileErrorBoundary';
import { Layout } from '@/components/layout/Layout';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <Layout>
        <ProfileErrorBoundary>
          <UserProfile />
        </ProfileErrorBoundary>
      </Layout>
    </ProtectedRoute>
  );
}