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
import React, { useState, useEffect } from "react";
import { Departamento } from "@/apis/departamentos/interfaces/response-departamentos.interface";
import dynamic from "next/dynamic";
import LoaderComponents from "@/components/generics/LoaderComponents";
import TableUsersSkeleton from "@/components/generics/SkeletonTable";
import usePaises from "@/hooks/paises/usePaises";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TableDeptos = dynamic(() => import("./ui/TableDeptos"), {
  loading: () => <TableUsersSkeleton />,
});

const FormCreateDepto = dynamic(() => import("./ui/FormCreateDepto"), {
  loading: () => <LoaderComponents />,
});

const DeptosAdminPage = () => {
  const { user } = useAuthStore();
  const { data: paisesData, isLoading: loadingPaises } = usePaises();

  const [selectedPaisId, setSelectedPaisId] = useState<string>("");

  const {
    data: departamentos,
    isLoading: loadingDeptos,
    refetch,
  } = useGetDepartamentosByPais(selectedPaisId);

  const [open, setOpen] = useState(false);
  const [currentDepto, setCurrentDepto] = useState<Departamento | null>(null);

  useEffect(() => {
    if (user?.pais.id && paisesData?.data) {
      const userPaisExists = paisesData.data.some(
        (pais) => pais.id === user.pais.id
      );

      if (userPaisExists) {
        setSelectedPaisId(user.pais.id);
      } else if (paisesData.data.length > 0) {
        setSelectedPaisId(paisesData.data[0].id);
      }
    }
  }, [user, paisesData]);

  const handleEdit = (depto: Departamento) => {
    setCurrentDepto(depto);
    setOpen(true);
  };

  const handleSuccess = () => {
    setOpen(false);
    setCurrentDepto(null);
    refetch();
  };

  const sortedPaises = React.useMemo(() => {
    if (!paisesData?.data || !user?.pais.id) return paisesData?.data || [];

    const paises = [...paisesData.data];

    const userPaisIndex = paises.findIndex((pais) => pais.id === user.pais.id);

    if (userPaisIndex > -1) {
      const [userPais] = paises.splice(userPaisIndex, 1);
      paises.unshift(userPais);
    }

    return paises;
  }, [paisesData?.data, user?.pais.id]);

  if (loadingPaises || loadingDeptos) {
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
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mt-5">
        <TitlePages title="Gestión de Departamentos" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-full sm:w-auto">
            <Select value={selectedPaisId} onValueChange={setSelectedPaisId}>
              <SelectTrigger className="w-full sm:w-[250px]">
                <SelectValue placeholder="Seleccionar país" />
              </SelectTrigger>
              <SelectContent>
                {sortedPaises?.map((pais) => (
                  <SelectItem
                    key={pais.id}
                    value={pais.id}
                    className={pais.id === user?.pais.id ? "font-semibold" : ""}
                  >
                    {pais.nombre} {pais.id === user?.pais.id && "(Tu país)"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <AlertDialog
            open={open}
            onOpenChange={(isOpen) => {
              if (!isOpen) setCurrentDepto(null);
              setOpen(isOpen);
            }}
          >
            <AlertDialogTrigger asChild>
              <Button
                onClick={() => setCurrentDepto(null)}
                disabled={!selectedPaisId}
              >
                Agregar +
              </Button>
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
                    paisId={selectedPaisId}
                  />
                </div>
              </AlertDialogHeader>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="mt-4">
        {selectedPaisId && (
          <p className="text-sm text-muted-foreground">
            Mostrando departamentos de:{" "}
            <span className="font-medium">
              {sortedPaises?.find((p) => p.id === selectedPaisId)?.nombre}
            </span>
            {selectedPaisId === user?.pais.id && " (Tu país)"}
          </p>
        )}
      </div>

      <div className="mt-5">
        <div className="rounded-md border">
          {selectedPaisId ? (
            <TableDeptos
              departamentos={departamentos?.data}
              handleEdit={handleEdit}
            />
          ) : (
            <div className="p-8 text-center">
              <p className="text-muted-foreground">
                Selecciona un país para ver sus departamentos
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeptosAdminPage;
