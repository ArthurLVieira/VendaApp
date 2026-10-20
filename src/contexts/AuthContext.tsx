import { Empresa } from "@/models/Empresa";
import { Role } from "@/models/Role";
import { Usuario, type RawUsuario } from "@/models/Usuario";
import {
  authRepository,
  REFRESH_KEY,
  registerRepository,
  TOKEN_KEY,
  USER_KEY,
} from "@/services/api";
import type { LoginRequest, RegisterRequest } from "@/types/api";
import { Storage } from "@/utils/storage";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface SignInPayload extends LoginRequest {
  rememberMe?: boolean;
}

interface AuthContextValue {
  user: Usuario | null;
  loading: boolean;
  signIn: (payload: SignInPayload) => Promise<void>;
  signUp: (payload: RegisterRequest) => Promise<void>;
  signOut: () => Promise<void>;
  refreshSession: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Storage.get<string>(TOKEN_KEY);
    const rawUser = Storage.get<RawUsuario>(USER_KEY);

    if (token && rawUser) setUser(Usuario.fromRaw(rawUser));
    setLoading(false);
  }, []);

  const signIn = useCallback(
    async ({ rememberMe, ...credentials }: SignInPayload) => {
      const data = await authRepository.login(credentials);
      const rawUser: RawUsuario = {
        email: data.data.email,
        nome: data.data.nome,
        ativo: data.data.ativo,
        roles: Role.fromRawList(data.data.roles),
        empresa: Empresa.fromRaw(data.data.empresa),
      };
      console.log("📤 Enviando para API:", rawUser);

      Storage.setRemembered(Boolean(rememberMe));
      Storage.set(TOKEN_KEY, data.accessToken);
      Storage.set(REFRESH_KEY, data.refreshToken);
      Storage.set(USER_KEY, data.data);
      setUser(Usuario.fromRaw(rawUser));
    },
    [],
  );

  const signUp = useCallback(async (payload: RegisterRequest) => {
    await registerRepository.register(payload);
  }, []);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    const refreshToken = Storage.get<string>(REFRESH_KEY);

    if (!refreshToken) return false;

    try {
      const data = await authRepository.refresh({ refreshToken });
      Storage.set(TOKEN_KEY, data.accessToken);
      Storage.set(REFRESH_KEY, data.refreshToken);
      Storage.set(USER_KEY, data.data);
      setUser(Usuario.fromRaw(data.data));

      return true;
    } catch {
      Storage.clearAuth();
      setUser(null);
      return false;
    }
  }, []);

  const signOut = useCallback(async () => {
    try {
      await authRepository.logout();
    } catch {}

    Storage.clearAuth();
    Storage.setRemembered(false);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, signIn, signUp, signOut, refreshSession }),
    [user, loading, signIn, signUp, signOut, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
