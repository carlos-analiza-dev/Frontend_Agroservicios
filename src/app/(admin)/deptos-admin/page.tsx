"use client";
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
import { Button } from "@/components/ui/button";
import useGetDepartamentosByPais from "@/hooks/departamentos/useGetDepartamentosByPais";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useState } from "react";
import { Departamento } from "@/apis/departamentos/interfaces/response-departamentos.interface";
import dynamic from "next/dynamic";
import LoaderComponents from "@/components/generics/LoaderComponents";
import TableUsersSkeleton from "@/components/generics/SkeletonTable";

const TableDeptos = dynamic(() => import("./ui/TableDeptos"), {
  loading: () => <TableUsersSkeleton />,
});

const FormCreateDepto = dynamic(() => import("./ui/FormCreateDepto"), {
  loading: () => <LoaderComponents />,
});

const DeptosAdminPage = () => {
  const { user } = useAuthStore();
  const paisId = user?.pais.id || "";
  const {
    data: departamentos,
    isLoading: loadingDeptos,
    refetch,
  } = useGetDepartamentosByPais(paisId);
  const [open, setOpen] = useState(false);
  const [currentDepto, setCurrentDepto] = useState<Departamento | null>(null);

  const handleEdit = (depto: Departamento) => {
    setCurrentDepto(depto);
    setOpen(true);
  };

  const handleSuccess = () => {
    setOpen(false);
    setCurrentDepto(null);
    refetch();
  };

  if (loadingDeptos) {
    return (
      <div className="container mx-auto py-6">
        <Skeleton className="h-10 w-1/4 mb-6" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mt-5">
        <TitlePages title="Gestión de Departamentos" />
        <div className="flex items-center gap-4">
          <AlertDialog
            open={open}
            onOpenChange={(isOpen) => {
              if (!isOpen) setCurrentDepto(null);
              setOpen(isOpen);
            }}
          >
            <AlertDialogTrigger asChild>
              <Button onClick={() => setCurrentDepto(null)}>Agregar +</Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="p-4 max-h-[600px] overflow-y-auto">
              <div className="flex justify-end">
                <AlertDialogCancel>X</AlertDialogCancel>
              </div>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {currentDepto
                    ? "Editar Departamento"
                    : "Agregar Departamento"}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {currentDepto
                    ? "Modifica los datos del departamento"
                    : "En esta sección podrás agregar nuevos departamentos"}
                </AlertDialogDescription>
                <div>
                  <FormCreateDepto
                    onSucces={handleSuccess}
                    editDepartamento={currentDepto}
                    isEdit={!!currentDepto}
                  />
                </div>
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="mt-5">
        <div className="rounded-md border">
          <TableDeptos
            departamentos={departamentos?.data}
            handleEdit={handleEdit}
          />
        </div>
      </div>
    </div>
  );
};

export default DeptosAdminPage;
