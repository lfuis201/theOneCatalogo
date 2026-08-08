import { Modal, Button } from "@heroui/react";
import { Package, Droplet, Star, Tag, Calendar, FlaskConical, DollarSign, Eye, ShieldAlert, Hash } from "lucide-react";
import type { Producto } from "../types";

interface ProductoFichaModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  producto: Producto | null;
}

export function ProductoFichaModal({ isOpen, onOpenChange, producto }: ProductoFichaModalProps) {
  if (!producto) return null;

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-[700px] bg-background border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
          <Modal.CloseTrigger />
          <div className="flex flex-col max-h-[90vh]">
            <Modal.Header className="flex flex-col gap-1 p-8 border-b border-default-100 bg-primary/5">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {producto.imagen ? (
                    <img 
                      src={producto.imagen} 
                      alt={producto.nombre} 
                      className="w-full h-full object-contain rounded-2xl mix-blend-multiply" 
                    />
                  ) : (
                    <Package className="text-primary" size={32} />
                  )}
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-primary/80">{producto.marca || "Sin Marca"}</span>
                  <Modal.Heading className="text-3xl font-black text-default-900 tracking-tight">
                    {producto.nombre}
                  </Modal.Heading>
                </div>
              </div>
            </Modal.Header>
            
            <Modal.Body className="gap-8 p-8 overflow-y-auto min-h-0">
              {/* Grid of technical details */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-default-400 uppercase tracking-wider flex items-center gap-1">
                    <Tag size={14} className="text-primary/70" /> Categoría
                  </span>
                  <span className="text-sm font-semibold text-default-900">
                    {producto.categoria || "Unisex"}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-default-400 uppercase tracking-wider flex items-center gap-1">
                    <Droplet size={14} className="text-primary/70" /> Familia
                  </span>
                  <span className="text-sm font-semibold text-default-900 capitalize">
                    {producto.familiaOlfativa || "N/A"}
                  </span>
                </div>
                


                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-default-400 uppercase tracking-wider flex items-center gap-1">
                    <FlaskConical size={14} className="text-primary/70" /> Volumen
                  </span>
                  <span className="text-sm font-semibold text-default-900 uppercase">
                    {producto.volumen || "N/A"}
                  </span>
                </div>



                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-default-400 uppercase tracking-wider flex items-center gap-1">
                    <Hash size={14} className="text-primary/70" /> Código
                  </span>
                  <span className="text-sm font-semibold text-default-900 uppercase">
                    {producto.codigo || "Sin Código"}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-default-400 uppercase tracking-wider flex items-center gap-1">
                    <Calendar size={14} className="text-primary/70" /> Año
                  </span>
                  <span className="text-sm font-semibold text-default-900">
                    {producto.anio || "N/A"}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-default-400 uppercase tracking-wider flex items-center gap-1">
                    <DollarSign size={14} className="text-primary/70" /> Precio Tienda
                  </span>
                  <span className="text-lg font-black text-primary">
                    ${producto.precioTienda.toFixed(2)}
                  </span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-xs font-bold text-default-400 uppercase tracking-wider flex items-center gap-1">
                    <Calendar size={14} className="text-primary/70" /> Registro
                  </span>
                  <span className="text-sm font-semibold text-default-900">
                    {producto.created_at}
                  </span>
                </div>
              </div>

              {/* Notes and description */}
              <div className="bg-default-50 rounded-2xl p-6 border border-default-100">
                <h4 className="text-sm font-bold text-default-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Package size={16} className="text-primary" /> Notas Olfativas y Descripción
                </h4>
                <p className="text-sm font-medium text-default-600 leading-relaxed whitespace-pre-wrap">
                  {producto.notas || "Sin descripción disponible."}
                </p>
              </div>
            </Modal.Body>

            <Modal.Footer className="p-6 border-t border-default-100 flex justify-end">
              <Button 
                onPress={() => onOpenChange()}
                className="bg-default-100 hover:bg-default-200 text-default-900 font-bold rounded-xl h-11 px-6"
              >
                Cerrar Ficha
              </Button>
            </Modal.Footer>
          </div>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
