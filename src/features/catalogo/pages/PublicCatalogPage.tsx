import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Smartphone, 
  Search, 
  Shield, 
  Briefcase,
  Award,
  Check,
  CheckCircle
} from "lucide-react";
import { DUMMY_CATALOG } from "../data";
import { AppPromoSection } from "../components/AppPromoSection";
import { useAuth } from "../../auth";

// Add some extra fragrances matching the user's specific search queries for a perfect "Buscador Inteligente" experience
const EXTENDED_CATALOG = [
  ...DUMMY_CATALOG,
  {
    id: "8",
    name: "CLUB DE NUIT UNTOLD",
    brand: "Armaf",
    year: "2022",
    family: "ORIENTAL AMBARADA",
    volume: "105 ml",
    code: "#9042",
    notes: "azafrán, jazmín, madera de ámbar, resina de abeto, cedro",
    category: "Unisex",
    image: "/nanobanana.png",
    bgGradient: "from-[#7C3AED] via-[#9333EA] to-[#D946EF]"
  },
  {
    id: "9",
    name: "KHAMRAH",
    brand: "Lattafa",
    year: "2022",
    family: "ORIENTAL VAINILLA",
    volume: "100 ml",
    code: "#7721",
    notes: "canela, nuez moscada, bergamota, fechas, praliné, nardos, vainilla, haba tonka, mirra, benjuí, madera de akigala, madera de ámbar",
    category: "Unisex",
    image: "/nanobanana.png",
    bgGradient: "from-[#B45309] via-[#D97706] to-[#F59E0B]"
  },
  {
    id: "10",
    name: "YASMIN OUD",
    brand: "Al Haramain",
    year: "2021",
    family: "Nicho Árabe",
    volume: "100 ml",
    code: "#1298",
    notes: "oud, rosa de taif, azafrán, vainilla de Madagascar, almizcle",
    category: "Dama",
    image: "/nanobanana.png",
    bgGradient: "from-[#451A03] via-[#78350F] to-[#D4AF37]"
  }
];

