"use client";

import TitlePages from "@/components/generics/TitlePages";
import { Button } from "@/components/ui/button";
import useGetMedicos from "@/hooks/medicos/useGetMedicos";
import { useState } from "react";

import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
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
import dynamic from "next/dynamic";
import LoaderComponents from "@/components/generics/LoaderComponents";
import TableUsersSkeleton from "@/components/generics/SkeletonTable";
import Paginacion from "@/components/generics/Paginacion";

const FormVeterinarios = dynamic(() => import("./ui/FormVeterinarios"), {
  loading: () => <LoaderComponents />,
});

const TableMedicos = dynamic(() => import("./ui/TableMedicos"), {
  loading: () => <TableUsersSkeleton />,
});

const VeterinariosPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const offset = (currentPage - 1) * itemsPerPage;
  const [searchName, setSearchName] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const { data, isLoading, isError } = useGetMedicos(
    itemsPerPage,
    currentPage,
    searchName
  );

  const totalPages = Math.ceil((data?.total || 0) / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
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
          <Button onClick={() => setIsOpen(true)}>Agregar +</Button>
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
            Mostrando {(currentPage - 1) * itemsPerPage + 1} -{" "}
            {Math.min(currentPage * itemsPerPage, data?.total || 0)} de{" "}
            {data?.total || 0} veterinarios
          </div>

          <Paginacion
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className=" max-h-[600px] overflow-y-auto">
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
            <FormVeterinarios onSuccess={() => setIsOpen(false)} />
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default VeterinariosPage;
