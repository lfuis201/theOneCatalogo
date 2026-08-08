import {
  Modal,
  Button,
  TextField,
  Label,
  InputGroup,
  Select,
  ListBox,
  toast,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Producto } from "../types";
import { useCategorias } from "../../categorias/hooks/useCategorias";
import { Package, Upload, Image as ImageIcon } from "lucide-react";
import { productoSchema, type ProductoFormValues } from "../schemas/productoSchema";
import { useProductos } from "../hooks/useProductos";

interface ProductoModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onSubmit: (producto: Partial<Producto>) => void;
  producto?: Producto | null; // Para modo de edición
}

export function ProductoModal({ isOpen, onOpenChange, onSubmit, producto }: ProductoModalProps) {
  const { categorias } = useCategorias();
  const { uploadImage, isUploading } = useProductos();

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadImage(file);
      setValue("imagen", url, { shouldValidate: true });
      toast.success("¡Imagen subida con éxito a Cloudinary!");
    } catch (error) {
      console.error(error);
      toast.error("Error al subir la imagen a Cloudinary.");
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductoFormValues>({
    resolver: zodResolver(productoSchema),
    defaultValues: {
      nombre: "",
      marca: "",
      categoria: "Unisex",
      categoriaId: "",
      familiaOlfativa: "",
      volumen: "",
      anio: "",
      codigo: "",
      precioTienda: undefined,
      imagen: "",
      notas: "",
    },
  });

  const selectedCategoria = watch("categoria");
  const selectedCategoriaId = watch("categoriaId");

  useEffect(() => {
    if (producto && isOpen) {
      reset({
        nombre: producto.nombre || "",
        marca: producto.marca || "",
        categoria: producto.categoria || "Unisex",
        categoriaId: producto.categoriaId || "",
        familiaOlfativa: producto.familiaOlfativa || "",
        volumen: producto.volumen || "",
        anio: producto.anio || "",
        codigo: producto.codigo || "",
        precioTienda: producto.precioTienda,
        imagen: producto.imagen || "",
        notas: producto.notas || "",
      });
    } else if (isOpen) {
      reset({
        nombre: "",
        marca: "",
        categoria: "Unisex",
        categoriaId: "",
        familiaOlfativa: "",
        volumen: "",
        anio: "",
        codigo: "",
        precioTienda: undefined,
        imagen: "",
        notas: "",
      });
    }
  }, [producto, isOpen, reset]);

  const handleFormSubmit = (data: ProductoFormValues) => {
    onSubmit({
      ...data,
      categoriaId: data.categoriaId || null,
    });
    reset();
    onOpenChange();
  };

  return (
    <Modal.Backdrop isOpen={isOpen} onOpenChange={onOpenChange}>
      <Modal.Container>
        <Modal.Dialog className="sm:max-w-[700px] bg-background border-none shadow-2xl rounded-[2.5rem] overflow-hidden">
          <Modal.CloseTrigger />
          <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col max-h-[90vh]">
            <Modal.Header className="flex flex-col gap-1 p-8 border-b border-default-100">
              <div className="flex items-center gap-3 text-default-900">
                <Package className="text-primary" size={24} />
                <Modal.Heading className="text-2xl font-black">
                  {producto ? "Editar Perfume" : "Nuevo Perfume"}
                </Modal.Heading>
              </div>
              <p className="text-sm font-medium text-default-500">
                {producto 
                  ? "Modifica los detalles técnicos o de venta del perfume." 
                  : "Ingresa los detalles técnicos y de venta del perfume."}
              </p>
            </Modal.Header>
            <Modal.Body className="gap-6 p-8 overflow-y-auto min-h-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <TextField isInvalid={!!errors.nombre}>
                  <Label className="text-primary font-bold mb-1 ml-1 text-sm">Nombre del Perfume</Label>
                  <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all">
                    <InputGroup.Input
                      placeholder="Ej. GOTAS DE COLOR"
                      {...register("nombre")}
                      className="px-3 text-sm font-medium"
                    />
                  </InputGroup>
                  {errors.nombre && <p className="text-danger text-tiny mt-1 ml-1">{errors.nombre.message}</p>}
                </TextField>

                <TextField isInvalid={!!errors.marca}>
                  <Label className="text-primary font-bold mb-1 ml-1 text-sm">Marca</Label>
                  <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all">
                    <InputGroup.Input
                      placeholder="Ej. Armaf"
                      {...register("marca")}
                      className="px-3 text-sm font-medium"
                    />
                  </InputGroup>
                  {errors.marca && <p className="text-danger text-tiny mt-1 ml-1">{errors.marca.message}</p>}
                </TextField>

                <Select
                  value={selectedCategoria}
                  onChange={(val) => setValue("categoria", val as any, { shouldValidate: true })}
                  placeholder="Selecciona público"
                  isInvalid={!!errors.categoria}
                  className="w-full"
                >
                  <Label className="text-primary font-bold mb-1 ml-1 text-sm">Clasificación Público</Label>
                  <Select.Trigger className="w-full bg-[#FAFAFA] border border-default-200 rounded-xl px-4 py-2 text-sm text-default-900 focus:outline-none focus:border-primary transition-all cursor-pointer h-11 font-medium flex items-center justify-between">
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      <ListBox.Item id="Dama" textValue="Dama">Dama <ListBox.ItemIndicator /></ListBox.Item>
                      <ListBox.Item id="Caballero" textValue="Caballero">Caballero <ListBox.ItemIndicator /></ListBox.Item>
                      <ListBox.Item id="Unisex" textValue="Unisex">Unisex <ListBox.ItemIndicator /></ListBox.Item>
                      <ListBox.Item id="Todos" textValue="Todos">Todos <ListBox.ItemIndicator /></ListBox.Item>
                    </ListBox>
                  </Select.Popover>
                  {errors.categoria && <p className="text-danger text-tiny mt-1 ml-1">{errors.categoria.message}</p>}
                </Select>

                <Select
                  value={selectedCategoriaId || "ninguna"}
                  onChange={(val) => setValue("categoriaId", val === "ninguna" ? null : (val as string), { shouldValidate: true })}
                  placeholder="Selecciona una categoría"
                  isInvalid={!!errors.categoriaId}
                  className="w-full"
                >
                  <Label className="text-primary font-bold mb-1 ml-1 text-sm">Categoría del Producto</Label>
                  <Select.Trigger className="w-full bg-[#FAFAFA] border border-default-200 rounded-xl px-4 py-2 text-sm text-default-900 focus:outline-none focus:border-primary transition-all cursor-pointer h-11 font-medium flex items-center justify-between">
                    <Select.Value />
                    <Select.Indicator />
                  </Select.Trigger>
                  <Select.Popover>
                    <ListBox>
                      <ListBox.Item id="ninguna" textValue="Ninguna (Particular)">Ninguna (Particular) <ListBox.ItemIndicator /></ListBox.Item>
                      {categorias.map((cat) => (
                        <ListBox.Item key={cat.id} id={cat.id} textValue={cat.nombre}>
                          {cat.nombre}
                          <ListBox.ItemIndicator />
                        </ListBox.Item>
                      ))}
                    </ListBox>
                  </Select.Popover>
                  {errors.categoriaId && <p className="text-danger text-tiny mt-1 ml-1">{errors.categoriaId.message}</p>}
                </Select>

                <TextField isInvalid={!!errors.familiaOlfativa}>
                  <Label className="text-primary font-bold mb-1 ml-1 text-sm">Familia Olfativa</Label>
                  <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all">
                    <InputGroup.Input
                      placeholder="Ej. FLORAL FRUTAL"
                      {...register("familiaOlfativa")}
                      className="px-3 text-sm font-medium"
                    />
                  </InputGroup>
                  {errors.familiaOlfativa && <p className="text-danger text-tiny mt-1 ml-1">{errors.familiaOlfativa.message}</p>}
                </TextField>

                <TextField isInvalid={!!errors.volumen}>
                  <Label className="text-primary font-bold mb-1 ml-1 text-sm">Volumen</Label>
                  <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all">
                    <InputGroup.Input
                      placeholder="Ej. 100 ML"
                      {...register("volumen")}
                      className="px-3 text-sm font-medium"
                    />
                  </InputGroup>
                  {errors.volumen && <p className="text-danger text-tiny mt-1 ml-1">{errors.volumen.message}</p>}
                </TextField>

                <TextField isInvalid={!!errors.anio}>
                  <Label className="text-primary font-bold mb-1 ml-1 text-sm">Año de Lanzamiento</Label>
                  <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all">
                    <InputGroup.Input
                      placeholder="Ej. 2023"
                      {...register("anio")}
                      className="px-3 text-sm font-medium"
                    />
                  </InputGroup>
                  {errors.anio && <p className="text-danger text-tiny mt-1 ml-1">{errors.anio.message}</p>}
                </TextField>

                <TextField isInvalid={!!errors.codigo}>
                  <Label className="text-primary font-bold mb-1 ml-1 text-sm">Código de Producto</Label>
                  <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all">
                    <InputGroup.Input
                      placeholder="Ej. #6679"
                      {...register("codigo")}
                      className="px-3 text-sm font-medium"
                    />
                  </InputGroup>
                  {errors.codigo && <p className="text-danger text-tiny mt-1 ml-1">{errors.codigo.message}</p>}
                </TextField>

                <TextField isInvalid={!!errors.precioTienda}>
                  <Label className="text-primary font-bold mb-1 ml-1 text-sm">Precio Tienda ($)</Label>
                  <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all">
                    <InputGroup.Input
                      type="number"
                      placeholder="0.00"
                      {...register("precioTienda")}
                      className="px-3 text-sm font-medium"
                    />
                  </InputGroup>
                  {errors.precioTienda && <p className="text-danger text-tiny mt-1 ml-1">{errors.precioTienda.message}</p>}
                </TextField>

                <div className="flex flex-col gap-2">
                  <Label className="text-primary font-bold mb-1 ml-1 text-sm">Imagen del Producto</Label>
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 px-4 py-3 bg-primary/10 hover:bg-primary/20 text-primary font-bold rounded-xl transition-all cursor-pointer border border-primary/20 text-sm">
                      <Upload size={16} />
                      {isUploading ? "Subiendo..." : "Subir Archivo"}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={isUploading}
                        className="hidden"
                      />
                    </label>
                    
                    {watch("imagen") ? (
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-12 rounded-xl bg-default-100 border border-default-200 overflow-hidden flex items-center justify-center">
                          <img
                            src={watch("imagen")}
                            alt="Vista previa"
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="text-xs text-default-500 max-w-[150px] truncate">
                          Imagen cargada
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-default-400">
                        <div className="w-12 h-12 rounded-xl bg-default-50 border border-dashed border-default-300 flex items-center justify-center">
                          <ImageIcon size={20} />
                        </div>
                        <span className="text-xs">Sin imagen cargada</span>
                      </div>
                    )}
                  </div>
                  {errors.imagen && <p className="text-danger text-tiny mt-1 ml-1">{errors.imagen.message}</p>}
                </div>
              </div>

              <TextField isInvalid={!!errors.notas}>
                <Label className="text-primary font-bold mb-1 ml-1 text-sm">Notas y Descripción</Label>
                <div className="bg-primary/5 border border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl transition-all p-2">
                  <textarea
                    placeholder="Ej. 2018. BERGAMOTA, NARANJA, CEDRÓN..."
                    {...register("notas")}
                    className="w-full bg-transparent outline-none resize-y min-h-[80px] px-2 py-1 text-sm font-medium text-default-900"
                  />
                </div>
                {errors.notas && <p className="text-danger text-tiny mt-1 ml-1">{errors.notas.message}</p>}
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
                {producto ? "Guardar Cambios" : "Guardar Perfume"}
              </Button>
            </Modal.Footer>
          </form>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
