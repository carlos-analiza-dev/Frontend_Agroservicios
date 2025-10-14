"use client";
import {
  TopProductosInterface,
  TopSucursalesInterface,
} from "@/apis/dashboard/interface/dashboard.interface";
import useGetTopProductos from "@/hooks/dashboards/useGetTopProductos";
import useGetTopSucursales from "@/hooks/dashboards/useGetTopSucursales";
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

const COLORES = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

const PaginaDashboard = () => {
  const { user } = useAuthStore();
  const simbolo = user?.pais.simbolo_moneda || "$";
  const { data: productos_top, isLoading } = useGetTopProductos();
  const { data: sucursales_top, isLoading: cargando_sucursales } =
    useGetTopSucursales();

  const datosProductosTop =
    productos_top?.map((item: TopProductosInterface) => ({
      nombre: item.producto,
      cantidad: parseInt(item.cantidad_total),
    })) || [];

  const datosSucursalesTop =
    sucursales_top?.map((item: TopSucursalesInterface) => ({
      nombre: item.sucursal,
      cantidad: parseInt(item.total_ventas),
    })) || [];

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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="font-semibold mb-4">Top Productos Más Vendidos</h3>
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <p>Cargando productos...</p>
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
              <p>No hay datos de productos disponibles</p>
            </div>
          )}
        </div>

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
      </div>
    </div>
  );
};

export default PaginaDashboard;
