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
import { Package, Loader2 } from "lucide-react";

interface Props {
  datosProductosTop: { nombre: string; cantidad: number }[];
  isLoading: boolean;
  COLORES: string[];
  tipo: "productos" | "servicios";
}

const TopProductosServicios = ({
  datosProductosTop,
  isLoading,
  COLORES,
  tipo,
}: Props) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
          <p className="text-sm" style={{ color: payload[0].color }}>
            {payload[0].name}:{" "}
            <span className="font-medium">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg">
          <Package className="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
            Top {tipo === "productos" ? "Productos" : "Servicios"} Más Vendidos
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Por cantidad de ventas
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-3">
          <Loader2 className="h-8 w-8 text-gray-400 animate-spin" />
          <p className="text-gray-500 dark:text-gray-400">Cargando {tipo}...</p>
        </div>
      ) : datosProductosTop.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={datosProductosTop}
            layout="vertical"
            margin={{ top: 10, right: 30, left: 100, bottom: 10 }}
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
              tickFormatter={(value) => value.toLocaleString()}
            />
            <YAxis
              type="category"
              dataKey="nombre"
              width={90}
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
              name="Cantidad Vendida"
              radius={[0, 4, 4, 0]}
              barSize={20}
            >
              {datosProductosTop.map((_, index) => (
                <Cell
                  key={`celda-${tipo}-${index}`}
                  fill={COLORES[index % COLORES.length]}
                  className="hover:opacity-80 transition-opacity"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex flex-col items-center justify-center h-64 space-y-3 text-gray-500 dark:text-gray-400">
          <Package className="h-12 w-12 opacity-50" />
          <p className="text-lg font-medium">No hay datos disponibles</p>
          <p className="text-sm">No se encontraron {tipo} vendidos</p>
        </div>
      )}

      {datosProductosTop.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            Mostrando {datosProductosTop.length} {tipo} más vendidos
          </p>
        </div>
      )}
    </div>
  );
};

export default TopProductosServicios;
