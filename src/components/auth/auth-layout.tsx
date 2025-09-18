import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AuthLayout({ 
  children, 
  title = "Welcome to Y-ALM",
  subtitle = "Application Lifecycle Management Platform"
}: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="min-h-screen flex">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/5 to-primary/10 items-center justify-center p-12">
          <div className="max-w-md text-center">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                {title}
              </h1>
              <p className="text-lg text-muted-foreground">
                {subtitle}
              </p>
            </div>
            <div className="space-y-4 text-sm text-muted-foreground">
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Secure authentication</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Role-based access control</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Modern UI/UX</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-12">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
