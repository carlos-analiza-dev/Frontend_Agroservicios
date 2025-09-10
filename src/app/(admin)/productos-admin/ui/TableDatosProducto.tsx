import React, { useState, useEffect } from "react";
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
import { Plus, Edit, Save, X } from "lucide-react";
import { User } from "@/interfaces/auth/user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";
import { Producto } from "@/apis/productos/interfaces/response-productos.interface";
import useGetSucursalesPais from "@/hooks/sucursales/useGetSucursalesPais";
import useGetDatosProducto from "@/hooks/datos-producto/useGetDatosProducto";
import { StatusMessage } from "@/components/generics/StatusMessage";
import TableUsersSkeleton from "@/components/generics/SkeletonTable";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CrearDatosProductoInterface } from "@/apis/datos_producto/interface/crear-datos-productos.interface";
import { CrearDatosProducto } from "@/apis/datos_producto/accions/crear-datos-producto";
import { Dato } from "@/apis/datos_producto/interface/response-datos-producto";
import { ActualizarDatosProducto } from "@/apis/datos_producto/accions/actualizar-datos-producto";
import { isAxiosError } from "axios";

interface Props {
  user: User | undefined;
  selectedProducto: Producto | null;
}

interface DatoProducto extends Dato {
  editing?: boolean;
}

