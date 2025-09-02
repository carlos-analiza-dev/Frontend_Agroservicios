import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { CrearServicePrecio } from "@/apis/servicios_precios/interfaces/crear-servicio-precio.interface";
import { updateServicioPrecio } from "@/apis/servicios_precios/accions/update-servicios-price";
import { AddServicioPrecio } from "@/apis/servicios_precios/accions/crear-servicio-price";
import { isAxiosError } from "axios";
import {
  PreciosPorPai,
  SubServicio,
} from "@/apis/servicios/interfaces/response-servicios.interface";
import { useAuthStore } from "@/providers/store/useAuthStore";

interface Props {
  subServicioId: string;
  editPrecio?: PreciosPorPai | null;
  onCancel: () => void;
  onSuccess: () => void;
  isEditing?: boolean;
  subServicio?: SubServicio | null;
}

const FormAddPrecios = ({
  subServicioId,
  onCancel,
  onSuccess,
  editPrecio,
  isEditing = false,
  subServicio,
}: Props) => {
  const { user } = useAuthStore();
  const paisId = user?.pais.id || "";
  const queryClient = useQueryClient();
  const [precioServicio, setPrecioServicio] = useState<number>(0);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<CrearServicePrecio>();

  const calcularCostoTotalInsumos = (): number => {
    if (!subServicio?.insumos || subServicio.insumos.length === 0) {
      return 0;
    }

    return subServicio.insumos.reduce((total, insumo) => {
      return total + parseFloat(insumo.insumo.costo) * insumo.cantidad;
    }, 0);
  };

  const costoTotalInsumos = calcularCostoTotalInsumos();

  const calcularCostoTotal = (precio: number): number => {
    return costoTotalInsumos + precio;
  };

  const precioWatch = watch("precio");

  useEffect(() => {
    if (precioWatch !== undefined) {
      const costoTotal = calcularCostoTotal(precioWatch);
      setValue("costo", costoTotal);
      setPrecioServicio(precioWatch);
    }
  }, [precioWatch, setValue]);

  useEffect(() => {
    if (isEditing && editPrecio) {
      const precio = Number(editPrecio.precio);
      const costoCalculado = calcularCostoTotal(precio);

      setValue("paisId", editPrecio.pais.id);
      setValue("precio", precio);
      setValue("tiempo", editPrecio.tiempo);
      setValue("cantidadMin", editPrecio.cantidadMin);
      setValue("cantidadMax", editPrecio.cantidadMax);
      setValue(
        "costo",
        editPrecio.costo ? Number(editPrecio.costo) : costoCalculado
      );

      setPrecioServicio(precio);
    } else {
      reset();
      setPrecioServicio(0);

      setValue("precio", 0);
      setValue("costo", costoTotalInsumos);
    }
  }, [isEditing, editPrecio, setValue, reset, costoTotalInsumos]);

  const createMutation = useMutation({
    mutationFn: (data: CrearServicePrecio) => AddServicioPrecio(data),
    onSuccess: () => {
      toast.success("Precio agregado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["servicios-admin"] });
      onSuccess();
      onCancel();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al crear los precios";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de crear el precio. Inténtalo de nuevo."
        );
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<CrearServicePrecio>) => {
      if (!editPrecio?.id) {
        throw new Error("ID del precio es requerido para editar");
      }

      return updateServicioPrecio(editPrecio.id, data);
    },
    onSuccess: () => {
      toast.success("Precio actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["servicios-admin"] });
      onSuccess();
      onCancel();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al actualizar los precios";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de actualizar el precio. Inténtalo de nuevo."
        );
      }
    },
  });

  const isLoading = createMutation.isPending || updateMutation.isPending;

  const handleFormSubmit = (data: CrearServicePrecio) => {
    if (data.cantidadMin >= data.cantidadMax) {
      toast.error("La cantidad mínima debe ser menor que la máxima");
      return;
    }

    if (data.tiempo <= 0) {
      toast.error("El tiempo debe ser mayor a 0");
      return;
    }

    if (data.precio <= 0) {
      toast.error("El precio debe ser mayor a 0");
      return;
    }

    if (data.costo && data.costo < 0) {
      toast.error("El costo no puede ser negativo");
      return;
    }

    const costoFinal = data.costo || calcularCostoTotal(data.precio);

    const submitData = {
      ...data,
      costo: costoFinal,
    };

    if (isEditing) {
      updateMutation.mutate(submitData);
    } else {
      createMutation.mutate({
        ...submitData,
        sub_servicio_id: subServicioId,
        paisId: paisId,
      });
    }
  };

  const costoTotal = calcularCostoTotal(precioServicio);

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 p-4">
      <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-blue-800">
              Costo de insumos:
            </span>
            <span className="text-sm font-bold text-blue-800">
              {user?.pais.simbolo_moneda} {costoTotalInsumos.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-blue-800">
              Precio del servicio:
            </span>
            <span className="text-sm font-bold text-blue-800">
              {user?.pais.simbolo_moneda} {precioServicio.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center border-t border-blue-200 pt-2">
            <span className="text-sm font-bold text-blue-800">
              Costo total:
            </span>
            <span className="text-sm font-bold text-blue-800">
              {user?.pais.simbolo_moneda} {costoTotal.toFixed(2)}
            </span>
          </div>
        </div>
        <p className="text-xs text-blue-600 mt-2">
          Costo total = Insumos + Precio del servicio
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="precio" className="font-bold">
            Precio Servicio*
          </Label>
          <Input
            id="precio"
            type="number"
            step="0.01"
            min="0"
            disabled={isLoading}
            {...register("precio", {
              required: "El precio es requerido",
              min: { value: 0.01, message: "El precio debe ser mayor a 0" },
              valueAsNumber: true,
            })}
            placeholder="0.00"
          />
          {errors.precio && (
            <p className="text-sm font-medium text-red-500">
              {errors.precio.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tiempo" className="font-bold">
            Tiempo (horas) *
          </Label>
          <Input
            id="tiempo"
            type="number"
            min="1"
            disabled={isLoading}
            {...register("tiempo", {
              required: "El tiempo es requerido",
              min: {
                value: 1,
                message: "El tiempo debe ser al menos 1 hora",
              },
              valueAsNumber: true,
            })}
            placeholder="1"
          />
          {errors.tiempo && (
            <p className="text-sm font-medium text-red-500">
              {errors.tiempo.message}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cantidadMin" className="font-bold">
            Cantidad Mínima Animales*
          </Label>
          <Input
            id="cantidadMin"
            type="number"
            min="1"
            disabled={isLoading}
            {...register("cantidadMin", {
              required: "La cantidad mínima es requerida",
              min: {
                value: 1,
                message: "La cantidad mínima debe ser al menos 1",
              },
              valueAsNumber: true,
            })}
            placeholder="1"
          />
          {errors.cantidadMin && (
            <p className="text-sm font-medium text-red-500">
              {errors.cantidadMin.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cantidadMax" className="font-bold">
            Cantidad Máxima Animales*
          </Label>
          <Input
            id="cantidadMax"
            type="number"
            min="1"
            disabled={isLoading}
            {...register("cantidadMax", {
              required: "La cantidad máxima es requerida",
              min: {
                value: 1,
                message: "La cantidad máxima debe ser al menos 1",
              },
              valueAsNumber: true,
            })}
            placeholder="10"
          />
          {errors.cantidadMax && (
            <p className="text-sm font-medium text-red-500">
              {errors.cantidadMax.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="costo" className="font-bold">
          Costo total manual (opcional)
        </Label>
        <Input
          id="costo"
          type="number"
          step="0.01"
          min="0"
          disabled={isLoading}
          {...register("costo", {
            min: { value: 0, message: "El costo no puede ser negativo" },
            valueAsNumber: true,
          })}
          placeholder={`${costoTotal.toFixed(2)} (valor calculado)`}
        />
        {errors.costo && (
          <p className="text-sm font-medium text-red-500">
            {errors.costo.message}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Si dejas este campo en blanco, se usará el cálculo automático: Insumos
          + Precio servicio
        </p>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
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
              {isEditing ? "Actualizando..." : "Creando..."}
            </>
          ) : (
            <>{isEditing ? "Actualizar Precio" : "Agregar Precio"}</>
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormAddPrecios;
