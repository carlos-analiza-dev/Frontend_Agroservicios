import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { CrearRangoFacturaInterface } from "@/apis/rangos-factura/interfaces/crear-rango-factura.interface";
import { CrearRangoFactura } from "@/apis/rangos-factura/accions/crear-rango-factura";
import { ActuralizarRangoFactura } from "@/apis/rangos-factura/accions/editar-rango-factura";
import { RangoFactura } from "@/apis/rangos-factura/interfaces/response-rangos-factura.interface";

interface Props {
  editRango?: RangoFactura | null;
  isEdit?: boolean;
  onSuccess: () => void;
}

const FormCrearRangosFactura = ({ onSuccess, editRango, isEdit }: Props) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,

    formState: { errors },
  } = useForm<CrearRangoFacturaInterface>();

  useEffect(() => {
    if (editRango && isEdit) {
      const formatDateForInput = (dateString: string) => {
        const date = new Date(dateString);
        return date.toISOString().split("T")[0];
      };

      reset({
        cai: editRango.cai,
        prefijo: editRango.prefijo,
        rango_inicial: editRango.rango_inicial,
        rango_final: editRango.rango_final,
        fecha_recepcion: formatDateForInput(editRango.fecha_recepcion),
        fecha_limite_emision: formatDateForInput(
          editRango.fecha_limite_emision
        ),
      });
    }
  }, [editRango, isEdit, reset]);

  const mutation = useMutation({
    mutationFn: (data: CrearRangoFacturaInterface) => CrearRangoFactura(data),
    onSuccess: () => {
      toast.success("Rango de factura creado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["rangos-factura"] });
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
            : "Hubo un error al crear el rango de factura";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de crear el rango de factura. Inténtalo de nuevo."
        );
      }
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: (data: CrearRangoFacturaInterface) =>
      ActuralizarRangoFactura(editRango?.id ?? "", data),
    onSuccess: () => {
      toast.success("Rango de factura actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["rangos-factura"] });
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
            : "Hubo un error al actualizar el rango de factura";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de actualizar el rango de factura. Inténtalo de nuevo."
        );
      }
    },
  });

  const onSubmit = (data: CrearRangoFacturaInterface) => {
    if (data.rango_inicial >= data.rango_final) {
      toast.error("El rango inicial debe ser menor al rango final");
      return;
    }

    const fechaRecepcion = new Date(data.fecha_recepcion);
    const fechaLimite = new Date(data.fecha_limite_emision);

    if (fechaRecepcion >= fechaLimite) {
      toast.error("La fecha de recepción debe ser anterior a la fecha límite");
      return;
    }

    if (isEdit) {
      mutationUpdate.mutate(data);
    } else {
      mutation.mutate(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label className="font-bold">CAI*</Label>
        <Input
          {...register("cai", {
            required: "El campo CAI es requerido",
            pattern: {
              value: /^[A-Z0-9-]+$/,
              message:
                "El CAI debe contener solo letras mayúsculas, números y guiones",
            },
          })}
          placeholder="Ej: 3C9F95-D124D1-0150BE-4E8683-5FEG02-9C"
          maxLength={37}
        />
        {errors.cai && (
          <p className="text-sm font-medium text-red-500">
            {errors.cai.message as string}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label className="font-bold">Prefijo*</Label>
        <Input
          {...register("prefijo", {
            required: "El campo prefijo es requerido",
            pattern: {
              value: /^[0-9-]+$/,
              message: "El prefijo debe contener solo números y guiones",
            },
          })}
          placeholder="Ej: 000-002-01-"
          maxLength={15}
        />
        {errors.prefijo && (
          <p className="text-sm font-medium text-red-500">
            {errors.prefijo.message as string}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="font-bold">Rango Inicial*</Label>
          <Input
            type="number"
            {...register("rango_inicial", {
              required: "El rango inicial es requerido",
              min: {
                value: 1,
                message: "El rango inicial debe ser mayor a 0",
              },
              valueAsNumber: true,
            })}
            placeholder="Ej: 200001"
            min={1}
          />
          {errors.rango_inicial && (
            <p className="text-sm font-medium text-red-500">
              {errors.rango_inicial.message as string}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label className="font-bold">Rango Final*</Label>
          <Input
            type="number"
            {...register("rango_final", {
              required: "El rango final es requerido",
              min: {
                value: 1,
                message: "El rango final debe ser mayor a 0",
              },
              valueAsNumber: true,
            })}
            placeholder="Ej: 220000"
            min={1}
          />
          {errors.rango_final && (
            <p className="text-sm font-medium text-red-500">
              {errors.rango_final.message as string}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label className="font-bold">Fecha de Recepción*</Label>
          <Input
            type="date"
            {...register("fecha_recepcion", {
              required: "La fecha de recepción es requerida",
            })}
          />
          {errors.fecha_recepcion && (
            <p className="text-sm font-medium text-red-500">
              {errors.fecha_recepcion.message as string}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <Label className="font-bold">Fecha Límite de Emisión*</Label>
          <Input
            type="date"
            {...register("fecha_limite_emision", {
              required: "La fecha límite de emisión es requerida",
            })}
          />
          {errors.fecha_limite_emision && (
            <p className="text-sm font-medium text-red-500">
              {errors.fecha_limite_emision.message as string}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={mutation.isPending || mutationUpdate.isPending}
          className="w-full md:w-auto"
        >
          {mutation.isPending || mutationUpdate.isPending ? (
            <>Procesando...</>
          ) : isEdit ? (
            "Actualizar Rango"
          ) : (
            "Crear Rango"
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormCrearRangosFactura;
