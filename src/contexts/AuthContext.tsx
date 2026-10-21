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
  useRef,
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
  const [user, setUser] = useState<Usuario | null>(() => {
    const raw = tokenManager.getUser();
    return raw ? Usuario.fromRaw(raw) : null;
  });

  const [loading, setLoading] = useState<boolean>(() =>
    tokenManager.isAuthenticated(),
  );

  const lastRawJsonRef = useRef<string | null>(null);

  const applyRawUser = useCallback((raw: RawUsuario | null) => {
    const json = raw ? JSON.stringify(raw) : null;
    if (json === lastRawJsonRef.current) return;
    lastRawJsonRef.current = json;
    setUser(raw ? Usuario.fromRaw(raw) : null);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const boot = async () => {
      try {
        if (!tokenManager.isAuthenticated()) {
          if (!cancelled) setLoading(false);
          return;
        }

        if (tokenManager.isExpiringSoon(0)) {
          try {
            await tokenManager.refresh();
          } catch {
            tokenManager.clearSession();
          }
        }

        if (!cancelled) applyRawUser(tokenManager.getUser());
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void boot();
    return () => {
      cancelled = true;
    };
  }, [applyRawUser]);

  useEffect(() => {
    const unsubscribe = tokenManager.on((event) => {
      if (event === "session:refreshed") {
        applyRawUser(tokenManager.getUser());
      } else if (event === "session:expired") {
        lastRawJsonRef.current = null;
        setUser(null);
      }
    });
    return () => {
      unsubscribe();
    };
  }, [applyRawUser]);

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

      lastRawJsonRef.current = null;
      applyRawUser(rawUser);
    },
    [applyRawUser],
  );

  const signUp = useCallback(async (payload: RegisterRequest) => {
    await registerRepository.register(payload);
  }, []);

  const signOut = useCallback(async () => {
    try {
      await authRepository.logout();
    } catch {}

    tokenManager.clearSession();
    lastRawJsonRef.current = null;
    setUser(null);
  }, []);

  const refreshSession = useCallback(async (): Promise<boolean> => {
    try {
      await tokenManager.refresh();
      applyRawUser(tokenManager.getUser());

      return true;
    } catch {
      tokenManager.clearSession();
      lastRawJsonRef.current = null;
      setUser(null);
      return false;
    }
  }, [applyRawUser]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, loading, signIn, signUp, signOut, refreshSession }),
    [user, loading, signIn, signUp, signOut, refreshSession],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
