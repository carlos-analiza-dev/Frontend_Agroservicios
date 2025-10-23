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
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h3 className="font-semibold mb-4 capitalize">Top {tipo} Más Vendidos</h3>
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <p>Cargando {tipo}...</p>
        </div>
      ) : datosProductosTop.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={datosProductosTop}
            layout="vertical"
            margin={{ left: 100 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" />
            <YAxis
              type="category"
              dataKey="nombre"
              width={80}
              tick={{ fontSize: 12 }}
            />
            <Tooltip />
            <Legend />
            <Bar dataKey="cantidad" name="Cantidad Vendida" fill="#8884d8">
              {datosProductosTop.map((_, index) => (
                <Cell
                  key={`celda-producto-${index}`}
                  fill={COLORES[index % COLORES.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-64">
          <p>No hay datos de {tipo} disponibles</p>
        </div>
      )}
    </div>
  );
};

export default TopProductosServicios;
