"use client";

import useGetServiciosAdmin from "@/hooks/servicios/useGetServiciosAdmin";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TitlePages from "@/components/generics/TitlePages";

import { Plus } from "lucide-react";
import PaginacionCategorias from "./ui/PaginacionCategorias";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import CardSkeleton from "@/components/generics/CardSkeleton";
import dynamic from "next/dynamic";
import LoaderComponents from "@/components/generics/LoaderComponents";

const FormCategorias = dynamic(() => import("./ui/FormCategorias"), {
  loading: () => <LoaderComponents />,
});

const CardsCategorias = dynamic(() => import("./ui/CardsCategorias"), {
  loading: () => <CardSkeleton />,
});

const ServiciosCategoriasAdminPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isOpen, setIsOpen] = useState(false);

  const offset = (currentPage - 1) * itemsPerPage;

  const { data, isLoading } = useGetServiciosAdmin(itemsPerPage, offset);

  if (isLoading) {
    return <CardSkeleton />;
  }

  const servicios = data?.data.servicios || [];
  const totalServicios = data?.data.total || 0;

  const totalPages = Math.ceil(totalServicios / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    const newItemsPerPage = parseInt(value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        endPage = 4;
      }

      if (currentPage >= totalPages - 2) {
        startPage = totalPages - 3;
      }

      if (startPage > 2) {
        pages.push(-1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push(-2);
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <TitlePages title=" Administración de Categorias y Servicios" />
          <p className="text-muted-foreground">
            Gestione los servicios y categorías disponibles
          </p>
        </div>

        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <Button>
              Agregar Categoria <Plus />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <div className="flex justify-end">
              <AlertDialogCancel>X</AlertDialogCancel>
            </div>
            <AlertDialogHeader>
              <AlertDialogTitle>Agregar Categoria</AlertDialogTitle>
              <AlertDialogDescription>
                En esta seccion podras agregar categorias para los servicios
              </AlertDialogDescription>
            </AlertDialogHeader>
            <FormCategorias onSuccess={() => setIsOpen(false)} />
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Mostrar</span>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={handleItemsPerPageChange}
          >
            <SelectTrigger className="w-20">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm font-medium">elementos por página</span>
        </div>

        <div className="text-sm text-muted-foreground">
          Mostrando {(currentPage - 1) * itemsPerPage + 1} -{" "}
          {Math.min(currentPage * itemsPerPage, totalServicios)} de{" "}
          {totalServicios} categorias
        </div>
      </div>

      <CardsCategorias servicios={servicios} />

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </div>

          <PaginacionCategorias
            handlePageChange={handlePageChange}
            currentPage={currentPage}
            totalPages={totalPages}
            getPageNumbers={getPageNumbers}
          />
        </div>
      )}
    </div>
  );
};

export default ServiciosCategoriasAdminPage;
