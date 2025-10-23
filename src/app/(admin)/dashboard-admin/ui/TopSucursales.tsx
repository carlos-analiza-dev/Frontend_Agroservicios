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
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
      <h3 className="font-semibold mb-4">Top Sucursales Con Mayor Venta</h3>
      {cargando_sucursales ? (
        <div className="flex items-center justify-center h-64">
          <p>Cargando sucursales...</p>
        </div>
      ) : datosSucursalesTop.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={datosSucursalesTop}
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
            <Bar
              dataKey="cantidad"
              name={`Total Ventas ${simbolo}`}
              fill="#8884d8"
            >
              {datosSucursalesTop.map((_, index) => (
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
          <p>No hay datos de sucursales disponibles</p>
        </div>
      )}
    </div>
  );
};

export default TopSucursales;
