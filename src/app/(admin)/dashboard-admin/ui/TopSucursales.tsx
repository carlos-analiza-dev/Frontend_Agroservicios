import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Building, Loader2, TrendingUp } from "lucide-react";

interface Props {
  datosSucursalesTop: { nombre: string; cantidad: number }[];
  cargando_sucursales: boolean;
  simbolo: string;
  COLORES: string[];
}

const TopSucursales = ({
  datosSucursalesTop,
  cargando_sucursales,
  simbolo,
  COLORES,
}: Props) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-white mb-1">
            {label}
          </p>
          <p className="text-sm" style={{ color: payload[0].color }}>
            Ventas:{" "}
            <span className="font-medium">
              {simbolo} {payload[0].value?.toLocaleString()}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
          <Building className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
            Top Sucursales
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Con mayor volumen de ventas
          </p>
        </div>
      </div>

      {cargando_sucursales ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-3">
          <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
          <p className="text-gray-500 dark:text-gray-400">
            Cargando sucursales...
          </p>
        </div>
      ) : datosSucursalesTop.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={datosSucursalesTop}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 120, bottom: 10 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#e5e7eb"
              horizontal={true}
              vertical={false}
            />
            <XAxis
              type="number"
              stroke="#6b7280"
              fontSize={12}
              tickFormatter={(value) => `${simbolo} ${value.toLocaleString()}`}
            />
            <YAxis
              type="category"
              dataKey="nombre"
              width={110}
              stroke="#6b7280"
              fontSize={12}
              tick={{ fill: "#6b7280" }}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                paddingTop: "10px",
                fontSize: "12px",
              }}
            />
            <Bar
              dataKey="cantidad"
              name={`Ventas (${simbolo})`}
              radius={[0, 4, 4, 0]}
              barSize={20}
            >
              {datosSucursalesTop.map((_, index) => (
                <Cell
                  key={`celda-sucursal-${index}`}
                  fill={COLORES[index % COLORES.length]}
                  className="hover:opacity-80 transition-opacity"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 space-y-3 text-gray-500 dark:text-gray-400">
          <Building className="h-12 w-12 opacity-50" />
          <p className="text-lg font-medium">No hay datos disponibles</p>
          <p className="text-sm">No se encontraron ventas por sucursal</p>
        </div>
      )}

      {datosSucursalesTop.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span>Mostrando {datosSucursalesTop.length} sucursales</span>
            <div className="flex items-center space-x-1">
              <TrendingUp className="h-3 w-3" />
              <span>
                Total: {simbolo}{" "}
                {datosSucursalesTop
                  .reduce((sum, item) => sum + item.cantidad, 0)
                  .toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopSucursales;
