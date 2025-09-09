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
import { Plus, Edit, Save, X, Trash2 } from "lucide-react";
import { User } from "@/interfaces/auth/user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-toastify";

interface Producto {
  id: number;
  nombre: string;
  sucursal: string;
  puntoReorden: number;
  precio: number;
  descuento: number;
  producto_id: string;
  sucursal_id: string;
  is_active: boolean;
  editing?: boolean;
}

interface Props {
  user: User | undefined;
}

const TableDatosProducto = ({ user }: Props) => {
  const sucursales = [
    { id: "1", nombre: "Sucursal Centro" },
    { id: "2", nombre: "Sucursal Norte" },
    { id: "3", nombre: "Sucursal Sur" },
    { id: "4", nombre: "Sucursal Este" },
    { id: "5", nombre: "Sucursal Oeste" },
  ];

  const [productos, setProductos] = useState<Producto[]>([
    {
      id: 1,
      nombre: "Laptop HP Pavilion",
      sucursal: "Sucursal Centro",
      puntoReorden: 5,
      precio: 1200,
      descuento: 10,
      producto_id: "1",
      sucursal_id: "1",
      is_active: true,
      editing: false,
    },
    {
      id: 2,
      nombre: "Laptop HP Pavilion",
      sucursal: "Sucursal Norte",
      puntoReorden: 15,
      precio: 25,
      descuento: 5,
      producto_id: "2",
      sucursal_id: "2",
      is_active: true,
      editing: false,
    },
    {
      id: 3,
      nombre: "Laptop HP Pavilion",
      sucursal: "Sucursal Sur",
      puntoReorden: 8,
      precio: 80,
      descuento: 15,
      producto_id: "3",
      sucursal_id: "3",
      is_active: true,
      editing: false,
    },
  ]);

  const [nuevoProducto, setNuevoProducto] = useState({
    producto_id: "",
    sucursal_id: "",
    puntoReorden: 0,
    precio: 0,
    descuento: 0,
  });

  const toggleEdit = (id: number) => {
    setProductos(
      productos.map((p) =>
        p.id === id ? { ...p, editing: !p.editing } : { ...p, editing: false }
      )
    );
  };

  const handleSave = (id: number) => {
    const producto = productos.find((p) => p.id === id);
    if (producto) {
      if (producto.puntoReorden < 0) {
        toast.error("El punto de reorden no puede ser negativo");
        return;
      }
      if (producto.precio < 0) {
        toast.error("El precio no puede ser negativo");
        return;
      }
      if (producto.descuento < 0 || producto.descuento > 100) {
        toast.error("El descuento debe estar entre 0 y 100");
        return;
      }
    }

    setProductos(
      productos.map((p) => (p.id === id ? { ...p, editing: false } : p))
    );
    toast.success("Datos del producto actualizados exitosamente");
  };

  const handleCancelEdit = (id: number) => {
    setProductos(
      productos.map((p) => (p.id === id ? { ...p, editing: false } : p))
    );
  };

  const handleDelete = (id: number) => {
    setProductos(productos.filter((p) => p.id !== id));
    toast.success("Producto eliminado exitosamente");
  };

  const handleFieldChange = (id: number, field: string, value: any) => {
    setProductos(
      productos.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleToggleStatus = (id: number) => {
    setProductos(
      productos.map((p) =>
        p.id === id ? { ...p, is_active: !p.is_active } : p
      )
    );
    toast.success("Estado del producto actualizado");
  };

  return (
    <div className="w-full space-y-4">
      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-semibold mb-3">Agregar Nuevos Datos al Producto</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          <div>
            <label className="text-sm font-medium mb-1 block">Sucursal</label>
            <Select
              value={nuevoProducto.sucursal_id}
              onValueChange={(value) =>
                setNuevoProducto({ ...nuevoProducto, sucursal_id: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar sucursal" />
              </SelectTrigger>
              <SelectContent>
                {sucursales.map((sucursal) => (
                  <SelectItem key={sucursal.id} value={sucursal.id}>
                    {sucursal.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              Punto de Reorden
            </label>
            <Input
              type="number"
              min="0"
              value={nuevoProducto.puntoReorden}
              onChange={(e) =>
                setNuevoProducto({
                  ...nuevoProducto,
                  puntoReorden: parseInt(e.target.value) || 0,
                })
              }
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              Precio ({user?.pais?.simbolo_moneda || "$"})
            </label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={nuevoProducto.precio}
              onChange={(e) =>
                setNuevoProducto({
                  ...nuevoProducto,
                  precio: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              Descuento (%)
            </label>
            <Input
              type="number"
              min="0"
              max="100"
              value={nuevoProducto.descuento}
              onChange={(e) =>
                setNuevoProducto({
                  ...nuevoProducto,
                  descuento: parseInt(e.target.value) || 0,
                })
              }
              placeholder="0"
            />
          </div>
          <Button onClick={() => {}} className="w-full">
            <Plus className="h-4 w-4 mr-1" />
            Agregar
          </Button>
        </div>
      </div>

      <Table>
        <TableCaption>Lista de productos y sus datos por sucursal</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Producto</TableHead>
            <TableHead className="text-center">Sucursal</TableHead>
            <TableHead className="text-center">Punto de Reorden</TableHead>
            <TableHead className="text-center">Precio</TableHead>
            <TableHead className="text-center">Descuento</TableHead>
            <TableHead className="text-center">Estado</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productos.map((producto) => (
            <TableRow key={producto.id}>
              <TableCell className="font-medium text-center">
                {producto.editing ? (
                  <Select
                    value={producto.producto_id}
                    onValueChange={(value) =>
                      handleFieldChange(producto.id, "producto_id", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar producto" />
                    </SelectTrigger>
                    <SelectContent>
                      {productos.map((prod) => (
                        <SelectItem key={prod.id} value={prod.nombre}>
                          {prod.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  producto.nombre
                )}
              </TableCell>
              <TableCell className="text-center">
                {producto.editing ? (
                  <Select
                    value={producto.sucursal_id}
                    onValueChange={(value) =>
                      handleFieldChange(producto.id, "sucursal_id", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar sucursal" />
                    </SelectTrigger>
                    <SelectContent>
                      {sucursales.map((sucursal) => (
                        <SelectItem key={sucursal.id} value={sucursal.id}>
                          {sucursal.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : (
                  producto.sucursal
                )}
              </TableCell>
              <TableCell className="text-center">
                <Input
                  type="number"
                  min="0"
                  value={producto.puntoReorden}
                  onChange={(e) =>
                    handleFieldChange(
                      producto.id,
                      "puntoReorden",
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
                      handleFieldChange(
                        producto.id,
                        "precio",
                        parseFloat(e.target.value) || 0
                      )
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
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-20 text-right"
                    disabled={!producto.editing}
                  />
                  <span className="text-sm">%</span>
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium cursor-pointer ${
                    producto.is_active
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                  onClick={() => handleToggleStatus(producto.id)}
                >
                  {producto.is_active ? "Activo" : "Inactivo"}
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(producto.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleCancelEdit(producto.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleSave(producto.id)}
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableDatosProducto;
