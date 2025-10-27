import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { SubServicio } from "@/apis/servicios/interfaces/response-servicios.interface";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AddSubServicio } from "@/apis/sub-servicio/accions/crear-sub-servicio";
import { UpdateSubServicio } from "@/apis/sub-servicio/accions/update-sub-servicio";
import { Textarea } from "@/components/ui/textarea";
import { UnidadMedida } from "@/helpers/data/unidadMedidas";
import useGetInsumosDisponibles from "@/hooks/insumos/useGetInsumosDisponibles";
import { Plus, Trash2 } from "lucide-react";
import { CrearServicioInterface } from "@/apis/sub-servicio/interface/crear-servicio.interface";

interface Props {
  servicioId: string;
  editSubServicio?: SubServicio | null;
  isEdit?: boolean;
  onSuccess: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface InsumoSeleccionado {
  id: string;
  nombre: string;
  codigo: string;
  unidad_venta: string;
  cantidad: number;
  disponible: boolean;
  editando?: boolean;
}

const FormServicios = ({
  servicioId,
  onSuccess,
  editSubServicio,
  isEdit,
  isOpen,
  onOpenChange,
}: Props) => {
  const queryClient = useQueryClient();
  const [insumosSeleccionados, setInsumosSeleccionados] = useState<
    InsumoSeleccionado[]
  >([]);
  const [insumoSeleccionado, setInsumoSeleccionado] = useState<string>("");
  const [cantidadInsumo, setCantidadInsumo] = useState<number>(1);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CrearServicioInterface>();

  useEffect(() => {
    if (isOpen) {
      if (isEdit && editSubServicio) {
        reset({
          nombre: editSubServicio.nombre,
          unidad_venta: editSubServicio.unidad_venta,
          descripcion: editSubServicio.descripcion,
          disponible: editSubServicio.disponible,
          servicioId: editSubServicio.servicioId,
        });
        setValue("unidad_venta", editSubServicio.unidad_venta);
      } else {
        reset({
          nombre: "",
          unidad_venta: "unidad",
          descripcion: "",
          disponible: true,
          servicioId: servicioId,
        });
        setInsumosSeleccionados([]);
      }
    }
  }, [isOpen, isEdit, editSubServicio, reset, servicioId, setValue]);

  const eliminarInsumo = (id: string) => {
    setInsumosSeleccionados(
      insumosSeleccionados.filter((insumo) => insumo.id !== id)
    );
  };

  const mutation = useMutation({
    mutationFn: (data: CrearServicioInterface) => AddSubServicio(data),
    onSuccess: () => {
      toast.success("Servicio creado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["servicios-admin"] });
      reset();
      setInsumosSeleccionados([]);
      onSuccess();
      onOpenChange(false);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al crear el servicio";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de crear el servicio. Inténtalo de nuevo."
        );
      }
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: (data: CrearServicioInterface) =>
      UpdateSubServicio(editSubServicio?.id ?? "", data),
    onSuccess: () => {
      toast.success("Servicio actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["servicios-admin"] });
      reset();
      setInsumosSeleccionados([]);
      onSuccess();
      onOpenChange(false);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al actualizar el servicio";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de actualizar el servicio. Inténtalo de nuevo."
        );
      }
    },
  });

  const onSubmit = (data: CrearServicioInterface) => {
    const datosEnviar: CrearServicioInterface = {
      ...data,
      servicioId: servicioId,
    };

    if (isEdit) {
      mutationUpdate.mutate(datosEnviar);
    } else {
      mutation.mutate(datosEnviar);
    }
  };
  const habilitarEdicionInsumo = (id: string) => {
    setInsumosSeleccionados((prev) =>
      prev.map((insumo) =>
        insumo.id === id
          ? { ...insumo, editando: true }
          : { ...insumo, editando: false }
      )
    );
  };

  const deshabilitarEdicionInsumo = (id: string) => {
    setInsumosSeleccionados((prev) =>
      prev.map((insumo) =>
        insumo.id === id ? { ...insumo, editando: false } : insumo
      )
    );
  };

  const actualizarCantidadInsumo = (id: string, nuevaCantidad: number) => {
    if (nuevaCantidad <= 0) {
      toast.error("La cantidad debe ser mayor a 0");
      return;
    }

    setInsumosSeleccionados((prev) =>
      prev.map((insumo) =>
        insumo.id === id ? { ...insumo, cantidad: nuevaCantidad } : insumo
      )
    );
  };

  const guardarEdicionInsumo = (id: string, nuevaCantidad: number) => {
    actualizarCantidadInsumo(id, nuevaCantidad);
    deshabilitarEdicionInsumo(id);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nombre" className="font-bold">
          Nombre del Servicio*
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
          placeholder="Ej: Interpretación de resultados, Cetosis en sangre, etc."
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
          Descripción*
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
          placeholder="Describe en detalle este servicio"
          className="min-h-[100px]"
        />
        {errors.descripcion && (
          <p className="text-sm font-medium text-red-500">
            {errors.descripcion.message as string}
          </p>
        )}
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
            Servicio disponible
          </Label>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          Cancelar
        </Button>
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
            <>{isEdit ? "Actualizar Servicio" : "Crear Servicio"}</>
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormServicios;
