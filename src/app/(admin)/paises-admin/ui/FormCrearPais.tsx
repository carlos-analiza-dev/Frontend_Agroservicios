import { CrearPaises } from "@/apis/paises/accions/crear-pais";
import { ActualizarPaises } from "@/apis/paises/accions/update-pais";
import { CreatePais } from "@/apis/paises/interfaces/crear-pais.interface";
import { PaisesResponse } from "@/apis/paises/interfaces/paises.response.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface Props {
  editPais?: PaisesResponse | null;
  isEdit?: boolean;
  onSucces: () => void;
}

const FormCrearPais = ({ onSucces, editPais, isEdit }: Props) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePais>();

  useEffect(() => {
    if (editPais && isEdit) {
      reset({
        nombre: editPais.nombre,
        code: editPais.code,
        code_phone: editPais.code_phone,
        nombre_documento: editPais.nombre_documento,
        nombre_moneda: editPais.nombre_moneda,
        simbolo_moneda: editPais.simbolo_moneda,
      });
    }
  }, [editPais, isEdit, reset]);

  const mutation = useMutation({
    mutationFn: (data: CreatePais) => CrearPaises(data),
    onSuccess: () => {
      (toast.success("Pais creado exitosamente"),
        queryClient.invalidateQueries({ queryKey: ["paises"] }));
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
            : "Hubo un error al crear el pais";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de crear el pais. Inténtalo de nuevo."
        );
      }
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: (data: CreatePais) =>
      ActualizarPaises(editPais?.id ?? "", data),
    onSuccess: () => {
      (toast.success("Pais actualizado exitosamente"),
        queryClient.invalidateQueries({ queryKey: ["paises"] }));
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
            : "Hubo un error al actualizar el pais";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de actualizar el pais. Inténtalo de nuevo."
        );
      }
    },
  });

  const onSubmit = (data: CreatePais) => {
    if (isEdit) {
      mutationUpdate.mutate(data);
    } else {
      mutation.mutate(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-1">
        <Label className="font-bol">Nombre Pais*</Label>
        <Input
          {...register("nombre", { required: "El campo nombre es requerido" })}
          placeholder="Escriba el nombre del pais"
        />
        {errors.nombre && (
          <p className="text-sm font-medium text-red-500">
            {errors.nombre.message as string}
          </p>
        )}
      </div>
      <div className="space-y-1 mt-3">
        <Label className="font-bol">Nombre Documento*</Label>
        <Input
          {...register("nombre_documento", {
            required: "El campo nombre documento es requerido",
          })}
          placeholder="Ejem: DNI, DUI, DPI"
        />
        {errors.nombre_documento && (
          <p className="text-sm font-medium text-red-500">
            {errors.nombre_documento.message as string}
          </p>
        )}
      </div>
      <div className="space-y-1 mt-3">
        <Label className="font-bol">Nombre Moneda*</Label>
        <Input
          {...register("nombre_moneda", {
            required: "El nombre de la moneda es requerido",
          })}
          placeholder="Ejem: Lempira,Quetzal,Dolar"
        />
        {errors.nombre_moneda && (
          <p className="text-sm font-medium text-red-500">
            {errors.nombre_moneda.message as string}
          </p>
        )}
      </div>
      <div className="space-y-1 mt-3">
        <Label className="font-bol">Simbolo Moneda*</Label>
        <Input
          {...register("simbolo_moneda", {
            required: "El simbolo de la moneda es requerido",
          })}
          placeholder="Ejem: L, Q, $"
        />
        {errors.simbolo_moneda && (
          <p className="text-sm font-medium text-red-500">
            {errors.simbolo_moneda.message as string}
          </p>
        )}
      </div>
      <div className="space-y-1 mt-3">
        <Label className="font-bol">Codigo Pais*</Label>
        <Input
          {...register("code", {
            required: "El codigo del pais es requerido",
          })}
          placeholder="Ejem: HN, GT, SV"
        />
        {errors.code && (
          <p className="text-sm font-medium text-red-500">
            {errors.code.message as string}
          </p>
        )}
      </div>
      <div className="space-y-1 mt-3">
        <Label className="font-bol">Codigo Telefono*</Label>
        <Input
          {...register("code_phone", {
            required: "El codigo del relefono es requerido",
          })}
          placeholder="Ejem: +504, +502, +502"
        />
        {errors.code_phone && (
          <p className="text-sm font-medium text-red-500">
            {errors.code_phone.message as string}
          </p>
        )}
      </div>
      <div className="flex justify-end mt-5">
        <Button type="submit" disabled={mutation.isPending}>
          {isEdit ? "Editar Pais" : "Crear Pais"}
        </Button>
      </div>
    </form>
  );
};

export default FormCrearPais;
