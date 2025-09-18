import { LoginForm } from "@/components/auth";
import AuthLayout from "@/components/auth/auth-layout";
import type { LoginFormData } from "@/components/auth/schemas";

export default function LoginPage() {


  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to your Y-ALM account to continue"
    >
      <LoginForm  />
    </AuthLayout>
  );
}
