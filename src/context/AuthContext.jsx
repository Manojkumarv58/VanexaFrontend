import { createContext, useContext, useState, useEffect } from 'react';
import { getProfile, loginUser, logoutUser, registerUser } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProfile()
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (data) => {
    const res = await loginUser(data);
    setUser(res.data.user);
    return res.data;
  };

  const register = async (data) => {
    const res = await registerUser(data);
    setUser(res.data.user);
    return res.data;
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
