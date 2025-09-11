import { AllEscalasProducto } from "@/apis/escala-producto/accions/obtener-escala-producto";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const useGetAllEscalasProductos = (productoId: string) => {
  return useQuery({
    queryKey: ["all-escalas", productoId],
    queryFn: () => AllEscalasProducto(productoId),
    retry: false,
  });
};

export default useGetAllEscalasProductos;
