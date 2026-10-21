import { tokenManager } from "@/services/auth/tokenManager";
import { useEffect, type ReactNode } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export function SessionGuard({ children }: { children: ReactNode }) {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = tokenManager.on((event) => {
      if (event === "session:expired") {
        toast.error("Sua sessão expirou. Faça login novamente.");
        if (!location.pathname.startsWith("/login")) {
          navigate("/login", { replace: true });
        }
      }
    });
    return unsubscribe;
  }, [navigate]);

  return <>{children}</>;
}
