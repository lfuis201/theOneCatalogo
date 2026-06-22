import { Outlet, Navigate } from "react-router-dom";
import { Sidebar } from "../../features/dashboard/components/Sidebar";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { Spinner } from "@heroui/react";
import { PageTransition } from "../components/PageTransition";

export function MainLayout() {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (profile && profile.rol !== 'admin') {
    return <Navigate to="/catalogo" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="ml-64 p-8 lg:p-12 min-h-screen overflow-x-hidden overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </div>
      </main>
    </div>
  );
}
