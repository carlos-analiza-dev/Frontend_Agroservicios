"use client";

import TitlePages from "@/components/generics/TitlePages";
import { Button } from "@/components/ui/button";
import useGetMedicos from "@/hooks/medicos/useGetMedicos";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import TableMedicos from "./ui/TableMedicos";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import FormVeterinarios from "./ui/FormVeterinarios";

const VeterinariosPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;
  const [searchName, setSearchName] = useState("");

  const { data, isLoading, isError } = useGetMedicos(
    limit,
    currentPage,
    searchName
  );

  const totalPages = Math.ceil((data?.total || 0) / limit);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <TitlePages title="Gestión de Veterinarios" />

        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <Input
            placeholder="Buscar por nombre..."
            className="w-full md:w-64"
            value={searchName}
            onChange={(e) => {
              setSearchName(e.target.value);
              setCurrentPage(1);
            }}
          />

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="whitespace-nowrap">Agregar +</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="w-full md:max-w-sxl max-h-[600px] overflow-y-auto">
              <div className="flex justify-end">
                <AlertDialogCancel>X</AlertDialogCancel>
              </div>
              <AlertDialogHeader>
                <AlertDialogTitle>Agregar Medico</AlertDialogTitle>
                <AlertDialogDescription>
                  En esta seccion podras agregar nuevos medicos
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="p-4">
                <FormVeterinarios />
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="rounded-md border">
        <TableMedicos
          isLoading={isLoading}
          isError={isError}
          veterinarios={data?.data}
        />
      </div>

      {!isLoading && data && data?.data?.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Mostrando {(currentPage - 1) * limit + 1} -{" "}
            {Math.min(currentPage * limit, data?.total || 0)} de{" "}
            {data?.total || 0} veterinarios
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={handlePreviousPage}
                  isActive={currentPage <= 1}
                  className={
                    currentPage <= 1
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>

              <PaginationItem>
                <span className="px-4">
                  Página {currentPage} de {totalPages}
                </span>
              </PaginationItem>

              <PaginationItem>
                <PaginationNext
                  onClick={handleNextPage}
                  isActive={currentPage >= totalPages}
                  className={
                    currentPage >= totalPages
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default VeterinariosPage;
