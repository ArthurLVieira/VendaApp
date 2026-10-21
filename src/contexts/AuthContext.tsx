import { Empresa } from "@/models/Empresa";
import { Role } from "@/models/Role";
import { Usuario, type RawUsuario } from "@/models/Usuario";
import { authRepository, registerRepository } from "@/services/api";
import { tokenManager } from "@/services/auth/tokenManager";
import type { LoginRequest, RegisterRequest } from "@/types/api";
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
    const boot = async () => {
      if (!tokenManager.isAuthenticated()) {
        setLoading(false);
        return;
      }

      const raw = tokenManager.getUser();
      if (raw) setUser(Usuario.fromRaw(raw));

      if (tokenManager.isExpiringSoon(0)) {
        try {
          await tokenManager.refresh();
          const refreshed = tokenManager.getUser();
          if (refreshed) setUser(Usuario.fromRaw(refreshed));
        } catch {
          tokenManager.clearSession();
          setUser(null);
        }
      }

      setLoading(false);
    };

    void boot();
  });

  useEffect(() => {
    const unsubscribe = tokenManager.on((event) => {
      if (event === "session:refreshed") {
        const raw = tokenManager.getUser();
        if (raw) setUser(Usuario.fromRaw(raw));
        else if (event === "session:refreshed") {
          setUser(null);
        }
      }
    });

    return unsubscribe;
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

      tokenManager.setSession(
        {
          accessToken: data.accessToken,
          refreshToken: data.refreshToken,
          expiresIn: data.expiresIn,
          data: rawUser,
        },
        Boolean(rememberMe),
      );

      setUser(Usuario.fromRaw(rawUser));
    },
    [],
  );

  const signUp = useCallback(async (payload: RegisterRequest) => {
    await registerRepository.register(payload);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await authRepository.logout();
    } catch {}

    tokenManager.clearSession();
    setUser(null);
  }, []);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      await tokenManager.refresh();
      const raw = tokenManager.getUser();
      if (raw) setUser(Usuario.fromRaw(raw));

      return true;
    } catch {
      tokenManager.clearSession();
      setUser(null);
      return false;
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, signIn, signUp, signOut, refreshSession }),
    [user, loading, signIn, signUp, signOut, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
