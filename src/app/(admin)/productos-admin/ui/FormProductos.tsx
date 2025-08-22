import { SubServicio } from "@/apis/servicios/interfaces/response-servicios.interface";
import { AddSubServicio } from "@/apis/sub-servicio/accions/crear-sub-servicio";
import { UpdateSubServicio } from "@/apis/sub-servicio/accions/update-sub-servicio";
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
import useGetMarcasActivas from "@/hooks/marcas/useGetMarcasActivas";
import useGetProveedoresActivos from "@/hooks/proveedores/useGetProveedoresActivos";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface Props {
  editSubServicio?: SubServicio | null;
  isEdit?: boolean;
  onSuccess: () => void;
}

const FormProductos = ({ onSuccess, editSubServicio, isEdit }: Props) => {
  const queryClient = useQueryClient();

  const { data: marcasActivas } = useGetMarcasActivas();
  const { data: proveedoresActivos } = useGetProveedoresActivos();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CrearSubServicio>();

  useEffect(() => {
    if (isEdit && editSubServicio) {
      reset({
        nombre: editSubServicio.nombre,
        tipo: editSubServicio.tipo as "servicio" | "producto",
        unidad_venta: editSubServicio.unidad_venta,
        descripcion: editSubServicio.descripcion,
        disponible: editSubServicio.disponible,
        servicioId: editSubServicio.servicioId,
        marcaId: editSubServicio.marcaId,
        proveedorId: editSubServicio.proveedorId,
      });
      setValue("unidad_venta", editSubServicio.unidad_venta);
    } else {
      reset({
        nombre: "",
        tipo: "producto",
        unidad_venta: "unidad",
        descripcion: "",
        disponible: true,
      });
    }
  }, [isEdit, editSubServicio, reset, setValue]);

  const mutation = useMutation({
    mutationFn: (data: CrearSubServicio) => AddSubServicio(data),
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
      UpdateSubServicio(editSubServicio?.id ?? "", data),
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
    const payload = { ...data, tipo: "producto" };
    if (isEdit) {
      mutationUpdate.mutate(payload);
    } else {
      mutation.mutate(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        <Label htmlFor="descripcion" className="font-bold">
          Descripción del Producto*
        </Label>
        <Textarea
          id="descripcion"
          {...register("descripcion", {
            required: "La descripción es requerida",
            minLength: {
              value: 10,
              message: "La descripción debe tener al menos 10 caracteres",
            },
            maxLength: {
              value: 500,
              message: "La descripción no puede tener más de 500 caracteres",
            },
          })}
          placeholder="Describe en detalle este producto"
          className="min-h-[100px]"
        />
        {errors.descripcion && (
          <p className="text-sm font-medium text-red-500">
            {errors.descripcion.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="marcaId" className="font-bold">
          Marca
        </Label>
        <Select
          defaultValue={isEdit ? editSubServicio?.marcaId : ""}
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
        <Label htmlFor="proveedorId" className="font-bold">
          Proveedor
        </Label>
        <Select
          defaultValue={isEdit ? editSubServicio?.proveedorId : ""}
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
