import { LoginForm } from '@/components/auth/LoginForm';
import { AuthLayout } from '@/components/layout/Layout';
import { PublicRoute } from '@/components/auth/ProtectedRoute';

export default function LoginPage() {
  return (
    <PublicRoute>
      <AuthLayout>
        <LoginForm />
      </AuthLayout>
    </PublicRoute>
  );
}