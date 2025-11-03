"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Plus, X } from "lucide-react"; // 👈 Usamos X en vez de Search
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

interface HistorialClinicoListProps {
  veterinarioId: string;
}

export const HistorialClinicoList: React.FC<HistorialClinicoListProps> = ({
  veterinarioId,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [identificador, setIdentificador] = useState("");

  const itemsPerPage = 6;

  const { data: historialData, isLoading } = useGetHistorialVeterinario({
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
    veterinario: veterinarioId,
    fechaInicio: fechaInicio || undefined,
    fechaFin: fechaFin || undefined,
    identificador: identificador || undefined,
  });

  const historial = historialData?.historial || [];
  const total = historialData?.total || 0;
  const totalPages = Math.ceil(total / itemsPerPage);

  const handleLimpiar = () => {
    setIdentificador("");
    setFechaInicio("");
    setFechaFin("");
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
          <Plus /> Agregar Historial
        </Button>
      </div>

      <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4 bg-muted/30 p-4 rounded-xl">
        <div>
          <Label htmlFor="identificador">Identificador Animal</Label>
          <Input
            id="identificador"
            value={identificador}
            onChange={(e) => setIdentificador(e.target.value)}
            placeholder="Ej: VAC-001"
          />
        </div>

        <div>
          <Label htmlFor="fechaInicio">Fecha Inicio</Label>
          <Input
            id="fechaInicio"
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="fechaFin">Fecha Fin</Label>
          <Input
            id="fechaFin"
            type="date"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
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
