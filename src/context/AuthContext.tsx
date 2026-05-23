import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { UserResponseDTO, UserRole } from '../api/types/user.types';
import { favoriteService } from '../api/services/favorite.service';
import { authService } from '../api/services/auth.service';
import { AuthResponseDTO } from '../api/types/auth.types';

interface AuthContextType {
  user: UserResponseDTO | null;
  favorites: number[];
  login: (authData: AuthResponseDTO) => void;
  logout: () => void;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<{ success: boolean; message?: string }>;
  toggleFavorite: (bookId: number) => void;
  isFavorite: (bookId: number) => boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserResponseDTO | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('auth_token');
    
    if (savedUser && token) {
      const u = JSON.parse(savedUser);
      setUser(u);
      loadServerFavorites(u.id);
    } else {
      // If no token, make sure state is empty
      logout();
    }
  }, []);

  const loadServerFavorites = async (userId: number) => {
    try {
      const favs = await favoriteService.getByUser(userId);
      setFavorites(favs.map(f => f.bookId));
    } catch (e) {
      console.error("Failed to load favorites from server");
    }
  };

  const login = (authData: AuthResponseDTO) => {
    const userData: UserResponseDTO = {
      id: authData.userId,
      email: authData.email,
      name: authData.name,
      role: authData.role,
      status: 'ACTIVE', // Default for logged in
      photo: `https://ui-avatars.com/api/?name=${authData.name}&background=6366f1&color=fff`
    };
    
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('auth_token', authData.token);
    loadServerFavorites(userData.id);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
  };

  const register = async (name: string, email: string, password: string, role: UserRole) => {
    try {
      const authData = await authService.register(name, email, password, role);
      login(authData);
      return { success: true, message: 'Registration successful' };
    } catch (error) {
      return { 
        success: false, 
        message: error instanceof Error ? error.message : 'Registration failed' 
      };
    }
  };

  const toggleFavorite = async (bookId: number) => {
    if (!user) return;
    
    const isCurrentlyFav = favorites.includes(bookId);
    
    try {
      if (isCurrentlyFav) {
        await favoriteService.remove(user.id, bookId);
        setFavorites(prev => prev.filter(id => id !== bookId));
      } else {
        await favoriteService.add(user.id, bookId);
        setFavorites(prev => [...prev, bookId]);
      }
    } catch (e) {
      console.error("Failed to sync favorite with server");
    }
  };

  const isFavorite = (bookId: number) => favorites.includes(bookId);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      favorites, 
      login, 
      logout, 
      register, 
      toggleFavorite, 
      isFavorite,
      isAuthenticated 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;