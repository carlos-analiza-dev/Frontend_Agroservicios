import { DatosVenta } from "@/apis/dashboard/interface/rendimineto-mensual.interface";
import { formatCurrency } from "@/helpers/funciones/formatCurrency";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  datosRendimiento: DatosVenta[];
  simbolo: string;
}

const RendimientoMensual = ({ datosRendimiento, simbolo }: Props) => {
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
        Rendimiento Mensual
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={datosRendimiento}>
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
          <Bar
            dataKey="ingresos"
            fill="#8884d8"
            name="Ingresos"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="ganancias"
            fill="#82ca9d"
            name="Ganancias"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RendimientoMensual;
