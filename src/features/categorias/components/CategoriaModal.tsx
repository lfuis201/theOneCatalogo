import {
  Modal,
  Button,
  TextField,
  Label,
  InputGroup,
} from "@heroui/react";
import { useState, useEffect } from "react";
import type { Categoria } from "../types";
import { Tag } from "lucide-react";

interface CategoriaModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onSubmit: (categoria: Partial<Categoria>) => void;
  categoria?: Categoria | null;
}

export function CategoriaModal({ isOpen, onOpenChange, onSubmit, categoria }: CategoriaModalProps) {
  const [nombre, setNombre] = useState("");

  useEffect(() => {
    if (categoria && isOpen) {
      setNombre(categoria.nombre);
    } else if (isOpen) {
      setNombre("");
    }
  }, [categoria, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nombre.trim()) return;
    onSubmit({ nombre });
    setNombre("");
    onOpenChange();
  };

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-[450px] bg-background border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
          <Modal.CloseTrigger />
          <form onSubmit={handleSubmit} className="flex flex-col max-h-[90vh]">
            <Modal.Header className="flex flex-col gap-1 p-8 border-b border-default-100">
              <div className="flex items-center gap-3 text-default-900">
                <Tag className="text-primary" size={24} />
                <Modal.Heading className="text-2xl font-black">
                  {categoria ? "Editar Categoría" : "Nueva Categoría"}
                </Modal.Heading>
              </div>
              <p className="text-sm font-medium text-default-500">
                {categoria ? "Modifica el nombre de la categoría." : "Ingresa el nombre para organizar tus perfumes."}
              </p>
            </Modal.Header>
            <Modal.Body className="gap-6 p-8 overflow-y-auto min-h-0">
              <TextField>
                <Label className="text-primary font-bold mb-1 ml-1 text-sm">Nombre de la Categoría</Label>
                <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all">
                  <InputGroup.Input
                    placeholder="Ej. Nicho, Amaderados, Cítricos"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="px-3 text-sm font-medium"
                    required
                  />
                </InputGroup>
              </TextField>
            </Modal.Body>
            <Modal.Footer className="p-8 border-t border-default-100 flex justify-end gap-3">
              <Button 
                variant="flat" 
                color="danger" 
                onPress={() => onOpenChange()}
                className="font-bold rounded-xl h-11 px-6"
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/30 h-11 px-6"
              >
                {categoria ? "Guardar Cambios" : "Crear Categoría"}
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
