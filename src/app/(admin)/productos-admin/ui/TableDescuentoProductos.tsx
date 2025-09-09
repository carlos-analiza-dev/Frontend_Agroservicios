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
import { Plus, Edit, Save, X, Trash2, Percent } from "lucide-react";

const TableDescuentoProductos = () => {
  const [descuentos, setDescuentos] = useState([
    {
      id: 1,
      producto: "Laptop HP Pavilion",
      cantidadMinima: 1,
      descuento: 0,
      editing: false,
    },
    {
      id: 2,
      producto: "Laptop HP Pavilion",
      cantidadMinima: 5,
      descuento: 5,
      editing: false,
    },
    {
      id: 3,
      producto: "Laptop HP Pavilion",
      cantidadMinima: 10,
      descuento: 10,
      editing: false,
    },
    {
      id: 4,
      producto: "Mouse Inalámbrico",
      cantidadMinima: 1,
      descuento: 0,
      editing: false,
    },
    {
      id: 5,
      producto: "Mouse Inalámbrico",
      cantidadMinima: 20,
      descuento: 15,
      editing: false,
    },
  ]);

  const [nuevoDescuento, setNuevoDescuento] = useState({
    producto: "",
    cantidadMinima: 1,
    descuento: 0,
    activo: true,
  });

  const toggleEdit = (id: number) => {
    setDescuentos(
      descuentos.map((d) => (d.id === id ? { ...d, editing: !d.editing } : d))
    );
  };

  const handleSave = (id: number) => {
    setDescuentos(
      descuentos.map((d) => (d.id === id ? { ...d, editing: false } : d))
    );
  };

  const handleDelete = (id: number) => {
    setDescuentos(descuentos.filter((d) => d.id !== id));
  };

  const handleAddDescuento = () => {
    if (nuevoDescuento.producto && nuevoDescuento.cantidadMinima > 0) {
      const nuevo = {
        id: Math.max(...descuentos.map((d) => d.id), 0) + 1,
        producto: nuevoDescuento.producto,
        cantidadMinima: nuevoDescuento.cantidadMinima,
        descuento: nuevoDescuento.descuento,
        editing: false,
        activo: nuevoDescuento.activo,
      };
      setDescuentos([...descuentos, nuevo]);
      setNuevoDescuento({
        producto: "",
        cantidadMinima: 1,
        descuento: 0,
        activo: true,
      });
    }
  };

  const productosUnicos = Array.from(
    new Set(descuentos.map((d) => d.producto))
  );

  return (
    <div className="w-full space-y-4">
      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-semibold mb-3">Agregar Nuevo Descuento</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          <div>
            <label className="text-sm font-medium mb-1 block">
              Cantidad Mínima
            </label>
            <Input
              type="number"
              min="1"
              value={nuevoDescuento.cantidadMinima}
              onChange={(e) =>
                setNuevoDescuento({
                  ...nuevoDescuento,
                  cantidadMinima: parseInt(e.target.value) || 1,
                })
              }
              placeholder="Cantidad"
            />
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
                value={nuevoDescuento.descuento}
                onChange={(e) =>
                  setNuevoDescuento({
                    ...nuevoDescuento,
                    descuento: parseInt(e.target.value) || 0,
                  })
                }
                placeholder="0"
                className="pr-8"
              />
              <Percent className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <Button onClick={handleAddDescuento} className="w-full">
            <Plus className="h-4 w-4 mr-1" />
            Agregar
          </Button>
        </div>
      </div>

      <Table>
        <TableCaption>Descuentos por volumen de compra</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Producto</TableHead>
            <TableHead className="text-right">Cantidad Mínima</TableHead>
            <TableHead className="text-right">Descuento</TableHead>

            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {descuentos.map((descuento) => (
            <TableRow key={descuento.id}>
              <TableCell className="font-medium">
                {descuento.editing ? (
                  <select
                    value={descuento.producto}
                    onChange={(e) =>
                      setDescuentos(
                        descuentos.map((d) =>
                          d.id === descuento.id
                            ? { ...d, producto: e.target.value }
                            : d
                        )
                      )
                    }
                    className="w-full p-2 border rounded-md"
                  >
                    {productosUnicos.map((producto) => (
                      <option key={producto} value={producto}>
                        {producto}
                      </option>
                    ))}
                  </select>
                ) : (
                  descuento.producto
                )}
              </TableCell>
              <TableCell className="text-right">
                <Input
                  type="number"
                  min="1"
                  value={descuento.cantidadMinima}
                  onChange={(e) =>
                    setDescuentos(
                      descuentos.map((d) =>
                        d.id === descuento.id
                          ? {
                              ...d,
                              cantidadMinima: parseInt(e.target.value) || 1,
                            }
                          : d
                      )
                    )
                  }
                  className="w-20 text-right"
                  disabled={!descuento.editing}
                />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={descuento.descuento}
                    onChange={(e) =>
                      setDescuentos(
                        descuentos.map((d) =>
                          d.id === descuento.id
                            ? {
                                ...d,
                                descuento: parseInt(e.target.value) || 0,
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
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(descuento.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleEdit(descuento.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleSave(descuento.id)}
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

export default TableDescuentoProductos;
