# Types Directory

## Overview
This directory contains all TypeScript type definitions, interfaces, and type utilities organized by feature. Types provide compile-time type safety and serve as contracts between different parts of the application.

## Directory Structure

```
types/
├── auth/                    # Authentication types
│   ├── index.ts            # Auth-related interfaces
│   ├── auth.types.ts       # Authentication types
│   └── session.types.ts    # Session management types
├── users/                  # User management types
│   ├── index.tsx           # User interfaces and types
│   ├── user.types.ts       # User entity types
│   └── user-query.types.ts # User query types
├── roles/                  # Role management types
│   ├── index.ts            # Role interfaces
│   ├── role.types.ts       # Role entity types
│   └── permission.types.ts # Permission types
├── api/                    # API-related types
│   ├── index.ts            # API response types
│   ├── request.types.ts    # Request types
│   └── response.types.ts   # Response types
├── common/                 # Shared/common types
│   ├── index.ts            # Common interfaces
│   ├── pagination.types.ts # Pagination types
│   └── validation.types.ts # Validation types
└── shared/                 # Shared type utilities
    ├── index.ts            # Utility types
    ├── api.types.ts        # API utility types
    └── form.types.ts       # Form utility types
```

## Type Organization Principles

### 1. **Feature-Based Grouping**
- Types are grouped by business functionality
- Each feature has its own directory
- Shared types are in `common/` and `shared/` directories

### 2. **Naming Conventions**
- **PascalCase** for interfaces and types
- **camelCase** for properties
- **Descriptive suffixes** for clarity:
  - `Request` for API request types
  - `Response` for API response types
  - `Params` for query parameters
  - `Config` for configuration types

### 3. **File Naming Patterns**
- `index.ts` - Main exports for the feature
- `[feature].types.ts` - Core entity types
- `[feature]-[aspect].types.ts` - Specific aspect types

## Type Definition Standards

### Interface Structure
```typescript
// Base entity interface
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

// Request interface
export interface CreateUserRequest {
  email: string;
  name: string;
  phone?: string;
  password: string;
}

// Response interface
export interface UserResponse {
  data: User;
  message: string;
  success: boolean;
}

// Query parameters interface
export interface PagedUserParams {
  PageNumber?: number;
  PageSize?: number;
  SearchTerm?: string;
  SortBy?: string;
  SortDescending?: boolean;
  Email?: string;
  Name?: string;
  Phone?: string;
  RoleId?: string;
  Status?: string;
}
```

### Union Types and Enums
```typescript
// Status enums
export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
}

// Union types
export type UserRole = 'admin' | 'user' | 'moderator';
export type SortDirection = 'asc' | 'desc';

// String literal unions
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export type ContentType = 'application/json' | 'multipart/form-data';
```

## Generic Types

### API Response Patterns
```typescript
// Generic API response
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

// Paginated response
export interface PagedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  message: string;
}

// Error response
export interface ApiError {
  message: string;
  code: string;
  details?: Record<string, any>;
  timestamp: string;
}
```

### Utility Types
```typescript
// Make all properties optional
export type Partial<T> = {
  [P in keyof T]?: T[P];
};

// Make specific properties required
export type RequireFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Make specific properties optional
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Extract only specific properties
export type PickFields<T, K extends keyof T> = Pick<T, K>;

// Omit specific properties
export type OmitFields<T, K extends keyof T> = Omit<T, K>;
```

## Form Types

### Form State Types
```typescript
// Form field state
export interface FormField<T> {
  value: T;
  error?: string;
  touched: boolean;
  dirty: boolean;
}

// Form state
export interface FormState<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  touched: Partial<Record<keyof T, boolean>>;
  isSubmitting: boolean;
  isValid: boolean;
  isDirty: boolean;
}

// Form validation
export interface ValidationRule<T> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | undefined;
}
```

### Form Component Props
```typescript
// Generic form props
export interface FormProps<T> {
  initialValues: T;
  onSubmit: (values: T) => void | Promise<void>;
  validationSchema?: ValidationSchema<T>;
  children: React.ReactNode;
}

// Input field props
export interface InputProps<T> {
  name: keyof T;
  value: T[keyof T];
  onChange: (value: T[keyof T]) => void;
  onBlur?: () => void;
  error?: string;
  placeholder?: string;
  disabled?: boolean;
}
```

## API Types

### Request/Response Types
```typescript
// HTTP request configuration
export interface RequestConfig {
  method: HttpMethod;
  headers?: Record<string, string>;
  body?: any;
  params?: Record<string, string>;
  timeout?: number;
}

// API endpoint configuration
export interface ApiEndpoint {
  path: string;
  method: HttpMethod;
  requiresAuth: boolean;
  rateLimit?: number;
}

// Service response
export interface ServiceResponse<T> {
  data: T;
  status: number;
  headers: Record<string, string>;
  success: boolean;
}
```

