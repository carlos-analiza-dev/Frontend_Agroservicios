"use client";

import React, { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";

import useGetFacturasProcesadas from "@/hooks/facturas/useGetFacturasProcesadas";
import useGetProductosDisponibles from "@/hooks/productos/useGetProductosDisponibles";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CrearNotaCreditoInterface } from "@/apis/nota-credito/interface/crear-nota-credito.interface";
import { CrearNotaCredito } from "@/apis/nota-credito/accions/crear-nota-credito";
import { useAuthStore } from "@/providers/store/useAuthStore";

interface Props {
  onSucces: () => void;
}

const FormCrearNotaCredito = ({ onSucces }: Props) => {
  const { user } = useAuthStore();
  const simbolo = user?.pais.simbolo_moneda || "";
  const paisId = user?.pais.id || "";
  const queryClient = useQueryClient();

  const { data: facturas } = useGetFacturasProcesadas();
  const { data: productos, isLoading: isLoadingProductos } =
    useGetProductosDisponibles();

  const [busquedaFactura, setBusquedaFactura] = useState("");
  const [facturasFiltradas, setFacturasFiltradas] = useState(facturas || []);
  const [mostrarOpcionesFactura, setMostrarOpcionesFactura] = useState(false);
  const [facturaSeleccionada, setFacturaSeleccionada] = useState<any>(null);

  const [busquedasProductos, setBusquedasProductos] = useState<{
    [key: number]: string;
  }>({});
  const [mostrarOpcionesProductos, setMostrarOpcionesProductos] = useState<{
    [key: number]: boolean;
  }>({});

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CrearNotaCreditoInterface>({
    defaultValues: {
      factura_id: "",
      monto: 0,
      motivo: "",
      detalles: [{ producto_id: "", cantidad: 0, montoDevuelto: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "detalles",
  });

  const detalles = watch("detalles");

  useEffect(() => {
    if (!facturas) return;

    if (!busquedaFactura.trim()) {
      setFacturasFiltradas(facturas);
      return;
    }

    const filtradas = facturas.filter((factura) => {
      const searchTerm = busquedaFactura.toLowerCase();
      return factura.numero_factura.toLowerCase().includes(searchTerm);
    });

    setFacturasFiltradas(filtradas);
  }, [busquedaFactura, facturas]);

  useEffect(() => {
    const nuevasBusquedas: { [key: number]: string } = {};
    const nuevosMostrarOpciones: { [key: number]: boolean } = {};

    fields.forEach((_, index) => {
      if (busquedasProductos[index] === undefined) {
        nuevasBusquedas[index] = "";
      }
      if (mostrarOpcionesProductos[index] === undefined) {
        nuevosMostrarOpciones[index] = false;
      }
    });

    if (Object.keys(nuevasBusquedas).length > 0) {
      setBusquedasProductos((prev) => ({ ...prev, ...nuevasBusquedas }));
    }
    if (Object.keys(nuevosMostrarOpciones).length > 0) {
      setMostrarOpcionesProductos((prev) => ({
        ...prev,
        ...nuevosMostrarOpciones,
      }));
    }
  }, [fields.length]);

  const seleccionarFactura = (factura: any) => {
    setFacturaSeleccionada(factura);
    setValue("factura_id", factura.id);
    setBusquedaFactura(`${factura.numero_factura} `);
    setMostrarOpcionesFactura(false);
  };

  const limpiarFactura = () => {
    setFacturaSeleccionada(null);
    setValue("factura_id", "");
    setBusquedaFactura("");
    setMostrarOpcionesFactura(true);
  };

  const handleBusquedaProductoChange = (index: number, value: string) => {
    setBusquedasProductos((prev) => ({
      ...prev,
      [index]: value,
    }));
    setMostrarOpcionesProductos((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

  const seleccionarProducto = (index: number, producto: any) => {
    handleProductoChange(producto.id, index);
    setBusquedasProductos((prev) => ({
      ...prev,
      [index]: producto.nombre,
    }));
    setMostrarOpcionesProductos((prev) => ({
      ...prev,
      [index]: false,
    }));
  };

  const limpiarProducto = (index: number) => {
    setValue(`detalles.${index}.producto_id`, "");
    setBusquedasProductos((prev) => ({
      ...prev,
      [index]: "",
    }));
    setMostrarOpcionesProductos((prev) => ({
      ...prev,
      [index]: true,
    }));
    setValue(`detalles.${index}.montoDevuelto`, 0);
  };

  const calcularPrecioProducto = (productoId: string): number => {
    try {
      if (!productos?.data?.productos || !productoId || !paisId) return 0;

      const producto = productos.data.productos.find(
        (p) => p?.id === productoId
      );

      if (!producto || !Array.isArray(producto.preciosPorPais)) return 0;

      const precioPais = producto.preciosPorPais[0].precio;

      return precioPais && precioPais ? Number(precioPais) : 0;
    } catch (error) {
      console.error("Error al calcular precio del producto:", error);
      return 0;
    }
  };

  const calcularMontoProducto = (
    productoId: string,
    cantidad: number
  ): number => {
    try {
      if (!productoId || cantidad <= 0) return 0;
      const precio = calcularPrecioProducto(productoId);
      return cantidad * precio;
    } catch (error) {
      console.error("Error al calcular monto del producto:", error);
      return 0;
    }
  };

  useEffect(() => {
    if (!productos?.data?.productos) return;

    try {
      let montoTotalCalculado = 0;

      detalles.forEach((detalle, index) => {
        if (detalle.producto_id && detalle.cantidad > 0) {
          const nuevoMonto = calcularMontoProducto(
            detalle.producto_id,
            detalle.cantidad
          );
          montoTotalCalculado += nuevoMonto;

          if (nuevoMonto !== detalle.montoDevuelto) {
            setValue(`detalles.${index}.montoDevuelto`, nuevoMonto);
          }
        } else {
          if (detalle.montoDevuelto !== 0) {
            setValue(`detalles.${index}.montoDevuelto`, 0);
          }
        }
      });

      setValue("monto", montoTotalCalculado);
    } catch (error) {
      console.error("Error en useEffect al calcular montos:", error);
    }
  }, [detalles, productos, paisId, setValue]);

  const montoTotal = detalles.reduce(
    (acc, curr) => acc + Number(curr.montoDevuelto || 0),
    0
  );

  const mutation = useMutation({
    mutationFn: (data: CrearNotaCreditoInterface) => CrearNotaCredito(data),
    onSuccess: () => {
      toast.success("Nota de crédito creada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["notas-credito"] });
      queryClient.invalidateQueries({ queryKey: ["facturas"] });
      onSucces();
      reset();
      setFacturaSeleccionada(null);
      setBusquedaFactura("");
      setBusquedasProductos({});
      setMostrarOpcionesProductos({});
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al crear la nota de crédito";
        toast.error(errorMessage);
      } else {
        toast.error("Hubo un error al crear la nota de crédito");
      }
    },
  });

  const handleProductoChange = (value: string, index: number) => {
    try {
      setValue(`detalles.${index}.producto_id`, value);
      const cantidad = watch(`detalles.${index}.cantidad`) || 0;
      const nuevoMonto = calcularMontoProducto(value, cantidad);
      setValue(`detalles.${index}.montoDevuelto`, nuevoMonto);
    } catch (error) {
      console.error("Error al cambiar producto:", error);
      setValue(`detalles.${index}.montoDevuelto`, 0);
    }
  };

  const handleCantidadChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    try {
      const cantidad = Number(e.target.value);
      const productoId = watch(`detalles.${index}.producto_id`);

      setValue(`detalles.${index}.cantidad`, cantidad);

      if (productoId && cantidad > 0) {
        const nuevoMonto = calcularMontoProducto(productoId, cantidad);
        setValue(`detalles.${index}.montoDevuelto`, nuevoMonto);
      } else {
        setValue(`detalles.${index}.montoDevuelto`, 0);
      }
    } catch (error) {
      console.error("Error al cambiar cantidad:", error);
      setValue(`detalles.${index}.montoDevuelto`, 0);
    }
  };

  const onSubmit = (data: CrearNotaCreditoInterface) => {
    if (montoTotal <= 0) {
      toast.error("El monto total debe ser mayor a 0");
      return;
    }

    if (!data.factura_id) {
      toast.error("Debe seleccionar una factura");
      return;
    }

    const dataConMontoActualizado: CrearNotaCreditoInterface = {
      ...data,
      monto: montoTotal,
    };

    mutation.mutate(dataConMontoActualizado);
  };

  const getProductosFiltrados = (index: number) => {
    if (!productos?.data?.productos) return [];

    const busqueda = busquedasProductos[index] || "";

    if (!busqueda.trim()) {
      return productos.data.productos;
    }

    return productos.data.productos.filter((producto) =>
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase())
    );
  };

  const getProductoSeleccionado = (index: number) => {
    const productoId = watch(`detalles.${index}.producto_id`);
    return productos?.data?.productos.find((p) => p.id === productoId);
  };

  const getMontoProductoActual = (index: number) => {
    const productoId = watch(`detalles.${index}.producto_id`);
    const cantidad = watch(`detalles.${index}.cantidad`);
    return calcularMontoProducto(productoId, cantidad);
  };

  if (isLoadingProductos) {
    return <div className="flex justify-center p-8">Cargando productos...</div>;
  }

  if (!productos?.data?.productos?.length) {
    return (
      <div className="text-center p-8">
        <p className="text-red-500">No hay productos disponibles</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1">
        <Label>Numero de Factura*</Label>
        <div className="relative">
          <Input
            placeholder="Buscar por número de factura o nombre del cliente..."
            value={busquedaFactura}
            onChange={(e) => {
              setBusquedaFactura(e.target.value);
              setMostrarOpcionesFactura(true);
            }}
            onFocus={() => setMostrarOpcionesFactura(true)}
            className="w-full"
          />
          {facturaSeleccionada && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={limpiarFactura}
            >
              ×
            </Button>
          )}

          {mostrarOpcionesFactura && facturasFiltradas.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
              {facturasFiltradas.map((factura) => (
                <div
                  key={factura.id}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 border-b last:border-b-0"
                  onClick={() => seleccionarFactura(factura)}
                >
                  <div className="font-medium">{factura.numero_factura}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        {errors.factura_id && (
          <p className="text-red-500 text-sm">{errors.factura_id.message}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label>Motivo*</Label>
        <Input
          {...register("motivo", { required: "El motivo es obligatorio" })}
          placeholder="Motivo de la nota de crédito"
        />
        {errors.motivo && (
          <p className="text-red-500 text-sm">{errors.motivo.message}</p>
        )}
      </div>

      <div className="space-y-4">
        <Label className="font-bold">Detalles de Productos</Label>
        {fields.map((field, index) => {
          const productosFiltrados = getProductosFiltrados(index);
          const productoSeleccionado = getProductoSeleccionado(index);
          const montoProducto = getMontoProductoActual(index);

          return (
            <div key={field.id} className="block">
              <div className="mb-4">
                <Label>Producto*</Label>
                <div className="relative">
                  <Input
                    placeholder="Buscar producto..."
                    value={busquedasProductos[index] || ""}
                    onChange={(e) =>
                      handleBusquedaProductoChange(index, e.target.value)
                    }
                    onFocus={() =>
                      setMostrarOpcionesProductos((prev) => ({
                        ...prev,
                        [index]: true,
                      }))
                    }
                  />
                  {productoSeleccionado && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => limpiarProducto(index)}
                    >
                      ×
                    </Button>
                  )}

                  {mostrarOpcionesProductos[index] &&
                    productosFiltrados.length > 0 && (
                      <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                        {productosFiltrados.map((producto) => (
                          <div
                            key={producto.id}
                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 border-b last:border-b-0"
                            onClick={() => seleccionarProducto(index, producto)}
                          >
                            <div className="font-medium">{producto.nombre}</div>
                            <div className="text-sm text-gray-600">
                              {simbolo}
                              {calcularPrecioProducto(producto.id).toFixed(2)}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
                {errors.detalles?.[index]?.producto_id && (
                  <p className="text-red-500 text-sm">
                    {errors.detalles[index]?.producto_id?.message}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2 items-end border p-2 rounded-md">
                <div>
                  <Label>Cantidad*</Label>
                  <Input
                    type="number"
                    {...register(`detalles.${index}.cantidad`, {
                      required: "Debe indicar la cantidad",
                      min: { value: 1, message: "Cantidad mínima es 1" },
                      valueAsNumber: true,
                    })}
                    onChange={(e) => handleCantidadChange(e, index)}
                  />
                  {errors.detalles?.[index]?.cantidad && (
                    <p className="text-red-500 text-sm">
                      {errors.detalles[index]?.cantidad?.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label>Monto Devuelto</Label>
                  <Input
                    type="number"
                    value={montoProducto}
                    readOnly
                    className="bg-gray-100"
                  />
                </div>

                <div>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
                  >
                    Eliminar
                  </Button>
                </div>
              </div>
            </div>
          );
        })}

        <Button
          type="button"
          onClick={() =>
            append({ producto_id: "", cantidad: 1, montoDevuelto: 0 })
          }
        >
          Agregar Producto
        </Button>
      </div>

      <div className="flex justify-between items-center pt-4 border-t">
        <div className="text-lg font-bold text-blue-600">
          Monto total: {simbolo}
          {montoTotal.toFixed(2)}
        </div>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? "Creando..." : "Crear Nota de Crédito"}
        </Button>
      </div>
    </form>
  );
};

export default FormCrearNotaCredito;
