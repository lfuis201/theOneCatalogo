import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { Heart, Upload, ChevronUp, ChevronDown, Plus, Minus } from "lucide-react";
import { DUMMY_CATALOG } from "../data";

export function PublicProductPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const product = DUMMY_CATALOG.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center">
        <h1 className="text-4xl font-light mb-4">Producto no encontrado</h1>
        <Button onPress={() => navigate("/catalogo")} className="bg-black text-white font-medium px-8 rounded-none">
          VOLVER AL CATÁLOGO
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen w-full flex flex-col bg-white text-black font-sans"
    >
      {/* Top Navbar / Header Simulation */}
      <header className="w-full border-b border-gray-200 sticky top-0 z-30 bg-white">
        {/* Main Nav area */}
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex-1">
            <span 
              onClick={() => navigate("/catalogo")}
              className="text-3xl font-serif tracking-widest uppercase font-bold cursor-pointer hover:opacity-80"
            >
              THEONE
            </span>
          </div>
          
          <div className="flex-1 flex justify-center">
            <div className="w-full max-w-lg bg-gray-50 flex items-center px-4 py-2 rounded-sm border border-gray-100">
              <span className="text-gray-400 mr-3 text-sm">⚲</span>
              <input 
                type="text" 
                placeholder="¿Qué deseas buscar?" 
                className="bg-transparent w-full outline-none text-sm font-light text-black placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="flex-1 flex justify-end items-center gap-6 text-xs tracking-wider">
            <button className="flex items-center gap-2 hover:text-gray-600 transition-colors">
              <span className="font-light">INICIAR SESIÓN</span>
            </button>
            <Heart size={20} className="font-light cursor-pointer hover:text-gray-600" />
            <span className="cursor-pointer hover:text-gray-600 relative">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </span>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="w-full flex justify-center items-center h-12 text-[11px] font-medium tracking-[0.1em] gap-8">
          <span className="cursor-pointer hover:underline underline-offset-4">DISEÑADORES</span>
          <span className="cursor-pointer hover:underline underline-offset-4">MUJER</span>
          <span className="cursor-pointer hover:underline underline-offset-4">HOMBRE</span>
          <span className="cursor-pointer hover:underline underline-offset-4 font-bold border-b border-black">BELLEZA</span>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-[1400px] mx-auto pt-6 px-6 pb-20">
        
        {/* Brand Name Center Top */}
        <div className="w-full text-center mb-10 mt-4">
          <h1 className="text-4xl font-serif uppercase tracking-widest text-gray-900">
            {product.brand}
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left Column: Image Gallery (thumbnails on left, main on right) */}
          <div className="flex-1 flex gap-6 lg:h-[700px]">
            {/* Thumbnails */}
            <div className="w-20 hidden md:flex flex-col gap-4 items-center">
              <ChevronUp size={20} className="text-gray-300 cursor-pointer hover:text-black mb-2" />
              
              {/* Fake thumbnails based on main image */}
              <div className="w-full aspect-square border-b-2 border-[#FFB81C] p-2 flex items-center justify-center cursor-pointer">
                <img src={product.image} className="w-full h-full object-contain" alt="thumb1" />
              </div>
              <div className="w-full aspect-square border border-transparent p-2 flex items-center justify-center cursor-pointer opacity-50 hover:opacity-100">
                <img src={product.image} className="w-full h-full object-contain grayscale" alt="thumb2" />
              </div>
              <div className="w-full aspect-square border border-transparent p-2 flex items-center justify-center cursor-pointer opacity-50 hover:opacity-100">
                <img src={product.image} className="w-full h-full object-cover grayscale" alt="thumb3" />
              </div>
            </div>

            {/* Main Image */}
            <div className="flex-1 bg-white flex items-center justify-center relative group">
              <div className="absolute top-0 right-0 flex gap-4 text-gray-400">
                <Upload size={20} className="cursor-pointer hover:text-black" />
              </div>
              <motion.img 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={product.image} 
                alt={product.name}
                className="w-[85%] h-[85%] object-contain drop-shadow-2xl mix-blend-multiply"
              />
            </div>
          </div>

          {/* Right Column: Details */}
          <div className="w-full lg:w-[400px] flex flex-col pt-4">
            
            <h2 className="text-2xl font-light text-gray-900 tracking-wide uppercase mb-2">
              {product.brand}
            </h2>
            
            <h3 className="text-sm font-light text-gray-600 mb-8 leading-relaxed">
              Perfume {product.name}, {product.volume} para {product.category}
            </h3>

            {/* Fake Price */}
            <div className="text-center w-full mb-2">
              <p className="text-xl font-medium tracking-wide">$3,990.00</p>
              <p className="text-[11px] text-gray-500 mt-1">Disponible</p>
            </div>

            {/* Gold Promotion text */}
            <div className="w-full text-center mb-6">
              <p className="text-xs font-bold text-[#D4AF37] tracking-widest uppercase">
                MSI + PAGA EN SEPTIEMBRE
              </p>
            </div>

            {/* Rating Stars Mock */}
            <div className="flex justify-center items-center gap-1 mb-8">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-gray-200 text-lg">★</span>
              ))}
              <span className="text-xs text-gray-500 ml-2">(0)</span>
            </div>

            <Button 
              className="w-full bg-black text-white rounded-none h-14 font-medium tracking-widest text-xs uppercase hover:bg-gray-800 mb-4"
            >
              Añadir a la bolsa
            </Button>

            <p className="text-[11px] text-gray-500 mb-8 pb-8 border-b border-gray-200">
              Envío gratis en compras superiores a $399.00 M.N.
            </p>

            {/* Accordions */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center cursor-pointer pb-4 border-b border-gray-200">
                <span className="text-xs font-medium tracking-widest uppercase text-gray-800 flex items-center gap-2">
                  <span className="w-4 h-3 border border-gray-800 rounded-sm inline-block"></span>
                  Promociones
                </span>
                <Plus size={16} className="text-gray-400" />
              </div>
              <div className="flex justify-between items-center cursor-pointer pb-4 border-b border-gray-200">
                <span className="text-xs font-medium tracking-widest uppercase text-gray-800 flex items-center gap-2">
                  Detalles del artículo
                </span>
                <Plus size={16} className="text-gray-400" />
              </div>
            </div>

          </div>

        </div>
      </div>
    </motion.div>
  );
}

