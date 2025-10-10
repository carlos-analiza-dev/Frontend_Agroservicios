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
import { CrearProductoNoVendido } from "@/apis/productos-no-vendidos/accions/crear-producto-no-vendido";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator, AlertTriangle, Package } from "lucide-react";
import {
  CreateProductosNoVendido,
  Motivo,
} from "@/apis/productos-no-vendidos/interfaces/producto-no-vendido.interface";
import { ActualizarProductoNoVendido } from "@/apis/productos-no-vendidos/accions/editar-producto-no-vendido";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { ProductoNoVendido } from "@/apis/productos-no-vendidos/interfaces/response-productos-no-vendidos.interface";

interface Props {
  editProductoNoVendido?: ProductoNoVendido | null;
  isEdit?: boolean;
  onSuccess: () => void;
  productoId: string;
  nombreProducto: string;
  precioUnitario: number;
}

const FormProductosNoVendidos = ({
  onSuccess,
  editProductoNoVendido,
  isEdit,
  productoId,
  nombreProducto,
  precioUnitario,
}: Props) => {
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const sucursalId = user?.sucursal.id || "";

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CreateProductosNoVendido>();

  const cantidadNoVendida = watch("cantidad_no_vendida") || 0;
  const precioUnitarioWatch = watch("precio_unitario") || 0;
  const totalPerdido = cantidadNoVendida * precioUnitarioWatch;

  useEffect(() => {
    setValue("producto_id", productoId);
    setValue("nombre_producto", nombreProducto);
    setValue("precio_unitario", precioUnitario);
    setValue("motivo", Motivo.SIN_STOCK);

    if (editProductoNoVendido && isEdit) {
      reset({
        producto_id: editProductoNoVendido.producto_id,
        nombre_producto: editProductoNoVendido.nombre_producto,
        cantidad_no_vendida: editProductoNoVendido.cantidad_no_vendida,
        precio_unitario: parseFloat(
          editProductoNoVendido.precio_unitario.toString()
        ),
        total_perdido: parseFloat(
          editProductoNoVendido.total_perdido.toString()
        ),
        existencia_actual: editProductoNoVendido.existencia_actual,
        cantidad_solicitada: editProductoNoVendido.cantidad_solicitada,
        motivo: editProductoNoVendido.motivo,
        observaciones: editProductoNoVendido.observaciones || "",
        fue_reabastecido: editProductoNoVendido.fue_reabastecido,
        fecha_reabastecimiento:
          editProductoNoVendido.fecha_reabastecimiento || undefined,
      });
    }
  }, [
    editProductoNoVendido,
    isEdit,
    reset,
    setValue,
    productoId,
    nombreProducto,
    precioUnitario,
  ]);

  useEffect(() => {
    setValue("total_perdido", totalPerdido);
  }, [totalPerdido, setValue]);

  const mutation = useMutation({
    mutationFn: (data: CreateProductosNoVendido) =>
      CrearProductoNoVendido(data),
    onSuccess: () => {
      toast.success("Producto no vendido registrado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["productos-no-vendidos"] });
      queryClient.invalidateQueries({ queryKey: ["estadisticas-perdidas"] });
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
            : "Hubo un error al registrar el producto no vendido";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de registrar el producto no vendido. Inténtalo de nuevo."
        );
      }
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: (data: CreateProductosNoVendido) =>
      ActualizarProductoNoVendido(editProductoNoVendido?.id ?? "", data),
    onSuccess: () => {
      toast.success("Producto no vendido actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["productos-no-vendidos"] });
      queryClient.invalidateQueries({ queryKey: ["estadisticas-perdidas"] });
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
            : "Hubo un error al actualizar el producto no vendido";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de actualizar el producto no vendido. Inténtalo de nuevo."
        );
      }
    },
  });

  const onSubmit = (data: CreateProductosNoVendido) => {
    if (isEdit) {
      mutationUpdate.mutate(data);
    } else {
      mutation.mutate({ ...data, sucursal_id: sucursalId });
    }
  };

  const handleMotivoChange = (motivo: Motivo) => {
    setValue("motivo", motivo);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="h-5 w-5" />
            {isEdit
              ? "Editar Producto No Vendido"
              : "Registrar Producto No Vendido"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg border">
            <div>
              <Label className="font-bold text-sm text-gray-600">
                Producto ID
              </Label>
              <div className="mt-1 text-sm font-medium">{productoId}</div>
            </div>
            <div>
              <Label className="font-bold text-sm text-gray-600">
                Nombre del Producto
              </Label>
              <div className="mt-1 text-sm font-medium">{nombreProducto}</div>
            </div>
            <div>
              <Label className="font-bold text-sm text-gray-600">
                Precio Unitario
              </Label>
              <div className="mt-1 text-sm font-medium">
                L. {precioUnitario.toFixed(2)}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="font-bold">Cantidad No Vendida*</Label>
              <Input
                type="number"
                min="1"
                {...register("cantidad_no_vendida", {
                  required: "La cantidad no vendida es requerida",
                  min: { value: 1, message: "La cantidad debe ser al menos 1" },
                  valueAsNumber: true,
                })}
                placeholder="0"
              />
              {errors.cantidad_no_vendida && (
                <p className="text-sm font-medium text-red-500">
                  {errors.cantidad_no_vendida.message as string}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="font-bold">Precio Unitario (L.)*</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                {...register("precio_unitario", {
                  required: "El precio unitario es requerido",
                  min: { value: 0, message: "El precio no puede ser negativo" },
                  valueAsNumber: true,
                })}
                placeholder="0.00"
                readOnly
                className="bg-gray-50"
              />
              {errors.precio_unitario && (
                <p className="text-sm font-medium text-red-500">
                  {errors.precio_unitario.message as string}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="font-bold">Existencia Actual*</Label>
              <Input
                type="number"
                min="0"
                {...register("existencia_actual", {
                  required: "La existencia actual es requerida",
                  min: {
                    value: 0,
                    message: "La existencia no puede ser negativa",
                  },
                  valueAsNumber: true,
                })}
                placeholder="0"
              />
              {errors.existencia_actual && (
                <p className="text-sm font-medium text-red-500">
                  {errors.existencia_actual.message as string}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="font-bold">Cantidad Solicitada*</Label>
              <Input
                type="number"
                min="1"
                {...register("cantidad_solicitada", {
                  required: "La cantidad solicitada es requerida",
                  min: { value: 1, message: "La cantidad debe ser al menos 1" },
                  valueAsNumber: true,
                })}
                placeholder="0"
              />
              {errors.cantidad_solicitada && (
                <p className="text-sm font-medium text-red-500">
                  {errors.cantidad_solicitada.message as string}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <Label className="font-bold">Motivo*</Label>
            <Select
              onValueChange={handleMotivoChange}
              defaultValue={editProductoNoVendido?.motivo || Motivo.SIN_STOCK}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione el motivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={Motivo.SIN_STOCK}>Sin Stock</SelectItem>
                <SelectItem value={Motivo.VENTA_INCOMPLETA}>
                  Venta Incompleta
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.motivo && (
              <p className="text-sm font-medium text-red-500">
                {errors.motivo?.message as string}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label>Observaciones</Label>
            <Textarea
              {...register("observaciones")}
              placeholder="Observaciones adicionales..."
              rows={3}
            />
            {errors.observaciones && (
              <p className="text-sm font-medium text-red-500">
                {errors.observaciones.message as string}
              </p>
            )}
          </div>

          {isEdit && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label className="font-bold">¿Fue Reabastecido?</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="fue_reabastecido"
                    {...register("fue_reabastecido")}
                    className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <Label htmlFor="fue_reabastecido">Sí, fue reabastecido</Label>
                </div>
                {errors.fue_reabastecido && (
                  <p className="text-sm font-medium text-red-500">
                    {errors.fue_reabastecido.message as string}
                  </p>
                )}
              </div>

              {watch("fue_reabastecido") && (
                <div className="space-y-1">
                  <Label className="font-bold">Fecha de Reabastecimiento</Label>
                  <Input
                    type="datetime-local"
                    {...register("fecha_reabastecimiento")}
                  />
                  {errors.fecha_reabastecimiento && (
                    <p className="text-sm font-medium text-red-500">
                      {errors.fecha_reabastecimiento.message as string}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          <Card className="bg-orange-50 border-orange-200">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-orange-600" />
                  <span className="font-bold text-orange-800">
                    Total Pérdida Estimada
                  </span>
                </div>
                <Badge
                  variant="outline"
                  className="text-lg font-bold text-orange-700"
                >
                  L. {totalPerdido.toFixed(2)}
                </Badge>
              </div>
              <div className="mt-2 text-sm text-orange-600">
                <p>
                  {cantidadNoVendida} unidades × L.{" "}
                  {precioUnitarioWatch.toFixed(2)} = L.{" "}
                  {totalPerdido.toFixed(2)}
                </p>
              </div>
            </CardContent>
          </Card>

          {watch("cantidad_solicitada") > 0 &&
            watch("existencia_actual") > 0 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 text-blue-700">
                  <AlertTriangle className="h-4 w-4" />
                  <span className="font-medium">Resumen de situación:</span>
                </div>
                <div className="mt-1 text-sm text-blue-600">
                  <p>
                    • Cantidad solicitada: {watch("cantidad_solicitada")}{" "}
                    unidades
                  </p>
                  <p>
                    • Existencia actual: {watch("existencia_actual")} unidades
                  </p>
                  <p>
                    • Diferencia:{" "}
                    {watch("cantidad_solicitada") - watch("existencia_actual")}{" "}
                    unidades
                  </p>
                  <p>
                    • Tasa de disponibilidad:{" "}
                    {(
                      (watch("existencia_actual") /
                        watch("cantidad_solicitada")) *
                      100
                    ).toFixed(1)}
                    %
                  </p>
                </div>
              </div>
            )}
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={mutation.isPending || mutationUpdate.isPending}
          className="flex items-center gap-2"
        >
          {mutation.isPending || mutationUpdate.isPending ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border border-white border-t-transparent" />
              {isEdit ? "Actualizando..." : "Registrando..."}
            </>
          ) : (
            <>
              <Package className="h-4 w-4" />
              {isEdit ? "Actualizar Registro" : "Registrar Producto No Vendido"}
            </>
          )}
        </Button>
      </div>

      <input type="hidden" {...register("producto_id")} />
      <input type="hidden" {...register("nombre_producto")} />
      <input
        type="hidden"
        {...register("total_perdido", { valueAsNumber: true })}
      />
    </form>
  );
};

export default FormProductosNoVendidos;
