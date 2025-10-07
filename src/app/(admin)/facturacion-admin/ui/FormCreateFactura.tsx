import { CrearFactura } from "@/apis/facturas/accions/crear-factura";
import { CrearFacturaInterface } from "@/apis/facturas/interfaces/crear-factura.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import React, { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Calculator } from "lucide-react";
import useGetProductosDisponibles from "@/hooks/productos/useGetProductosDisponibles";
import useGetServiciosDisponibles from "@/hooks/servicios/useGetServiciosDisponibles";
import { toast } from "react-toastify";
import useGetClientesActivos from "@/hooks/clientes/useGetClientesActivos";
import { useAuthStore } from "@/providers/store/useAuthStore";
import LoaderComponents from "@/components/generics/LoaderComponents";
import { obtenerExistenciaProductos } from "@/apis/existencia_productos/accions/obtener-existencia-productos";

interface Props {
  onSuccess: () => void;
}

const FormCreateFactura = ({ onSuccess }: Props) => {
  const { user } = useAuthStore();
  const paisId = user?.pais.id || "";
  const sucursal_id = user?.sucursal.id || "";
  const queryClient = useQueryClient();
  const { data: productos, isLoading: loadingProductos } =
    useGetProductosDisponibles();
  const { data: servicios, isLoading: loadingServicios } =
    useGetServiciosDisponibles();
  const { data: clientes, isLoading: loadingClientes } =
    useGetClientesActivos();

  const [productosYServicios, setProductosYServicios] = useState<any[]>([]);

  React.useEffect(() => {
    if (productos && servicios) {
      const productosFormateados =
        productos.data?.productos.map((p: any) => ({
          ...p,
          tipo: "producto",
          nombre: p.nombre,
          precio: p.precio_venta,
        })) || [];

      const serviciosFormateados =
        servicios.data?.servicios.map((s: any) => ({
          ...s,
          tipo: "servicio",
          nombre: s.nombre,
          precio: s.precio,
        })) || [];

      setProductosYServicios([
        ...productosFormateados,
        ...serviciosFormateados,
      ]);
    }
  }, [productos, servicios]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<CrearFacturaInterface>({
    defaultValues: {
      detalles: [{ id_producto_servicio: "", cantidad: 1, precio: 0 }],
      sub_total: 0,
      descuentos_rebajas: 0,
      importe_exento: 0,
      importe_exonerado: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "detalles",
  });

  const detalles = watch("detalles");
  const descuentos = watch("descuentos_rebajas") || 0;
  const importeExento = watch("importe_exento") || 0;
  const importeExonerado = watch("importe_exonerado") || 0;

  const productosParaVerificar = React.useMemo(() => {
    return detalles
      .filter((detalle) => {
        const producto = productosYServicios.find(
          (p) => p.id === detalle.id_producto_servicio
        );
        return producto?.tipo === "producto" && detalle.id_producto_servicio;
      })
      .map((detalle) => ({
        productoId: detalle.id_producto_servicio,
        cantidad: detalle.cantidad || 0,
      }));
  }, [detalles, productosYServicios]);

  const existenciasQueries = useQueries({
    queries: productosParaVerificar.map((producto) => ({
      queryKey: ["existencia-productos", producto.productoId, sucursal_id],
      queryFn: () =>
        obtenerExistenciaProductos(producto.productoId, sucursal_id),
      enabled: !!producto.productoId && !!sucursal_id,
      retry: false,
    })),
  });

  const mapaExistencias = React.useMemo(() => {
    const mapa: { [key: string]: number } = {};

    existenciasQueries.forEach((query, index) => {
      const productoId = productosParaVerificar[index]?.productoId;
      if (productoId && query.data && query.data.length > 0) {
        const existenciaData = query.data[0];
        mapa[productoId] = parseInt(existenciaData.existenciaTotal) || 0;
      }
    });

    return mapa;
  }, [existenciasQueries, productosParaVerificar]);

  const mapaCargando = React.useMemo(() => {
    const mapa: { [key: string]: boolean } = {};

    productosParaVerificar.forEach((producto, index) => {
      mapa[producto.productoId] = existenciasQueries[index]?.isLoading || false;
    });

    return mapa;
  }, [productosParaVerificar, existenciasQueries]);

  const productosSinExistencia = React.useMemo(() => {
    return detalles.filter((detalle) => {
      const producto = productosYServicios.find(
        (p) => p.id === detalle.id_producto_servicio
      );
      if (producto?.tipo === "producto") {
        const existencia = mapaExistencias[detalle.id_producto_servicio] || 0;
        const cantidadRequerida = detalle.cantidad || 0;
        return existencia < cantidadRequerida;
      }
      return false;
    });
  }, [detalles, productosYServicios, mapaExistencias]);

  const tieneExistenciaSuficiente = productosSinExistencia.length === 0;

  const infoProductosSinExistencia = React.useMemo(() => {
    return productosSinExistencia.map((detalle) => {
      const producto = productosYServicios.find(
        (p) => p.id === detalle.id_producto_servicio
      );
      const existencia = mapaExistencias[detalle.id_producto_servicio] || 0;

      return {
        nombre: producto?.nombre || "Producto desconocido",
        cantidadRequerida: detalle.cantidad || 0,
        existenciaActual: existencia,
        productoId: detalle.id_producto_servicio,
      };
    });
  }, [productosSinExistencia, productosYServicios, mapaExistencias]);

  const subTotal = React.useMemo(() => {
    return (
      detalles?.reduce((total, detalle) => {
        const cantidad = Number(detalle.cantidad) || 0;
        const precio = Number(detalle.precio) || 0;
        return total + cantidad * precio;
      }, 0) || 0
    );
  }, [detalles]);

  const totalGeneral = React.useMemo(() => {
    return subTotal - descuentos + importeExento + importeExonerado;
  }, [subTotal, descuentos, importeExento, importeExonerado]);

  React.useEffect(() => {
    setValue("sub_total", subTotal);
  }, [subTotal, setValue]);

  const handleProductoChange = (index: number, value: string) => {
    const productoSeleccionado = productosYServicios.find(
      (p) => p.id === value
    );
    if (productoSeleccionado) {
      setValue(`detalles.${index}.precio`, productoSeleccionado.precio);
      setValue(`detalles.${index}.id_producto_servicio`, value);
    }
  };

  const calcularTotalLinea = (cantidad: number, precio: number) => {
    return (Number(cantidad) || 0) * (Number(precio) || 0);
  };

  const mutation = useMutation({
    mutationFn: (data: CrearFacturaInterface) => CrearFactura(data),
    onSuccess: () => {
      toast.success("Factura creada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["facturas"] });
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
            : "Hubo un error al crear la factura";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de crear la factura. Inténtalo de nuevo."
        );
      }
    },
  });

  const ExistenciaBadge = ({
    productoId,
    cantidad,
  }: {
    productoId: string;
    cantidad: number;
  }) => {
    const producto = productosYServicios.find((p) => p.id === productoId);

    if (!productoId || producto?.tipo === "servicio") return null;

    const existencia = mapaExistencias[productoId];
    const isLoading = mapaCargando[productoId] || false;
    const suficiente = existencia !== undefined && existencia >= cantidad;

    if (isLoading) {
      return (
        <Badge variant="outline" className="ml-2">
          <div className="h-3 w-3 animate-spin rounded-full border border-blue-500 border-t-transparent mr-1" />
          Cargando...
        </Badge>
      );
    }

    if (existencia === undefined) {
      return (
        <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700">
          Sin datos
        </Badge>
      );
    }

    return (
      <Badge variant={suficiente ? "default" : "destructive"} className="ml-2">
        {suficiente
          ? `Disponible: ${existencia}`
          : `Insuficiente: ${existencia}`}
      </Badge>
    );
  };

  const onSubmit = (data: CrearFacturaInterface) => {
    if (!data.detalles || data.detalles.length === 0) {
      toast.error("Debe agregar al menos un producto o servicio");
      return;
    }

    const detallesInvalidos = data.detalles.some(
      (detalle) => !detalle.id_producto_servicio
    );
    if (detallesInvalidos) {
      toast.error("Todos los productos/servicios deben estar seleccionados");
      return;
    }

    if (!tieneExistenciaSuficiente) {
      const productosLista = infoProductosSinExistencia
        .map(
          (p) =>
            `${p.nombre} (necesita: ${p.cantidadRequerida}, tiene: ${p.existenciaActual})`
        )
        .join(", ");

      toast.error(`Productos con existencia insuficiente: ${productosLista}`);
      return;
    }

    mutation.mutate({ ...data, pais_id: paisId });
  };

  const agregarDetalle = () => {
    append({ id_producto_servicio: "", cantidad: 1, precio: 0 });
  };

  const eliminarDetalle = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    } else {
      toast.error("Debe haber al menos un producto o servicio");
    }
  };

  if (loadingProductos || loadingServicios || loadingClientes) {
    return <LoaderComponents />;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Información del Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="font-bold">Cliente*</Label>
              <Select onValueChange={(value) => setValue("id_cliente", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clientes?.data?.clientes.map((cliente) => (
                    <SelectItem key={cliente.id} value={cliente.id}>
                      {cliente.nombre} - {cliente.identificacion}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.id_cliente && (
                <p className="text-sm font-medium text-red-500">
                  {errors.id_cliente.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="font-bold">Forma de Pago*</Label>
              <Select onValueChange={(value) => setValue("forma_pago", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione forma de pago" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Contado">Contado</SelectItem>
                  <SelectItem value="Credito">Crédito</SelectItem>
                </SelectContent>
              </Select>
              {errors.forma_pago && (
                <p className="text-sm font-medium text-red-500">
                  {errors.forma_pago?.message as string}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Totales</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="font-bold">Sub Total</Label>
                <Input
                  value={subTotal.toFixed(2)}
                  disabled
                  className="font-bold text-lg"
                />
              </div>

              <div className="space-y-2">
                <Label>Descuentos y Rebajas</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("descuentos_rebajas", {
                    min: 0,
                    valueAsNumber: true,
                  })}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label>Importe Exento</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("importe_exento", {
                    min: 0,
                    valueAsNumber: true,
                  })}
                  placeholder="0.00"
                />
              </div>

              <div className="space-y-2">
                <Label>Importe Exonerado</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("importe_exonerado", {
                    min: 0,
                    valueAsNumber: true,
                  })}
                  placeholder="0.00"
                />
              </div>

              <div className="border-t pt-4">
                <Label className="font-bold text-lg">Total General</Label>
                <Input
                  value={totalGeneral.toFixed(2)}
                  disabled
                  className="font-bold text-2xl text-green-600"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Productos y Servicios</CardTitle>
          <Button
            type="button"
            onClick={agregarDetalle}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Agregar Producto/Servicio
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto/Servicio</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Precio Unitario</TableHead>
                <TableHead>Existencia</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => {
                const productoId = watch(
                  `detalles.${index}.id_producto_servicio`
                );
                const cantidad = watch(`detalles.${index}.cantidad`) || 0;
                const producto = productosYServicios.find(
                  (p) => p.id === productoId
                );
                const existencia = mapaExistencias[productoId];
                const sinSuficienteExistencia =
                  producto?.tipo === "producto" &&
                  existencia !== undefined &&
                  existencia < cantidad;

                return (
                  <TableRow
                    key={field.id}
                    className={sinSuficienteExistencia ? "bg-red-50" : ""}
                  >
                    <TableCell>
                      <div className="flex flex-col">
                        <Select
                          onValueChange={(value) =>
                            handleProductoChange(index, value)
                          }
                          value={productoId}
                        >
                          <SelectTrigger
                            className={
                              sinSuficienteExistencia ? "border-red-300" : ""
                            }
                          >
                            <SelectValue placeholder="Seleccione producto/servicio" />
                          </SelectTrigger>
                          <SelectContent>
                            {productosYServicios.map((item) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.nombre} - {item.precio} ({item.tipo})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <ExistenciaBadge
                          productoId={productoId}
                          cantidad={cantidad}
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="1"
                        className={
                          sinSuficienteExistencia ? "border-red-300" : ""
                        }
                        {...register(`detalles.${index}.cantidad`, {
                          required: "La cantidad es requerida",
                          min: { value: 1, message: "Mínimo 1" },
                          valueAsNumber: true,
                        })}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.01"
                        {...register(`detalles.${index}.precio`, {
                          required: "El precio es requerido",
                          min: { value: 0, message: "Mínimo 0" },
                          valueAsNumber: true,
                        })}
                      />
                    </TableCell>
                    <TableCell>
                      {producto?.tipo === "producto" &&
                        existencia !== undefined && (
                          <div className="flex flex-col">
                            <span
                              className={
                                sinSuficienteExistencia
                                  ? "text-red-600 font-medium"
                                  : "text-green-600 font-medium"
                              }
                            >
                              {existencia} unidades
                            </span>
                            {sinSuficienteExistencia && (
                              <span className="text-xs text-red-500">
                                Faltan {cantidad - existencia}
                              </span>
                            )}
                          </div>
                        )}
                      {producto?.tipo === "servicio" && (
                        <Badge variant="outline">Servicio</Badge>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">
                      L.{" "}
                      {calcularTotalLinea(
                        cantidad,
                        watch(`detalles.${index}.precio`) || 0
                      ).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => eliminarDetalle(index)}
                        disabled={fields.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Resumen de la Factura
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="space-y-2">
              <Badge variant="secondary" className="w-full">
                Sub Total
              </Badge>
              <p className="text-xl font-bold">L. {subTotal.toFixed(2)}</p>
            </div>
            <div className="space-y-2">
              <Badge variant="secondary" className="w-full">
                Descuentos
              </Badge>
              <p className="text-xl font-bold text-red-600">
                -L. {descuentos.toFixed(2)}
              </p>
            </div>
            <div className="space-y-2">
              <Badge variant="secondary" className="w-full">
                Items
              </Badge>
              <p className="text-xl font-bold">{fields.length}</p>
            </div>
            <div className="space-y-2">
              <Badge variant="default" className="w-full">
                Total General
              </Badge>
              <p className="text-2xl font-bold text-green-600">
                L. {totalGeneral.toFixed(2)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end pt-4">
        <Button
          type="submit"
          disabled={mutation.isPending || !tieneExistenciaSuficiente}
          className="flex items-center gap-2"
          size="lg"
        >
          {mutation.isPending ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border border-white border-t-transparent" />
              Creando Factura...
            </>
          ) : (
            <>
              <Plus className="h-5 w-5" />
              Crear Factura
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormCreateFactura;
