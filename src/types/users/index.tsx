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

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  email: string;
  name: string;
  phone?: string;
  password: string;
}

export interface UpdateUserRequest {
  email?: string;
  name?: string;
  phone?: string;
  status?: 'active' | 'inactive' | 'pending';
}

export interface UserResponse {
  data: User;
  message: string;
}

export interface PagedUserResponse {
  data: User[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  message: string;
}