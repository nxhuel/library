import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User } from '../interfaces';

// Define context type
interface RoleContextType {
  user: User | null;
  login: (username: string, email: string, role: User['role']) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create context
const RoleContext = createContext<RoleContextType | undefined>(undefined);

// Provider component
export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (username: string, email: string, role: User['role']) => {
    const newUser: User = {
      id: Date.now(),
      username,
      email,
      role,
      avatar: `https://ui-avatars.com/api/?name=${username}&background=random`
    };
    setUser(newUser);
    localStorage.setItem('user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const isAuthenticated = !!user;

  return (
    <RoleContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </RoleContext.Provider>
  );
};

// Custom hook to use the RoleContext
export const useAuth = () => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within a RoleProvider');
  }
  return context;
};

export default RoleContext;