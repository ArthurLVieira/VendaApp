import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import { Toaster } from "react-hot-toast";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { Suspense } from "react";
import { FullPageSpinner } from "@/components/ui/FullPageSpinner";
import Dashboard from "@/pages/Dashboard";
import ClientesPage from "@/pages/clientes/ClientesPage";
import { useSessionHeartbeat } from "@/hooks/useSessionHeartbeat";
import { SessionGuard } from "@/components/layout/SessionGuard";
import { useSessionWarning } from "@/hooks/useSessionWarning";
import { SessionWarningModal } from "@/components/session/SessionWarningModal";
import { SessionFloatingBadge } from "@/components/session/SessionFloatingBadge";
import { RouteErrorBoundary } from "@/components/layout/RouteErrorBoundary";
import ProdutosPage from "@/pages/produtos/ProdutosPage";

function AppInner() {
  useSessionHeartbeat();
  const session = useSessionWarning();

  return (
    <SessionGuard>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/clientes"
          element={
            <ProtectedRoute>
              <ClientesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/produtos"
          element={
            <ProtectedRoute>
              <ProdutosPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {session.isWarning &&
        session.modalOpen &&
        session.remainingMs !== null && (
          <SessionWarningModal
            open={session.modalOpen}
            remainingMs={session.remainingMs}
            refreshing={session.refreshing}
            onContinue={session.refresh}
            onLogout={session.logout}
            onMinimize={session.minimize}
          />
        )}

      {session.floatingVisible && session.remainingMs !== null && (
        <SessionFloatingBadge
          remainingMs={session.remainingMs}
          onClick={session.expand}
        />
      )}
    </SessionGuard>
  );
}

export default function MainRouter() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          className: "dark:bg-neutral-800 dark:text-neutral-100",
        }}
      />
      <Suspense fallback={<FullPageSpinner message="Carregando..." />}>
        <RouteErrorBoundary>
          <AppInner />
        </RouteErrorBoundary>
      </Suspense>
    </BrowserRouter>
  );
}
