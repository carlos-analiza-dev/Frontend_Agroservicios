"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Plus, X, Search, Check } from "lucide-react";
import useGetHistorialVeterinario from "@/hooks/historial-clinico/useGetHistorialVeterinario";
import HistorialCardSkeleton from "./HistorialCardSkeleton";
import HistorialCard from "./HistorialCard";
import PaginationSection from "./PaginationSection";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import FormHistorialClinico from "./FormHistorialClinico";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useGetFincasPais from "@/hooks/fincas/useGetFincasPais";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface HistorialClinicoListProps {
  veterinarioId: string;
}

interface Finca {
  id: string;
  nombre_finca: string;
}

export const HistorialClinicoList: React.FC<HistorialClinicoListProps> = ({
  veterinarioId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [identificador, setIdentificador] = useState("");
  const [fincaSearch, setFincaSearch] = useState("");
  const [selectedFinca, setSelectedFinca] = useState<Finca | null>(null);
  const [openCombobox, setOpenCombobox] = useState(false);

  const itemsPerPage = 6;

  const { data: fincasData, isLoading: loadingFincas } = useGetFincasPais({
    name: fincaSearch,
    enabled: fincaSearch.length > 1 && openCombobox,
  });

  const fincas: Finca[] = fincasData?.fincas || [];

  const { data: historialData, isLoading } = useGetHistorialVeterinario({
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
    veterinario: veterinarioId,
    fechaInicio: fechaInicio || undefined,
    fechaFin: fechaFin || undefined,
    identificador: identificador || undefined,
    fincaNombre: selectedFinca?.nombre_finca || undefined,
  });

  const historial = historialData?.historial || [];
  const total = historialData?.total || 0;
  const totalPages = Math.ceil(total / itemsPerPage);

  const handleLimpiar = () => {
    setIdentificador("");
    setFechaInicio("");
    setFechaFin("");
    setFincaSearch("");
    setSelectedFinca(null);
    setCurrentPage(1);
  };

  const handleSelectFinca = (finca: Finca) => {
    setSelectedFinca(finca);
    setFincaSearch(finca.nombre_finca);
    setOpenCombobox(false);
    setCurrentPage(1);
  };

  const handleRemoveFinca = () => {
    setSelectedFinca(null);
    setFincaSearch("");
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Historial Clínico
          </h1>
          <p className="text-muted-foreground">
            Gestiona y revisa el historial médico de los animales
          </p>
        </div>
        <Button onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" /> Agregar Historial
        </Button>
      </div>

      <div className="grid md:grid-cols-5 sm:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-xl">
        <div>
          <Label htmlFor="identificador">Identificador Animal</Label>
          <Input
            id="identificador"
            value={identificador}
            onChange={(e) => {
              setIdentificador(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Ej: VAC-001"
          />
        </div>

        <div>
          <Label htmlFor="finca">Finca</Label>
          <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openCombobox}
                className="w-full justify-between h-10"
              >
                <span
                  className={cn(
                    "truncate",
                    !selectedFinca && "text-muted-foreground"
                  )}
                >
                  {selectedFinca
                    ? selectedFinca.nombre_finca
                    : "Buscar finca..."}
                </span>
                <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="start">
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Buscar finca por nombre..."
                  value={fincaSearch}
                  onValueChange={setFincaSearch}
                />
                <CommandList>
                  <CommandEmpty>
                    {loadingFincas
                      ? "Buscando..."
                      : fincaSearch.length > 1
                        ? "No se encontraron fincas."
                        : "Escribe al menos 2 caracteres..."}
                  </CommandEmpty>
                  <CommandGroup>
                    {fincas.map((finca) => (
                      <CommandItem
                        key={finca.id}
                        value={finca.nombre_finca}
                        onSelect={() => handleSelectFinca(finca)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            selectedFinca?.id === finca.id
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {finca.nombre_finca}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {selectedFinca && (
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                {selectedFinca.nombre_finca}
                <button
                  type="button"
                  onClick={handleRemoveFinca}
                  className="ml-1 rounded-full hover:bg-muted"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            </div>
          )}
        </div>

        <div>
          <Label htmlFor="fechaInicio">Fecha Inicio</Label>
          <Input
            id="fechaInicio"
            type="date"
            value={fechaInicio}
            onChange={(e) => {
              setFechaInicio(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div>
          <Label htmlFor="fechaFin">Fecha Fin</Label>
          <Input
            id="fechaFin"
            type="date"
            value={fechaFin}
            onChange={(e) => {
              setFechaFin(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="flex items-end">
          <Button
            className="w-full"
            variant="secondary"
            onClick={handleLimpiar}
          >
            <X className="mr-2 h-4 w-4" /> Limpiar
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <HistorialCardSkeleton key={index} />
          ))
        ) : historial.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">
              No hay historiales disponibles
            </h3>
            <p className="text-muted-foreground mt-2">
              No se encontraron registros de historial clínico para mostrar.
            </p>
          </div>
        ) : (
          historial.map((item) => (
            <HistorialCard key={item.id} historial={item} />
          ))
        )}
      </div>

      {totalPages > 1 && (
        <PaginationSection
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="w-full md:max-w-4xl max-h-[85vh] overflow-hidden">
          <div className="sticky top-0 z-10 bg-background border-b p-6">
            <div className="flex justify-between items-center">
              <div>
                <AlertDialogTitle className="text-xl">
                  Agregar Historial Clínico
                </AlertDialogTitle>
                <AlertDialogDescription className="mt-1">
                  Registre la información médica de los animales atendidos
                </AlertDialogDescription>
              </div>
              <AlertDialogCancel className="h-9 w-9 p-0 rounded-full flex items-center justify-center hover:bg-muted">
                ✕
              </AlertDialogCancel>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(85vh-120px)]">
            <div className="p-6">
              <FormHistorialClinico onSucces={() => setIsOpen(false)} />
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
