"use client";
import useGetExistenciaProductos from "@/hooks/existencias/useGetExistenciaProductos";
import useGetSucursalesPais from "@/hooks/sucursales/useGetSucursalesPais";
import { useAuthStore } from "@/providers/store/useAuthStore";
import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, AlertCircle, Download } from "lucide-react";
import TableExistencia from "./ui/TableExistencia";
import { exportToExcel } from "@/helpers/funciones/downLoadInvProductos";

const ExistenciaProductosAdmin = () => {
  const { user } = useAuthStore();
  const paisId = user?.pais.id || "";
  const sucursalUsuario = user?.sucursal.id || "";

  const [selectedProducto, setSelectedProducto] = useState<string>("");
  const [selectedSucursal, setSelectedSucursal] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (sucursalUsuario && !selectedSucursal) {
      setSelectedSucursal(sucursalUsuario);
    }
  }, [sucursalUsuario, selectedSucursal]);

  const sucursalId = selectedSucursal === "all" ? "" : selectedSucursal;
  const productoId = selectedProducto === "all" ? "" : selectedProducto;

  const { data: existencia_productos, isLoading } = useGetExistenciaProductos(
    productoId,
    sucursalId
  );

  const { data: sucursales } = useGetSucursalesPais(paisId);

  const sucursalActual =
    sucursales?.find((s) => s.id === sucursalUsuario)?.nombre ||
    "Sucursal actual";

  const filteredData = existencia_productos?.filter(
    (item) =>
      item.productoNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sucursalNombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.productoId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalExistencia =
    filteredData?.reduce(
      (total, item) => total + parseFloat(item.existenciaTotal),
      0
    ) || 0;

  const handleClearFilters = () => {
    setSelectedProducto("");
    setSelectedSucursal(sucursalUsuario || "all");
    setSearchTerm("");
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Inventario de Productos</CardTitle>
              <CardDescription>
                Visualiza la existencia de productos por sucursal
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportToExcel(filteredData)}
                disabled={!filteredData || filteredData.length === 0}
              >
                <Download className="h-4 w-4 mr-2" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>

            <Select
              value={selectedSucursal}
              onValueChange={setSelectedSucursal}
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    selectedSucursal === sucursalUsuario && sucursalUsuario
                      ? sucursalActual
                      : "Filtrar por sucursal"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {sucursalUsuario && (
                  <SelectItem value={sucursalUsuario}>
                    {sucursalActual} (Actual)
                  </SelectItem>
                )}
                <SelectItem value="all">Todas las sucursales</SelectItem>
                {sucursales
                  ?.filter(
                    (sucursal) =>
                      sucursal.id &&
                      sucursal.id.trim() !== "" &&
                      sucursal.id !== sucursalUsuario
                  )
                  .map((sucursal) => (
                    <SelectItem key={sucursal.id} value={sucursal.id}>
                      {sucursal.nombre}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={handleClearFilters}>
              <Filter className="h-4 w-4 mr-2" />
              Limpiar filtros
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="space-y-4 p-6">
                  {[...Array(5)].map((_, i) => (
                    <Skeleton key={i} className="h-12 w-full" />
                  ))}
                </div>
              ) : filteredData && filteredData.length > 0 ? (
                <>
                  <TableExistencia filteredData={filteredData} />

                  <div className="p-4 border-t">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-muted-foreground">
                        Mostrando {filteredData.length} de{" "}
                        {existencia_productos?.length} registros
                      </div>
                      <div className="text-sm font-medium">
                        Total existencia:{" "}
                        <span className="text-primary">
                          {totalExistencia.toFixed(2)} unidades
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-8 text-center">
                  <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">
                    No se encontraron resultados
                  </h3>
                  <p className="text-muted-foreground">
                    {searchTerm ||
                    selectedProducto ||
                    (selectedSucursal !== "all" && selectedSucursal)
                      ? "Intenta ajustar los filtros de búsqueda"
                      : "No hay datos de existencia disponibles"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExistenciaProductosAdmin;
