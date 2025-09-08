"use client";
import TitlePages from "@/components/generics/TitlePages";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { tiposPagos } from "@/helpers/data/tiposPagos";
import useGetProveedoresActivos from "@/hooks/proveedores/useGetProveedoresActivos";
import useGetSucursalesPais from "@/hooks/sucursales/useGetSucursalesPais";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { Filter, Plus } from "lucide-react";
import React, { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import useGetComprasInsumos from "@/hooks/compras-insumos/useGetComprasInsumos";
import TableCompras from "./ui/TableCompras";
import FormCompraInsumos from "./ui/FormCompraInsumos";

const ComprasInsumosPage = () => {
  const { user } = useAuthStore();
  const paisId = user?.pais.id || "";
  const [isOpen, setIsOpen] = useState(false);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [proveedor, setProveedor] = useState("");
  const [sucursal, setSucursal] = useState("");
  const [tipoPago, setTipoPago] = useState("");
  const { data: proveedores } = useGetProveedoresActivos();
  const { data: sucursales } = useGetSucursalesPais(paisId);

  const proveedorId = proveedor === "all" ? "" : proveedor;
  const sucursalId = sucursal === "all" ? "" : sucursal;
  const todosPagos = tipoPago === "all" ? "" : tipoPago;

  const { data: comprasData, isLoading } = useGetComprasInsumos(
    limit,
    offset,
    proveedorId,
    sucursalId,
    todosPagos
  );

  const handlePageChange = (newOffset: number) => {
    setOffset(newOffset);
  };

  const clearFilters = () => {
    setProveedor("");
    setSucursal("");
    setTipoPago("");
    setOffset(0);
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mt-5">
        <TitlePages title="Gestión de Compras - Insumos" />
        <div className="flex items-center gap-4">
          <Button onClick={() => setIsOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Agregar Compra
          </Button>
        </div>
      </div>

      <div className="mt-5 p-4 bg-muted/50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Select value={proveedor} onValueChange={setProveedor}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por proveedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {proveedores && proveedores.length > 0 ? (
                  proveedores.map((prov) => (
                    <SelectItem value={prov.id} key={prov.id}>
                      {prov.nombre_legal} - {prov.nit_rtn}
                    </SelectItem>
                  ))
                ) : (
                  <p>No se encontraron proveedores</p>
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={sucursal} onValueChange={setSucursal}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por sucursal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {sucursales && sucursales.length > 0 ? (
                  sucursales.map((suc) => (
                    <SelectItem value={suc.id} key={suc.id}>
                      {suc.nombre}
                    </SelectItem>
                  ))
                ) : (
                  <p>No se encontraron sucursales</p>
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={tipoPago} onValueChange={setTipoPago}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por tipo de pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {tiposPagos.map((tipo) => (
                  <SelectItem value={tipo.value} key={tipo.id}>
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={clearFilters}>
            <Filter className="mr-2 h-4 w-4" /> Limpiar
          </Button>
        </div>
      </div>

      <div className="mt-5">
        <div className="rounded-md border">
          <TableCompras comprasData={comprasData} isLoading={isLoading} />
        </div>

        {comprasData && comprasData.total > limit && (
          <div className="mt-4">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      handlePageChange(Math.max(0, offset - limit))
                    }
                    className={
                      offset === 0 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {[...Array(Math.ceil(comprasData.total / limit))].map(
                  (_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        isActive={offset === index * limit}
                        onClick={() => handlePageChange(index * limit)}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(offset + limit)}
                    className={
                      offset + limit >= comprasData.total
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="p-4 md:max-w-5xl max-h-[600px] overflow-y-auto">
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Agregar Nueva Compra</AlertDialogTitle>
            <AlertDialogDescription>
              En esta sección ingresarás las compras de productos
            </AlertDialogDescription>
            <div>
              <FormCompraInsumos onSuccess={() => setIsOpen(false)} />
            </div>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ComprasInsumosPage;
