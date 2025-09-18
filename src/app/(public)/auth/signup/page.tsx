import { SignUp } from "@/components/auth";
import AuthLayout from "@/components/auth/auth-layout";
import type { SignupFormData } from "@/components/auth/schemas";

export default function SignupPage() {


  return (
    <AuthLayout
      title="Join Y-ALM"
      subtitle="Create your account to get started with our platform"
    >
      <SignUp  />
    </AuthLayout>
  );
}
