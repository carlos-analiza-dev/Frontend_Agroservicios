import { ResponseExistenciaProductosInterface } from "@/apis/existencia_productos/interfaces/response-existencia-productos.interface";
import { PreciosPorPai } from "@/apis/productos/interfaces/response-productos.interface";
import { Badge } from "@/components/ui/badge";
import { UseQueryResult } from "@tanstack/react-query";
import React from "react";

interface ProductoServicioUnificado {
  id: string;
  nombre: string;
  tipo: "producto" | "servicio";
  precio?: number;
  preciosPorPais: PreciosPorPai[];
  cantidadMin?: number;
  cantidadMax?: number;
}

interface Props {
  productoId: string;
  cantidad: number;
  productosYServicios: ProductoServicioUnificado[];
  mapaExistencias: { [key: string]: number };
  existenciasQueries: UseQueryResult<
    ResponseExistenciaProductosInterface[],
    Error
  >[];
}

const ExistenciaBadge = ({
  cantidad,
  productoId,
  productosYServicios,
  mapaExistencias,
  existenciasQueries,
}: Props) => {
  const producto = productosYServicios.find((p) => p.id === productoId);
  if (!productoId || producto?.tipo === "servicio") return null;

  const existencia = mapaExistencias[productoId];
  const isLoading = existenciasQueries.some((query) => query.isLoading);
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
        Sin existencia
      </Badge>
    );
  }

  return (
    <Badge variant={suficiente ? "default" : "destructive"} className="ml-2">
      {suficiente ? `Disponible: ${existencia}` : `Insuficiente: ${existencia}`}
    </Badge>
  );
};

export default ExistenciaBadge;
