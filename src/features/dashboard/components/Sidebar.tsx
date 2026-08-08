import { Separator, Button } from "@heroui/react";
import {
  LayoutDashboard,
  Settings,
  LogOut,
  Users,
  Package,
  CreditCard,
  Tag,
  ShieldAlert,
  Building,
} from "lucide-react";
import { useLocation, Link } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";

export function Sidebar() {
  const location = useLocation();
  const { signOut, user, profile } = useAuth();
  const role = profile?.rol || 'cliente';

  const menuItems = [
    { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
    { path: "/clientes", label: "Clientes", icon: <Users size={20} /> },
    { path: "/productos", label: "Perfumes", icon: <Package size={20} /> },
    { path: "/categorias", label: "Categorías", icon: <Tag size={20} /> },
    { path: "/suscripciones", label: "Suscripciones", icon: <CreditCard size={20} /> },
  ];

  const adminItems = [
    { path: "/configuracion", label: "Configuración", icon: <Settings size={20} /> },
    ...(role === 'superadmin' ? [
      { path: "/superadmin", label: "Admins", icon: <ShieldAlert size={20} /> },
      { path: "/superadmin/empresas", label: "Empresas", icon: <Building size={20} /> },
      { path: "/superadmin/productos", label: "Prod. Globales", icon: <Package size={20} /> },
      { path: "/superadmin/suscripciones", label: "Lic. Globales", icon: <CreditCard size={20} /> }
    ] : []),
  ];

  return (
    <div className="w-64 h-screen border-r border-zinc-800 bg-zinc-950 flex flex-col p-4 fixed left-0 top-0 z-50 text-zinc-400 font-sans">
      <div className="px-2 mb-8 pt-2">
        <h1 className="text-sm font-black tracking-[0.3em] text-white opacity-90">
          Admin Dashboard
        </h1>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto space-y-6">
        <div>
          <p className="px-2 text-tiny font-bold text-zinc-500 uppercase tracking-widest mb-4">Menú Principal</p>
          <div className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-3 h-10 rounded-xl transition-all font-bold no-underline ${isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                    }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {(role === 'admin' || role === 'superadmin') && (
          <div>
            <p className="px-2 text-tiny font-bold text-zinc-500 uppercase tracking-widest mb-4">Administración</p>
            <div className="space-y-1">
              {adminItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 h-12 rounded-2xl transition-all font-bold no-underline ${isActive
                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                        : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                      }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer / Profile */}
      <div className="mt-auto pt-4 border-t border-zinc-800 flex flex-col gap-4">
        <div className="flex items-center gap-3 px-2 bg-zinc-900/50 p-3 rounded-2xl border border-zinc-800">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-black shadow-md border-2 border-zinc-800">
            {user?.email?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{user?.email?.split('@')[0]}</p>
            <p className="text-[10px] text-primary truncate uppercase font-black tracking-widest">{role}</p>
          </div>
        </div>

        <Button
          variant="flat"
          fullWidth
          onPress={signOut}
          className="rounded-2xl font-bold h-11 bg-zinc-900 text-zinc-400 hover:bg-danger/20 hover:text-danger border-none transition-all"
        >
          <LogOut size={18} />
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}
