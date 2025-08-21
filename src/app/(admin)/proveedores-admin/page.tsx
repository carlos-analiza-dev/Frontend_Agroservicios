"use client";
import useGetAllProveedores from "@/hooks/proveedores/useGetAllProveedores";
import React, { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";
import TitlePages from "@/components/generics/TitlePages";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import FormProveedor from "./ui/FormProveedor";
import TableProveedores from "./ui/TableProveedores";

const ProveedoresAdmin = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const offset = (page - 1) * limit;
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading, error } = useGetAllProveedores(limit, offset);

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <div className="text-destructive text-center">
          Error al cargar los proveedores: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <TitlePages title="Gestión de Proveedores" />
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <Button>Nuevo Proveedor</Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="h-[600px] overflow-y-auto">
            <div className="flex justify-end">
              <AlertDialogCancel>X</AlertDialogCancel>
            </div>
            <AlertDialogHeader>
              <AlertDialogTitle>Agregar Proveedor</AlertDialogTitle>
              <AlertDialogDescription>
                En esta seccion podras agregar los proveedores
              </AlertDialogDescription>
            </AlertDialogHeader>
            <FormProveedor onSucces={() => setIsOpen(false)} />
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="rounded-md border">
        <TableProveedores isLoading={isLoading} data={data} />
      </div>

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(page - 1)}
                  className={page === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (page <= 3) {
                  pageNumber = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = page - 2 + i;
                }

                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      isActive={pageNumber === page}
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(page + 1)}
                  className={
                    page === totalPages ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      {data && (
        <div className="mt-4 text-sm text-muted-foreground">
          Mostrando {data.data.length} de {data.total} proveedores
        </div>
      )}
    </div>
  );
};

export default ProveedoresAdmin;
