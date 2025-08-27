import React, { useEffect, useState } from "react";
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
import { CrearSubServicio } from "@/apis/sub-servicio/interface/crear-sub-servicio.interface";
import { AddSubServicio } from "@/apis/sub-servicio/accions/crear-sub-servicio";
import { UpdateSubServicio } from "@/apis/sub-servicio/accions/update-sub-servicio";
import { Textarea } from "@/components/ui/textarea";
import { UnidadMedida } from "@/helpers/data/unidadMedidas";
import useGetInsumos from "@/hooks/insumos/useGetInsumos";
import useGetInsumosDisponibles from "@/hooks/insumos/useGetInsumosDisponibles";
import { Insumo } from "@/apis/insumos/interfaces/response-insumos.interface";
import { Plus, Trash2 } from "lucide-react";
import { InsumoDis } from "@/apis/insumos/interfaces/response-insumos-disponibles.interface";
import { CrearServicioInsumos } from "@/apis/insumos-servicio/accions/crear-servicio-insumos";

interface Props {
  servicioId: string;
  editSubServicio?: SubServicio | null;
  isEdit?: boolean;
  onSuccess: () => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
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
  const { data: insumos } = useGetInsumosDisponibles();
  const [insumosSeleccionados, setInsumosSeleccionados] = useState<InsumoDis[]>(
    []
  );
  const [insumoSeleccionado, setInsumoSeleccionado] = useState<string>("");
  const [cantidadInsumo, setCantidadInsumo] = useState<number>(1);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CrearSubServicio>();

  useEffect(() => {
    if (isOpen) {
      if (isEdit && editSubServicio) {
        reset({
          nombre: editSubServicio.nombre,
          tipo: editSubServicio.tipo as "servicio" | "producto",
          unidad_venta: editSubServicio.unidad_venta,
          descripcion: editSubServicio.descripcion,
          disponible: editSubServicio.disponible,
          servicioId: editSubServicio.servicioId,
        });
        setValue("unidad_venta", editSubServicio.unidad_venta);
      } else {
        reset({
          nombre: "",
          tipo: "servicio",
          unidad_venta: "unidad",
          descripcion: "",
          disponible: true,
          servicioId: servicioId,
        });
        setInsumosSeleccionados([]);
      }
    }
  }, [isOpen, isEdit, editSubServicio, reset, servicioId, setValue]);

  const agregarInsumo = () => {
    if (!insumoSeleccionado || cantidadInsumo <= 0) {
      toast.error("Selecciona un insumo y una cantidad válida");
      return;
    }

    const insumoExistente = insumos?.insumos.find(
      (insumo) => insumo.id === insumoSeleccionado
    );

    if (!insumoExistente) {
      toast.error("Insumo no encontrado");
      return;
    }

    const yaAgregado = insumosSeleccionados.find(
      (insumo) => insumo.id === insumoSeleccionado
    );

    if (yaAgregado) {
      toast.error("Este insumo ya fue agregado");
      return;
    }

    const nuevoInsumo: InsumoDis = {
      ...insumoExistente,
      cantidad: cantidadInsumo,
    };

    setInsumosSeleccionados([...insumosSeleccionados, nuevoInsumo]);
    setInsumoSeleccionado("");
    setCantidadInsumo(1);
  };

  const eliminarInsumo = (id: string) => {
    setInsumosSeleccionados(
      insumosSeleccionados.filter((insumo) => insumo.id !== id)
    );
  };

  const crearInsumosMutation = useMutation({
    mutationFn: (data: { subServicioId: string; insumos: InsumoDis[] }) => {
      const promises = data.insumos.map((insumo) =>
        CrearServicioInsumos({
          servicioId: data.subServicioId,
          insumoId: insumo.id,
          cantidad: insumo.cantidad ?? 1,
        })
      );
      return Promise.all(promises);
    },
    onSuccess: () => {
      toast.success("Insumos del servicio creados exitosamente");
      queryClient.invalidateQueries({ queryKey: ["servicios-admin"] });
    },
    onError: (error) => {
      toast.error("Error al crear los insumos del servicio");
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CrearSubServicio) => AddSubServicio(data),
    onSuccess: (subServicioCreado) => {
      if (insumosSeleccionados.length > 0) {
        crearInsumosMutation.mutate({
          subServicioId: subServicioCreado.data.id,
          insumos: insumosSeleccionados,
        });
      }

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
    mutationFn: (data: CrearSubServicio) =>
      UpdateSubServicio(editSubServicio?.id ?? "", data),
    onSuccess: (subServicioActualizado) => {
      if (insumosSeleccionados.length > 0 && editSubServicio?.id) {
        crearInsumosMutation.mutate({
          subServicioId: editSubServicio.id,
          insumos: insumosSeleccionados,
        });
      }

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

  const onSubmit = (data: CrearSubServicio) => {
    if (isEdit) {
      mutationUpdate.mutate(data);
    } else {
      mutation.mutate({ ...data, servicioId });
    }
  };

  const isLoading =
    mutation.isPending ||
    mutationUpdate.isPending ||
    crearInsumosMutation.isPending;

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

      {!isEdit && (
        <div className="space-y-4 border rounded-md p-4">
          <Label className="font-bold text-lg">Insumos del Servicio</Label>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="insumo">Seleccionar Insumo</Label>
              <Select
                value={insumoSeleccionado}
                onValueChange={setInsumoSeleccionado}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un insumo" />
                </SelectTrigger>
                <SelectContent>
                  {insumos?.insumos.map((insumo) => (
                    <SelectItem key={insumo.id} value={insumo.id}>
                      {insumo.nombre} - {insumo.codigo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cantidad">Cantidad</Label>
              <Input
                id="cantidad"
                type="number"
                min="1"
                value={cantidadInsumo}
                onChange={(e) => setCantidadInsumo(Number(e.target.value))}
                placeholder="Cantidad"
              />
            </div>

            <div className="flex items-end">
              <Button type="button" onClick={agregarInsumo} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Insumo
              </Button>
            </div>
          </div>

          {insumosSeleccionados.length > 0 && (
            <div className="mt-4">
              <Label className="font-bold">Insumos agregados:</Label>
              <div className="mt-2 space-y-2">
                {insumosSeleccionados.map((insumo) => (
                  <div
                    key={insumo.id}
                    className="flex items-center justify-between p-2 border rounded-md"
                  >
                    <div>
                      <span className="font-medium">{insumo.nombre}</span>
                      <span className="text-sm text-gray-500 ml-2">
                        - {insumo.cantidad} {insumo.unidad_venta}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => eliminarInsumo(insumo.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
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
