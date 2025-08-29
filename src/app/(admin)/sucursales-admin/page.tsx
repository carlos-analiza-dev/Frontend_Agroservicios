"use client";
import useGetSucursales from "@/hooks/sucursales/useGetSucursales";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Search, Building } from "lucide-react";
import useGetDepartamentosByPais from "@/hooks/departamentos/useGetDepartamentosByPais";
import useGetMunicipiosActivosByDepto from "@/hooks/municipios/useGetMunicipiosActivosByDepto";
import TitlePages from "@/components/generics/TitlePages";
import PaginacionSucursales from "./ui/PaginacionSucursales";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import LoaderComponents from "@/components/generics/LoaderComponents";
import dynamic from "next/dynamic";
import TableUsersSkeleton from "@/components/generics/SkeletonTable";

const FormSucursal = dynamic(() => import("./ui/FormSucursal"), {
  loading: () => <LoaderComponents />,
});

const TableSucursales = dynamic(() => import("./ui/TableSucursales"), {
  loading: () => <TableUsersSkeleton />,
});

const SucursalesAdminPage = () => {
  const { user } = useAuthStore();
  const paisId = user?.pais.id;
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [departamentoId, setDepartamentoId] = useState<string>("all");
  const [municipioId, setMunicipioId] = useState<string>("all");
  const [isOpen, setIsOpen] = useState(false);
  const offset = (page - 1) * limit;

  const departament = departamentoId === "all" ? "" : departamentoId;
  const municipio = municipioId === "all" ? "" : municipioId;

  const { data: sucursales, isLoading } = useGetSucursales(
    limit,
    offset,
    paisId,
    departament,
    municipio
  );

  const { data: departamentos } = useGetDepartamentosByPais(paisId || "");

  const { data: municipios } = useGetMunicipiosActivosByDepto(departament);

  const totalPages = Math.ceil((sucursales?.total || 0) / limit);

  const handleDepartamentoChange = (value: string) => {
    setDepartamentoId(value);
    if (value === "all") {
      setMunicipioId("all");
    } else {
      setMunicipioId("all");
    }
    setPage(1);
  };

  const handleMunicipioChange = (value: string) => {
    setMunicipioId(value);
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPage(1);
  };

  const getVisiblePages = () => {
    const pages = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  const clearFilters = () => {
    setDepartamentoId("all");
    setMunicipioId("all");
    setSearchTerm("");
    setPage(1);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Building className="h-8 w-8" />
          <TitlePages title="Gestión de Sucursales" />
        </div>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nueva Sucursal
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Sucursales</CardTitle>
              <CardDescription>
                Gestiona todas las sucursales de tu empresa
              </CardDescription>
            </div>

            {(departamentoId || municipioId || searchTerm) && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearFilters}
                className="sm:self-end"
              >
                Limpiar filtros
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Departamento</label>
              <Select
                value={departamentoId}
                onValueChange={handleDepartamentoChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los departamentos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los departamentos</SelectItem>
                  {departamentos?.data?.departamentos?.map((depto) => (
                    <SelectItem key={depto.id} value={depto.id}>
                      {depto.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Municipio</label>
              <Select
                value={municipioId}
                onValueChange={handleMunicipioChange}
                disabled={!departamentoId || departamentoId === "all"}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      departamentoId && departamentoId !== "all"
                        ? "Todos los municipios"
                        : "Selecciona un departamento primero"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los municipios</SelectItem>
                  {municipios?.data?.map((mun) => (
                    <SelectItem key={mun.id} value={mun.id}>
                      {mun.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Buscar</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar sucursal..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Items por página</label>
              <Select
                value={limit.toString()}
                onValueChange={(value) => {
                  setLimit(Number(value));
                  setPage(1);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TableSucursales
            isLoading={isLoading}
            filteredSucursales={sucursales?.data}
            searchTerm={searchTerm}
          />

          {(sucursales?.total || 0) > 0 && (
            <div className="flex flex-col sm:flex-row items-center justify-between pt-6 space-y-4 sm:space-y-0">
              <div className="text-sm text-muted-foreground">
                Mostrando {(page - 1) * limit + 1} -{" "}
                {Math.min(page * limit, sucursales?.total || 0)} de{" "}
                {sucursales?.total} sucursales
              </div>

              <PaginacionSucursales
                page={page}
                setPage={setPage}
                getVisiblePages={getVisiblePages}
                totalPages={totalPages}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Agregar Sucursal</AlertDialogTitle>
            <AlertDialogDescription>
              En esta seccion podras agrear nuevas sucursales
            </AlertDialogDescription>
          </AlertDialogHeader>
          <FormSucursal onSucces={() => setIsOpen(false)} />
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SucursalesAdminPage;
