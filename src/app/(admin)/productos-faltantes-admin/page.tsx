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
  Calendar,
  Download,
  Building,
} from "lucide-react";
import useGetProductosNoVendidos from "@/hooks/productos-no-vendidos/useGetProductosNoVendidos";
import { useAuthStore } from "../../../providers/store/useAuthStore";
import InfoPrincipal from "./ui/InfoPrincipal";
import TableProductosNoVendidos from "./ui/TableProductosNoVendidos";
import useGetSucursalesPais from "@/hooks/sucursales/useGetSucursalesPais";

import { Badge } from "@/components/ui/badge";
import { exportProductosFaltantes } from "@/helpers/funciones/exportProductosFaltantes";

const ProductosFaltantesPage = () => {
  const { user } = useAuthStore();
  const paisId = user?.pais.id || "";
  const simbolo = user?.pais.simbolo_moneda || "$";
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [motivoFilter, setMotivoFilter] = useState<string>("all");
  const [sucursalFilter, setSucursalFilter] = useState<string>("all");
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [showDateFilters, setShowDateFilters] = useState(false);
  const { data: sucursales, isLoading: cargandoSucursales } =
    useGetSucursalesPais(paisId);

  const { data, isLoading, error, refetch } = useGetProductosNoVendidos({
    limit,
    offset,
    fechaInicio,
    fechaFin,
    sucursal: sucursalFilter !== "all" ? sucursalFilter : undefined,
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

      const matchesSucursal =
        sucursalFilter === "all" || producto.sucursal.id === sucursalFilter;

      return matchesSearch && matchesMotivo && matchesSucursal;
    }) || [];

  const handleExportToExcel = () => {
    exportProductosFaltantes(filteredProductos, simbolo);
  };

  const handleApplyDateFilters = () => {
    setOffset(0);
  };

  const handleClearDateFilters = () => {
    setFechaInicio("");
    setFechaFin("");
    setOffset(0);
  };

  const handleClearSucursalFilter = () => {
    setSucursalFilter("all");
    setOffset(0);
  };

  const handleRefetch = () => {
    setOffset(0);
    refetch();
  };

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
              <Button onClick={handleRefetch} variant="outline">
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
            Productos No Vendidos
          </h1>
          <p className="text-gray-600 mt-1">
            Gestión de productos no vendidos por falta de inventario
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleExportToExcel}
            variant="outline"
            className="shrink-0"
            disabled={filteredProductos.length === 0}
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar Excel
          </Button>
          <Button
            onClick={handleRefetch}
            variant="outline"
            className="shrink-0"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      <InfoPrincipal data={data} simbolo={simbolo} />

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4">
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
                  </SelectContent>
                </Select>

                <Select
                  value={sucursalFilter}
                  onValueChange={setSucursalFilter}
                  disabled={cargandoSucursales}
                >
                  <SelectTrigger className="w-[180px]">
                    <Building className="h-4 w-4 mr-2" />
                    <SelectValue
                      placeholder={
                        cargandoSucursales
                          ? "Cargando..."
                          : "Filtrar por sucursal"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las sucursales</SelectItem>
                    {sucursales?.map((sucursal) => (
                      <SelectItem key={sucursal.id} value={sucursal.id}>
                        {sucursal.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  onClick={() => setShowDateFilters(!showDateFilters)}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Fechas
                </Button>
              </div>
            </div>

            {showDateFilters && (
              <div className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg bg-gray-50">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    Desde:
                  </label>
                  <Input
                    type="date"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
                    Hasta:
                  </label>
                  <Input
                    type="date"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={handleApplyDateFilters}
                    disabled={!fechaInicio && !fechaFin}
                  >
                    Aplicar Fechas
                  </Button>

                  <Button variant="outline" onClick={handleClearDateFilters}>
                    Limpiar
                  </Button>
                </div>
              </div>
            )}

            {/* Indicadores de Filtros Activos */}
            {(fechaInicio || fechaFin || sucursalFilter !== "all") && (
              <div className="flex flex-wrap items-center gap-2 text-sm text-blue-600">
                <Filter className="h-4 w-4" />
                <span>Filtrado por:</span>
                {fechaInicio && (
                  <Badge variant="outline" className="text-blue-600">
                    desde {fechaInicio}
                  </Badge>
                )}
                {fechaFin && (
                  <Badge variant="outline" className="text-blue-600">
                    hasta {fechaFin}
                  </Badge>
                )}
                {sucursalFilter !== "all" && (
                  <Badge variant="outline" className="text-blue-600">
                    {sucursales?.find((s) => s.id === sucursalFilter)?.nombre}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                      onClick={handleClearSucursalFilter}
                    >
                      ×
                    </Button>
                  </Badge>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Lista de Productos Faltantes</CardTitle>
          <div className="text-sm text-gray-500">
            {filteredProductos.length} productos encontrados
          </div>
        </CardHeader>
        <CardContent>
          {filteredProductos.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">
                No se encontraron productos
              </h3>
              <p className="text-gray-600 mt-1">
                {searchTerm ||
                motivoFilter !== "all" ||
                sucursalFilter !== "all" ||
                fechaInicio ||
                fechaFin
                  ? "Intenta ajustar los filtros de búsqueda"
                  : "No hay productos faltantes registrados"}
              </p>
              {(fechaInicio || fechaFin || sucursalFilter !== "all") && (
                <div className="flex gap-2 justify-center mt-4">
                  <Button variant="outline" onClick={handleClearDateFilters}>
                    Limpiar filtros de fecha
                  </Button>
                  {sucursalFilter !== "all" && (
                    <Button
                      variant="outline"
                      onClick={handleClearSucursalFilter}
                    >
                      Limpiar filtro de sucursal
                    </Button>
                  )}
                </div>
              )}
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
