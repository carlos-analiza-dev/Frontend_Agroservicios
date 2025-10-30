"use client";
import useGetNotasCredito from "@/hooks/notas-credito/useGetNotasCredito";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FileText, Plus } from "lucide-react";
import TableNotaCredito from "./ui/TableNotaCredito";
import TableUsersSkeleton from "@/components/generics/SkeletonTable";
import TitlePages from "@/components/generics/TitlePages";
import { Button } from "@/components/ui/button";
import PaginacionNotaCredito from "./ui/PaginacionNotaCredito";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import FormCrearNotaCredito from "./ui/FormCrearNotaCredito";

const NotaCreditoPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  const { data: notas_credito, isLoading } = useGetNotasCredito({
    limit,
    offset,
  });

  const totalPages = notas_credito ? Math.ceil(notas_credito.total / limit) : 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <TitlePages title="Notas de Crédito" />
          <p className="text-muted-foreground">
            Gestión y visualización de notas de crédito emitidas
          </p>
        </div>
        <div>
          <Button onClick={() => setIsOpen(true)}>
            <Plus /> Agregar Nota
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Notas de Crédito</CardTitle>
          <CardDescription>
            {notas_credito
              ? `Total: ${notas_credito.total} notas de crédito`
              : "Cargando..."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              <TableUsersSkeleton />
            </div>
          ) : notas_credito && notas_credito.notas.length > 0 ? (
            <>
              <div className="rounded-md border">
                <TableNotaCredito notas_credito={notas_credito} />
              </div>

              {totalPages > 1 && (
                <div className="mt-6">
                  <PaginacionNotaCredito
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">
                No hay notas de crédito
              </h3>
              <p className="text-muted-foreground">
                No se encontraron notas de crédito en el sistema.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="w-full md:max-w-3xl">
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Agregar Nota de Credito</AlertDialogTitle>
            <AlertDialogDescription>
              En esta seccion podras generar un nueva nota de credito
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="p-3 h-[500px] overflow-y-auto">
            <FormCrearNotaCredito onSucces={() => setIsOpen(false)} />
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default NotaCreditoPage;
