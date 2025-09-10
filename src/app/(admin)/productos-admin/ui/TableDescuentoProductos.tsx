import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Save, X, Trash2, Percent, Loader2 } from "lucide-react";
import { Producto } from "@/apis/productos/interfaces/response-productos.interface";
import useGetDescuentoProducto from "@/hooks/descuento-productos/useGetDescuentoProducto";
import { useForm } from "react-hook-form";
import { CrearDescuentoInterface } from "@/apis/descuentos_producto/interface/crear-descuento-producto.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { ResponseDescuentoInterface } from "@/apis/descuentos_producto/interface/response-descuento-producto.interface";
import { CrearDescuentoProducto } from "@/apis/descuentos_producto/accions/crear-descuento-producto";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { ActualizarDescuentoProducto } from "@/apis/descuentos_producto/accions/actualizar-descuentos";
import { StatusMessage } from "@/components/generics/StatusMessage";
import TableUsersSkeleton from "@/components/generics/SkeletonTable";

interface Props {
  selectedProducto: Producto | null;
}

interface DescuentoLocal extends ResponseDescuentoInterface {
  editing?: boolean;
}

interface ActualizarDescuentoInterface {
  cantidad_comprada: number;
  descuentos: number;
}

const TableDescuentoProductos = ({ selectedProducto }: Props) => {
  const queryClient = useQueryClient();
  const { data: descuentosData, isLoading } = useGetDescuentoProducto(
    selectedProducto?.id ?? ""
  );
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CrearDescuentoInterface>();
  const [descuentos, setDescuentos] = useState<DescuentoLocal[]>([]);

  const createMutation = useMutation({
    mutationFn: CrearDescuentoProducto,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["descuento-producto", selectedProducto?.id],
      });
      toast.success("Descuento creado exitosamente");
      reset();
    },
    onError: (error: any) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al crear los descuentos";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de crear los descuentos. Inténtalo de nuevo."
        );
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: {
      id: string;
      cantidad_comprada: number;
      descuentos: number;
    }) => {
      const updateData: ActualizarDescuentoInterface = {
        cantidad_comprada: data.cantidad_comprada,
        descuentos: data.descuentos,
      };
      return ActualizarDescuentoProducto(data.id, updateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["descuento-producto", selectedProducto?.id],
      });
      toast.success("Descuento actualizado exitosamente");
    },
    onError: (error: any) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al editar los descuentos";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de editar los descuentos. Inténtalo de nuevo."
        );
      }
    },
  });

  React.useEffect(() => {
    if (descuentosData) {
      setDescuentos(
        descuentosData.map((descuento) => ({
          ...descuento,
          editing: false,
        }))
      );
    }
  }, [descuentosData]);

  const toggleEdit = (id: string) => {
    setDescuentos(
      descuentos.map((descuento) =>
        descuento.id === id
          ? { ...descuento, editing: !descuento.editing }
          : { ...descuento, editing: false }
      )
    );
  };

  const handleSave = (id: string) => {
    const descuentoEditado = descuentos.find((d) => d.id === id);
    if (!descuentoEditado) return;

    updateMutation.mutate({
      id: descuentoEditado.id,
      cantidad_comprada: descuentoEditado.cantidad_comprada,
      descuentos: descuentoEditado.descuentos,
    });

    toggleEdit(id);
  };

  const onSubmit = (data: CrearDescuentoInterface) => {
    if (!selectedProducto) return;

    createMutation.mutate({
      ...data,
      productoId: selectedProducto.id,
    });
  };

  if (isLoading) {
    return <TableUsersSkeleton />;
  }

  return (
    <div className="w-full space-y-4">
      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-semibold mb-3">Agregar Nuevo Descuento</h3>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end"
        >
          <div>
            <label className="text-sm font-medium mb-1 block">
              Cantidad Mínima
            </label>
            <Input
              type="number"
              min="1"
              {...register("cantidad_comprada", {
                required: "La cantidad es requerida",
                min: { value: 1, message: "La cantidad mínima es 1" },
                valueAsNumber: true,
              })}
              placeholder="Cantidad"
              className={errors.cantidad_comprada ? "border-destructive" : ""}
            />
            {errors.cantidad_comprada && (
              <p className="text-destructive text-xs mt-1">
                {errors.cantidad_comprada.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              Descuento (%)
            </label>
            <div className="relative">
              <Input
                type="number"
                min="0"
                max="100"
                {...register("descuentos", {
                  required: "El descuento es requerido",
                  min: { value: 0, message: "El descuento mínimo es 0%" },
                  max: { value: 100, message: "El descuento máximo es 100%" },
                  valueAsNumber: true,
                })}
                placeholder="0"
                className={`pr-8 ${errors.descuentos ? "border-destructive" : ""}`}
              />
              <Percent className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            {errors.descuentos && (
              <p className="text-destructive text-xs mt-1">
                {errors.descuentos.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!selectedProducto || createMutation.isPending}
          >
            {createMutation.isPending ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Plus className="h-4 w-4 mr-1" />
            )}
            {createMutation.isPending ? "Creando..." : "Agregar"}
          </Button>
        </form>
      </div>

      <Table>
        <TableCaption>Descuentos por volumen de compra</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Producto</TableHead>
            <TableHead className="text-center">Cantidad Mínima</TableHead>
            <TableHead className="text-center">Descuento</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {descuentos && descuentos.length > 0 ? (
            descuentos.map((descuento) => (
              <TableRow key={descuento.id}>
                <TableCell className="text-center">
                  {descuento.producto?.nombre || "N/A"}
                </TableCell>
                <TableCell className="flex justify-center">
                  <Input
                    type="number"
                    min="1"
                    value={descuento.cantidad_comprada}
                    onChange={(e) =>
                      setDescuentos(
                        descuentos.map((d) =>
                          d.id === descuento.id
                            ? {
                                ...d,
                                cantidad_comprada:
                                  parseInt(e.target.value) || 1,
                              }
                            : d
                        )
                      )
                    }
                    className="w-20 text-right"
                    disabled={!descuento.editing}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={descuento.descuentos}
                      onChange={(e) =>
                        setDescuentos(
                          descuentos.map((d) =>
                            d.id === descuento.id
                              ? {
                                  ...d,
                                  descuentos: parseInt(e.target.value) || 0,
                                }
                              : d
                          )
                        )
                      }
                      className="w-20 text-right"
                      disabled={!descuento.editing}
                    />
                    <Percent className="h-4 w-4 text-muted-foreground" />
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    {!descuento.editing ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleEdit(descuento.id)}
                          disabled={updateMutation.isPending}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleEdit(descuento.id)}
                          disabled={updateMutation.isPending}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleSave(descuento.id)}
                          disabled={updateMutation.isPending}
                        >
                          {updateMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Save className="h-4 w-4" />
                          )}
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                <StatusMessage type="empty" />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableDescuentoProductos;