const TableDatosProducto = ({ user, selectedProducto }: Props) => {
  const paisId = user?.pais.id || "";
  const { data: sucursales } = useGetSucursalesPais(paisId);
  const queryClient = useQueryClient();
  const limit = 10;
  const offset = 0;

  const {
    data: productosData,
    isLoading,
    refetch,
  } = useGetDatosProducto(limit, offset, selectedProducto?.id ?? "");

  const [datosProductos, setDatosProductos] = useState<DatoProducto[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CrearDatosProductoInterface>({
    defaultValues: {
      productoId: selectedProducto?.id || "",
      sucursalId: "",
      punto_reorden: 0,
      precio: 0,
      descuento: 0,
    },
  });

  const crearDatosProductoMutation = useMutation({
    mutationFn: CrearDatosProducto,
    onSuccess: () => {
      toast.success("Datos del producto creados exitosamente");
      reset({
        productoId: selectedProducto?.id || "",
        sucursalId: "",
        punto_reorden: 0,
        precio: 0,
        descuento: 0,
      });
      refetch();
      queryClient.invalidateQueries({ queryKey: ["datos-producto"] });
    },
    onError: (error: any) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al crear los datos";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de crear los datos. Inténtalo de nuevo."
        );
      }
    },
  });

  const actualizarDatosProductoMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CrearDatosProductoInterface>;
    }) => ActualizarDatosProducto(id, data),
    onSuccess: () => {
      toast.success("Datos del producto actualizados exitosamente");
      refetch();
      queryClient.invalidateQueries({ queryKey: ["datos-producto"] });
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al actualizar los datos";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de actualizar los datos. Inténtalo de nuevo."
        );
      }
    },
  });

  useEffect(() => {
    if (productosData?.datos) {
      const datosTransformados = productosData.datos.map((dato) => ({
        ...dato,
        editing: false,
      }));
      setDatosProductos(datosTransformados);
    }
  }, [productosData]);

  useEffect(() => {
    if (selectedProducto) {
      setValue("productoId", selectedProducto.id);
    } else {
      setValue("productoId", "");
    }
  }, [selectedProducto, setValue]);

  const onSubmit = (data: CrearDatosProductoInterface) => {
    if (!selectedProducto) {
      toast.error("Por favor selecciona un producto primero");
      return;
    }

    if (!data.sucursalId) {
      toast.error("Por favor selecciona una sucursal");
      return;
    }

    crearDatosProductoMutation.mutate(data);
  };

  const handleFieldChange = (id: string, field: string, value: any) => {
    setDatosProductos((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const toggleEdit = (id: string) => {
    setDatosProductos((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, editing: !item.editing } : item
      )
    );
  };

  const handleCancelEdit = (id: string) => {
    if (productosData?.datos) {
      const originalData = productosData.datos.find((d) => d.id === id);
      if (originalData) {
        setDatosProductos((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...originalData,
                  editing: false,
                }
              : item
          )
        );
      }
    }
  };

  const handleSave = async (id: string) => {
    try {
      const productoEditado = datosProductos.find((item) => item.id === id);
      if (productoEditado) {
        const datosActualizacion: Partial<CrearDatosProductoInterface> = {
          punto_reorden: productoEditado.punto_reorden,
          precio: parseFloat(productoEditado.precio),
          descuento: parseFloat(productoEditado.descuento),
          sucursalId: productoEditado.sucursal.id,
          productoId: productoEditado.producto.id,
        };

        actualizarDatosProductoMutation.mutate({
          id: productoEditado.id,
          data: datosActualizacion,
        });

        setDatosProductos((prev) =>
          prev.map((item) =>
            item.id === id ? { ...item, editing: false } : item
          )
        );
      }
    } catch (error) {
      toast.error("Error al guardar los cambios");
    }
  };

  if (isLoading) {
    return <TableUsersSkeleton />;
  }

  return (
    <div className="w-full space-y-4">
      <form
        className="bg-muted p-4 rounded-lg"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h3 className="font-semibold mb-3">Agregar Nuevos Datos al Producto</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          <div>
            <label className="text-sm font-medium mb-1 block">Sucursal</label>
            <Select
              value={watch("sucursalId")}
              onValueChange={(value) => setValue("sucursalId", value)}
            >
              <SelectTrigger
                className={errors.sucursalId ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Seleccionar sucursal" />
              </SelectTrigger>
              <SelectContent>
                {sucursales && sucursales.length > 0 ? (
                  sucursales.map((sucursal) => (
                    <SelectItem key={sucursal.id} value={sucursal.id}>
                      {sucursal.nombre}
                    </SelectItem>
                  ))
                ) : (
                  <p>No se encontraron sucursales</p>
                )}
              </SelectContent>
            </Select>
            {errors.sucursalId && (
              <p className="text-red-500 text-xs mt-1">
                {errors.sucursalId.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              Punto de Reorden
            </label>
            <Input
              type="number"
              min="0"
              {...register("punto_reorden", {
                required: "Este campo es requerido",
                min: {
                  value: 0,
                  message: "El valor debe ser mayor o igual a 0",
                },
                valueAsNumber: true,
              })}
              placeholder="0"
            />
            {errors.punto_reorden && (
              <p className="text-red-500 text-xs mt-1">
                {errors.punto_reorden.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              Precio ({user?.pais?.simbolo_moneda || "$"})
            </label>
            <Input
              type="number"
              min="0"
              step="0.01"
              {...register("precio", {
                required: "Este campo es requerido",
                min: {
                  value: 0,
                  message: "El precio debe ser mayor o igual a 0",
                },
                valueAsNumber: true,
              })}
              placeholder="0.00"
            />
            {errors.precio && (
              <p className="text-red-500 text-xs mt-1">
                {errors.precio.message}
              </p>
            )}
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              Descuento (%)
            </label>
            <Input
              type="number"
              min="0"
              max="100"
              {...register("descuento", {
                required: "Este campo es requerido",
                min: {
                  value: 0,
                  message: "El descuento debe ser entre 0 y 100",
                },
                max: {
                  value: 100,
                  message: "El descuento debe ser entre 0 y 100",
                },
                valueAsNumber: true,
              })}
              placeholder="0"
            />
            {errors.descuento && (
              <p className="text-red-500 text-xs mt-1">
                {errors.descuento.message}
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={crearDatosProductoMutation.isPending || !selectedProducto}
          >
            {crearDatosProductoMutation.isPending ? (
              "Cargando..."
            ) : (
              <>
                <Plus className="h-4 w-4 mr-1" />
                Agregar
              </>
            )}
          </Button>
        </div>
      </form>

      <Table>
        <TableCaption>Lista de productos y sus datos por sucursal</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Producto</TableHead>
            <TableHead className="text-center">Sucursal</TableHead>
            <TableHead className="text-center">Punto de Reorden</TableHead>
            <TableHead className="text-center">Precio</TableHead>
            <TableHead className="text-center">Descuento</TableHead>

            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {datosProductos && datosProductos.length > 0 ? (
            datosProductos.map((producto) => (
              <TableRow key={producto.id}>
                <TableCell className="font-medium text-center">
                  {producto.producto.nombre}
                </TableCell>
                <TableCell className="text-center">
                  {producto.editing ? (
                    <Select
                      value={producto.sucursal.id}
                      onValueChange={(value) =>
                        handleFieldChange(producto.id, "sucursal", {
                          ...producto.sucursal,
                          id: value,
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar sucursal" />
                      </SelectTrigger>
                      <SelectContent>
                        {sucursales?.map((sucursal) => (
                          <SelectItem key={sucursal.id} value={sucursal.id}>
                            {sucursal.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    producto.sucursal.nombre
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Input
                    type="number"
                    min="0"
                    value={producto.punto_reorden}
                    onChange={(e) =>
                      handleFieldChange(
                        producto.id,
                        "punto_reorden",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-20 text-center"
                    disabled={!producto.editing}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-sm">
                      {user?.pais?.simbolo_moneda || "$"}
                    </span>
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={producto.precio}
                      onChange={(e) =>
                        handleFieldChange(producto.id, "precio", e.target.value)
                      }
                      className="w-24 text-right"
                      disabled={!producto.editing}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={producto.descuento}
                      onChange={(e) =>
                        handleFieldChange(
                          producto.id,
                          "descuento",
                          e.target.value
                        )
                      }
                      className="w-20 text-right"
                      disabled={!producto.editing}
                    />
                    <span className="text-sm">%</span>
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  <div className="flex justify-center gap-2">
                    {!producto.editing ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleEdit(producto.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancelEdit(producto.id)}
                          disabled={actualizarDatosProductoMutation.isPending}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleSave(producto.id)}
                          disabled={actualizarDatosProductoMutation.isPending}
                        >
                          {actualizarDatosProductoMutation.isPending ? (
                            "Guardando..."
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

export default TableDatosProducto;
