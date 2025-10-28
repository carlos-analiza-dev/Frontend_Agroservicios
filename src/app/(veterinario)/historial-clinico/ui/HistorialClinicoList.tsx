// components/historial-clinico/HistorialClinicoList.tsx
"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Calendar,
  User,
  MapPin,
  Stethoscope,
  FileText,
  ChevronRight,
} from "lucide-react";
import useGetHistorialVeterinario from "@/hooks/historial-clinico/useGetHistorialVeterinario";
import { Historial } from "@/apis/historial-clinico/interface/response-historial-veterinario.interface";

interface HistorialClinicoListProps {
  veterinarioId: string;
}

export const HistorialClinicoList: React.FC<HistorialClinicoListProps> = ({
  veterinarioId,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const {
    data: historialData,
    isLoading,
    error,
  } = useGetHistorialVeterinario({
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
    veterinario: veterinarioId,
  });

  const historial = historialData?.historial || [];
  const total = historialData?.total || 0;
  const totalPages = Math.ceil(total / itemsPerPage);

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-600">
            Error al cargar el historial clínico
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Historial Clínico
          </h1>
          <p className="text-muted-foreground">
            Gestiona y revisa el historial médico de los animales
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          Total: {total} registros
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
    </div>
  );
};

interface HistorialCardProps {
  historial: Historial;
}

const HistorialCard: React.FC<HistorialCardProps> = ({ historial }) => {
  const { animal, detalles, createdAt, resumen } = historial;

  return (
    <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-primary" />
              {animal.identificador}
            </CardTitle>
            <CardDescription className="line-clamp-2">
              {resumen || "Sin resumen disponible"}
            </CardDescription>
          </div>
          <Badge variant="outline" className="text-xs">
            {detalles.length} proc.
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {animal.identificador || "Sin nombre"}
            </span>
            <Badge variant="secondary" className="text-xs">
              {animal.sexo}
            </Badge>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <div
                className="w-3 h-3 rounded-full border"
                style={{ backgroundColor: animal.color.toLowerCase() }}
              />
              {animal.color}
            </div>
            <span>•</span>
            <span>{animal.especie.nombre}</span>
            {animal.razas?.[0] && (
              <>
                <span>•</span>
                <span>{animal.razas[0].nombre}</span>
              </>
            )}
          </div>

          {animal.propietario && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>Prop: {animal.propietario.nombre}</span>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Procedimientos ({detalles.length})
          </h4>
          <div className="space-y-1 max-h-20 overflow-y-auto">
            {detalles.slice(0, 2).map((detalle: any) => (
              <div key={detalle.id} className="text-xs p-2 bg-muted/50 rounded">
                <div className="font-medium line-clamp-1">
                  {detalle.diagnostico || "Sin diagnóstico"}
                </div>
                {detalle.tratamiento && (
                  <div className="text-muted-foreground line-clamp-1 mt-1">
                    {detalle.tratamiento}
                  </div>
                )}
              </div>
            ))}
            {detalles.length > 2 && (
              <div className="text-xs text-muted-foreground text-center">
                +{detalles.length - 2} más...
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="h-3 w-3" />
            {new Date(createdAt).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const HistorialCardSkeleton: React.FC = () => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
          <Skeleton className="h-6 w-12" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-3 w-40" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex items-center justify-between pt-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-8 w-20" />
        </div>
      </CardContent>
    </Card>
  );
};

interface PaginationSectionProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationSection: React.FC<PaginationSectionProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>

        {getVisiblePages().map((page, index) => (
          <PaginationItem key={index}>
            {page === "..." ? (
              <span className="px-4 py-2">...</span>
            ) : (
              <PaginationLink
                isActive={currentPage === page}
                onClick={() => onPageChange(page as number)}
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={() =>
              currentPage < totalPages && onPageChange(currentPage + 1)
            }
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
