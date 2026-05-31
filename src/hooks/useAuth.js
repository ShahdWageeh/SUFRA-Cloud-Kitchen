import { useAuth } from '@/context/AuthContext';

export const useAuthActions = () => {
  const { setUser } = useAuth();

  const login = async (credentials) => {
    // Logic for login will go here
    console.log('Logging in...', credentials);
  };

  const logout = () => {
    // Logic for logout will go here
    setUser(null);
  };

  return { login, logout };
};
