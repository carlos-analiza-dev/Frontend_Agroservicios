import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Plus, X } from "lucide-react";
import { PreciosPorPai } from "@/apis/productos/interfaces/response-productos.interface";

interface ProductoServicioUnificado {
  id: string;
  nombre: string;
  tipo: "producto" | "servicio";
  precio?: number;
  preciosPorPais: PreciosPorPai[];
  cantidadMin?: number;
  cantidadMax?: number;
}

interface SelectorProductoServicioProps {
  onAgregar: (productoId: string) => void;
  productosYServicios: ProductoServicioUnificado[];
  productosSeleccionados: string[];
  disabled?: boolean;
}

const SelectorProductoServicio = ({
  onAgregar,
  productosYServicios,
  productosSeleccionados,
  disabled = false,
}: SelectorProductoServicioProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const opcionesFiltradas = useMemo(() => {
    let opciones = productosYServicios;

    if (searchTerm) {
      opciones = opciones.filter((item) =>
        item.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return opciones;
  }, [productosYServicios, searchTerm]);

  const estaSeleccionado = (itemId: string) => {
    return productosSeleccionados.includes(itemId);
  };

  const handleAgregar = (item: ProductoServicioUnificado) => {
    onAgregar(item.id);
    setIsOpen(false);
    setSearchTerm("");
  };

  return (
    <div className="relative mb-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Buscar producto o servicio para agregar..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            disabled={disabled}
            className="pr-10"
          />

          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
        </div>

        <Button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          variant="outline"
          disabled={disabled}
        >
          {isOpen ? "Cerrar" : "Buscar"}
        </Button>
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-auto">
          {opcionesFiltradas.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {searchTerm
                ? "No se encontraron resultados"
                : "No hay productos/servicios disponibles"}
            </div>
          ) : (
            <div className="py-2">
              {opcionesFiltradas.map((item) => {
                const seleccionado = estaSeleccionado(item.id);

                return (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between px-3 py-3 border-b border-gray-100 last:border-b-0 ${
                      seleccionado
                        ? "bg-gray-50 opacity-60"
                        : "hover:bg-gray-50 cursor-pointer"
                    }`}
                    onClick={() => !seleccionado && handleAgregar(item)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span
                          className={`font-medium ${seleccionado ? "text-gray-500" : "text-gray-900"}`}
                        >
                          {item.nombre}
                        </span>
                        <div className="flex items-center gap-2">
                          {seleccionado && (
                            <Badge
                              variant="outline"
                              className="bg-green-50 text-green-700 text-xs"
                            >
                              Agregado
                            </Badge>
                          )}
                          <Badge
                            variant={
                              item.tipo === "producto" ? "default" : "secondary"
                            }
                          >
                            {item.tipo === "producto" ? "Producto" : "Servicio"}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        Precio: L. {item.preciosPorPais[0]?.precio || 0}
                        {item.tipo === "servicio" &&
                          item.preciosPorPais.length > 1 && (
                            <span className="text-xs text-gray-500 ml-2">
                              ({item.preciosPorPais.length} precios disponibles)
                            </span>
                          )}
                      </div>
                    </div>

                    {!seleccionado && (
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleAgregar(item)}
                        className="ml-2"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
};

export default SelectorProductoServicio;
