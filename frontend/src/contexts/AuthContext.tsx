import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import api from '@/src/api';


const TOKEN_KEY = 'token';
const USER_KEY = 'user';

export type User = {
  id: number;
  nome?: string;
  email: string;
  nascimento?: string | null;
  telefone?: string | null;
  instagram_username?: string | null;
  created_at?: string;
};

type AuthResult = { ok: boolean; error?: string };

type FetchOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  params?: any;
  headers?: Record<string, string>;
  url?: string;
};

type AuthContextData = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (payload: {
    nome: string;
    email: string;
    password: string;
    nascimento?: string | null;
    telefone?: string | null;
    instagram_username?: string | null;
  }) => Promise<AuthResult>;
  signOut: () => Promise<void>;
  fetchWithAuth: (path: string, options?: FetchOptions) => Promise<any>;
  setUser: (u: User | null) => void;
};

const AuthContext = createContext<AuthContextData | undefined>(undefined);

type Props = { children: ReactNode };

export default function AuthProvider({ children }: Props) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
        const storedUser = await AsyncStorage.getItem(USER_KEY);

        if (storedToken) {
          api.defaults.headers.common.Authorization = `Bearer ${storedToken}`;
          setToken(storedToken);
        }

        if (storedUser) {
          try {
            const parsed = JSON.parse(storedUser) as User;
            setUser(parsed);
          } catch (err) {
            console.warn('Falha ao parsear user armazenado', err);
            await AsyncStorage.removeItem(USER_KEY);
          }
        }

        if (storedToken) {
          try {
            const res = await api.get('/auth/me');
            if (res.status === 200 && res.data) {
              setUser(res.data as User);
              await AsyncStorage.setItem(USER_KEY, JSON.stringify(res.data));
            } else {
              // token inválido
              await AsyncStorage.removeItem(TOKEN_KEY);
              await AsyncStorage.removeItem(USER_KEY);
              delete api.defaults.headers.common.Authorization;
              setToken(null);
              setUser(null);
            }
          } catch (err) {
            console.warn('Falha ao validar token em /auth/me — mantendo estado local se presente');
          }
        }
      } catch (err) {
        console.error('Erro ao restaurar credenciais:', err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const fetchWithAuth = async (path: string, options: FetchOptions = {}) => {
    const config: any = {
      url: path,
      method: options.method || 'GET',
      data: options.data,
      params: options.params,
      headers: options.headers || {},
    };
    return api.request(config);
  };

  const signIn = async (email: string, password: string): Promise<AuthResult> => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const data = res.data;

      if (!res || res.status >= 400) {
        return { ok: false, error: data?.error || 'Erro ao autenticar' };
      }

      const receivedToken = data.token as string;
      const receivedUser = data.user as User;

      await AsyncStorage.setItem(TOKEN_KEY, receivedToken);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(receivedUser));

      api.defaults.headers.common.Authorization = `Bearer ${receivedToken}`;

      setToken(receivedToken);
      setUser(receivedUser);

      router.replace('/(tabs)');

      return { ok: true };
    } catch (err: any) {
      console.error('signIn error', err);
      const message = err?.response?.data?.error || err.message || 'Erro ao autenticar';
      return { ok: false, error: message };
    }
  };

  const signUp = async (payload: {
    nome: string;
    email: string;
    password: string;
    nascimento?: string | null;
    telefone?: string | null;
    instagram_username?: string | null;
  }): Promise<AuthResult> => {
    try {
      const res = await api.post('/auth/register', payload);
      if (res.status >= 400) return { ok: false, error: res.data?.error || 'Erro ao cadastrar' };
      return { ok: true };
    } catch (err: any) {
      console.error('signUp error', err);
      const message = err?.response?.data?.error || err.message || 'Erro ao cadastrar';
      return { ok: false, error: message };
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
    } catch (err) {
      console.error('Erro ao limpar storage no signOut', err);
    } finally {
      setToken(null);
      setUser(null);
      if (api && api.defaults && api.defaults.headers && api.defaults.headers.common) {
        delete api.defaults.headers.common.Authorization;
      }
      router.replace('/login');
    }
  };

  const value: AuthContextData = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    signIn,
    signUp,
    signOut,
    fetchWithAuth,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = (): AuthContextData => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
};
