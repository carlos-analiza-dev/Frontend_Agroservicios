"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { tiposPagos } from "@/helpers/data/tiposPagos";
import useGetProductosDisponibles from "@/hooks/productos/useGetProductosDisponibles";
import useGetProveedoresActivos from "@/hooks/proveedores/useGetProveedoresActivos";
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, Trash2 } from "lucide-react";
import useGetTaxesPais from "@/hooks/impuestos/useGetTaxesPais";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { CrearCompra } from "@/apis/compras_productos/accions/crear-compra";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

interface ProductoCompra {
  productoId: string;
  cantidad: number;
  bonificacion: number;
  costoUnitario: number;
  descuento: number;
  impuesto: number;
}

interface FormCompra {
  sucursalId: string;
  proveedorId: string;
  tipoPago: string;
  productos: ProductoCompra[];
}

const FormCompraProductos = () => {
  const { user } = useAuthStore();
  const sucursalId = user?.sucursal.id || "";
  const queryClient = useQueryClient();

  const crearCompraMutation = useMutation({
    mutationFn: CrearCompra,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["compras"] });
      queryClient.invalidateQueries({ queryKey: ["productos"] });
      queryClient.invalidateQueries({ queryKey: ["inventario"] });

      toast.success("Compra creada exitosamente");
      reset();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al ejecutar la compra";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de ejecutar la compra. Inténtalo de nuevo."
        );
      }
    },
  });

  const {
    register,
    handleSubmit,
    reset,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormCompra>({
    defaultValues: {
      productos: [
        {
          productoId: "",
          cantidad: 0,
          bonificacion: 0,
          costoUnitario: 0,
          descuento: 0,
          impuesto: 0,
        },
      ],
      proveedorId: "",
      tipoPago: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "productos",
  });

  const { data: proveedores } = useGetProveedoresActivos();
  const { data: productosData } = useGetProductosDisponibles();
  const { data: impuestos } = useGetTaxesPais();
  const productos = productosData?.data.productos || [];

  const productosWatch = watch("productos");
  const proveedorId = watch("proveedorId");
  const tipoPago = watch("tipoPago");

  const isFormValid = () => {
    if (!proveedorId || !tipoPago || !sucursalId) return false;

    return productosWatch.every(
      (producto) =>
        producto.productoId &&
        producto.cantidad > 0 &&
        producto.costoUnitario > 0
    );
  };

  const getProductosDisponibles = (currentIndex: number) => {
    return productos.filter((producto) => {
      if (productosWatch?.[currentIndex]?.productoId === producto.id) {
        return true;
      }
      const estaSeleccionado = productosWatch?.some(
        (p, index) => index !== currentIndex && p.productoId === producto.id
      );
      return !estaSeleccionado;
    });
  };

  const calcularTotales = () => {
    let subtotal = 0;
    let totalImpuestos = 0;
    let totalDescuentos = 0;
    let total = 0;

    productosWatch?.forEach((producto) => {
      const cantidadTotal = producto.cantidad;
      const subtotalProducto = cantidadTotal * (producto.costoUnitario || 0);
      const descuentoProducto =
        subtotalProducto * ((producto.descuento || 0) / 100);
      const subtotalConDescuento = subtotalProducto - descuentoProducto;
      const impuestoProducto =
        subtotalConDescuento * ((producto.impuesto || 0) / 100);

      subtotal += subtotalProducto;
      totalDescuentos += descuentoProducto;
      totalImpuestos += impuestoProducto;
      total += subtotalConDescuento + impuestoProducto;
    });

    return {
      subtotal: parseFloat(subtotal.toFixed(2)),
      totalImpuestos: parseFloat(totalImpuestos.toFixed(2)),
      totalDescuentos: parseFloat(totalDescuentos.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
    };
  };

  const { subtotal, totalImpuestos, totalDescuentos, total } =
    calcularTotales();

  const onSubmit = async (data: FormCompra) => {
    if (!isFormValid()) {
      toast.error("Por favor, complete todos los campos requeridos");
      return;
    }

    const detalles = data.productos.map((producto) => {
      const subtotalProducto = producto.cantidad * producto.costoUnitario;
      const descuentoProducto = subtotalProducto * (producto.descuento / 100);
      const subtotalConDescuento = subtotalProducto - descuentoProducto;
      const impuestoProducto = subtotalConDescuento * (producto.impuesto / 100);

      return {
        productoId: producto.productoId,
        costo_por_unidad: producto.costoUnitario,
        cantidad: producto.cantidad,
        bonificacion: producto.bonificacion || 0,
        descuentos: parseFloat(descuentoProducto.toFixed(2)),
        impuestos: parseFloat(impuestoProducto.toFixed(2)),
      };
    });

    const compraData = {
      proveedorId: data.proveedorId,
      sucursalId: sucursalId,
      tipo_pago: data.tipoPago,
      subtotal: subtotal,
      descuentos: totalDescuentos,
      impuestos: totalImpuestos,
      total: total,
      detalles: detalles,
    };

    crearCompraMutation.mutate(compraData);
  };

  const handleProductoChange = (index: number, productoId: string) => {
    setValue(`productos.${index}.productoId`, productoId);

    const productoSeleccionado = productos.find((p) => p.id === productoId);
    if (productoSeleccionado) {
      const costo = productoSeleccionado.preciosPorPais?.[0]?.costo
        ? parseFloat(productoSeleccionado.preciosPorPais[0].costo)
        : 0;

      const impuestoPorcentaje = productoSeleccionado.tax?.porcentaje
        ? parseFloat(productoSeleccionado.tax.porcentaje)
        : 0;

      setValue(`productos.${index}.costoUnitario`, costo);
      setValue(`productos.${index}.impuesto`, impuestoPorcentaje);
      setValue(`productos.${index}.cantidad`, 1);
    } else {
      setValue(`productos.${index}.costoUnitario`, 0);
      setValue(`productos.${index}.impuesto`, 0);
      setValue(`productos.${index}.cantidad`, 0);
    }
  };

  const handleImpuestoChange = (index: number, value: string) => {
    setValue(`productos.${index}.impuesto`, Number(value));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="space-y-1">
          <Label className="font-bold">Proveedor*</Label>
          <Select
            value={proveedorId}
            onValueChange={(value) => setValue("proveedorId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona el proveedor" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Proveedor</SelectLabel>
                {proveedores?.map((prov) => (
                  <SelectItem value={prov.id} key={prov.id}>
                    {prov.nombre_legal} - {prov.nit_rtn}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.proveedorId && (
            <p className="text-sm text-red-500">{errors.proveedorId.message}</p>
          )}
        </div>

        <div className="space-y-1">
          <Label className="font-bold">Tipo de Pago*</Label>
          <Select
            value={tipoPago}
            onValueChange={(value) => setValue("tipoPago", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona el tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Tipo Pago</SelectLabel>
                {tiposPagos?.map((tipo) => (
                  <SelectItem value={tipo.value} key={tipo.id}>
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.tipoPago && (
            <p className="text-sm text-red-500">{errors.tipoPago.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Label className="font-bold text-lg">Productos de la Compra</Label>
          <Button
            type="button"
            onClick={() =>
              append({
                productoId: "",
                cantidad: 0,
                bonificacion: 0,
                costoUnitario: 0,
                descuento: 0,
                impuesto: 0,
              })
            }
            className="flex items-center gap-2"
          >
            <Plus size={16} />
            Agregar Producto
          </Button>
        </div>

        {fields.map((field, index) => {
          const productoSeleccionado = productos.find(
            (p) => p.id === productosWatch?.[index]?.productoId
          );

          const cantidadPagada = productosWatch?.[index]?.cantidad || 0;
          const bonificacion = productosWatch?.[index]?.bonificacion || 0;

          const subtotalProducto =
            cantidadPagada * (productosWatch?.[index]?.costoUnitario || 0);
          const descuentoProducto =
            subtotalProducto *
            ((productosWatch?.[index]?.descuento || 0) / 100);
          const subtotalConDescuento = subtotalProducto - descuentoProducto;
          const impuestoProducto =
            subtotalConDescuento *
            ((productosWatch?.[index]?.impuesto || 0) / 100);
          const totalProducto = subtotalConDescuento + impuestoProducto;

          const productosDisponibles = getProductosDisponibles(index);

          return (
            <div key={field.id} className="p-4 border rounded-lg space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="space-y-1">
                  <Label>Producto*</Label>
                  <Select
                    value={productosWatch?.[index]?.productoId || ""}
                    onValueChange={(value) =>
                      handleProductoChange(index, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Productos</SelectLabel>
                        {productosDisponibles.map((prod) => (
                          <SelectItem value={prod.id} key={prod.id}>
                            {prod.nombre} - {prod.codigo}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {errors.productos?.[index]?.productoId && (
                    <p className="text-sm text-red-500">
                      {errors.productos[index]?.productoId?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label>Cantidad*</Label>
                  <Input
                    type="number"
                    min="0"
                    {...register(`productos.${index}.cantidad` as const, {
                      required: "Cantidad requerida",
                      valueAsNumber: true,
                      min: { value: 1, message: "Mínimo 1" },
                    })}
                  />
                  {errors.productos?.[index]?.cantidad && (
                    <p className="text-sm text-red-500">
                      {errors.productos[index]?.cantidad?.message}
                    </p>
                  )}
                </div>

                <div className="space-y-1">
                  <Label>Bonificación</Label>
                  <Input
                    type="number"
                    min="0"
                    {...register(`productos.${index}.bonificacion` as const, {
                      valueAsNumber: true,
                      min: { value: 0, message: "Mínimo 0" },
                    })}
                  />
                </div>

                <div className="space-y-1">
                  <Label>Costo Unitario</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    {...register(`productos.${index}.costoUnitario` as const, {
                      valueAsNumber: true,
                      min: { value: 0, message: "Mínimo 0" },
                    })}
                  />
                </div>

                <div className="space-y-1">
                  <Label>Descuento %</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    {...register(`productos.${index}.descuento` as const, {
                      valueAsNumber: true,
                      min: { value: 0, message: "Mínimo 0%" },
                      max: { value: 100, message: "Máximo 100%" },
                    })}
                  />
                </div>

                <div className="space-y-1">
                  <Label>Impuesto %</Label>
                  <Select
                    value={productosWatch?.[index]?.impuesto?.toString()}
                    onValueChange={(value) =>
                      handleImpuestoChange(index, value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Impuesto</SelectLabel>
                        {impuestos?.map((imp) => (
                          <SelectItem
                            value={String(parseFloat(imp.porcentaje))}
                            key={imp.id}
                          >
                            {imp.nombre} - {parseFloat(imp.porcentaje)}%
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {productoSeleccionado && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-3 bg-blue-50 rounded-lg text-sm">
                  <div>
                    <span className="font-semibold">Código: </span>
                    {productoSeleccionado.codigo}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-3 bg-green-50 rounded-lg text-sm">
                <div>
                  <span className="font-semibold">Cant. Pagada: </span>
                  {cantidadPagada}
                </div>
                <div>
                  <span className="font-semibold">Bonificación: </span>
                  {bonificacion}
                </div>
                <div>
                  <span className="font-semibold">Subtotal: </span>
                  {user?.pais.simbolo_moneda} {subtotalProducto.toFixed(2)}
                </div>
                <div>
                  <span className="font-semibold">Descuento: </span>
                  {user?.pais.simbolo_moneda} {descuentoProducto.toFixed(2)}
                </div>
                <div>
                  <span className="font-semibold">Impuesto: </span>
                  {user?.pais.simbolo_moneda} {impuestoProducto.toFixed(2)}
                </div>
                <div>
                  <span className="font-semibold">Total Producto: </span>
                  {user?.pais.simbolo_moneda} {totalProducto.toFixed(2)}
                </div>
              </div>

              {fields.length > 1 && (
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => remove(index)}
                    className="flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                    Eliminar
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-blue-50 rounded-lg">
        <div className="space-y-1">
          <Label className="font-bold">Subtotal</Label>
          <p className="text-lg font-semibold">
            {user?.pais.simbolo_moneda} {subtotal.toFixed(2)}
          </p>
        </div>

        <div className="space-y-1">
          <Label className="font-bold">Descuentos</Label>
          <p className="text-lg font-semibold text-red-500">
            {user?.pais.simbolo_moneda} {totalDescuentos.toFixed(2)}
          </p>
        </div>

        <div className="space-y-1">
          <Label className="font-bold">Impuestos</Label>
          <p className="text-lg font-semibold">
            {user?.pais.simbolo_moneda} {totalImpuestos.toFixed(2)}
          </p>
        </div>

        <div className="space-y-1">
          <Label className="font-bold text-blue-600">Total</Label>
          <p className="text-2xl font-bold text-blue-600">
            {user?.pais.simbolo_moneda} {total.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="flex justify-end pt-4 gap-4">
        <Button type="button" variant="outline" onClick={() => reset()}>
          Cancelar
        </Button>
        <Button
          type="submit"
          size="lg"
          disabled={crearCompraMutation.isPending}
        >
          {crearCompraMutation.isPending ? "Procesando..." : "Ingresar Compra"}
        </Button>
      </div>
    </form>
  );
};

export default FormCompraProductos;
