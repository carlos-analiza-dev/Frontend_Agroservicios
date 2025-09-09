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
import { Plus, Edit, Save, X, Trash2 } from "lucide-react";
import { User } from "@/interfaces/auth/user";

interface Props {
  user: User | undefined;
}

const TableEscalasProducto = ({ user }: Props) => {
  const [escalas, setEscalas] = useState([
    {
      id: 1,
      producto: "Laptop HP Pavilion",
      compraMinima: 1,
      bonificacion: 0,
      costo: 1200,
      editing: false,
    },
    {
      id: 2,
      producto: "Laptop HP Pavilion",
      compraMinima: 5,
      bonificacion: 1,
      costo: 1150,
      editing: false,
    },
    {
      id: 3,
      producto: "Laptop HP Pavilion",
      compraMinima: 10,
      bonificacion: 2,
      costo: 1100,
      editing: false,
    },
    {
      id: 4,
      producto: "Mouse Inalámbrico",
      compraMinima: 1,
      bonificacion: 0,
      costo: 25,
      editing: false,
    },
    {
      id: 5,
      producto: "Mouse Inalámbrico",
      compraMinima: 10,
      bonificacion: 1,
      costo: 22,
      editing: false,
    },
  ]);

  const [nuevaEscala, setNuevaEscala] = useState({
    producto: "",
    compraMinima: 1,
    bonificacion: 0,
    costo: 0,
  });

  const toggleEdit = (id: number) => {
    setEscalas(
      escalas.map((e) => (e.id === id ? { ...e, editing: !e.editing } : e))
    );
  };

  const handleSave = (id: number) => {
    setEscalas(
      escalas.map((e) => (e.id === id ? { ...e, editing: false } : e))
    );
  };

  const handleDelete = (id: number) => {
    setEscalas(escalas.filter((e) => e.id !== id));
  };

  const handleAddEscala = () => {
    if (nuevaEscala.producto && nuevaEscala.costo > 0) {
      const nueva = {
        id: Math.max(...escalas.map((e) => e.id), 0) + 1,
        producto: nuevaEscala.producto,
        compraMinima: nuevaEscala.compraMinima,
        bonificacion: nuevaEscala.bonificacion,
        costo: nuevaEscala.costo,
        editing: false,
      };
      setEscalas([...escalas, nueva]);
      setNuevaEscala({
        producto: "",
        compraMinima: 1,
        bonificacion: 0,
        costo: 0,
      });
    }
  };

  const productosUnicos = Array.from(new Set(escalas.map((e) => e.producto)));

  return (
    <div className="w-full space-y-4">
      <div className="bg-muted p-4 rounded-lg">
        <h3 className="font-semibold mb-3">Agregar Nueva Escala</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 items-end">
          <div>
            <label className="text-sm font-medium mb-1 block">
              Bonificación
            </label>
            <Input
              type="number"
              min="0"
              value={nuevaEscala.bonificacion}
              onChange={(e) =>
                setNuevaEscala({
                  ...nuevaEscala,
                  bonificacion: parseInt(e.target.value) || 0,
                })
              }
              placeholder="Unidades bonus"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              Costo {user?.pais.simbolo_moneda}
            </label>
            <Input
              type="number"
              min="0"
              step="0.01"
              value={nuevaEscala.costo}
              onChange={(e) =>
                setNuevaEscala({
                  ...nuevaEscala,
                  costo: parseFloat(e.target.value) || 0,
                })
              }
              placeholder="0.00"
            />
          </div>
          <Button onClick={handleAddEscala} className="w-full">
            <Plus className="h-4 w-4 mr-1" />
            Agregar
          </Button>
        </div>
      </div>

      <Table>
        <TableCaption>Escalas de precios por volumen de compra</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Producto</TableHead>
            <TableHead className="text-right">Compra Mínima</TableHead>
            <TableHead className="text-right">Bonificación</TableHead>
            <TableHead className="text-right">Costo Unitario</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {escalas.map((escala) => (
            <TableRow key={escala.id}>
              <TableCell className="font-medium">
                {escala.editing ? (
                  <select
                    value={escala.producto}
                    className="w-full p-2 border rounded-md"
                  >
                    {productosUnicos.map((producto) => (
                      <option key={producto} value={producto}>
                        {producto}
                      </option>
                    ))}
                  </select>
                ) : (
                  escala.producto
                )}
              </TableCell>
              <TableCell className="text-right">
                <Input
                  type="number"
                  min="1"
                  value={escala.compraMinima}
                  className="w-20 text-right"
                  disabled={!escala.editing}
                />
              </TableCell>
              <TableCell className="text-right">
                <Input
                  type="number"
                  min="0"
                  value={escala.bonificacion}
                  className="w-20 text-right"
                  disabled={!escala.editing}
                />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1">
                  <span className="text-sm">$</span>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={escala.costo}
                    className="w-24 text-right"
                    disabled={!escala.editing}
                  />
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="flex justify-center gap-2">
                  {!escala.editing ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleEdit(escala.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(escala.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleEdit(escala.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleSave(escala.id)}
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

export default TableEscalasProducto;
