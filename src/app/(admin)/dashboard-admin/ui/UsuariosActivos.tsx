import { ClientesActivosInterface } from "@/apis/dashboard/interface/response-clientes-activos.interface";
import React from "react";
import { Users, TrendingUp, TrendingDown } from "lucide-react";

interface Props {
  usuarios_activos: ClientesActivosInterface | undefined;
}

const UsuariosActivos = ({ usuarios_activos }: Props) => {
  const total = usuarios_activos?.total || 0;
  const porcentajeCambio = usuarios_activos?.porcentajeCambio || "0";
  const tendencia = usuarios_activos?.tendencia || "neutral";
  const esPositivo = tendencia === "positive";

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-lg shadow-md border-l-4 border-purple-500 hover:border-purple-600 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">
            Usuarios Activos
          </h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {total.toLocaleString()}
          </p>
        </div>
        <Users className="h-8 w-8 text-purple-500 dark:text-purple-400" />
      </div>

      <div
        className={`flex items-center space-x-1 ${
          tendencia === "positive"
            ? "text-green-600 dark:text-green-400"
            : tendencia === "negative"
              ? "text-red-600 dark:text-red-400"
              : "text-gray-500 dark:text-gray-400"
        }`}
      >
        {parseFloat(porcentajeCambio) !== 0 && (
          <>
            {esPositivo ? (
              <TrendingUp className="h-4 w-4" />
            ) : (
              <TrendingDown className="h-4 w-4" />
            )}
            <span className="text-sm font-medium">
              {parseFloat(porcentajeCambio) > 0 ? "+" : ""}
              {porcentajeCambio}%
            </span>
          </>
        )}
        <span className="text-sm text-gray-500 dark:text-gray-400">
          vs período anterior
        </span>
      </div>
    </div>
  );
};

export default UsuariosActivos;
