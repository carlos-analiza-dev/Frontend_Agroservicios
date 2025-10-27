import { DatosVenta } from "@/apis/dashboard/interface/rendimineto-mensual.interface";
import { formatCurrency } from "@/helpers/funciones/formatCurrency";
import React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  datosTendencia: DatosVenta[];
  simbolo: string;
}

const TendenciaGanancias = ({ datosTendencia, simbolo }: Props) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-4 border border-gray-200 dark:border-gray-700 rounded shadow-lg">
          <p className="font-semibold text-gray-900 dark:text-white">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value, simbolo)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h3 className="font-semibold mb-4 text-gray-700 dark:text-gray-300">
        Tendencia de Ingresos
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={datosTendencia}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="mes" stroke="#6b7280" fontSize={12} />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            tickFormatter={(value) =>
              `${simbolo} ${(value / 1000).toFixed(0)}k`
            }
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="ingresos"
            stroke="#8884d8"
            name="Ingresos"
            strokeWidth={2}
            dot={{ fill: "#8884d8", strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: "#8884d8" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TendenciaGanancias;
