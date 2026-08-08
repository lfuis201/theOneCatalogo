import { useAuth } from "../../auth/hooks/useAuth";
import { Card, Separator, Button, Spinner } from "@heroui/react";
import { 
  ShieldCheck, 
  User as UserIcon, 
  Settings, 
  Building,
  Users,
  CreditCard,
  DollarSign,
  Package,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGlobalStats } from "../../superadmin/hooks/useGlobalStats";

export function Dashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const role = profile?.rol || 'cliente';

  const { stats, isLoading } = useGlobalStats();

  if (role === 'superadmin') {
    if (isLoading) {
      return (
        <div className="h-[400px] w-full flex flex-col items-center justify-center gap-4">
          <Spinner size="lg" color="primary" />
          <p className="text-primary/70 font-semibold animate-pulse">Cargando métricas de plataforma...</p>
        </div>
      );
    }

    return (
      <div className="space-y-8 animate-in fade-in duration-500 font-sans">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1">
            <h2 className="text-sm font-bold text-primary uppercase tracking-widest">Plataforma SaaS Central</h2>
            <h1 className="text-4xl font-black tracking-tight text-default-900">
              Hola, <span className="text-primary">{profile?.nombre || user?.email?.split('@')[0]}</span> (Superadmin)
            </h1>
          </div>
          <div className="flex items-center gap-3 bg-white p-2 px-4 rounded-2xl shadow-sm border border-default-100">
            <div className="p-2 bg-primary/10 text-primary rounded-full">
              <ShieldCheck size={18} />
            </div>
            <span className="text-sm font-bold text-default-600 uppercase tracking-wider">Superadministrador</span>
          </div>
        </header>

        <Separator className="bg-default-200/50" />

        {/* Global SaaS Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6 border-none shadow-xl shadow-primary/5 rounded-[2rem] bg-white flex flex-row items-center justify-between">
            <div>
              <p className="text-xs font-bold text-default-400 uppercase tracking-wider mb-1">MRR Recurrente</p>
              <p className="text-2xl font-black text-default-900">${stats?.mrrEstimado.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-primary/10 rounded-2xl text-primary">
              <DollarSign size={24} />
            </div>
          </Card>

          <Card className="p-6 border-none shadow-xl shadow-primary/5 rounded-[2rem] bg-white flex flex-row items-center justify-between">
            <div>
              <p className="text-xs font-bold text-default-400 uppercase tracking-wider mb-1">Licencias Activas</p>
              <p className="text-2xl font-black text-success">{stats?.totalSuscripcionesActivas}</p>
            </div>
            <div className="p-4 bg-success/10 rounded-2xl text-success">
              <CreditCard size={24} />
            </div>
          </Card>

          <Card className="p-6 border-none shadow-xl shadow-primary/5 rounded-[2rem] bg-white flex flex-row items-center justify-between">
            <div>
              <p className="text-xs font-bold text-default-400 uppercase tracking-wider mb-1">Administradores</p>
              <p className="text-2xl font-black text-default-900">{stats?.totalAdmins}</p>
              <p className="text-[10px] text-default-400 mt-1">{stats?.adminsActivos} Activos / {stats?.adminsInactivos} Inactivos</p>
            </div>
            <div className="p-4 bg-blue-100 rounded-2xl text-blue-600">
              <Users size={24} />
            </div>
          </Card>

          <Card className="p-6 border-none shadow-xl shadow-primary/5 rounded-[2rem] bg-white flex flex-row items-center justify-between">
            <div>
              <p className="text-xs font-bold text-default-400 uppercase tracking-wider mb-1">Empresas (Tenants)</p>
              <p className="text-2xl font-black text-default-900">{stats?.totalEmpresas}</p>
            </div>
            <div className="p-4 bg-purple-100 rounded-2xl text-purple-600">
              <Building size={24} />
            </div>
          </Card>
        </div>

        {/* Quick Access Grid */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-default-800">Accesos Directos de Administración</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 border-none shadow-lg hover:shadow-xl transition-all cursor-pointer rounded-2xl bg-white" onPress={() => navigate('/superadmin')}>
              <div className="p-3 bg-primary/10 text-primary w-fit rounded-xl mb-4">
                <Users size={20} />
              </div>
              <h4 className="font-bold text-default-800 mb-1">Gestionar Admins</h4>
              <p className="text-xs text-default-500">Crea, edita y ajusta límites de licencias de administradores.</p>
            </Card>

            <Card className="p-6 border-none shadow-lg hover:shadow-xl transition-all cursor-pointer rounded-2xl bg-white" onPress={() => navigate('/superadmin/empresas')}>
              <div className="p-3 bg-purple-100 text-purple-600 w-fit rounded-xl mb-4">
                <Building size={20} />
              </div>
              <h4 className="font-bold text-default-800 mb-1">Gestionar Empresas</h4>
              <p className="text-xs text-default-500">Administra las marcas y tiendas registradas en la app.</p>
            </Card>

            <Card className="p-6 border-none shadow-lg hover:shadow-xl transition-all cursor-pointer rounded-2xl bg-white" onPress={() => navigate('/superadmin/suscripciones')}>
              <div className="p-3 bg-success/10 text-success w-fit rounded-xl mb-4">
                <CreditCard size={20} />
              </div>
              <h4 className="font-bold text-default-800 mb-1">Suscripciones Globales</h4>
              <p className="text-xs text-default-500">Supervisa las licencias activas y los cobros del sistema.</p>
            </Card>

            <Card className="p-6 border-none shadow-lg hover:shadow-xl transition-all cursor-pointer rounded-2xl bg-white" onPress={() => navigate('/superadmin/productos')}>
              <div className="p-3 bg-blue-100 text-blue-600 w-fit rounded-xl mb-4">
                <Package size={20} />
              </div>
              <h4 className="font-bold text-default-800 mb-1">Catálogo Global</h4>
              <p className="text-xs text-default-500">Monitorea y supervisa los productos que se suben a la plataforma.</p>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Encabezado Dinámico */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-sm font-bold text-primary uppercase tracking-widest">Bienvenido de nuevo</h2>
          <h1 className="text-4xl font-black tracking-tight text-default-900">
            Hola, <span className="text-primary">{user?.email?.split('@')[0]}</span>
          </h1>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 px-4 rounded-2xl shadow-sm border border-default-100">
          <div className="p-2 bg-success-50 text-success rounded-full">
            <ShieldCheck size={18} />
          </div>
          <span className="text-sm font-bold text-default-600 uppercase tracking-wider">{role}</span>
        </div>
      </header>

      <Separator className="bg-default-200/50" />

      {/* Tarjetas de Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-none shadow-xl shadow-primary/5 rounded-[2rem] bg-white">
          <div className="flex gap-4 items-center">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
              <UserIcon size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-default-400 uppercase tracking-wider">Perfil</p>
              <p className="text-lg font-black text-default-800">{profile?.nombre || 'Usuario'}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-none shadow-xl shadow-orange-500/5 rounded-[2rem] bg-white">
          <div className="flex gap-4 items-center">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
              <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-default-400 uppercase tracking-wider">Estado</p>
              <p className="text-lg font-black text-default-800">Activo</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-none shadow-xl shadow-orange-500/5 rounded-[2rem] bg-white">
          <div className="flex gap-4 items-center">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
              <Settings size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-default-400 uppercase tracking-wider">Configuración</p>
              <p className="text-lg font-black text-default-800">Completada</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sección de Privilegios */}
        <Card className="border-none shadow-xl shadow-primary/5 rounded-[2.5rem] bg-white overflow-hidden">
          <div className="p-8 bg-primary/5 flex items-center gap-3">
            <div className="p-2 bg-primary text-white rounded-lg">
              <ShieldCheck size={20} />
            </div>
            <h3 className="text-xl font-bold">Mis Privilegios</h3>
          </div>
          <div className="p-8 space-y-6">
            <div className="p-5 bg-default-50 rounded-2xl border border-default-100">
              <p className="font-bold text-default-700 mb-1">Estado de la cuenta</p>
              <p className="text-sm text-default-500 leading-relaxed">
                Tu cuenta está activa con el rol de <b className="text-primary uppercase tracking-tighter">{role}</b>. 
                Tienes acceso a las herramientas de gestión y visualización de datos en tiempo real.
              </p>
            </div>
            
            {role === 'admin' && (
              <Button fullWidth className="bg-primary text-white font-bold h-12 rounded-2xl shadow-lg shadow-primary/20">
                <Settings size={18} />
                Configuración de Sistema
              </Button>
            )}
          </div>
        </Card>

        {/* Mensaje de Bienvenida */}
        <div className="space-y-6">
          <h3 className="text-xl font-bold px-2 text-default-800">Próximos Pasos</h3>
          <Card className="p-8 border-none shadow-xl shadow-orange-500/5 rounded-[2.5rem] bg-white">
            <p className="text-default-600 leading-relaxed">
              Bienvenido a tu nuevo panel de control. Desde aquí podrás gestionar todas las funciones de tu aplicación. 
              Utiliza el menú lateral para navegar entre las diferentes secciones.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
