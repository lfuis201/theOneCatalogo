import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth';
import { AuthPage } from '../features/auth/pages/AuthPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { Dashboard } from '../features/dashboard';
import { ClientesPage } from '../features/clientes';
import { ProductosPage } from '../features/productos';
import { SuscripcionesPage } from '../features/suscripciones';
import { PublicCatalogPage, PublicProductPage, PublicBlogPostPage, PublicPlansPage, PublicProfilePage } from '../features/catalogo';
import { CategoriasPage } from '../features/categorias';
import { MainLayout } from '../shared/layouts/MainLayout';
import { PublicLayout } from '../shared/layouts/PublicLayout';
import { AnimatePresence, motion } from 'framer-motion';
import { PageTransition } from '../shared/components/PageTransition';
import { AdminsPage, EmpresasPage, ProductosGlobalesPage, SuscripcionesGlobalesPage, PlanesConfigPage } from '../features/superadmin';
import { PerfilPage } from '../features/perfil/pages/PerfilPage';

export function AppRouter() {
  const { user, loading } = useAuth();
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      {loading ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-screen w-full flex items-center justify-center bg-background"
        >
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            <p className="text-primary/70 font-medium animate-pulse">Iniciando catálogo...</p>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen w-full"
        >
          <Routes location={location}>
            {/* Public routes wrapped in PublicLayout */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={
                <PageTransition>
                  <PublicCatalogPage />
                </PageTransition>
              } />
              <Route path="/catalogo" element={<Navigate to="/" replace />} />
              <Route path="/catalogo/:id" element={
                <PageTransition>
                  <PublicProductPage />
                </PageTransition>
              } />
              <Route path="/blog/:id" element={
                <PageTransition>
                  <PublicBlogPostPage />
                </PageTransition>
              } />
              <Route path="/planes" element={
                <PageTransition>
                  <PublicPlansPage />
                </PageTransition>
              } />
              <Route path="/perfil" element={
                <PageTransition>
                  <PublicProfilePage />
                </PageTransition>
              } />
            </Route>

            {/* Admin Login Route */}
            <Route path="/login" element={
              <PageTransition>
                <AuthPage />
              </PageTransition>
            } />
            <Route path="/register" element={
              <PageTransition>
                <RegisterPage />
              </PageTransition>
            } />

            {/* Private Routes */}
            <Route element={<MainLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/clientes" element={<ClientesPage />} />
              <Route path="/productos" element={<ProductosPage />} />
              <Route path="/categorias" element={<CategoriasPage />} />
              <Route path="/suscripciones" element={<SuscripcionesPage />} />
              <Route path="/configuracion" element={<PerfilPage />} />
              <Route path="/superadmin" element={<AdminsPage />} />
              <Route path="/superadmin/empresas" element={<EmpresasPage />} />
              <Route path="/superadmin/productos" element={<ProductosGlobalesPage />} />
              <Route path="/superadmin/suscripciones" element={<SuscripcionesGlobalesPage />} />
              <Route path="/superadmin/planes" element={<PlanesConfigPage />} />
            </Route>

            {/* Fallback to Root */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
