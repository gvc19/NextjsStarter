import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  PagedUserParams,
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse,
  PagedUserResponse
} from "@/types/users";
import { userService } from '@/services/users/user-service';

export const QUERY_KEYS = {
    users: ['users'] as const,
    user: (id: string) => ['users', id] as const,
    usersPaged: (params?: PagedUserParams) => ['users', 'paged', params] as const,
    searchUsers: (searchTerm: string, pageNumber?: number, pageSize?: number) =>
      ['users', 'search', searchTerm, pageNumber, pageSize] as const,
    usersByRole: (roleId: string, pageNumber?: number, pageSize?: number) =>
      ['users', 'role', roleId, pageNumber, pageSize] as const,
    activeUsers: (pageNumber?: number, pageSize?: number) =>
      ['users', 'active', pageNumber, pageSize] as const,
  };

// Get all users with pagination
export const useUsers = (params?: PagedUserParams) => {
  return useQuery<PagedUserResponse>({
    queryKey: QUERY_KEYS.usersPaged(params),
    queryFn: () => userService.getUsers(params),
  });
};

// Get user by ID
export const useUser = (id: string) => {
  return useQuery<UserResponse>({
    queryKey: QUERY_KEYS.user(id),
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
  });
};

// Search users
export const useSearchUsers = (searchTerm: string, pageNumber?: number, pageSize?: number) => {
  return useQuery<PagedUserResponse>({
    queryKey: QUERY_KEYS.searchUsers(searchTerm, pageNumber, pageSize),
    queryFn: () => userService.searchUsers(searchTerm, pageNumber, pageSize),
    enabled: !!searchTerm,
  });
};

// Get users by role
export const useUsersByRole = (roleId: string, pageNumber?: number, pageSize?: number) => {
  return useQuery<PagedUserResponse>({
    queryKey: QUERY_KEYS.usersByRole(roleId, pageNumber, pageSize),
    queryFn: () => userService.getUsersByRole(roleId, pageNumber, pageSize),
    enabled: !!roleId,
  });
};

// Get active users
export const useActiveUsers = (pageNumber?: number, pageSize?: number) => {
  return useQuery<PagedUserResponse>({
    queryKey: QUERY_KEYS.activeUsers(pageNumber, pageSize),
    queryFn: () => userService.getActiveUsers(pageNumber, pageSize),
  });
};

// Create user mutation
export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation<UserResponse, Error, CreateUserRequest>({
    mutationFn: (userData) => userService.createUser(userData),
    onSuccess: () => {
      // Invalidate and refetch users list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
    },
  });
};

// Update user mutation
export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation<UserResponse, Error, { id: string; data: UpdateUserRequest }>({
    mutationFn: ({ id, data }) => userService.updateUser(id, data),
    onSuccess: (data, variables) => {
      // Invalidate specific user and users list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user(variables.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
    },
  });
};

// Delete user mutation
export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation<{ message: string }, Error, string>({
    mutationFn: (id) => userService.deleteUser(id),
    onSuccess: () => {
      // Invalidate users list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
    },
  });
};

// Update user status mutation
export const useUpdateUserStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation<UserResponse, Error, { id: string; status: 'active' | 'inactive' | 'pending' }>({
    mutationFn: ({ id, status }) => userService.updateUserStatus(id, status),
    onSuccess: (data, variables) => {
      // Invalidate specific user and users list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.user(variables.id) });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users });
    },
  });
};
  