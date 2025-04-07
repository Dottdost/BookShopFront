//Типы для аутентификации

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
  isAdmin?: boolean; // Добавим для удобства на клиенте
  roles?: Role[]; // Упрощенная версия без UserRole
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}
