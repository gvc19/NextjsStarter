# Services Directory

## Overview
This directory contains all service classes that handle API communication and business logic. Services are organized by functionality and follow the inheritance pattern with the base ApiBase class.

## Directory Structure

```
services/
├── auth/                    # Authentication services
│   ├── auth-service.ts     # Authentication API calls
│   ├── token-service.ts    # Token management
│   └── session-service.ts  # Session management
├── users/                  # User management services
│   └── user-service.ts     # User CRUD operations
├── roles/                  # Role management services
│   └── role-service.ts     # Role CRUD operations
├── user-roles/             # User-role mapping services
│   └── user-role-service.ts # User-role assignment operations
└── shared/                 # Shared services
    ├── api-base.ts         # Base API service class
    ├── cache-service.ts    # Caching utilities
    └── validation-service.ts # Input validation
```

## Service Architecture

### Base Class Pattern
All services extend the `ApiBase` class to inherit common HTTP functionality:

```typescript
import { ApiBase } from '@/config/apiBase';

class UserService extends ApiBase {
  private readonly basePath = '/api/users';

  constructor() {
    super(); // Initialize base class
  }

  async getUsers() {
    return this.makeRequest(this.basePath);
  }
}
```

### Service Responsibilities

#### 1. **API Communication**
- HTTP request/response handling
- Error handling and retry logic
- Request/response transformation
- Authentication token management

#### 2. **Business Logic**
- Data validation and sanitization
- Business rule enforcement
- Data transformation and mapping
- Caching strategies

#### 3. **Error Handling**
- API error translation
- Network error handling
- Retry mechanisms
- User-friendly error messages

## Service Development Standards

### Class Structure
```typescript
class FeatureService extends ApiBase {
  private readonly basePath = '/api/feature';
  private readonly cacheKey = 'feature-cache';

  constructor() {
    super();
  }

  // Public methods for external use
  async getItems(): Promise<ItemResponse> {
    return this.makeRequest(this.basePath);
  }

  // Private methods for internal logic
  private validateItem(item: Item): boolean {
    // Validation logic
  }
}
```

### Method Naming Conventions

| Operation | Method Name | Example |
|-----------|-------------|---------|
| Create | `create[Entity]` | `createUser()` |
| Read (Single) | `get[Entity]ById` | `getUserById()` |
| Read (Multiple) | `get[Entities]` | `getUsers()` |
| Update | `update[Entity]` | `updateUser()` |
| Delete | `delete[Entity]` | `deleteUser()` |
| Search | `search[Entities]` | `searchUsers()` |
| Filter | `get[Entities]By[Filter]` | `getUsersByRole()` |

### Error Handling Pattern
```typescript
async createUser(userData: CreateUserRequest): Promise<UserResponse> {
  try {
    // Validate input
    this.validateUserData(userData);
    
    // Make API call
    const response = await this.makeRequest(`${this.basePath}`, {
      method: 'POST',
      data: userData,
    });
    
    return response;
  } catch (error) {
    // Log error for debugging
    console.error('Failed to create user:', error);
    
    // Transform error for user consumption
    throw new Error('Unable to create user. Please try again.');
  }
}
```

## Service Types and Interfaces

### Request/Response Types
All service methods use properly typed interfaces:

```typescript
// Request interfaces
interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
}

// Response interfaces
interface UserResponse {
  data: User;
  message: string;
}

// Service method signature
async createUser(userData: CreateUserRequest): Promise<UserResponse>
```

### Generic Response Pattern
```typescript
interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

interface PagedResponse<T> {
  data: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}
```

## Caching Strategy

### Cache Implementation
```typescript
class UserService extends ApiBase {
  private cache = new Map<string, any>();
  private readonly CACHE_TTL = 5 * 60 * 1000; // 5 minutes

  async getUsers(useCache = true): Promise<UserResponse> {
    const cacheKey = 'users-list';
    
    if (useCache && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (Date.now() - cached.timestamp < this.CACHE_TTL) {
        return cached.data;
      }
    }

    const response = await this.makeRequest(this.basePath);
    
    if (useCache) {
      this.cache.set(cacheKey, {
        data: response,
        timestamp: Date.now()
      });
    }

    return response;
  }
}
```

## Authentication Integration

### Token Management
```typescript
class AuthService extends ApiBase {
  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async getUsers(): Promise<UserResponse> {
    return this.makeRequest('/api/users', {
      headers: this.getAuthHeaders()
    });
  }
}
```

## Service Testing

### Unit Testing Pattern
```typescript
describe('UserService', () => {
  let userService: UserService;
  let mockApiBase: jest.Mocked<ApiBase>;

  beforeEach(() => {
    mockApiBase = {
      makeRequest: jest.fn()
    } as any;
    
    userService = new UserService();
    // Mock the inherited makeRequest method
    userService['makeRequest'] = mockApiBase.makeRequest;
  });

  it('should create user successfully', async () => {
    const userData = { email: 'test@example.com', name: 'Test User' };
    const expectedResponse = { data: userData, message: 'Success' };
    
    mockApiBase.makeRequest.mockResolvedValue(expectedResponse);
    
    const result = await userService.createUser(userData);
    
    expect(result).toEqual(expectedResponse);
    expect(mockApiBase.makeRequest).toHaveBeenCalledWith('/api/users', {
      method: 'POST',
      data: userData
    });
  });
});
```

## Performance Optimization

### Request Optimization
- **Request batching** for multiple operations
- **Request deduplication** to prevent duplicate calls
- **Pagination** for large datasets
- **Lazy loading** for non-critical data

### Memory Management
- **Cache cleanup** for expired data
- **WeakMap usage** for temporary references
- **Event listener cleanup** in service instances

## Error Recovery

### Retry Logic
```typescript
async makeRequestWithRetry(
  path: string, 
  options: RequestOptions, 
  maxRetries = 3
): Promise<any> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await this.makeRequest(path, options);
    } catch (error) {
      if (attempt === maxRetries) throw error;
      
      // Exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, Math.pow(2, attempt) * 1000)
      );
    }
  }
}
```

## Service Registration

### Dependency Injection
```typescript
// Service registry
export const services = {
  userService: new UserService(),
  authService: new AuthService(),
  roleService: new RoleService(),
} as const;

// Type-safe service access
export type Services = typeof services;
```

## Documentation Standards

### Method Documentation
```typescript
/**
 * Creates a new user in the system
 * 
 * @param userData - User information for creation
 * @param options - Additional request options
 * @returns Promise resolving to user creation response
 * @throws {ValidationError} When user data is invalid
 * @throws {ApiError} When API request fails
 * 
 * @example
 * ```typescript
 * const user = await userService.createUser({
 *   email: 'user@example.com',
 *   name: 'John Doe',
 *   password: 'securePassword'
 * });
 * ```
 */
async createUser(userData: CreateUserRequest): Promise<UserResponse>
```

## Future Considerations

### Scalability
- **Service composition** for complex operations
- **Middleware pattern** for cross-cutting concerns
- **Plugin architecture** for extensibility
- **Microservice integration** preparation

### Maintenance
- **API versioning** support
- **Backward compatibility** management
- **Deprecation handling** for old methods
- **Performance monitoring** and optimization