### Error Types
```typescript
// API error types
export interface ApiError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, any>;
}

// Validation error
export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

// Network error
export interface NetworkError {
  message: string;
  code: 'NETWORK_ERROR' | 'TIMEOUT' | 'CANCELLED';
  originalError?: Error;
}
```

## Component Types

### React Component Types
```typescript
// Generic component props
export interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  'data-testid'?: string;
}

// Button component props
export interface ButtonProps extends ComponentProps {
  variant: 'primary' | 'secondary' | 'danger' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

// Modal component props
export interface ModalProps extends ComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closable?: boolean;
}
```

### Hook Types
```typescript
// Custom hook return type
export interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

// Form hook return type
export interface UseFormReturn<T> {
  values: T;
  errors: Partial<Record<keyof T, string>>;
  setValue: (field: keyof T, value: T[keyof T]) => void;
  setError: (field: keyof T, error: string) => void;
  handleSubmit: (onSubmit: (values: T) => void) => void;
  reset: () => void;
}
```

## Type Guards

### Type Guard Functions
```typescript
// User type guard
export function isUser(obj: any): obj is User {
  return (
    obj &&
    typeof obj.id === 'string' &&
    typeof obj.email === 'string' &&
    typeof obj.name === 'string' &&
    typeof obj.status === 'string'
  );
}

// API response type guard
export function isApiResponse<T>(obj: any): obj is ApiResponse<T> {
  return (
    obj &&
    typeof obj.data !== 'undefined' &&
    typeof obj.message === 'string' &&
    typeof obj.success === 'boolean'
  );
}

// Error type guard
export function isApiError(obj: any): obj is ApiError {
  return (
    obj &&
    typeof obj.message === 'string' &&
    typeof obj.code === 'string' &&
    typeof obj.status === 'number'
  );
}
```

## Type Utilities

### Utility Type Functions
```typescript
// Deep partial type
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// Non-nullable type
export type NonNullable<T> = T extends null | undefined ? never : T;

// Array element type
export type ArrayElement<T> = T extends (infer U)[] ? U : never;

// Function return type
export type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

// Promise return type
export type Awaited<T> = T extends Promise<infer U> ? U : T;
```

### Conditional Types
```typescript
// Conditional type based on boolean
export type IsArray<T> = T extends any[] ? true : false;

// Extract array element type
export type ElementType<T> = T extends (infer U)[] ? U : never;

// Make properties optional based on condition
export type OptionalIf<T, K extends keyof T, C> = C extends true 
  ? Partial<Pick<T, K>> & Omit<T, K>
  : T;
```

## Type Documentation

### JSDoc Comments
```typescript
/**
 * Represents a user in the system
 * 
 * @interface User
 * @property {string} id - Unique identifier
 * @property {string} email - User's email address
 * @property {string} name - User's display name
 * @property {string} [phone] - Optional phone number
 * @property {UserStatus} status - Current user status
 * @property {string} createdAt - ISO timestamp of creation
 * @property {string} updatedAt - ISO timestamp of last update
 */
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}
```

### Type Examples
```typescript
/**
 * Example usage of User interface
 * 
 * @example
 * ```typescript
 * const user: User = {
 *   id: '123',
 *   email: 'user@example.com',
 *   name: 'John Doe',
 *   phone: '+1234567890',
 *   status: UserStatus.ACTIVE,
 *   createdAt: '2023-01-01T00:00:00Z',
 *   updatedAt: '2023-01-01T00:00:00Z'
 * };
 * ```
 */
```

## Export Patterns

### Index File Exports
```typescript
// types/users/index.ts
export type { User, CreateUserRequest, UpdateUserRequest } from './user.types';
export type { PagedUserParams, UserResponse, PagedUserResponse } from './user-query.types';
export { UserStatus } from './user.types';

// Re-export for convenience
export type { User as UserEntity } from './user.types';
```

### Barrel Exports
```typescript
// types/index.ts
export * from './auth';
export * from './users';
export * from './roles';
export * from './api';
export * from './common';
export * from './shared';
```

## Testing Types

### Type Testing
```typescript
// Type assertion tests
import { expectType } from 'tsd';

// Test that User has required properties
expectType<{
  id: string;
  email: string;
  name: string;
  status: UserStatus;
}>({} as User);

// Test that CreateUserRequest omits id and timestamps
expectType<{
  email: string;
  name: string;
  password: string;
}>({} as CreateUserRequest);
```

## Future Considerations

### Scalability
- **Type composition** for complex types
- **Generic constraints** for type safety
- **Template literal types** for string manipulation
- **Mapped types** for dynamic type generation

### Maintenance
- **Type versioning** for breaking changes
- **Migration strategies** for type updates
- **Type documentation** and examples
- **Type testing** and validation