export function PublicCatalogPage() {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  // Section scrolls
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // State for Smart Search
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("Todos");
  
  // State for Distributor Panel simulation
  const [licenses, setLicenses] = useState([
    { code: "THEONE-VIP-9821-X", active: true, user: "Juan Pérez" },
    { code: "THEONE-VIP-4509-A", active: true, user: "María G. López" },
    { code: "THEONE-VIP-1102-M", active: false, user: "Sin Asignar" },
    { code: "THEONE-VIP-6612-P", active: true, user: "Carlos Mendoza" },
  ]);
  const [newCodeGenerated, setNewCodeGenerated] = useState("");

  const handleGenerateLicense = () => {
    const rand = Math.floor(1000 + Math.random() * 9000);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const char = chars[Math.floor(Math.random() * chars.length)];
    const code = `THEONE-VIP-${rand}-${char}`;
    setLicenses([...licenses, { code, active: true, user: "Nuevo Vendedor" }]);
    setNewCodeGenerated(code);
    setTimeout(() => setNewCodeGenerated(""), 4000);
  };

  const toggleLicense = (index: number) => {
    const updated = [...licenses];
    updated[index].active = !updated[index].active;
    setLicenses(updated);
  };

  // State for Olfactory Guide (accordion)
  const [activeGuideTab, setActiveGuideTab] = useState<"notas" | "concentraciones">("notas");

  // State for Contact Form submission simulation
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    mensaje: ""
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.email) return;
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ nombre: "", email: "", telefono: "", mensaje: "" });
    }, 5000);
  };

  // Filtering products for the Smart Search
  const filteredProducts = EXTENDED_CATALOG.filter(prod => {
    const matchesSearch = 
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.family.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedCategoryFilter === "Todos") return matchesSearch;
    if (selectedCategoryFilter === "Árabes") {
      return matchesSearch && (
        prod.brand.toLowerCase().includes("armaf") || 
        prod.brand.toLowerCase().includes("lattafa") || 
        prod.brand.toLowerCase().includes("haramain") || 
        prod.family.toLowerCase().includes("árabe")
      );
    }
    return matchesSearch && prod.category.toLowerCase() === selectedCategoryFilter.toLowerCase();
  });

  return (
    <>

      {/* 2. SECCIÓN / PÁGINA: INICIO (HOME) */}
      <section className="relative w-full min-h-[calc(100vh-80px)] flex flex-col justify-center items-center px-6 py-20 overflow-hidden border-b border-black/5 bg-[#fafafa]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,40,0.04)_0%,transparent_60%)] pointer-events-none" />
        
        {/* Decorative background grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-[1000px] text-center space-y-8 z-10"
        >
          <span className="text-[11px] font-sans-clean font-bold tracking-[0.4em] uppercase text-[#C5A028] block">
            THE ONE • PLATAFORMA DE ALTA PERFUMERÍA
          </span>
          <h1 className="text-4xl sm:text-6xl md:text-8xl font-serif-elegant font-light tracking-tight text-black leading-[1.1]">
            La herramienta definitiva <br />
            para los profesionales de la <span className="italic text-gold font-normal">perfumería</span>.
          </h1>
          <h2 className="text-base sm:text-xl font-sans-clean font-light text-black/60 max-w-3xl mx-auto leading-relaxed">
            Eleva tus ventas con el catálogo más exclusivo y sofisticado del mercado. Diseñador, Árabes y Nicho en un solo lugar.
          </h2>

          <div className="pt-8 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Button 
              onPress={() => scrollToSection("catalogo-fisico")}
              className="bg-black text-white hover:bg-black/90 font-sans-clean font-black text-xs tracking-widest uppercase h-14 px-8 rounded-none transition-all shadow-lg shadow-black/10 w-full sm:w-auto"
            >
              Adquirir Catálogo Físico
            </Button>
            <Button 
              onPress={() => scrollToSection("aplicacion-digital")}
              className="bg-transparent text-black border border-black/20 hover:border-black hover:bg-black/5 font-sans-clean font-bold text-xs tracking-widest uppercase h-14 px-8 rounded-none transition-all w-full sm:w-auto"
            >
              Descargar la App
            </Button>
          </div>
        </motion.div>
      </section>

      {/* 3. SECCIÓN / PÁGINA: NOSOTROS */}
      <section id="nosotros" className="w-full max-w-[1200px] mx-auto px-6 py-24 border-b border-black/5 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8 text-left">
          <span className="text-[10px] font-sans-clean font-bold tracking-[0.25em] uppercase text-[#C5A028]">NOSOTROS</span>
          <h2 className="text-3xl md:text-5xl font-serif-elegant font-bold tracking-tight text-black">
            Excelencia Visual, <br />
            <span className="italic font-light text-gold">Pasión por las Fragancias</span>
          </h2>
          <div className="space-y-6 text-sm font-sans-clean font-light text-black/70 leading-relaxed">
            <p>
              En <strong className="text-black font-semibold">THE ONE</strong>, somos especialistas en el diseño, conceptualización y producción de herramientas de venta de alta gama para el sector de la perfumería. Nos dedicamos a crear catálogos exclusivos que sirven como el puente perfecto entre los distribuidores y sus clientes.
            </p>
            <p>
              Lo que nos distingue es nuestro compromiso inquebrantable con la calidad estético-visual: realizamos una selección meticulosa y un cuidado diseño de la imagen de cada frasco, asegurando que cada página ofrezca la más alta resolución, nitidez y fidelidad para capturar la esencia de cada fragancia. No solo hacemos catálogos; creamos una experiencia premium que prestigia y eleva tu negocio.
            </p>
          </div>
        </div>

        {/* Recruitment Block */}
        <div className="bg-white border border-black/5 p-8 md:p-12 relative overflow-hidden shadow-sm">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#C5A028]/5 rounded-bl-full pointer-events-none" />
          <div className="space-y-6 text-left">
            <span className="text-[10px] font-sans-clean font-bold tracking-[0.2em] uppercase text-[#C5A028] flex items-center gap-2">
              <Briefcase size={12} /> OPORTUNIDAD INDEPENDIENTE
            </span>
            <h3 className="text-2xl md:text-3xl font-serif-elegant font-bold text-black">
              Multiplica tus Ingresos
            </h3>
            <p className="text-xs md:text-sm font-sans-clean font-light text-black/60 leading-relaxed">
              Si te apasiona el mundo de las fragancias y buscas un modelo de negocio rentable, es momento de dar el siguiente paso. Conviértete en un consultor de perfumes independiente y comienza a generar ingresos extra respaldado por la herramienta de ventas más impactante y completa del mercado.
            </p>
            <div className="pt-4">
              <Button 
                onPress={() => scrollToSection("contacto")}
                className="bg-black text-white hover:bg-black/90 font-sans-clean font-bold text-xs tracking-widest uppercase h-12 px-6 rounded-none transition-all w-full sm:w-auto"
              >
                Quiero Iniciar Mi Negocio
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECCIÓN / PÁGINA: CATÁLOGO FÍSICO */}
      <section id="catalogo-fisico" className="w-full max-w-[1200px] mx-auto px-6 py-24 border-b border-black/5">
        <div className="text-center space-y-4 mb-16">
          <span className="text-[10px] font-sans-clean font-bold tracking-[0.25em] uppercase text-[#C5A028]">EDICIÓN 2026/27</span>
          <h2 className="text-3xl md:text-5xl font-serif-elegant font-bold tracking-tight text-black">Catálogo Físico THE ONE 2026/27</h2>
          <p className="text-lg font-serif-elegant italic font-light text-black/50">Una obra de arte impresa para tus ventas.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Spec details */}
          <div className="lg:col-span-7 space-y-8 text-left">
            <h3 className="text-xl font-sans-clean font-bold uppercase tracking-wider text-black border-b border-black/10 pb-4">
              Especificaciones Técnicas del Producto
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="text-xs font-sans-clean font-bold uppercase text-[#C5A028]">Contenido Exclusivo</h4>
                <p className="text-xs font-sans-clean font-light text-black/70 leading-relaxed">
                  Una selección de fragancias de Dama y Caballero que abarca las tendencias más exclusivas del mercado internacional.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-sans-clean font-bold uppercase text-[#C5A028]">Universos Olfativos</h4>
                <p className="text-xs font-sans-clean font-light text-black/70 leading-relaxed">
                  Categorías clasificadas meticulosamente en Diseñador, Árabes y Nicho.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-sans-clean font-bold uppercase text-[#C5A028]">Calidad de Producción</h4>
                <p className="text-xs font-sans-clean font-light text-black/70 leading-relaxed">
                  Edición limitada impresa de lujo con 240 páginas a todo color, utilizando materiales de la más alta calidad y acabados premium.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-sans-clean font-bold uppercase text-[#C5A028]">Mapeo Técnico Completo</h4>
                <p className="text-xs font-sans-clean font-light text-black/70 leading-relaxed">
                  Más de 2,370 fragancias detalladas con índice alfabético, notas (salida, corazón, fondo), familia, lanzamiento y recomendación experta.
                </p>
              </div>
            </div>

            <div className="bg-white border border-black/5 p-6 rounded-none space-y-3 shadow-sm">
              <h4 className="text-xs font-sans-clean font-bold uppercase text-black tracking-widest flex items-center gap-2">
                <Award size={14} className="text-[#C5A028]" /> Facilitador de Margen de Ganancia
              </h4>
              <p className="text-xs font-sans-clean font-light text-black/50 leading-relaxed">
                Incluye el precio máximo de referencia al público basado en tiendas departamentales autorizadas. Así tu cliente ve el valor real del producto y tú controlas el margen de ganancia exacto en cada venta.
              </p>
            </div>
          </div>

          {/* Investment Block */}
          <div className="lg:col-span-5 col-span-1">
            <div className="border border-[#C5A028] p-8 md:p-10 bg-white flex flex-col justify-between relative shadow-md">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-black text-[#C5A028] text-[9px] font-sans-clean font-black tracking-widest uppercase py-1 px-3">
                Edición Limitada
              </div>

              <div className="space-y-6 text-center lg:text-left">
                <span className="text-[10px] font-sans-clean font-bold tracking-[0.2em] text-[#C5A028] uppercase">INVERSIÓN</span>
                <div className="space-y-2">
                  <h3 className="text-xl font-serif-elegant font-bold text-black">Catálogo Impreso de Lujo</h3>
                  <p className="text-xs font-sans-clean font-light text-black/40">Adquiere tu herramienta de demostración física para ventas frente a frente.</p>
                </div>

                <div className="flex items-baseline justify-center lg:justify-start gap-1 py-4 border-y border-black/5">
                  <span className="text-5xl font-serif-elegant font-black text-black">$210.00</span>
                  <span className="text-sm font-sans-clean font-bold text-black/50">MXN / Unidad</span>
                </div>
              </div>

              <div className="pt-8">
                <Button 
                  onPress={() => scrollToSection("contacto")}
                  className="w-full bg-black text-white hover:bg-black/90 font-sans-clean font-black text-xs tracking-widest uppercase h-12 rounded-none transition-all"
                >
                  Comprar Catálogo Físico
                </Button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 5. SECCIÓN / PÁGINA: APLICACIÓN DIGITAL */}
      <section id="aplicacion-digital" className="w-full max-w-[1200px] mx-auto px-6 py-24 border-b border-black/5">
        <div className="text-center space-y-4 mb-16">
          <span className="text-[10px] font-sans-clean font-bold tracking-[0.25em] uppercase text-[#C5A028]">TECNOLOGÍA EN TU BOLSILLO</span>
          <h2 className="text-3xl md:text-5xl font-serif-elegant font-bold tracking-tight text-black">Catálogo Electrónico THE ONE</h2>
          <p className="text-sm font-sans-clean font-light text-black/50 max-w-2xl mx-auto leading-relaxed">
            Optimiza tus consultas y profesionaliza el servicio a tus clientes con nuestra aplicación móvil para Android. Planes de suscripción estructurados por edición anual (Ejemplo: 2026, 2027, 2028).
          </p>
        </div>

        {/* Mobile Mockup Promo Section */}
        <div className="mb-12">
          <AppPromoSection />
        </div>

        {/* Plans comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 max-w-5xl mx-auto">
          
          {/* Plan 1: Silver Collector */}
          <Card className="p-8 border border-black/10 rounded-none bg-white flex flex-col justify-between relative hover:border-[#C5A028]/50 transition-all duration-500 shadow-sm">
            <div className="space-y-6 text-left">
              <div>
                <span className="text-[9px] font-sans-clean font-bold tracking-widest text-[#a1a1a1] uppercase border border-black/20 px-2 py-0.5">PERFIL VENDEDOR</span>
                <h3 className="text-2xl font-serif-elegant font-bold text-black mt-3">Silver Collector</h3>
                <p className="text-xs font-sans-clean font-light text-black/50 mt-1">
                  Ideal para consultores independientes y vendedores que buscan una herramienta premium, ágil y profesional para cerrar ventas de cara al consumidor.
                </p>
              </div>

              <div className="h-[1px] bg-black/10 w-full"></div>

              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-xs font-sans-clean font-light text-black/70 leading-normal">
                  <CheckCircle size={14} className="text-[#C5A028] mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-black">Portabilidad:</strong> Uso completo de la aplicación tanto Online como Offline (sin necesidad de internet).
                  </div>
                </li>
                <li className="flex items-start gap-3 text-xs font-sans-clean font-light text-black/70 leading-normal">
                  <CheckCircle size={14} className="text-[#C5A028] mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-black">Fichas Técnicas:</strong> Consulta detallada de las 2,370+ fragancias y elaboración de fichas sin restricciones.
                  </div>
                </li>
                <li className="flex items-start gap-3 text-xs font-sans-clean font-light text-black/70 leading-normal">
                  <CheckCircle size={14} className="text-[#C5A028] mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-black">Herramienta de Envío:</strong> Comparte fichas técnicas de manera profesional directamente a tus clientes por medios digitales.
                  </div>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Button 
                onPress={() => scrollToSection("contacto")}
                className="w-full bg-white text-black border border-black/20 hover:bg-black/5 font-sans-clean font-bold text-xs tracking-widest uppercase h-12 rounded-none transition-all"
              >
                Adquirir Plan Silver
              </Button>
            </div>
          </Card>

          {/* Plan 2: VIP Gold Perfumer */}
          <Card className="p-8 border border-[#C5A028] rounded-none bg-white flex flex-col justify-between relative shadow-md">
            <div className="absolute top-0 right-8 -translate-y-1/2 bg-black text-[#C5A028] text-[9px] font-sans-clean font-black tracking-widest uppercase py-1 px-3">
              Recomendado Mayoristas
            </div>

            <div className="space-y-6 text-left">
              <div>
                <span className="text-[9px] font-sans-clean font-bold tracking-widest text-[#C5A028] uppercase border border-[#C5A028] px-2 py-0.5">PERFIL SOCIO-DISTRIBUIDOR</span>
                <h3 className="text-2xl font-serif-elegant font-bold text-black mt-3">VIP Gold Perfumer</h3>
                <p className="text-xs font-sans-clean font-light text-black/60 mt-1">
                  La solución definitiva para macro-distribuidores y mayoristas de perfumería que abastecen a su propia red de vendedores y automatizan sus pedidos a través de licencias digitales replicables.
                </p>
              </div>

              <div className="h-[1px] bg-black/10 w-full"></div>

              <ul className="space-y-4">
                <li className="flex items-start gap-3 text-xs font-sans-clean font-light text-black/70 leading-normal">
                  <CheckCircle size={14} className="text-[#C5A028] mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-black">Integración Comercial:</strong> Incluye todas las ventajas del plan Silver (Uso online/offline, consulta y envío de fichas ilimitadas).
                  </div>
                </li>
                <li className="flex items-start gap-3 text-xs font-sans-clean font-light text-black/70 leading-normal">
                  <CheckCircle size={14} className="text-[#C5A028] mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-black">Botón de WhatsApp Corporativo:</strong> Personalización de la app con los datos del mayorista. Cuando tus vendedores coticen, la app los redirigirá automáticamente a tu WhatsApp con el pedido pre-cargado.
                  </div>
                </li>
                <li className="flex items-start gap-3 text-xs font-sans-clean font-light text-black/70 leading-normal">
                  <CheckCircle size={14} className="text-[#C5A028] mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-black">Licenciamiento por Volumen:</strong> Adquiere paquetes de licencias digitales para tu red a un costo unitario escalonado.
                  </div>
                </li>
                <li className="flex items-start gap-3 text-xs font-sans-clean font-light text-black/70 leading-normal">
                  <CheckCircle size={14} className="text-[#C5A028] mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-black">Panel de Control de Red:</strong> Monitorea, activa o desactiva las licencias de tus vendedores desde tu perfil corporativo.
                  </div>
                </li>
              </ul>
            </div>

            <div className="pt-8">
              <Button 
                onPress={() => scrollToSection("contacto")}
                className="w-full bg-black text-white hover:bg-black/90 font-sans-clean font-black text-xs tracking-widest uppercase h-12 rounded-none transition-all"
              >
                Adquirir Licencia VIP Gold
              </Button>
            </div>
          </Card>

        </div>

        {/* INTERACTIVE BUSCADOR INTELIGENTE DEMO */}
        <div className="bg-white border border-black/5 p-8 max-w-4xl mx-auto rounded-none shadow-sm">
          <div className="space-y-2 mb-6 text-left">
            <span className="text-[9px] font-sans-clean font-bold tracking-widest text-[#C5A028] uppercase flex items-center gap-1.5">
              <Search size={10} /> DEMO EN VIVO
            </span>
            <h3 className="text-xl font-serif-elegant font-bold text-black">Buscador Inteligente</h3>
            <p className="text-xs font-sans-clean font-light text-black/50">
              Prueba cómo los vendedores buscan fragancias por ingredientes, notas y marcas en nuestra app. 
            </p>
          </div>

          {/* Quick filters */}
          <div className="flex flex-wrap gap-2 mb-4">
            <button 
              onClick={() => { setSearchQuery(""); setSelectedCategoryFilter("Todos"); }} 
              className={`px-3 py-1.5 text-[10px] font-sans-clean font-bold uppercase transition-all bg-transparent border-0 cursor-pointer ${selectedCategoryFilter === "Todos" && searchQuery === "" ? "bg-black text-white" : "bg-black/5 text-black/70 hover:bg-black/10"}`}
            >
              Todos
            </button>
            <button 
              onClick={() => { setSearchQuery("oud"); setSelectedCategoryFilter("Todos"); }} 
              className={`px-3 py-1.5 text-[10px] font-sans-clean font-bold uppercase transition-all bg-transparent border-0 cursor-pointer ${searchQuery.toLowerCase() === "oud" ? "bg-black text-white" : "bg-black/5 text-black/70 hover:bg-black/10"}`}
            >
              Oud y Vainilla
            </button>
            <button 
              onClick={() => { setSearchQuery("frescas"); setSelectedCategoryFilter("Todos"); }} 
              className={`px-3 py-1.5 text-[10px] font-sans-clean font-bold uppercase transition-all bg-transparent border-0 cursor-pointer ${searchQuery.toLowerCase() === "frescas" ? "bg-black text-white" : "bg-black/5 text-black/70 hover:bg-black/10"}`}
            >
              Fragancias Frescas
            </button>
            <button 
              onClick={() => { setSearchQuery(""); setSelectedCategoryFilter("Dama"); }} 
              className={`px-3 py-1.5 text-[10px] font-sans-clean font-bold uppercase transition-all bg-transparent border-0 cursor-pointer ${selectedCategoryFilter === "Dama" && searchQuery === "" ? "bg-black text-white" : "bg-black/5 text-black/70 hover:bg-black/10"}`}
            >
              Damas
            </button>
            <button 
              onClick={() => { setSearchQuery(""); setSelectedCategoryFilter("Caballero"); }} 
              className={`px-3 py-1.5 text-[10px] font-sans-clean font-bold uppercase transition-all bg-transparent border-0 cursor-pointer ${selectedCategoryFilter === "Caballero" && searchQuery === "" ? "bg-black text-white" : "bg-black/5 text-black/70 hover:bg-black/10"}`}
            >
              Caballeros
            </button>
            <button 
              onClick={() => { setSearchQuery(""); setSelectedCategoryFilter("Árabes"); }} 
              className={`px-3 py-1.5 text-[10px] font-sans-clean font-bold uppercase transition-all bg-transparent border-0 cursor-pointer ${selectedCategoryFilter === "Árabes" && searchQuery === "" ? "bg-black text-white" : "bg-black/5 text-black/70 hover:bg-black/10"}`}
            >
              Tendencia Árabe
            </button>
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-4 top-3.5 text-black/30" size={16} />
            <input 
              type="text" 
              placeholder="Busca por marca, notas (oud, bergamota, vainilla), familia olfativa..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/5 border border-black/10 focus:border-[#C5A028] rounded-none py-3 pl-12 pr-4 text-sm text-black font-sans-clean outline-none transition-colors"
            />
          </div>

          {/* Results grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto pr-2">
            <AnimatePresence>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((p) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-4 border border-black/5 bg-[#fafafa] hover:border-[#C5A028]/40 transition-all flex flex-col justify-between text-left"
                  >
                    <div className="space-y-2">
                      <div className="flex justify-between items-start">
                        <span className="text-[8px] font-sans-clean font-bold text-[#C5A028] uppercase tracking-wider">{p.family}</span>
                        <span className="text-[9px] font-sans-clean text-black/40">{p.year}</span>
                      </div>
                      <h4 className="text-sm font-sans-clean font-bold text-black leading-tight">{p.name}</h4>
                      <p className="text-[10px] font-sans-clean text-black/50">{p.brand} • {p.volume || "100 ml"}</p>
                      <div className="text-[10px] font-serif-elegant font-light text-black/70 italic leading-relaxed pt-1">
                        <strong>Notas:</strong> {p.notes}
                      </div>
                    </div>
                    <div className="mt-4 pt-2 border-t border-black/5 flex justify-between items-center text-[10px]">
                      <span className="text-black/40">Ref. Departamental:</span>
                      <strong className="text-black">$3,150 MXN</strong>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="col-span-full py-8 text-center text-xs font-sans-clean text-black/40">
                  Ningún perfume coincide con la búsqueda. Intenta con "oud", "vainilla", "canela" o "Armaf".
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </section>

      {/* 6. SECCIÓN / PÁGINA: DISTRIBUIDORES */}
      <section id="distribuidores" className="w-full max-w-[1200px] mx-auto px-6 py-24 border-b border-black/5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16">
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="text-[10px] font-sans-clean font-bold tracking-[0.25em] uppercase text-[#C5A028]">CANAL B2B / MAYORISTAS</span>
            <h2 className="text-3xl md:text-5xl font-serif-elegant font-bold tracking-tight text-black">¿Eres Distribuidor de Perfumes?</h2>
            <p className="text-sm md:text-base font-sans-clean font-light text-black/60 leading-relaxed">
              Equipa a toda tu red de vendedores con su propio catálogo digital. Adquiere paquetes de licencias a precio de mayoreo y recibe todos los pedidos directo en tu WhatsApp.
            </p>
            <p className="text-xs font-sans-clean text-black/45 border-l-2 border-[#C5A028] pl-4 italic">
              "Cada vendedor que use una de tus licencias verá tu información de contacto, asegurando que el 100% de las ventas regresen a ti."
            </p>
          </div>

          <div className="lg:col-span-5 bg-white border border-black/5 p-8 rounded-none space-y-6 text-left shadow-sm">
            <h3 className="text-xs font-sans-clean font-black tracking-widest text-[#C5A028] uppercase flex items-center gap-2">
              <Shield size={12} /> REQUISITOS COMERCIALES
            </h3>
            <p className="text-xs font-sans-clean font-light text-black/60 leading-relaxed">
              Para mantener la exclusividad y los estándares de nuestra red comercial, solicitamos cumplir con los siguientes requisitos mínimos indispensables para la activación de cuentas comerciales:
            </p>
            <ul className="space-y-3 text-xs font-sans-clean">
              <li className="flex items-center gap-2 text-black/80">
                <Check size={14} className="text-[#C5A028]" /> <strong>Infraestructura:</strong> Contar con tienda física establecida.
              </li>
              <li className="flex items-center gap-2 text-black/80">
                <Check size={14} className="text-[#C5A028]" /> <strong>Autenticidad:</strong> Comercializar estrictamente producto 100% original.
              </li>
            </ul>
            <p className="text-[11px] font-sans-clean font-light text-black/50 leading-relaxed">
              Si cumples con estos requisitos, comunícate ahora mismo con nosotros para recibir atención personalizada y conocer los beneficios por volumen.
            </p>
            <Button 
              onPress={() => scrollToSection("contacto")}
              className="w-full border border-black/20 bg-transparent text-black hover:bg-black hover:text-white font-sans-clean font-bold text-xs tracking-widest uppercase h-11 rounded-none transition-all"
            >
              Contactar Área de Distribución
            </Button>
          </div>
        </div>

        {/* Benefits Table */}
        <div className="mb-20 max-w-5xl mx-auto overflow-x-auto border border-black/10">
          <table className="w-full text-left border-collapse min-w-[600px]">
            <thead>
              <tr className="border-b border-black/10 bg-black/5">
                <th className="p-4 text-xs font-sans-clean font-bold tracking-widest uppercase text-black">Paquete de Licencias</th>
                <th className="p-4 text-xs font-sans-clean font-bold tracking-widest uppercase text-[#C5A028]">Beneficio Comercial</th>
                <th className="p-4 text-xs font-sans-clean font-bold tracking-widest uppercase text-black text-right">Costo por Licencia</th>
              </tr>
            </thead>
            <tbody className="text-xs font-sans-clean font-light">
              <tr className="border-b border-black/5 hover:bg-black/[0.01] transition-colors">
                <td className="p-4 text-black font-bold">Pack Emprendedor (10 a 49)</td>
                <td className="p-4 text-black/60">Ideal para redes de venta locales y pequeños consultores.</td>
                <td className="p-4 text-[#C5A028] font-bold text-right">Precio Base</td>
              </tr>
              <tr className="border-b border-black/5 hover:bg-black/[0.01] transition-colors">
                <td className="p-4 text-black font-bold">Pack Empresarial (50 a 199)</td>
                <td className="p-4 text-black/60">Para distribuidores regionales que coordinan grupos amplios.</td>
                <td className="p-4 text-[#C5A028] font-bold text-right">Descuento Especial</td>
              </tr>
              <tr className="hover:bg-black/[0.01] transition-colors">
                <td className="p-4 text-black font-bold">Pack Macro-Distribuidor (200+)</td>
                <td className="p-4 text-black/60">Máxima escala y control de mercado con privilegios VIP.</td>
                <td className="p-4 text-[#C5A028] font-bold text-right">Precio Mayorista VIP</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* INTERACTIVE DISTRIBUTOR PANEL MOCKUP */}
        <div className="bg-white border border-[#C5A028] p-8 max-w-4xl mx-auto rounded-none relative text-left shadow-sm">
          <div className="absolute top-0 right-6 -translate-y-1/2 bg-black text-[#C5A028] text-[9px] font-sans-clean font-black tracking-widest uppercase py-1 px-3">
            Socio VIP Gold Dashboard Demo
          </div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-black/10 pb-6">
            <div>
              <h3 className="text-lg font-serif-elegant font-bold text-black">Panel del Distribuidor</h3>
              <p className="text-xs font-sans-clean font-light text-black/50">Gestiona las licencias digitales activas para tu red de vendedores.</p>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-[#fafafa] p-3 text-center border border-black/5">
                <span className="text-[9px] block uppercase text-black/40 tracking-wider">Compradas</span>
                <strong className="text-sm text-black">150</strong>
              </div>
              <div className="bg-[#C5A028]/10 p-3 text-center border border-[#C5A028]/20">
                <span className="text-[9px] block uppercase text-[#C5A028] tracking-wider">Activas</span>
                <strong className="text-sm text-[#C5A028]">{licenses.filter(l => l.active).length}</strong>
              </div>
              <div className="bg-[#fafafa] p-3 text-center border border-black/5">
                <span className="text-[9px] block uppercase text-black/40 tracking-wider">Disponibles</span>
                <strong className="text-sm text-black">{150 - licenses.filter(l => l.active).length}</strong>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-sans-clean font-bold uppercase text-black">Lista de Accesos de Vendedores</h4>
              <Button 
                size="sm"
                onPress={handleGenerateLicense}
                className="bg-black text-[#C5A028] hover:bg-black/90 font-sans-clean font-black text-[10px] tracking-widest uppercase h-9 rounded-none"
              >
                Generar Enlace / Código
              </Button>
            </div>

            {newCodeGenerated && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-green-50 border border-green-300 text-green-800 text-xs font-sans-clean text-center"
              >
                ¡Código generado con éxito! Envíalo a tu vendedor: <strong>{newCodeGenerated}</strong>
              </motion.div>
            )}

            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-2">
              {licenses.map((lic, index) => (
                <div key={index} className="flex justify-between items-center p-3 border border-black/5 bg-[#fafafa]">
                  <div className="space-y-1">
                    <span className="text-xs font-sans-clean font-bold text-black block">{lic.code}</span>
                    <span className="text-[10px] font-sans-clean text-black/40">Asignado a: {lic.user}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-[9px] font-sans-clean font-bold uppercase py-0.5 px-2 ${lic.active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {lic.active ? "Activo" : "Inactivo"}
                    </span>
                    <button 
                      onClick={() => toggleLicense(index)}
                      className="text-[10px] font-sans-clean font-bold text-[#C5A028] hover:underline bg-transparent border-0 cursor-pointer"
                    >
                      {lic.active ? "Desactivar" : "Activar"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </section>

      {/* GUÍAS DE FAMILIAS OLFATIVAS (Educativo) */}
      <section className="w-full max-w-[1200px] mx-auto px-6 py-24 border-b border-black/5">
        <div className="text-center space-y-4 mb-16">
          <span className="text-[10px] font-sans-clean font-bold tracking-[0.25em] uppercase text-[#C5A028]">ACADEMIA DE PERFUMERÍA</span>
          <h2 className="text-3xl md:text-5xl font-serif-elegant font-bold tracking-tight text-black">Guías de Familias Olfativas</h2>
          <p className="text-sm font-sans-clean font-light text-black/50 max-w-xl mx-auto">
            Domina el lenguaje de la alta perfumería para educar a tus clientes y cerrar ventas con total autoridad técnica.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white border border-black/5 p-6 md:p-8 shadow-sm">
          <div className="flex border-b border-black/10 mb-8">
            <button 
              onClick={() => setActiveGuideTab("notas")}
              className={`flex-1 py-4 text-center font-sans-clean font-bold text-xs uppercase tracking-widest transition-colors bg-transparent border-0 cursor-pointer ${activeGuideTab === "notas" ? "text-[#C5A028] border-b-2 border-[#C5A028]" : "text-black/40 hover:text-black"}`}
            >
              Las Notas Olfativas (Pirámide)
            </button>
            <button 
              onClick={() => setActiveGuideTab("concentraciones")}
              className={`flex-1 py-4 text-center font-sans-clean font-bold text-xs uppercase tracking-widest transition-colors bg-transparent border-0 cursor-pointer ${activeGuideTab === "concentraciones" ? "text-[#C5A028] border-b-2 border-[#C5A028]" : "text-black/40 hover:text-black"}`}
            >
              EDP vs. Extrait de Parfum
            </button>
          </div>

          {activeGuideTab === "notas" ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
              <div className="p-5 border border-black/5 bg-[#fafafa] space-y-4">
                <span className="text-[#C5A028] text-2xl font-serif-elegant font-bold">01</span>
                <h4 className="text-sm font-sans-clean font-bold text-black uppercase tracking-wider">Notas de Salida (Cabeza)</h4>
                <p className="text-xs font-sans-clean font-light text-black/60 leading-relaxed">
                  Son el primer aroma que se percibe al aplicar la fragancia. Suelen ser ligeras, volátiles e intensas (como cítricos y hojas verdes). Duran de 10 a 30 minutos.
                </p>
              </div>

              <div className="p-5 border border-black/5 bg-[#fafafa] space-y-4">
                <span className="text-[#C5A028] text-2xl font-serif-elegant font-bold">02</span>
                <h4 className="text-sm font-sans-clean font-bold text-black uppercase tracking-wider">Notas de Corazón (Medio)</h4>
                <p className="text-xs font-sans-clean font-light text-black/60 leading-relaxed">
                  El alma de la fragancia. Definen la familia olfativa (flores, frutas, especias). Emergen cuando las notas de salida se disipan y duran de 2 a 4 horas.
                </p>
              </div>

              <div className="p-5 border border-black/5 bg-[#fafafa] space-y-4">
                <span className="text-[#C5A028] text-2xl font-serif-elegant font-bold">03</span>
                <h4 className="text-sm font-sans-clean font-bold text-black uppercase tracking-wider">Notas de Fondo (Base)</h4>
                <p className="text-xs font-sans-clean font-light text-black/60 leading-relaxed">
                  Dan profundidad y fijación al perfume. Compuestas por acordes ricos e intensos (maderas, ámbar, almizcle, vainilla). Comienzan a percibirse tras 2 horas y duran todo el día.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              <div className="p-6 border border-black/5 bg-[#fafafa] space-y-4">
                <h4 className="text-sm font-sans-clean font-bold text-black uppercase tracking-wider">Eau de Parfum (EDP)</h4>
                <div className="h-1 bg-black/10 w-full rounded-full">
                  <div className="h-1 bg-[#C5A028] rounded-full" style={{ width: "70%" }}></div>
                </div>
                <p className="text-[10px] text-black/40 uppercase">Concentración: 15% - 20% aceites esenciales</p>
                <p className="text-xs font-sans-clean font-light text-black/60 leading-relaxed">
                  Es el estándar de la perfumería fina. Ofrece una estela notable y una duración promedio de 6 a 8 horas. Ideal para uso diario o eventos nocturnos donde se busca destacar sin saturar.
                </p>
              </div>

              <div className="p-6 border border-black/5 bg-white space-y-4 shadow-sm">
                <h4 className="text-sm font-sans-clean font-bold text-[#C5A028] uppercase tracking-wider">Extrait de Parfum (Extracto)</h4>
                <div className="h-1 bg-black/10 w-full rounded-full">
                  <div className="h-1 bg-[#C5A028] rounded-full" style={{ width: "100%" }}></div>
                </div>
                <p className="text-[10px] text-[#C5A028] uppercase">Concentración: 20% - 40% aceites esenciales</p>
                <p className="text-xs font-sans-clean font-light text-black/60 leading-relaxed">
                  La máxima pureza en perfumería de nicho. Su fijación en piel es extraordinaria, superando a menudo las 12 horas. Se asienta cerca de la piel y proyecta elegancia con una evolución lenta y compleja.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 7. SECCIÓN / PÁGINA: CONTACTO */}
      <section id="contacto" className="w-full max-w-[800px] mx-auto px-6 py-24 border-b border-black/5">
        <div className="text-center space-y-4 mb-16">
          <span className="text-[10px] font-sans-clean font-bold tracking-[0.25em] uppercase text-[#C5A028]">CONTACTO</span>
          <h2 className="text-3xl md:text-5xl font-serif-elegant font-bold tracking-tight text-black">Ponte en Contacto con Nosotros</h2>
          <p className="text-sm font-sans-clean font-light text-black/50 leading-relaxed">
            Si necesitas más información sobre nuestros catálogos físicos o la suscripción de las aplicaciones, envíanos un correo o utiliza el formulario de abajo para ponernos en contacto a la brevedad.
          </p>
        </div>

        {formSubmitted ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 border border-[#C5A028] bg-white text-center space-y-4 shadow-sm"
          >
            <div className="w-12 h-12 rounded-full border border-green-500 mx-auto flex items-center justify-center text-green-500">
              <Check size={24} />
            </div>
            <h3 className="text-xl font-serif-elegant text-black">¡Mensaje Enviado Exitosamente!</h3>
            <p className="text-xs font-sans-clean font-light text-black/60 max-w-md mx-auto">
              Hemos recibido tus datos correctamente. Un ejecutivo de distribución de **THE ONE** se comunicará contigo a la brevedad vía correo o WhatsApp.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleFormSubmit} className="space-y-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-sans-clean font-bold uppercase text-black/50 tracking-wider">Nombre Completo</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ej. Juan Pérez López"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  className="w-full bg-white border border-black/10 focus:border-[#C5A028] rounded-none py-3 px-4 text-xs text-black outline-none transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-sans-clean font-bold uppercase text-black/50 tracking-wider">Correo Electrónico *</label>
                <input 
                  type="email" 
                  required
                  placeholder="ejemplo@correo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-white border border-black/10 focus:border-[#C5A028] rounded-none py-3 px-4 text-xs text-black outline-none transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-sans-clean font-bold uppercase text-black/50 tracking-wider">Número de Teléfono / WhatsApp</label>
              <input 
                type="tel" 
                placeholder="Ej. +52 55 1234 5678"
                value={formData.telefono}
                onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                className="w-full bg-white border border-black/10 focus:border-[#C5A028] rounded-none py-3 px-4 text-xs text-black outline-none transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-sans-clean font-bold uppercase text-black/50 tracking-wider">Mensaje</label>
              <textarea 
                rows={5}
                required
                placeholder="Escribe tu consulta aquí..."
                value={formData.mensaje}
                onChange={(e) => setFormData({ ...formData, mensaje: e.target.value })}
                className="w-full bg-white border border-black/10 focus:border-[#C5A028] rounded-none py-3 px-4 text-xs text-black outline-none transition-colors resize-none"
              />
            </div>

            <div className="pt-4">
              <Button 
                type="submit"
                className="w-full bg-black text-white hover:bg-black/90 font-sans-clean font-black text-xs tracking-widest uppercase h-12 rounded-none transition-all"
              >
                Enviar Formulario
              </Button>
            </div>
          </form>
        )}
      </section>

      {/* 8. PIE DE PÁGINA (FOOTER) */}
      <footer className="w-full bg-black text-white/40 py-16 border-t border-white/5 font-sans-clean">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 text-xs">
          
          <div className="space-y-4 text-left">
            <span className="text-white text-xl font-serif-elegant tracking-widest uppercase font-bold">
              THE<span className="text-gold">ONE</span>
            </span>
            <p className="leading-relaxed pr-6 text-[11px] font-sans-clean font-light text-white/30">
              Creamos las herramientas de venta impresas y digitales más sofisticadas y exactas del mercado latinoamericano. Conectando mayoristas con consultores independientes de alta perfumería.
            </p>
          </div>

          <div className="space-y-3 text-left">
            <h4 className="text-white font-bold tracking-widest uppercase mb-2 text-xs">Menú Principal</h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="block text-left hover:text-white transition-colors bg-transparent border-0 cursor-pointer">Inicio</button>
              <button onClick={() => scrollToSection("nosotros")} className="block text-left hover:text-white transition-colors bg-transparent border-0 cursor-pointer">Nosotros</button>
              <button onClick={() => scrollToSection("catalogo-fisico")} className="block text-left hover:text-white transition-colors bg-transparent border-0 cursor-pointer">Catálogo Físico</button>
              <button onClick={() => scrollToSection("aplicacion-digital")} className="block text-left hover:text-white transition-colors bg-transparent border-0 cursor-pointer">Aplicación Digital</button>
              <button onClick={() => scrollToSection("distribuidores")} className="block text-left hover:text-white transition-colors bg-transparent border-0 cursor-pointer">Distribuidores</button>
              <button onClick={() => scrollToSection("contacto")} className="block text-left hover:text-white transition-colors bg-transparent border-0 cursor-pointer">Contacto</button>
            </div>
          </div>

          <div className="space-y-4 text-[11px] text-left">
            <h4 className="text-white font-bold tracking-widest uppercase text-xs">Legales & Contacto</h4>
            <div className="space-y-2 text-white/30">
              <p>Aviso de Privacidad | Términos y Condiciones</p>
              <p>Soporte: info@theonecatalogo.com</p>
              <p>© 2026 THE ONE. Todos los derechos reservados.</p>
            </div>
          </div>

        </div>
      </footer>

    </>
  );
}
