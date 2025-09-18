# Queries Directory

## Overview
This directory contains TanStack Query (React Query) hooks for data fetching, caching, and state management. All query hooks are organized by feature and provide a consistent interface for server state management.

## Directory Structure

```
queries/
├── auth/                    # Authentication queries
│   ├── authQuery.ts        # Login, logout, token refresh
│   └── sessionQuery.ts     # Session management queries
├── users/                  # User management queries
│   ├── userQuery.ts        # User CRUD operations
│   └── userProfileQuery.ts # User profile specific queries
├── roles/                  # Role management queries
│   └── roleQuery.ts        # Role CRUD operations
├── user-roles/             # User-role mapping queries
│   └── userRoleQuery.ts    # User-role assignment queries
└── shared/                 # Shared query utilities
    ├── queryKeys.ts        # Centralized query key management
    ├── queryClient.ts      # Query client configuration
    └── queryUtils.ts       # Query utility functions
```

## Query Hook Architecture

### Base Query Pattern
All query hooks follow a consistent pattern for better maintainability:

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { service } from '@/services/feature/service';
import { QUERY_KEYS } from './queryKeys';

// Query hook
export const useFeature = (params?: FeatureParams) => {
  return useQuery<FeatureResponse>({
    queryKey: QUERY_KEYS.feature(params),
    queryFn: () => service.getFeature(params),
    enabled: !!params?.id, // Conditional fetching
  });
};

// Mutation hook
export const useCreateFeature = () => {
  const queryClient = useQueryClient();
  
  return useMutation<FeatureResponse, Error, CreateFeatureRequest>({
    mutationFn: (data) => service.createFeature(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.feature });
    },
  });
};
```

## Query Key Management

### Centralized Query Keys
```typescript
// queryKeys.ts
export const QUERY_KEYS = {
  // Feature-based keys
  users: ['users'] as const,
  roles: ['roles'] as const,
  auth: ['auth'] as const,
  
  // Specific entity keys
  user: (id: string) => ['users', id] as const,
  role: (id: string) => ['roles', id] as const,
  
  // Paginated keys
  usersPaged: (params?: PagedParams) => ['users', 'paged', params] as const,
  rolesPaged: (params?: PagedParams) => ['roles', 'paged', params] as const,
  
  // Search keys
  searchUsers: (term: string, page?: number) => 
    ['users', 'search', term, page] as const,
  
  // Filtered keys
  usersByRole: (roleId: string, page?: number) => 
    ['users', 'role', roleId, page] as const,
} as const;
```

### Query Key Patterns

| Query Type | Pattern | Example |
|------------|---------|---------|
| List | `[feature]` | `['users']` |
| Single Item | `[feature, id]` | `['users', '123']` |
| Paginated | `[feature, 'paged', params]` | `['users', 'paged', {page: 1}]` |
| Search | `[feature, 'search', term, page]` | `['users', 'search', 'john', 1]` |
| Filtered | `[feature, filter, value, page]` | `['users', 'role', 'admin', 1]` |

## Query Hook Types

### 1. **Read Queries (useQuery)**
For fetching data from the server:

```typescript
export const useUsers = (params?: PagedUserParams) => {
  return useQuery<PagedUserResponse>({
    queryKey: QUERY_KEYS.usersPaged(params),
    queryFn: () => userService.getUsers(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};
```

### 2. **Mutations (useMutation)**
For creating, updating, or deleting data:

```typescript
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation<UserResponse, Error, CreateUserRequest>({
    mutationFn: (userData) => userService.createUser(userData),
    onSuccess: (data) => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
      
      // Optimistically update cache
      queryClient.setQueryData(
        QUERY_KEYS.user(data.data.id), 
        data
      );
    },
    onError: (error) => {
      console.error('Failed to create user:', error);
    },
  });
};
```

### 3. **Infinite Queries (useInfiniteQuery)**
For paginated data that loads more on demand:

```typescript
export const useInfiniteUsers = (filters?: UserFilters) => {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.usersInfinite(filters),
    queryFn: ({ pageParam = 1 }) => 
      userService.getUsers({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage) => 
      lastPage.pageNumber < lastPage.totalPages 
        ? lastPage.pageNumber + 1 
        : undefined,
  });
};
```

## Query Configuration

### Default Configuration
```typescript
// queryClient.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});
```

### Feature-Specific Configuration
```typescript
export const useUsers = (params?: PagedUserParams) => {
  return useQuery<PagedUserResponse>({
    queryKey: QUERY_KEYS.usersPaged(params),
    queryFn: () => userService.getUsers(params),
    // Feature-specific overrides
    staleTime: 2 * 60 * 1000, // 2 minutes for users
    enabled: !!params, // Only run when params exist
  });
};
```

## Cache Management

### Cache Invalidation Patterns
```typescript
// Invalidate all queries for a feature
queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });

