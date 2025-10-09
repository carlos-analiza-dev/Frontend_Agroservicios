import { CrearDescuento } from "@/apis/descuentos-clientes/accions/crear-descuento";
import { EditarDescuento } from "@/apis/descuentos-clientes/accions/editar-descuento";
import { CrearImpueto } from "@/apis/impuestos/accions/crear-impuesto";
import { EditarImpuesto } from "@/apis/impuestos/accions/editar-impuesto";
import { CrearImpuestoInterface } from "@/apis/impuestos/interfaces/crear-impuesto.interface";
import { ResponseTaxesInterface } from "@/apis/impuestos/interfaces/response-taxes-pais.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface Props {
  editImpuesto?: ResponseTaxesInterface | null;
  isEdit?: boolean;
  onSuccess: () => void;
  tipo: "impuesto" | "descuento";
}

const FormImpuestos = ({ onSuccess, editImpuesto, isEdit, tipo }: Props) => {
  const { user } = useAuthStore();
  const paisId = user?.pais.id ?? "";
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CrearImpuestoInterface>();

  useEffect(() => {
    if (editImpuesto && isEdit) {
      reset({
        nombre: editImpuesto.nombre,
        porcentaje: parseFloat(editImpuesto.porcentaje),
        paisId: editImpuesto.pais.id,
      });
    }
  }, [editImpuesto, isEdit, reset]);

  const mensaje = tipo === "impuesto" ? "Impuesto" : "Descuento";

  const mutation = useMutation({
    mutationFn: (data: CrearImpuestoInterface) =>
      tipo === "impuesto" ? CrearImpueto(data) : CrearDescuento(data),
    onSuccess: () => {
      toast.success(`${mensaje} creado exitosamente`);
      if (tipo === "impuesto") {
        queryClient.invalidateQueries({ queryKey: ["taxes"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["descuentos-clientes"] });
      }
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
            : `Hubo un error al crear el ${mensaje.toLowerCase()}`;
        toast.error(errorMessage);
      } else {
        toast.error(`Error al crear el ${mensaje.toLowerCase()}.`);
      }
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: (data: CrearImpuestoInterface) =>
      tipo === "impuesto"
        ? EditarImpuesto(editImpuesto?.id ?? "", data)
        : EditarDescuento(editImpuesto?.id ?? "", data),
    onSuccess: () => {
      toast.success(`${mensaje} actualizado exitosamente`);
      queryClient.invalidateQueries({ queryKey: ["taxes"] });
      queryClient.invalidateQueries({ queryKey: ["descuentos-clientes"] });
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
            : `Hubo un error al actualizar el ${mensaje.toLowerCase()}`;
        toast.error(errorMessage);
      } else {
        toast.error(`Error al actualizar el ${mensaje.toLowerCase()}.`);
      }
    },
  });

  const onSubmit = (data: CrearImpuestoInterface) => {
    if (isEdit) {
      mutationUpdate.mutate(data);
    } else {
      mutation.mutate({ ...data, paisId });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label className="font-bold">Nombre del {mensaje}*</Label>
        <Input
          {...register("nombre", {
            required: `El nombre del ${mensaje.toLowerCase()} es requerido`,
          })}
          placeholder={`Ej: ${tipo === "impuesto" ? "ISV, IVA" : "Cliente VIP, Black Friday"}`}
        />
        {errors.nombre && (
          <p className="text-sm text-red-500">{errors.nombre.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label className="font-bold">Porcentaje*</Label>
        <Input
          type="number"
          step="0.01"
          min="1"
          max="99"
          {...register("porcentaje", {
            required: `El porcentaje del ${mensaje.toLowerCase()} es requerido`,
            min: { value: 1, message: "Debe ser mayor o igual a 1" },
            max: { value: 99, message: "Debe ser menor o igual a 99" },
            valueAsNumber: true,
          })}
          placeholder="Ej: 15, 20, 25"
        />
        {errors.porcentaje && (
          <p className="text-sm text-red-500">{errors.porcentaje.message}</p>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={mutation.isPending || mutationUpdate.isPending}
        >
          {mutation.isPending || mutationUpdate.isPending
            ? isEdit
              ? `Actualizando ${mensaje}...`
              : `Creando ${mensaje}...`
            : isEdit
              ? `Actualizar ${mensaje}`
              : `Crear ${mensaje}`}
        </Button>
      </div>
    </form>
  );
};

export default FormImpuestos;
