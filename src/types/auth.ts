export interface Role {
  roleId: string;
  roleName: string;
}

export interface User {
  id: string;
  userName: string;
  email: string;
  isEmailConfirmed: boolean;
  createdAt: string;
  isAdmin?: boolean;
  roles?: Role[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
