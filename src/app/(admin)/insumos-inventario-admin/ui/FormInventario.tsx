import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
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

import { CrearInventarioInsumoInterface } from "@/apis/inventario-insumos/interfaces/crear-inventario-insumo.interface";
import useGetInsumosSinInv from "@/hooks/insumos/useGetInsumosSinInv";
import { CrearInventario } from "@/apis/inventario-insumos/accions/crear-inventario-insumo";
import { EditarInventario } from "@/apis/inventario-insumos/accions/editar-inventario-insumo";
import { Inventario } from "@/apis/inventario-insumos/interfaces/response-inventarios-insumos.interface";

interface Props {
  onSuccess: () => void;
  editInventario?: Inventario | null;
  isEdit?: boolean;
}

const FormInventario = ({ onSuccess, editInventario, isEdit }: Props) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CrearInventarioInsumoInterface>();

  const { data: insumos } = useGetInsumosSinInv();

  useEffect(() => {
    if (editInventario && isEdit) {
      reset({
        insumoId: editInventario.insumo?.id || "",
        cantidadDisponible: editInventario.cantidadDisponible,
        stockMinimo: editInventario.stockMinimo,
      });
    }
  }, [editInventario, isEdit, reset]);

  const mutation = useMutation({
    mutationFn: (data: CrearInventarioInsumoInterface) => CrearInventario(data),
    onSuccess: () => {
      toast.success("Inventario actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["inventarios-admin"] });
      queryClient.invalidateQueries({
        queryKey: ["insumos-sin-inventario-admin"],
      });
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
            : "Hubo un error al actualizar el inventario";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de actualizar el inventario. Inténtalo de nuevo."
        );
      }
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: (data: CrearInventarioInsumoInterface) =>
      EditarInventario(editInventario?.id ?? "", data),
    onSuccess: () => {
      toast.success("Inventario actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["inventarios-admin"] });
      queryClient.invalidateQueries({
        queryKey: ["insumos-sin-inventario-admin"],
      });
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
            : "Hubo un error al actualizar el inventario";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de actualizar el inventario. Inténtalo de nuevo."
        );
      }
    },
  });

  const onSubmit = (data: CrearInventarioInsumoInterface) => {
    if (isEdit) {
      mutationUpdate.mutate(data);
    } else {
      mutation.mutate(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {!isEdit && (
        <div className="space-y-1">
          <Label className="font-bold">Insumo*</Label>
          <Select
            defaultValue={isEdit ? editInventario?.insumo?.id : ""}
            onValueChange={(value) => setValue("insumoId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un insumo" />
            </SelectTrigger>
            <SelectContent>
              {insumos?.map((insumo) => (
                <SelectItem key={insumo.id} value={insumo.id}>
                  {insumo.nombre} - {insumo.codigo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.insumoId && (
            <p className="text-sm font-medium text-red-500">
              {errors.insumoId.message as string}
            </p>
          )}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="font-bold">Cantidad Disponible*</Label>
          <Input
            type="number"
            min="0"
            step="1"
            {...register("cantidadDisponible", {
              required: "La cantidad disponible es requerida",
              min: { value: 0, message: "La cantidad no puede ser negativa" },
              valueAsNumber: true,
            })}
            placeholder="0"
          />
          {errors.cantidadDisponible && (
            <p className="text-sm font-medium text-red-500">
              {errors.cantidadDisponible.message as string}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label className="font-bold">Stock Mínimo*</Label>
          <Input
            type="number"
            min="0"
            step="1"
            {...register("stockMinimo", {
              required: "El stock mínimo es requerido",
              min: {
                value: 0,
                message: "El stock mínimo no puede ser negativo",
              },
              validate: (value) => {
                const cantidadDisponible = watch("cantidadDisponible");
                if (
                  cantidadDisponible !== undefined &&
                  value > cantidadDisponible
                ) {
                  return "El stock mínimo no puede ser mayor que la cantidad disponible";
                }
                return true;
              },
              valueAsNumber: true,
            })}
            placeholder="0"
          />
          {errors.stockMinimo && (
            <p className="text-sm font-medium text-red-500">
              {errors.stockMinimo.message as string}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={mutation.isPending || mutationUpdate.isPending}
          className="min-w-[120px]"
        >
          {mutation.isPending || mutationUpdate.isPending ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {isEdit ? "Actualizando..." : "Creando..."}
            </>
          ) : (
            <>{isEdit ? "Actualizar Inventario" : "Crear Inventario"}</>
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormInventario;
