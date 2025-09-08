import { RegisterForm } from '@/components/auth/RegisterForm';
import { AuthLayout } from '@/components/layout/Layout';
import { PublicRoute } from '@/components/auth/ProtectedRoute';

export default function RegisterPage() {
  return (
    <PublicRoute>
      <AuthLayout>
        <RegisterForm />
      </AuthLayout>
    </PublicRoute>
  );
}