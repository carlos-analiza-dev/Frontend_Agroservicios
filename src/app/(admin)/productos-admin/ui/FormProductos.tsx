import { Servicio } from "@/apis/productos/interfaces/response-productos.interface";
import { AddProducto } from "@/apis/sub-servicio/accions/crear-sub-servicio";
import { UpdateProducto } from "@/apis/sub-servicio/accions/update-sub-servicio";
import { CrearSubServicio } from "@/apis/sub-servicio/interface/crear-sub-servicio.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UnidadMedida } from "@/helpers/data/unidadMedidas";
import useGetCategorias from "@/hooks/categorias/useGetCategorias";
import useGetTaxesPais from "@/hooks/impuestos/useGetTaxesPais";
import useGetMarcasActivas from "@/hooks/marcas/useGetMarcasActivas";
import useGetProveedoresActivos from "@/hooks/proveedores/useGetProveedoresActivos";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface Props {
  editSubServicio?: Servicio | null;
  isEdit?: boolean;
  onSuccess: () => void;
}

const FormProductos = ({ onSuccess, editSubServicio, isEdit }: Props) => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: marcasActivas } = useGetMarcasActivas();
  const { data: proveedoresActivos } = useGetProveedoresActivos();
  const { data: categorias } = useGetCategorias();
  const { data: impuestos } = useGetTaxesPais();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CrearSubServicio>();

  useEffect(() => {
    if (isEdit && editSubServicio) {
      reset({
        nombre: editSubServicio.nombre,
        tipo: editSubServicio.tipo,
        unidad_venta: editSubServicio.unidad_venta,
        disponible: editSubServicio.disponible,
        isActive: editSubServicio.isActive,
        marcaId: editSubServicio.marca.id,
        proveedorId: editSubServicio.proveedor.id,
        categoriaId: editSubServicio.categoria.id,
        atributos: editSubServicio.atributos,
        codigo_barra: editSubServicio.codigo_barra,
        precio: Number(editSubServicio.preciosPorPais?.[0]?.precio),
        costo: Number(editSubServicio.preciosPorPais?.[0]?.costo),
        taxId: editSubServicio.tax?.id,
      });
      setValue("unidad_venta", editSubServicio.unidad_venta);
    } else {
      reset({
        nombre: "",
        tipo: "producto",
        unidad_venta: "unidad",
        disponible: true,
        isActive: true,
        marcaId: undefined,
        proveedorId: undefined,
        categoriaId: undefined,
        atributos: undefined,
        codigo_barra: undefined,
        precio: undefined,
        costo: undefined,
        taxId: undefined,
      });
    }
  }, [isEdit, editSubServicio, reset, setValue]);

  const mutation = useMutation({
    mutationFn: (data: CrearSubServicio) => AddProducto(data),
    onSuccess: () => {
      toast.success("Producto creado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["productos-admin"] });
      reset();
      onSuccess();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al crear el producto";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de crear el producto. Inténtalo de nuevo."
        );
      }
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: (data: CrearSubServicio) =>
      UpdateProducto(editSubServicio?.id ?? "", data),
    onSuccess: () => {
      toast.success("Producto actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["productos-admin"] });
      reset();
      onSuccess();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al actualizar el producto";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de actualizar el producto. Inténtalo de nuevo."
        );
      }
    },
  });

  const onSubmit = (data: CrearSubServicio) => {
    const payload = {
      ...data,
      tipo: "producto",
      precio: Number(data.precio),
      costo: Number(data.costo),
      paisId: user?.pais.id,
    };
    if (isEdit) {
      mutationUpdate.mutate(payload);
    } else {
      mutation.mutate(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="codigo" className="font-bold">
          Código de Producto*
        </Label>
        <Input
          id="codigo"
          {...register("codigo", {
            required: "El código es requerido",
            maxLength: {
              value: 20,
              message: "El código no puede tener más de 20 caracteres",
            },
          })}
          placeholder="Ej: PROD-190019"
          defaultValue={isEdit ? editSubServicio?.codigo : ""}
        />
        {errors.codigo && (
          <p className="text-sm font-medium text-red-500">
            {errors.codigo.message as string}
          </p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="nombre" className="font-bold">
          Nombre del Producto*
        </Label>
        <Input
          id="nombre"
          {...register("nombre", {
            required: "El nombre del servicio es requerido",
            minLength: {
              value: 3,
              message: "El nombre debe tener al menos 3 caracteres",
            },
            maxLength: {
              value: 100,
              message: "El nombre no puede tener más de 100 caracteres",
            },
          })}
          placeholder="Ej: Fertilizantes, Herbicidas,Desparasitantes, etc."
        />
        {errors.nombre && (
          <p className="text-sm font-medium text-red-500">
            {errors.nombre.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="codigo_barra" className="font-bold">
          Código de Barra*
        </Label>
        <Input
          id="codigo_barra"
          {...register("codigo_barra", {
            required: "El código de barra es requerido",
            maxLength: {
              value: 20,
              message: "El código de barra no puede tener más de 20 caracteres",
            },
          })}
          placeholder="Ej: 7501031311309"
          defaultValue={isEdit ? editSubServicio?.codigo_barra : ""}
        />
        {errors.codigo_barra && (
          <p className="text-sm font-medium text-red-500">
            {errors.codigo_barra.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="marcaId" className="font-bold">
          Marca
        </Label>
        <Select
          defaultValue={isEdit ? editSubServicio?.marca.id : ""}
          onValueChange={(value) => setValue("marcaId", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una marca" />
          </SelectTrigger>
          <SelectContent>
            {marcasActivas?.map((marca) => (
              <SelectItem key={marca.id} value={marca.id}>
                {marca.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="categoriaId" className="font-bold">
          Categoria
        </Label>
        <Select
          defaultValue={isEdit ? editSubServicio?.categoria.id : ""}
          onValueChange={(value) => setValue("categoriaId", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona una categoria" />
          </SelectTrigger>
          <SelectContent>
            {categorias?.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!isEdit && (
        <>
          <div className="flex justify-between">
            <div className="space-y-2">
              <Label htmlFor="precio" className="font-bold">
                Precio*
              </Label>
              <Input
                id="precio"
                type="number"
                step="0.01"
                {...register("precio", {
                  required: "El precio es requerido",
                  min: { value: 0, message: "El precio no puede ser negativo" },
                })}
                placeholder="0.00"
                defaultValue={
                  isEdit ? editSubServicio?.preciosPorPais?.[0]?.precio : ""
                }
              />
              {errors.precio && (
                <p className="text-sm font-medium text-red-500">
                  {errors.precio.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="costo" className="font-bold">
                Costo*
              </Label>
              <Input
                id="costo"
                type="number"
                step="0.01"
                {...register("costo", {
                  required: "El costo es requerido",
                  min: { value: 0, message: "El costo no puede ser negativo" },
                })}
                placeholder="0.00"
                defaultValue={
                  isEdit ? editSubServicio?.preciosPorPais?.[0]?.costo : ""
                }
              />
              {errors.costo && (
                <p className="text-sm font-medium text-red-500">
                  {errors.costo.message as string}
                </p>
              )}
            </div>
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="tax_rate" className="font-bold">
          Impuesto (Tax Rate %)
        </Label>
        <Select
          defaultValue={isEdit ? editSubServicio?.tax?.id : ""}
          onValueChange={(value) => setValue("taxId", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un impuesto" />
          </SelectTrigger>
          <SelectContent>
            {impuestos?.map((imp) => (
              <SelectItem key={imp.id} value={imp.id}>
                {imp.nombre} - {(parseFloat(imp.porcentaje) * 100).toFixed(1)}%
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="unidad_venta" className="font-bold">
          Unidad de Venta*
        </Label>
        <Select
          defaultValue={isEdit ? editSubServicio?.unidad_venta : "unidad"}
          onValueChange={(value) => setValue("unidad_venta", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona la unidad" />
          </SelectTrigger>
          <SelectContent>
            {UnidadMedida.map((unidad) => (
              <SelectItem key={unidad.value} value={unidad.value}>
                {unidad.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.unidad_venta && (
          <p className="text-sm font-medium text-red-500">
            {errors.unidad_venta.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="atributos" className="font-bold">
          Atributos*
        </Label>
        <Textarea
          id="atributos"
          {...register("atributos", {
            required: "Los atributos son requeridos",
            maxLength: {
              value: 250,
              message: "Los atributos no pueden tener más de 250 caracteres",
            },
          })}
          placeholder="Ej: Presentación 1L, Color verde, Uso agrícola..."
          className="min-h-[80px]"
          defaultValue={isEdit ? editSubServicio?.atributos : ""}
        />
        {errors.atributos && (
          <p className="text-sm font-medium text-red-500">
            {errors.atributos.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="proveedorId" className="font-bold">
          Proveedor
        </Label>
        <Select
          defaultValue={isEdit ? editSubServicio?.proveedor.id : ""}
          onValueChange={(value) => setValue("proveedorId", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un proveedor" />
          </SelectTrigger>
          <SelectContent>
            {proveedoresActivos?.map((proveedor) => (
              <SelectItem key={proveedor.id} value={proveedor.id}>
                {proveedor.nombre_legal} - {proveedor.nit_rtn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isEdit && (
        <>
          <div className="space-y-2">
            <Label className="font-bold">Estado</Label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="disponible"
                {...register("disponible")}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                defaultChecked
              />
              <Label htmlFor="disponible" className="text-sm font-normal">
                Producto disponible
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="font-bold">Actividad</Label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="actividad"
                {...register("isActive")}
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                defaultChecked
              />
              <Label htmlFor="actividad" className="text-sm font-normal">
                Producto activo
              </Label>
            </div>
          </div>
        </>
      )}

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="submit"
          disabled={mutation.isPending || mutationUpdate.isPending}
        >
          {mutation.isPending || mutationUpdate.isPending ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              {isEdit ? "Actualizando..." : "Creando..."}
            </>
          ) : (
            <>{isEdit ? "Actualizar Producto" : "Crear Producto"}</>
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormProductos;
