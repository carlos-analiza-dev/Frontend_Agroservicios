import { CreateMunicipio } from "@/apis/municipios/interfaces/create-municipio.interface";
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
import { CrearMunicipio } from "@/apis/municipios/accions/crear-municipio";
import { ActualizarMunicipio } from "@/apis/municipios/accions/update-municipio";
import { Municipio } from "@/apis/municipios/interfaces/response-municipios.interface";
import { Departamento } from "@/apis/departamentos/interfaces/response-departamentos.interface";

interface Props {
  editMunicipio?: Municipio | null;
  isEdit?: boolean;
  onSucces: () => void;
  deptoId?: string;
  departamentos?: Departamento[];
}

const FormCreateMunicipio = ({
  onSucces,
  editMunicipio,
  isEdit,
  deptoId,
  departamentos,
}: Props) => {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CreateMunicipio>();

  useEffect(() => {
    if (editMunicipio && isEdit) {
      reset({
        nombre: editMunicipio.nombre,
        departamento: editMunicipio.departamento.id,
        isActive: editMunicipio.isActive,
      });
    } else if (deptoId) {
      setValue("departamento", deptoId);
    }
  }, [editMunicipio, isEdit, reset, setValue, deptoId]);

  const mutation = useMutation({
    mutationFn: (data: CreateMunicipio) => CrearMunicipio(data),
    onSuccess: () => {
      toast.success("Municipio creado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["municipios-depto"] });
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
            : "Hubo un error al crear el municipio";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de crear el municipio. Inténtalo de nuevo."
        );
      }
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: (data: CreateMunicipio) =>
      ActualizarMunicipio(editMunicipio?.id ?? "", data),
    onSuccess: () => {
      toast.success("Municipio actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["municipios-depto"] });
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
            : "Hubo un error al actualizar el municipio";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de actualizar el municipio. Inténtalo de nuevo."
        );
      }
    },
  });

  const onSubmit = (data: CreateMunicipio) => {
    if (isEdit) {
      mutationUpdate.mutate(data);
    } else {
      mutation.mutate(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label className="font-bold">Nombre Municipio*</Label>
        <Input
          {...register("nombre", { required: "El campo nombre es requerido" })}
          placeholder="Escriba el nombre del municipio"
        />
        {errors.nombre && (
          <p className="text-sm font-medium text-red-500">
            {errors.nombre.message as string}
          </p>
        )}
      </div>

      {!isEdit && (
        <div className="space-y-1">
          <Label className="font-bold">Departamento*</Label>
          <Select
            onValueChange={(value) => setValue("departamento", value)}
            defaultValue={isEdit ? editMunicipio?.departamento.id : deptoId}
            disabled={!!deptoId && !isEdit}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccione un departamento" />
            </SelectTrigger>
            <SelectContent>
              {departamentos?.map((depto) => (
                <SelectItem key={depto.id} value={depto.id}>
                  {depto.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.departamento && (
            <p className="text-sm font-medium text-red-500">
              {errors.departamento?.message as string}
            </p>
          )}
        </div>
      )}

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
          {isEdit ? "Actualizar Municipio" : "Crear Municipio"}
        </Button>
      </div>
    </form>
  );
};

export default FormCreateMunicipio;
