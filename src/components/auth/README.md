# Auth Components

This directory contains authentication-related components for the Y-ALM application.

## Components

### LoginForm
A login form component with email and password fields, built with React Hook Form and Zod validation.

**Props:**
- `onSubmit?: (data: LoginFormData) => void` - Callback function called when form is submitted
- `isLoading?: boolean` - Loading state for the form

**Usage:**
```tsx
import { LoginForm } from "@/components/auth";

<LoginForm 
  onSubmit={(data) => console.log(data)} 
  isLoading={false} 
/>
```

### SignUp
A signup form component with first name, last name, email, password, and confirm password fields.

**Props:**
- `onSubmit?: (data: SignupFormData) => void` - Callback function called when form is submitted
- `isLoading?: boolean` - Loading state for the form

**Usage:**
```tsx
import { SignUp } from "@/components/auth";

<SignUp 
  onSubmit={(data) => console.log(data)} 
  isLoading={false} 
/>
```

### AuthLayout
A layout component that provides a consistent design for authentication pages with a branded left side and form area on the right.

**Props:**
- `children: ReactNode` - The form content to display
- `title?: string` - Title for the branding section (default: "Welcome to Y-ALM")
- `subtitle?: string` - Subtitle for the branding section

**Usage:**
```tsx
import { AuthLayout } from "@/components/auth";

<AuthLayout title="Welcome back" subtitle="Sign in to continue">
  <LoginForm onSubmit={handleLogin} />
</AuthLayout>
```

## Schemas

### LoginFormData
```tsx
{
  email: string;
  password: string;
}
```

### SignupFormData
```tsx
{
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}
```

## Validation Rules

### Login Form
- Email: Required, valid email format
- Password: Required, minimum 6 characters

### Signup Form
- First Name: Required, 2-50 characters
- Last Name: Required, 2-50 characters
- Email: Required, valid email format
- Password: Required, minimum 8 characters, must contain uppercase, lowercase, and number
- Confirm Password: Required, must match password

## Features

- ✅ Form validation with Zod schemas
- ✅ React Hook Form integration
- ✅ Password visibility toggle
- ✅ Responsive design
- ✅ Accessibility features (ARIA labels, proper form structure)
- ✅ Loading states
- ✅ Error handling and display
- ✅ Modern UI with Tailwind CSS
- ✅ TypeScript support

## Pages

The auth pages are located at:
- `/auth/login` - Login page
- `/auth/signup` - Signup page

Both pages use the AuthLayout component and include placeholder functionality that can be connected to your authentication service.
