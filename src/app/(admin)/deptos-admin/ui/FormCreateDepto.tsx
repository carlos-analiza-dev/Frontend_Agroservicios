import { CreateDepartamento } from "@/apis/departamentos/interfaces/create-departamento.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import usePaises from "@/hooks/paises/usePaises";
import {
  Departamento,
  ResponseDeptos,
} from "@/apis/departamentos/interfaces/response-departamentos.interface";
import { CrearDepto } from "@/apis/departamentos/accions/crear-departamento";
import { ActualizarDepto } from "@/apis/departamentos/accions/update-depto";

interface Props {
  editDepartamento?: Departamento | null;
  isEdit?: boolean;
  onSucces: () => void;
  paisId?: string;
}

const FormCreateDepto = ({
  onSucces,
  editDepartamento,
  isEdit,
  paisId,
}: Props) => {
  const queryClient = useQueryClient();
  const { data: paises } = usePaises();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateDepartamento>();

  useEffect(() => {
    if (editDepartamento && isEdit) {
      reset({
        nombre: editDepartamento.nombre,
        pais: editDepartamento.pais.id,
        isActive: editDepartamento.isActive,
      });
    } else if (paisId) {
      setValue("pais", paisId);
    }
  }, [editDepartamento, isEdit, reset, setValue, paisId]);

  const mutation = useMutation({
    mutationFn: (data: CreateDepartamento) => CrearDepto(data),
    onSuccess: () => {
      toast.success("Departamento creado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["departamentos-pais"] });
      reset();
      onSucces();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al crear el departamento";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de crear el departamento. Inténtalo de nuevo."
        );
      }
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: (data: CreateDepartamento) =>
      ActualizarDepto(editDepartamento?.id ?? "", data),
    onSuccess: () => {
      toast.success("Departamento actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["departamentos-pais"] });
      reset();
      onSucces();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al actualizar el departamento";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de actualizar el departamento. Inténtalo de nuevo."
        );
      }
    },
  });

  const onSubmit = (data: CreateDepartamento) => {
    if (isEdit) {
      mutationUpdate.mutate(data);
    } else {
      mutation.mutate(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label className="font-bold">Nombre Departamento*</Label>
        <Input
          {...register("nombre", { required: "El campo nombre es requerido" })}
          placeholder="Escriba el nombre del departamento"
        />
        {errors.nombre && (
          <p className="text-sm font-medium text-red-500">
            {errors.nombre.message as string}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label className="font-bold">País*</Label>
        <Select
          onValueChange={(value) => setValue("pais", value)}
          defaultValue={isEdit ? editDepartamento?.pais.id : paisId}
          disabled={!!paisId && !isEdit}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione un país" />
          </SelectTrigger>
          <SelectContent>
            {paises?.data.map((pais) => (
              <SelectItem key={pais.id} value={pais.id}>
                {pais.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.pais && (
          <p className="text-sm font-medium text-red-500">
            {errors.pais?.message as string}
          </p>
        )}
      </div>

      {isEdit && (
        <div className="space-y-1">
          <Label className="font-bold">Estado</Label>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isActive"
              {...register("isActive")}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            <Label htmlFor="isActive">Activo</Label>
          </div>
        </div>
      )}

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={mutation.isPending || mutationUpdate.isPending}
        >
          {isEdit ? "Actualizar Departamento" : "Crear Departamento"}
        </Button>
      </div>
    </form>
  );
};

export default FormCreateDepto;
