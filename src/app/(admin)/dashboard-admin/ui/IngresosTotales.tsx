import { IngresosTotalesInterface } from "@/apis/dashboard/interface/dashboard.interface";
import React from "react";
import { DollarSign } from "lucide-react";

interface Props {
  ingresos_totales: IngresosTotalesInterface | undefined;
  simbolo: string;
}

const IngresosTotales = ({ ingresos_totales, simbolo }: Props) => {
  const monto = ingresos_totales?.ingresosTotales || 0;

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border-l-4 border-blue-500 hover:border-blue-600 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Ingresos Totales
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {simbolo} {monto.toLocaleString("es-HN")}
          </p>
        </div>
        <DollarSign className="h-8 w-8 text-blue-500 dark:text-blue-400" />
      </div>
    </div>
  );
};

export default IngresosTotales;
