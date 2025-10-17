"use client";
import useGetMovimientosProductos from "@/hooks/movimientos-productos/useGetMovimientosProductos";
import useGetSucursalesPais from "@/hooks/sucursales/useGetSucursalesPais";
import { useAuthStore } from "@/providers/store/useAuthStore";
import React, { useState } from "react";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import TableMovimientosProductos from "./ui/TableMovimientosProductos";

const MovimientosProductosAdmin = () => {
  const { user } = useAuthStore();
  const sucursalId = user?.sucursal.id || "";
  const paisId = user?.pais.id || "";
  const [paginaActual, setPaginaActual] = useState(1);
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState(sucursalId);
  const limite = 10;

  const { data: sucursales, isLoading: cargandoSucursales } =
    useGetSucursalesPais(paisId);

  const { data: movimientosData, isLoading: cargandoMovimientos } =
    useGetMovimientosProductos(sucursalSeleccionada, limite, paginaActual);

  const totalPaginas = Math.ceil((movimientosData?.total || 0) / limite);

  const SkeletonTable = () => (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex space-x-4">
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 flex-1" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Movimientos de Productos
        </h1>
        <p className="text-muted-foreground">
          Gestiona y visualiza todos los movimientos de inventario
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtra los movimientos por sucursal y categoría
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Sucursal</label>
              <Select
                value={sucursalSeleccionada}
                onValueChange={(value) => {
                  setSucursalSeleccionada(value);
                  setPaginaActual(1);
                }}
                disabled={cargandoSucursales}
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
            </div>

            <div className="flex items-end">
              <p className="text-sm text-muted-foreground">
                Mostrando {movimientosData?.data.length} de{" "}
                {movimientosData?.total} movimientos
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Movimientos</CardTitle>
          <CardDescription>
            Lista de todos los movimientos de productos en el inventario
          </CardDescription>
        </CardHeader>
        <CardContent>
          {cargandoMovimientos ? (
            <SkeletonTable />
          ) : (
            <>
              <TableMovimientosProductos movimientosData={movimientosData} />

              {totalPaginas > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (paginaActual > 1)
                              setPaginaActual(paginaActual - 1);
                          }}
                          className={
                            paginaActual === 1
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>

                      {Array.from(
                        { length: totalPaginas },
                        (_, i) => i + 1
                      ).map((page) => (
                        <PaginationItem key={page}>
                          <PaginationLink
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setPaginaActual(page);
                            }}
                            isActive={page === paginaActual}
                            className="cursor-pointer"
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (paginaActual < totalPaginas)
                              setPaginaActual(paginaActual + 1);
                          }}
                          className={
                            paginaActual === totalPaginas
                              ? "pointer-events-none opacity-50"
                              : "cursor-pointer"
                          }
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MovimientosProductosAdmin;
