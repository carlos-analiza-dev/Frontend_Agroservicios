"use client";
import { useAuthStore } from "@/providers/store/useAuthStore";
import React from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";

const datosVentas = [
  { mes: "Ene", ingresos: 4000, ganancias: 2400 },
  { mes: "Feb", ingresos: 3000, ganancias: 1398 },
  { mes: "Mar", ingresos: 9800, ganancias: 2000 },
  { mes: "Abr", ingresos: 3908, ganancias: 2780 },
  { mes: "May", ingresos: 4800, ganancias: 1890 },
];

const datosCategorias = [
  { nombre: "Electrónicos", valor: 400 },
  { nombre: "Ropa", valor: 300 },
  { nombre: "Hogar", valor: 300 },
];

const COLORES = ["#0088FE", "#00C49F", "#FFBB28"];

const PaginaDashboard = () => {
  const { user } = useAuthStore();

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        {user && (
          <p className="text-muted-foreground">¡Bienvenido, {user.name}!</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="font-semibold">Ingresos Totales</h3>
          <p className="text-2xl font-bold">$25,560</p>
          <p className="text-sm text-green-500">+12% vs mes anterior</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="font-semibold">Tasa de Conversión</h3>
          <p className="text-2xl font-bold">18.2%</p>
          <p className="text-sm text-green-500">+2.6% vs mes anterior</p>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="font-semibold">Clientes Activos</h3>
          <p className="text-2xl font-bold">1,842</p>
          <p className="text-sm text-red-500">-3% vs mes anterior</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Rendimiento Mensual</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={datosVentas}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="ingresos" fill="#8884d8" name="Ingresos" />
              <Bar dataKey="ganancias" fill="#82ca9d" name="Ganancias" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Tendencia de Ingresos</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={datosVentas}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="ingresos"
                stroke="#8884d8"
                name="Ingresos"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="font-semibold mb-4">Distribución por Categoría</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={datosCategorias}
              cx="50%"
              cy="50%"
              labelLine={true}
              outerRadius={80}
              fill="#8884d8"
              dataKey="valor"
              label={({ nombre, percent }) =>
                `${nombre} ${(percent * 100).toFixed(0)}%`
              }
            >
              {datosCategorias.map((_, index) => (
                <Cell
                  key={`celda-${index}`}
                  fill={COLORES[index % COLORES.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PaginaDashboard;
