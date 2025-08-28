"use client";
import useGetInventariosInsumos from "@/hooks/inventarios-insumos/useGetInventariosInsumos";
import { useAuthStore } from "@/providers/store/useAuthStore";
import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search, Filter, Package } from "lucide-react";
import TableUsersSkeleton from "@/components/generics/SkeletonTable";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import dynamic from "next/dynamic";
import LoaderComponents from "@/components/generics/LoaderComponents";

const FormInventario = dynamic(() => import("./ui/FormInventario"), {
  loading: () => <LoaderComponents />,
});

const TableInventarioInsumo = dynamic(
  () => import("./ui/TableInventarioInsumo"),
  {
    loading: () => <TableUsersSkeleton />,
  }
);

const PageInventarioInsumosAdmin = () => {
  const { user } = useAuthStore();
  let paisId = user?.pais.id;
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const offset = (currentPage - 1) * itemsPerPage;

  const { data: response, isLoading } = useGetInventariosInsumos(
    itemsPerPage,
    offset,
    paisId
  );

  const filteredInventario = useMemo(() => {
    if (!response?.data) return [];

    return response.data.inventario.filter(
      (item) =>
        item.insumo?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.insumo?.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.insumo?.marca.nombre
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
    );
  }, [response, searchTerm]);

  const totalPages = Math.ceil((response?.data.total || 0) / itemsPerPage);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold tracking-tight">
            Inventario de Insumos
          </h1>
          <p className="text-muted-foreground">
            Gestiona el inventario de insumos disponibles
          </p>
        </div>
        <Button onClick={() => setIsOpen(true)}>
          <Package className="mr-2 h-4 w-4" />
          Nuevo Insumo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative w-full md:max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar insumo..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={itemsPerPage.toString()}
                onValueChange={(value) => setItemsPerPage(Number(value))}
              >
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Items por página" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 por página</SelectItem>
                  <SelectItem value="10">10 por página</SelectItem>
                  <SelectItem value="20">20 por página</SelectItem>
                  <SelectItem value="50">50 por página</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <TableUsersSkeleton />
            </div>
          ) : filteredInventario.length === 0 ? (
            <div className="text-center py-10">
              <Package className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No hay insumos</h3>
              <p className="text-muted-foreground">
                No se encontraron insumos en el inventario.
              </p>
            </div>
          ) : (
            <>
              <TableInventarioInsumo filteredInventario={filteredInventario} />

              {totalPages > 1 && (
                <div className="mt-6">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage((prev) => Math.max(prev - 1, 1));
                          }}
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(page);
                              }}
                              isActive={currentPage === page}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      )}
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage((prev) =>
                              Math.min(prev + 1, totalPages)
                            );
                          }}
                          className={
                            currentPage === totalPages
                              ? "pointer-events-none opacity-50"
                              : ""
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

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <div className="flex justify-end">
            {" "}
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Agregar Inventario de Insumos</AlertDialogTitle>
            <AlertDialogDescription>
              En esta seccion podras agregar inventario a tus insumos
              disponibles
            </AlertDialogDescription>
          </AlertDialogHeader>
          <FormInventario onSuccess={() => setIsOpen(false)} />
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PageInventarioInsumosAdmin;
