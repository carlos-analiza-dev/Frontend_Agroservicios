import { CrearImpueto } from "@/apis/impuestos/accions/crear-impuesto";
import { EditarImpueto } from "@/apis/impuestos/accions/editar-impuesto";
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
}

const FormImpuestos = ({ onSuccess, editImpuesto, isEdit }: Props) => {
  const { user } = useAuthStore();
  const paisId = user?.pais.id ?? "";
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    watch,
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

  const mutation = useMutation({
    mutationFn: (data: CrearImpuestoInterface) => CrearImpueto(data),
    onSuccess: () => {
      toast.success("Impuesto creado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["taxes"] });
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
            : "Hubo un error al crear el impuesto";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de crear el impuesto. Inténtalo de nuevo."
        );
      }
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: (data: CrearImpuestoInterface) =>
      EditarImpueto(editImpuesto?.id ?? "", data),
    onSuccess: () => {
      toast.success("Impuesto actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["taxes"] });
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
            : "Hubo un error al actualizar el impuesto";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de actualizar el impuesto. Inténtalo de nuevo."
        );
      }
    },
  });

  const onSubmit = (data: CrearImpuestoInterface) => {
    if (isEdit) {
      mutationUpdate.mutate(data);
    } else {
      mutation.mutate({ ...data, paisId: paisId });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label className="font-bold">Nombre del Impuesto*</Label>
        <Input
          {...register("nombre", { required: "El campo nombre es requerido" })}
          placeholder="Escriba el nombre del impuesto"
        />
        {errors.nombre && (
          <p className="text-sm font-medium text-red-500">
            {errors.nombre.message as string}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label className="font-bold">Porcentaje*</Label>
        <Input
          type="number"
          step="1"
          min="1"
          max="99"
          {...register("porcentaje", {
            required: "El campo porcentaje es requerido",
            min: {
              value: 1,
              message: "El porcentaje debe ser mayor o igual a 1",
            },
            max: {
              value: 99,
              message: "El porcentaje debe ser menor o igual a 99",
            },
            valueAsNumber: true,
          })}
          placeholder="Ej: 15, 20, 25, 30"
        />

        {errors.porcentaje && (
          <p className="text-sm font-medium text-red-500">
            {errors.porcentaje.message as string}
          </p>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={mutation.isPending || mutationUpdate.isPending}
        >
          {mutation.isPending || mutationUpdate.isPending ? (
            <span className="flex items-center">
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
            </span>
          ) : (
            <span>{isEdit ? "Actualizar Impuesto" : "Crear Impuesto"}</span>
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormImpuestos;
