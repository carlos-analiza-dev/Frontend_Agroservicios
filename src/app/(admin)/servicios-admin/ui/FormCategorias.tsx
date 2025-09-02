import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { CrearServicio } from "@/apis/servicios/interfaces/crear-servicio.interface";
import { AddServicio } from "@/apis/servicios/accions/crear-servicio";
import { EditarServicio } from "@/apis/servicios/accions/editar-servicio";
import { Servicio } from "@/apis/servicios/interfaces/response-servicios.interface";
import { useAuthStore } from "@/providers/store/useAuthStore";

interface Props {
  editServicio?: Servicio | null;
  isEdit?: boolean;
  onSuccess: () => void;
}

const FormCategorias = ({ onSuccess, editServicio, isEdit }: Props) => {
  const { user } = useAuthStore();
  const paisId = user?.pais.id || "";
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CrearServicio>();

  useEffect(() => {
    if (isEdit && editServicio) {
      reset({
        nombre: editServicio.nombre,
        descripcion: editServicio.descripcion,
        isActive: editServicio.isActive,
      });
    } else {
      reset({
        nombre: "",
        descripcion: "",
        isActive: true,
      });
    }
  }, [isEdit, editServicio, reset]);

  const mutation = useMutation({
    mutationFn: (data: CrearServicio) => AddServicio(data),
    onSuccess: () => {
      toast.success("Categoría creada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["servicios-admin"] });
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
            : "Hubo un error al crear la categoría";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de crear la categoría. Inténtalo de nuevo."
        );
      }
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: (data: CrearServicio) =>
      EditarServicio(editServicio?.id ?? "", data),
    onSuccess: () => {
      toast.success("Categoría actualizada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["servicios-admin"] });
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
            : "Hubo un error al actualizar la categoría";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de actualizar la categoría. Inténtalo de nuevo."
        );
      }
    },
  });

  const onSubmit = (data: CrearServicio) => {
    if (isEdit) {
      mutationUpdate.mutate(data);
    } else {
      mutation.mutate({ ...data, paisId: paisId });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nombre" className="font-bold">
          Nombre de la Categoría*
        </Label>
        <Input
          id="nombre"
          {...register("nombre", {
            required: "El nombre de la categoría es requerido",
            minLength: {
              value: 3,
              message: "El nombre debe tener al menos 3 caracteres",
            },
            maxLength: {
              value: 50,
              message: "El nombre no puede tener más de 50 caracteres",
            },
          })}
          placeholder="Ej: Laboratorio, Reproducción, etc."
        />
        {errors.nombre && (
          <p className="text-sm font-medium text-red-500">
            {errors.nombre.message as string}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="descripcion" className="font-bold">
          Descripción*
        </Label>
        <textarea
          id="descripcion"
          {...register("descripcion", {
            required: "La descripción es requerida",
            minLength: {
              value: 10,
              message: "La descripción debe tener al menos 10 caracteres",
            },
            maxLength: {
              value: 255,
              message: "La descripción no puede tener más de 255 caracteres",
            },
          })}
          placeholder="Describe los servicios que incluye esta categoría"
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
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
            id="isActive"
            {...register("isActive")}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            defaultChecked
          />
          <Label htmlFor="isActive" className="text-sm font-normal">
            Categoría activa
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
            <>{isEdit ? "Actualizar Categoría" : "Crear Categoría"}</>
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormCategorias;
