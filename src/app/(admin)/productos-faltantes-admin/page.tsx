"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Package,
  AlertTriangle,
  RefreshCw,
  Filter,
} from "lucide-react";
import useGetProductosNoVendidos from "@/hooks/productos-no-vendidos/useGetProductosNoVendidos";
import { useAuthStore } from "../../../providers/store/useAuthStore";
import InfoPrincipal from "./ui/InfoPrincipal";
import TableProductosNoVendidos from "./ui/TableProductosNoVendidos";

const ProductosFaltantesPage = () => {
  const { user } = useAuthStore();
  const simbolo = user?.pais.simbolo_moneda || "$";
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [motivoFilter, setMotivoFilter] = useState<string>("all");

  const { data, isLoading, error, refetch } = useGetProductosNoVendidos({
    limit,
    offset,
  });

  const filteredProductos =
    data?.productos?.filter((producto) => {
      const matchesSearch =
        producto.nombre_producto
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        producto.producto.codigo
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesMotivo =
        motivoFilter === "all" || producto.motivo === motivoFilter;

      return matchesSearch && matchesMotivo;
    }) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="flex flex-col items-center gap-2">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Cargando productos faltantes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4 text-center">
              <AlertTriangle className="h-12 w-12 text-red-500" />
              <div>
                <h3 className="text-lg font-semibold">
                  Error al cargar los datos
                </h3>
                <p className="text-gray-600 mt-1">
                  Ocurrió un error al obtener los productos faltantes.
                </p>
              </div>
              <Button onClick={() => refetch()} variant="outline">
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Productos Faltantes
          </h1>
          <p className="text-gray-600 mt-1">
            Gestión de productos no vendidos por falta de inventario
          </p>
        </div>
        <Button
          onClick={() => refetch()}
          variant="outline"
          className="shrink-0"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Actualizar
        </Button>
      </div>

      <InfoPrincipal data={data} simbolo={simbolo} />

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nombre o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={motivoFilter} onValueChange={setMotivoFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por motivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los motivos</SelectItem>
                  <SelectItem value="Sin_Stock">Sin Stock</SelectItem>
                  <SelectItem value="Venta_Incompleta">
                    Venta Incompleta
                  </SelectItem>
                  <SelectItem value="Vencido">Vencido</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Productos Faltantes</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredProductos.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">
                No se encontraron productos
              </h3>
              <p className="text-gray-600 mt-1">
                {searchTerm || motivoFilter !== "all"
                  ? "Intenta ajustar los filtros de búsqueda"
                  : "No hay productos faltantes registrados"}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <TableProductosNoVendidos
                filteredProductos={filteredProductos}
                simbolo={simbolo}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {data && data.total > limit && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Mostrando {Math.min(limit, filteredProductos.length)} de{" "}
                {data.total} productos
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  disabled={offset === 0}
                  onClick={() => setOffset((prev) => Math.max(0, prev - limit))}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  disabled={offset + limit >= data.total}
                  onClick={() => setOffset((prev) => prev + limit)}
                >
                  Siguiente
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProductosFaltantesPage;
