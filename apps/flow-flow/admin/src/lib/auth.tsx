import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { api } from './api';

interface User { id: number; username: string; name: string; role: string; }

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      api.getMe().then(setUser).catch(() => { localStorage.removeItem('token'); setToken(null); });
    }
  }, [token]);

  async function login(username: string, password: string) {
    const res = await api.login(username, password);
    localStorage.setItem('token', res.access_token);
    setToken(res.access_token);
    const me = await api.getMe();
    setUser(me);
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() { return useContext(AuthContext); }
