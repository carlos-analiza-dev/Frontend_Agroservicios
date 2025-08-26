"use client";
import useGetInsumos from "@/hooks/insumos/useGetInsumos";
import usePaises from "@/hooks/paises/usePaises";
import { useAuthStore } from "@/providers/store/useAuthStore";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, Plus, Filter } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import TitlePages from "@/components/generics/TitlePages";
import TableInsumos from "./ui/TableInsumos";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
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
import FormInsumos from "./ui/FormInsumos";

const InsumosAdminPage = () => {
  const { user } = useAuthStore();
  let paisId = user?.pais.id;
  const [isOopen, setIsOopen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const offset = (currentPage - 1) * itemsPerPage;

  const {
    data: insumos,
    isLoading,
    isError,
  } = useGetInsumos(itemsPerPage, offset, paisId);

  const insumos_total = insumos?.data.data || [];
  const totalInsumos = insumos?.data?.total || 0;
  const totalPages = Math.ceil(totalInsumos / itemsPerPage);

  const filteredInsumos = insumos_total.filter(
    (insumo) =>
      insumo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insumo.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insumo.marca?.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      insumo.proveedor?.nombre_legal
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      const startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (startPage > 1) {
        pages.push(1);
        if (startPage > 2) {
          pages.push("ellipsis");
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pages.push("ellipsis");
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  if (isError) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-destructive py-8">
            <Package className="h-12 w-12 mx-auto mb-4" />
            <p>Error al cargar los insumos</p>
            <p className="text-sm mt-2">
              Por favor, intenta nuevamente más tarde
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <TitlePages title="Gestión de Insumos" />
          <p className="text-muted-foreground">
            Administra los insumos y medicamentos del sistema
          </p>
        </div>
        <Button onClick={() => setIsOopen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Insumo
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="space-y-2">
              <CardTitle>Lista de Insumos</CardTitle>
              <CardDescription>
                {totalInsumos} insumo{totalInsumos !== 1 ? "s" : ""} encontrado
                {totalInsumos !== 1 ? "s" : ""}
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredInsumos.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">
                No se encontraron insumos
              </h3>
              <p className="text-muted-foreground">
                {searchTerm
                  ? "Intenta con otros términos de búsqueda"
                  : "No hay insumos registrados"}
              </p>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <TableInsumos filteredInsumos={filteredInsumos} />
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between pt-6">
                  <div className="text-sm text-muted-foreground">
                    Mostrando {Math.min(itemsPerPage, filteredInsumos.length)}{" "}
                    de {totalInsumos} insumos
                  </div>

                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1)
                              setCurrentPage(currentPage - 1);
                          }}
                          className={
                            currentPage === 1
                              ? "pointer-events-none opacity-50"
                              : ""
                          }
                        />
                      </PaginationItem>

                      {getPageNumbers().map((page, index) => (
                        <PaginationItem key={index}>
                          {page === "ellipsis" ? (
                            <PaginationEllipsis />
                          ) : (
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(page as number);
                              }}
                              isActive={currentPage === page}
                            >
                              {page}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))}

                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages)
                              setCurrentPage(currentPage + 1);
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

      <AlertDialog open={isOopen} onOpenChange={setIsOopen}>
        <AlertDialogContent>
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Agregar Insumo</AlertDialogTitle>
            <AlertDialogDescription>
              En esta seccion podras agregar insumos
            </AlertDialogDescription>
          </AlertDialogHeader>
          <FormInsumos onSuccess={() => setIsOopen(false)} />
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default InsumosAdminPage;