// Invalidate specific query
queryClient.invalidateQueries({ 
  queryKey: QUERY_KEYS.user(userId) 
});

// Invalidate queries with predicate
queryClient.invalidateQueries({
  predicate: (query) => 
    query.queryKey[0] === 'users' && 
    query.queryKey[1] === 'paged'
});
```

### Optimistic Updates
```typescript
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }) => userService.updateUser(id, data),
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.user(id) });
      
      // Snapshot previous value
      const previousUser = queryClient.getQueryData(QUERY_KEYS.user(id));
      
      // Optimistically update
      queryClient.setQueryData(QUERY_KEYS.user(id), (old: any) => ({
        ...old,
        data: { ...old.data, ...data }
      }));
      
      return { previousUser };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousUser) {
        queryClient.setQueryData(
          QUERY_KEYS.user(variables.id), 
          context.previousUser
        );
      }
    },
    onSettled: (data, error, variables) => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.user(variables.id) 
      });
    },
  });
};
```

## Error Handling

### Global Error Handling
```typescript
// queryClient.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      onError: (error) => {
        // Global error handling
        if (error.status === 401) {
          // Handle authentication errors
          authService.logout();
        } else if (error.status >= 500) {
          // Handle server errors
          toast.error('Server error. Please try again later.');
        }
      },
    },
    mutations: {
      onError: (error) => {
        // Global mutation error handling
        toast.error(error.message || 'An error occurred');
      },
    },
  },
});
```

### Query-Specific Error Handling
```typescript
export const useUsers = (params?: PagedUserParams) => {
  return useQuery<PagedUserResponse>({
    queryKey: QUERY_KEYS.usersPaged(params),
    queryFn: () => userService.getUsers(params),
    onError: (error) => {
      // Specific error handling for users query
      if (error.status === 403) {
        toast.error('You do not have permission to view users');
      }
    },
  });
};
```

## Loading States

### Loading State Management
```typescript
export const useUsers = (params?: PagedUserParams) => {
  const query = useQuery<PagedUserResponse>({
    queryKey: QUERY_KEYS.usersPaged(params),
    queryFn: () => userService.getUsers(params),
  });

  return {
    ...query,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isRefetching: query.isRefetching,
    isStale: query.isStale,
  };
};
```

### Skeleton Loading
```typescript
export const useUsersWithSkeleton = (params?: PagedUserParams) => {
  const query = useUsers(params);
  
  return {
    ...query,
    showSkeleton: query.isLoading && !query.data,
    showRefetching: query.isFetching && query.data,
  };
};
```

## Testing Queries

### Query Testing Pattern
```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

describe('useUsers', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
  });

  it('should fetch users successfully', async () => {
    const mockUsers = { data: [], totalCount: 0 };
    jest.spyOn(userService, 'getUsers').mockResolvedValue(mockUsers);

    const { result } = renderHook(() => useUsers(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockUsers);
  });
});
```

## Performance Optimization

### Query Optimization
- **Stale time configuration** to prevent unnecessary refetches
- **Cache time management** for memory optimization
- **Query deduplication** for identical requests
- **Background refetching** for data freshness

### Memory Management
- **Cache cleanup** for unused queries
- **Garbage collection** of stale data
- **Memory leak prevention** in long-running apps

## Documentation Standards

### Hook Documentation
```typescript
/**
 * Fetches a paginated list of users with optional filtering
 * 
 * @param params - Pagination and filtering parameters
 * @returns Query result with users data and loading states
 * 
 * @example
 * ```tsx
 * const { data: users, isLoading, error } = useUsers({
 *   pageNumber: 1,
 *   pageSize: 10,
 *   searchTerm: 'john'
 * });
 * ```
 */
export const useUsers = (params?: PagedUserParams) => {
  // Implementation
};
```

## Future Considerations

### Scalability
- **Query composition** for complex data fetching
- **Custom hooks** for business logic
- **Query middleware** for cross-cutting concerns
- **Real-time updates** with WebSocket integration

### Maintenance
- **Query versioning** for API changes
- **Migration strategies** for breaking changes
- **Performance monitoring** and optimization
- **Cache debugging** tools and utilities
