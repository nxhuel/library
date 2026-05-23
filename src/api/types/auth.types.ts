import { UserRole } from './user.types';

export interface AuthResponseDTO {
  token: string;
  userId: number;
  email: string;
  name: string;
  role: UserRole;
}
