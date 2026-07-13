import { useNavigate, useLocation } from "react-router-dom";
import { Button, Dropdown, Label } from "@heroui/react";
import { useAuth } from "../../features/auth";
import { User, LogIn, UserPlus, Shield, LogOut, CreditCard } from "lucide-react";

export function PublicHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, profile, signOut } = useAuth();

  const handleNavClick = (sectionId: string) => {
    if (location.pathname === "/") {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate(`/?scroll=${sectionId}`);
    }
  };

  return (
    <header className="w-full border-b border-black/10 sticky top-0 z-50 bg-[#fafafa]/90 backdrop-blur-md">
      <div className="max-w-[1200px] mx-auto px-6 h-20 flex items-center justify-between">
        <div 
          onClick={() => {
            if (location.pathname === "/") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              navigate("/");
            }
          }}
          className="flex items-center cursor-pointer group"
        >
          <span className="text-2xl font-serif-elegant tracking-[0.25em] uppercase font-bold text-black group-hover:text-[#C5A028] transition-colors duration-300">
            THE<span className="text-gold font-black">ONE</span>
          </span>
        </div>

        <nav className="hidden lg:flex items-center gap-8 text-[11px] font-sans-clean font-bold tracking-[0.2em] uppercase">
          <button onClick={() => {
            if (location.pathname === "/") {
              window.scrollTo({ top: 0, behavior: "smooth" });
            } else {
              navigate("/");
            }
          }} className={`hover:text-[#C5A028] transition-colors bg-transparent border-0 cursor-pointer ${location.pathname === "/" && !location.search ? 'text-[#C5A028]' : 'text-black/70'}`}>Inicio</button>
          <button onClick={() => handleNavClick("nosotros")} className="hover:text-[#C5A028] text-black/70 transition-colors text-left bg-transparent border-0 cursor-pointer">Nosotros</button>
          <button onClick={() => handleNavClick("catalogo-fisico")} className="hover:text-[#C5A028] text-black/70 transition-colors text-left bg-transparent border-0 cursor-pointer">Catálogo Físico</button>
          <button onClick={() => handleNavClick("aplicacion-digital")} className="hover:text-[#C5A028] text-black/70 transition-colors text-left bg-transparent border-0 cursor-pointer">Aplicación Digital</button>
          <button onClick={() => handleNavClick("distribuidores")} className="hover:text-[#C5A028] text-black/70 transition-colors text-left bg-transparent border-0 cursor-pointer">Distribuidores</button>
          <button onClick={() => navigate("/planes")} className={`hover:text-[#C5A028] transition-colors text-left bg-transparent border-0 cursor-pointer ${location.pathname === "/planes" ? 'text-[#C5A028]' : 'text-black/70'}`}>Planes</button>
          <button onClick={() => handleNavClick("contacto")} className="hover:text-[#C5A028] text-black/70 transition-colors text-left bg-transparent border-0 cursor-pointer">Contacto</button>
        </nav>

        <div className="flex gap-4 items-center">
          <Dropdown>
            <Button 
              isIconOnly
              variant="light"
              className="rounded-full text-black hover:text-[#C5A028] hover:bg-black/5 min-w-10 w-10 h-10"
              aria-label={user ? user.email : "Menú de usuario"}
            >
              <User size={18} className="pointer-events-none" />
            </Button>
            <Dropdown.Popover className="rounded-none border border-black/10 bg-[#fafafa]">
              <Dropdown.Menu 
                onAction={async (key) => {
                  const actionKey = String(key);
                  if (actionKey === "profile") navigate("/perfil");
                  else if (actionKey === "admin-panel") navigate("/dashboard");
                  else if (actionKey === "logout") {
                    await signOut();
                    navigate("/");
                  }
                  else if (actionKey === "login") navigate("/login");
                  else if (actionKey === "register") navigate("/register");
                }}
              >
                {user ? (
                  <>
                    <Dropdown.Item id="profile" key="profile" textValue="Mi Cuenta">
                      <Label className="pointer-events-none font-sans-clean text-xs font-bold uppercase tracking-wider text-black flex items-center gap-2 py-1">
                        <CreditCard size={14} className="pointer-events-none" /> Mi Cuenta
                      </Label>
                    </Dropdown.Item>
                    {profile?.rol === "admin" && (
                      <Dropdown.Item id="admin-panel" key="admin-panel" textValue="Panel de Control">
                        <Label className="pointer-events-none font-sans-clean text-xs font-bold uppercase tracking-wider text-black flex items-center gap-2 py-1">
                          <Shield size={14} className="pointer-events-none" /> Panel de Control
                        </Label>
                      </Dropdown.Item>
                    )}
                    <Dropdown.Item id="logout" key="logout" textValue="Salir" variant="danger">
                      <Label className="pointer-events-none font-sans-clean text-xs font-bold uppercase tracking-wider text-red-500 flex items-center gap-2 py-1">
                        <LogOut size={14} className="text-red-500 pointer-events-none" /> Salir
                      </Label>
                    </Dropdown.Item>
                  </>
                ) : (
                  <>
                    <Dropdown.Item id="login" key="login" textValue="Iniciar Sesión">
                      <Label className="pointer-events-none font-sans-clean text-xs font-bold uppercase tracking-wider text-black flex items-center gap-2 py-1">
                        <LogIn size={14} className="pointer-events-none" /> Iniciar Sesión
                      </Label>
                    </Dropdown.Item>
                    <Dropdown.Item id="register" key="register" textValue="Registrarse">
                      <Label className="pointer-events-none font-sans-clean text-xs font-bold uppercase tracking-wider text-black flex items-center gap-2 py-1">
                        <UserPlus size={14} className="pointer-events-none" /> Registrarse
                      </Label>
                    </Dropdown.Item>
                  </>
                )}
              </Dropdown.Menu>
            </Dropdown.Popover>
          </Dropdown>

          <Button 
            onPress={() => handleNavClick("distribuidores")}
            className="border border-[#C5A028]/40 text-[#C5A028] hover:bg-[#C5A028] hover:text-white bg-transparent font-sans-clean font-bold text-[9px] tracking-widest uppercase h-9 rounded-none transition-all px-4"
          >
            Canal B2B
          </Button>
        </div>
      </div>
    </header>
  );
}
