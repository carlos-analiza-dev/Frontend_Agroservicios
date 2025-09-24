import { ObtenerRangosFactura } from "@/apis/rangos-factura/accions/obtener-rangos-factura";
import { useQuery } from "@tanstack/react-query";
import React from "react";

const useGetRangosFactura = (limit: number, offset: number) => {
  return useQuery({
    queryKey: ["rangos-factura", limit, offset],
    queryFn: () => ObtenerRangosFactura(limit, offset),
    retry: 0,
    staleTime: 60 * 1000 * 5,
  });
};

export default useGetRangosFactura;
