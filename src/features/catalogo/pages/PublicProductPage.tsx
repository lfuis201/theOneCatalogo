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
    <div className="flex-1 w-full max-w-[1400px] mx-auto pt-10 px-6 pb-20">
        
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
  );
}

