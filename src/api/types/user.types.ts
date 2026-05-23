export enum UserRole {
  USER = 'USER',
  AUTHOR = 'AUTHOR',
  ADMIN = 'ADMIN',
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export interface UserRequestDTO {
  email?: string;
  name?: string;
  password?: string;
  role: UserRole;
  photo?: string;
}

export interface UserResponseDTO {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  photo?: string;
  status: UserStatus;
  createdAt: string;
}

export interface UserStatusRequestDTO {
  status: UserStatus;
}

export interface UserRoleRequestDTO {
  role: UserRole;
}
