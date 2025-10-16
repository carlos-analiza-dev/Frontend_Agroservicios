"use client";

import useGetCitasCompletadasByMedico from "@/hooks/citas/useGetCitasCompletadasByMedico";
import { useAuthStore } from "@/providers/store/useAuthStore";

import { useQueryClient } from "@tanstack/react-query";
import React, { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapIcon } from "lucide-react";
import { MessageError } from "@/components/generics/MessageError";
import HojaRutaOptimizada from "../citas-veterinario/ui/HojaRutaOptimizada";
import CardCitasMedico from "../citas-veterinario/ui/CardCitasMedicos";

const HistorialCitasPage = () => {
  const { user } = useAuthStore();

  const userId = user?.id || "";
  const limit = 10;
  const [mostrarHojaRuta, setMostrarHojaRuta] = useState(false);

  const {
    data: citas_completadas,
    isLoading,
    refetch,
    isRefetching,
    fetchNextPage,
    isError,
    hasNextPage,
    isFetchingNextPage,
  } = useGetCitasCompletadasByMedico(userId, limit);

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">
            Cargando historial de citas...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[400px]">
        <MessageError
          titulo="No se encontraron citas"
          descripcion="No se encontraron citas para este modulo en este momento."
          onPress={() => onRefresh()}
        />
      </div>
    );
  }

  const allCitas = citas_completadas?.pages.flatMap((page) => page.citas) || [];

  if (mostrarHojaRuta) {
    return (
      <HojaRutaOptimizada
        citas={allCitas}
        onBack={() => setMostrarHojaRuta(false)}
      />
    );
  }

  return (
    <div className="flex flex-1 flex-col p-4 md:p-6">
      {allCitas && allCitas.length > 0 && (
        <Button
          className="mb-4 md:mb-6 lg:mx-auto lg:max-w-2xl w-full"
          onClick={() => setMostrarHojaRuta(true)}
        >
          <MapIcon className="h-4 w-4 mr-2" />
          Ver Ruta Optimizada del Historial
        </Button>
      )}

      <ScrollArea className="flex-1">
        <div className="space-y-4 lg:mx-auto lg:max-w-4xl">
          {allCitas.map((item) => (
            <Card key={item.id} className="w-full">
              <CardContent className="p-0">
                <CardCitasMedico item={item} />
              </CardContent>
            </Card>
          ))}
        </div>

        {isFetchingNextPage && (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}

        {allCitas.length === 0 && (
          <div className="flex flex-1 items-center justify-center py-16">
            <MessageError
              titulo="No se encontraron citas"
              descripcion="No hay citas completadas en tu historial"
              onPress={() => onRefresh()}
            />
          </div>
        )}
      </ScrollArea>

      {allCitas.length > 0 && (
        <div className="mt-4 lg:hidden">
          <Button
            variant="outline"
            className="w-full"
            onClick={onRefresh}
            disabled={isRefetching}
          >
            {isRefetching ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2" />
            ) : null}
            {isRefetching ? "Actualizando..." : "Actualizar"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default HistorialCitasPage;
