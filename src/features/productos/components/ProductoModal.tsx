import {
  Modal,
  Button,
  TextField,
  Label,
  InputGroup,
  Select,
  ListBox,
} from "@heroui/react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Producto } from "../types";
import { useCategorias } from "../../categorias/hooks/useCategorias";
import { Package } from "lucide-react";
import { productoSchema, type ProductoFormValues } from "../schemas/productoSchema";

interface ProductoModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onSubmit: (producto: Partial<Producto>) => void;
  producto?: Producto | null; // Para modo de edición
}

export function ProductoModal({ isOpen, onOpenChange, onSubmit, producto }: ProductoModalProps) {
  const { categorias } = useCategorias();
  
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
      variante: "",
      familiaOlfativa: "",
      ocasion: "",
      volumen: "",
      tipo: "",
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
        variante: producto.variante || "",
        familiaOlfativa: producto.familiaOlfativa || "",
        ocasion: producto.ocasion || "",
        volumen: producto.volumen || "",
        tipo: producto.tipo || "",
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
        variante: "",
        familiaOlfativa: "",
        ocasion: "",
        volumen: "",
        tipo: "",
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

                <TextField isInvalid={!!errors.variante}>
                  <Label className="text-primary font-bold mb-1 ml-1 text-sm">Variante / Subnombre</Label>
                  <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all">
                    <InputGroup.Input
                      placeholder="Ej. HAPPY SMILE"
                      {...register("variante")}
                      className="px-3 text-sm font-medium"
                    />
                  </InputGroup>
                  {errors.variante && <p className="text-danger text-tiny mt-1 ml-1">{errors.variante.message}</p>}
                </TextField>

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

                <TextField isInvalid={!!errors.ocasion}>
                  <Label className="text-primary font-bold mb-1 ml-1 text-sm">Ocasión</Label>
                  <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all">
                    <InputGroup.Input
                      placeholder="Ej. CASUAL"
                      {...register("ocasion")}
                      className="px-3 text-sm font-medium"
                    />
                  </InputGroup>
                  {errors.ocasion && <p className="text-danger text-tiny mt-1 ml-1">{errors.ocasion.message}</p>}
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

                <TextField isInvalid={!!errors.tipo}>
                  <Label className="text-primary font-bold mb-1 ml-1 text-sm">Tipo</Label>
                  <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all">
                    <InputGroup.Input
                      placeholder="Ej. EDT, EDP"
                      {...register("tipo")}
                      className="px-3 text-sm font-medium"
                    />
                  </InputGroup>
                  {errors.tipo && <p className="text-danger text-tiny mt-1 ml-1">{errors.tipo.message}</p>}
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

                <TextField isInvalid={!!errors.imagen}>
                  <Label className="text-primary font-bold mb-1 ml-1 text-sm">URL de Imagen</Label>
                  <InputGroup className="bg-primary/5 border-primary/10 hover:border-primary/20 focus-within:!border-primary rounded-xl h-11 transition-all">
                    <InputGroup.Input
                      placeholder="Ej. /sauvage.png"
                      {...register("imagen")}
                      className="px-3 text-sm font-medium"
                    />
                  </InputGroup>
                  {errors.imagen && <p className="text-danger text-tiny mt-1 ml-1">{errors.imagen.message}</p>}
                </TextField>
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
