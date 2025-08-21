import { ActualizarProveedor } from "@/apis/proveedores/accions/actualizar-proveedores";
import { CrearProveedor } from "@/apis/proveedores/accions/crear-proveedores";
import { CrearProveedorInterface } from "@/apis/proveedores/interfaces/crear-proveedor.interface";
import { Proveedor } from "@/apis/proveedores/interfaces/response-proveedores.interface";
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
import useGetDeptosActivesByPais from "@/hooks/departamentos/useGetDeptosActivesByPais";
import useGetMunicipiosActivosByDepto from "@/hooks/municipios/useGetMunicipiosActivosByDepto";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface Props {
  editProveedor?: Proveedor | null;
  isEdit?: boolean;
  onSucces: () => void;
}

const FormProveedor = ({ onSucces, editProveedor, isEdit }: Props) => {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CrearProveedorInterface>();
  const { user } = useAuthStore();
  const paisId = user?.pais.id || "";

  const { data: departamentos } = useGetDeptosActivesByPais(paisId);
  const deptoId = watch("departamentoId");
  const { data: municipios } = useGetMunicipiosActivosByDepto(deptoId);

  const departamentoId = watch("departamentoId");

  useEffect(() => {
    if (editProveedor && isEdit) {
      reset({
        nit_rtn: editProveedor.nit_rtn,
        nrc: editProveedor.nrc,
        nombre_legal: editProveedor.nombre_legal,
        complemento_direccion: editProveedor.complemento_direccion,
        telefono: editProveedor.telefono,
        correo: editProveedor.correo,
        nombre_contacto: editProveedor.nombre_contacto,
        departamentoId: editProveedor.departamento.id,
        municipioId: editProveedor.municipio.id,
      });
    }
  }, [editProveedor, isEdit, reset]);

  const mutation = useMutation({
    mutationFn: (data: CrearProveedorInterface) => CrearProveedor(data),
    onSuccess: () => {
      toast.success("Proveedor creado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["proveedores"] });
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
            : "Hubo un error al crear el proveedor";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de crear el proveedor. Inténtalo de nuevo."
        );
      }
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: (data: CrearProveedorInterface) =>
      ActualizarProveedor(editProveedor?.id ?? "", data),
    onSuccess: () => {
      toast.success("Proveedor actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["proveedores"] });
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
            : "Hubo un error al actualizar el proveedor";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de actualizar el proveedor. Inténtalo de nuevo."
        );
      }
    },
  });

  const onSubmit = (data: CrearProveedorInterface) => {
    if (isEdit) {
      mutationUpdate.mutate(data);
    } else {
      mutation.mutate(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label className="font-bold">NIT/RTN*</Label>
        <Input
          {...register("nit_rtn", {
            required: "El NIT/RTN es requerido",
            pattern: {
              value: /^[0-9]+$/,
              message: "Solo se permiten números",
            },
          })}
          placeholder="Ingrese el NIT/RTN"
          maxLength={14}
        />
        {errors.nit_rtn && (
          <p className="text-sm font-medium text-red-500">
            {errors.nit_rtn.message as string}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label className="font-bold">NRC*</Label>
        <Input
          {...register("nrc", {
            required: "El NRC es requerido",
            pattern: {
              value: /^[0-9-]+$/,
              message: "Formato inválido para NRC",
            },
          })}
          placeholder="Ej: 123456-7"
        />
        {errors.nrc && (
          <p className="text-sm font-medium text-red-500">
            {errors.nrc.message as string}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label className="font-bold">Nombre Legal*</Label>
        <Input
          {...register("nombre_legal", {
            required: "El nombre legal es requerido",
          })}
          placeholder="Nombre legal de la empresa"
        />
        {errors.nombre_legal && (
          <p className="text-sm font-medium text-red-500">
            {errors.nombre_legal.message as string}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label className="font-bold">Nombre de Contacto*</Label>
        <Input
          {...register("nombre_contacto", {
            required: "El nombre de contacto es requerido",
          })}
          placeholder="Persona de contacto"
        />
        {errors.nombre_contacto && (
          <p className="text-sm font-medium text-red-500">
            {errors.nombre_contacto.message as string}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label className="font-bold">Teléfono*</Label>
        <Input
          {...register("telefono", {
            required: "El teléfono es requerido",
            pattern: {
              value: /^[0-9-+() ]+$/,
              message: "Formato de teléfono inválido",
            },
          })}
          placeholder="Ej: 2234-5678"
        />
        {errors.telefono && (
          <p className="text-sm font-medium text-red-500">
            {errors.telefono.message as string}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label className="font-bold">Email*</Label>
        <Input
          {...register("correo", {
            required: "El email es requerido",
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: "Formato de email inválido",
            },
          })}
          placeholder="correo@ejemplo.com"
          type="email"
        />
        {errors.correo && (
          <p className="text-sm font-medium text-red-500">
            {errors.correo.message as string}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label className="font-bold">Complemento de Dirección</Label>
        <Input
          {...register("complemento_direccion")}
          placeholder="Detalles adicionales de la dirección"
        />
      </div>

      <div className="space-y-1">
        <Label className="font-bold">Departamento*</Label>
        <Select
          onValueChange={(value) => setValue("departamentoId", value)}
          defaultValue={editProveedor?.departamento.id}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione un departamento" />
          </SelectTrigger>
          <SelectContent>
            {departamentos?.data.map((departamento) => (
              <SelectItem key={departamento.id} value={departamento.id}>
                {departamento.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.departamentoId && (
          <p className="text-sm font-medium text-red-500">
            {errors.departamentoId.message as string}
          </p>
        )}
      </div>

      <div className="space-y-1">
        <Label className="font-bold">Municipio*</Label>
        <Select
          onValueChange={(value) => setValue("municipioId", value)}
          defaultValue={editProveedor?.municipio.id}
          disabled={!departamentoId}
        >
          <SelectTrigger>
            <SelectValue placeholder="Seleccione un municipio" />
          </SelectTrigger>
          <SelectContent>
            {municipios?.data.map((municipio) => (
              <SelectItem key={municipio.id} value={municipio.id}>
                {municipio.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.municipioId && (
          <p className="text-sm font-medium text-red-500">
            {errors.municipioId.message as string}
          </p>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={mutation.isPending || mutationUpdate.isPending}
          className="w-full sm:w-auto"
        >
          {isEdit ? "Actualizar Proveedor" : "Crear Proveedor"}
        </Button>
      </div>
    </form>
  );
};

export default FormProveedor;
