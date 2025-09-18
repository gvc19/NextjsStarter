import { ApiBase } from '@/config/apiBase';
import { 
  PagedUserParams,
  User,
  CreateUserRequest,
  UpdateUserRequest,
  UserResponse,
  PagedUserResponse
} from '@/types/users';

class UserService extends ApiBase {
  private readonly basePath = '/api/users';

  constructor() {
    super();
  }

  // Create a new user
  async createUser(userData: CreateUserRequest): Promise<UserResponse> {
    return this.makeRequest(`${this.basePath}`, {
      method: 'POST',
      data: userData,
    });
  }

  // Get user by ID
  async getUserById(id: string): Promise<UserResponse> {
    return this.makeRequest(`${this.basePath}/${id}`);
  }

  // Get all users with pagination and filtering
  async getUsers(params?: PagedUserParams): Promise<PagedUserResponse> {
    return this.makeRequest(`${this.basePath}`, {
      method: 'GET',
      params: params as Record<string, string>,
    });
  }

  // Search users
  async searchUsers(searchTerm: string, pageNumber?: number, pageSize?: number): Promise<PagedUserResponse> {
    return this.makeRequest(`${this.basePath}/search`, {
      method: 'GET',
      params: {
        searchTerm,
        pageNumber: pageNumber?.toString() || '1',
        pageSize: pageSize?.toString() || '10',
      },
    });
  }

  // Get users by role
  async getUsersByRole(roleId: string, pageNumber?: number, pageSize?: number): Promise<PagedUserResponse> {
    return this.makeRequest(`${this.basePath}/role/${roleId}`, {
      method: 'GET',
      params: {
        pageNumber: pageNumber?.toString() || '1',
        pageSize: pageSize?.toString() || '10',
      },
    });
  }

  // Get active users
  async getActiveUsers(pageNumber?: number, pageSize?: number): Promise<PagedUserResponse> {
    return this.makeRequest(`${this.basePath}/active`, {
      method: 'GET',
      params: {
        pageNumber: pageNumber?.toString() || '1',
        pageSize: pageSize?.toString() || '10',
      },
    });
  }

  // Update user
  async updateUser(id: string, userData: UpdateUserRequest): Promise<UserResponse> {
    return this.makeRequest(`${this.basePath}/${id}`, {
      method: 'PUT',
      data: userData,
    });
  }

  // Delete user
  async deleteUser(id: string): Promise<{ message: string }> {
    return this.makeRequest(`${this.basePath}/${id}`, {
      method: 'DELETE',
    });
  }

  // Update user status
  async updateUserStatus(id: string, status: 'active' | 'inactive' | 'pending'): Promise<UserResponse> {
    return this.makeRequest(`${this.basePath}/${id}/status`, {
      method: 'PATCH',
      data: { status },
    });
  }
}

export const userService = new UserService();
export default userService;
