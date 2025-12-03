"use client";
import {
  TopProductosInterface,
  TopSucursalesInterface,
} from "@/apis/dashboard/interface/dashboard.interface";
import useGetTopServicios from "@/hooks/dashboards/useGetTopServicios";
import useGetTopSucursales from "@/hooks/dashboards/useGetTopSucursales";
import { useAuthStore } from "@/providers/store/useAuthStore";
import TopProductosServicios from "./ui/TopProductosServicios";
import TopSucursales from "./ui/TopSucursales";
import useGetClienteActivos from "@/hooks/dashboards/useGetClienteActivos";
import useGetRendimientoMensual from "@/hooks/dashboards/useGetRendimientoMensual";
import useGetTendencia from "@/hooks/dashboards/useGetTendencia";
import RendimientoMensual from "./ui/RendimientoMensual";
import TendenciaGanancias from "./ui/TendenciaGanancias";
import { useIngresosTotales } from "@/hooks/dashboards/useIngresosTotales";
import useGetUsuariosActivos from "@/hooks/dashboards/useGetUsuariosActivos";
import { useEffect, useState } from "react";
import FiltrosDashboard from "./ui/FiltrosDashboard ";
import { useGetTopProductos } from "@/hooks/dashboards/useGetTopProductos";
import IngresosTotales from "./ui/IngresosTotales";
import UsuariosActivos from "./ui/UsuariosActivos";
import ClientesActivos from "./ui/ClientesActivos";
import { COLORES } from "@/helpers/data/color";

const PaginaDashboard = () => {
  const { user } = useAuthStore();
  const simbolo = user?.pais.simbolo_moneda || "$";
  const [filtros, setFiltros] = useState({
    fechaInicio: "",
    fechaFin: "",
  });

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0];
  };
  const { data: productos_top, isLoading } = useGetTopProductos({
    fechaInicio: filtros.fechaInicio,
    fechaFin: filtros.fechaFin,
  });
  const { data: servicios_top, isLoading: cargando_servicios } =
    useGetTopServicios({
      fechaInicio: filtros.fechaInicio,
      fechaFin: filtros.fechaFin,
    });
  const { data: sucursales_top, isLoading: cargando_sucursales } =
    useGetTopSucursales({
      fechaInicio: filtros.fechaInicio,
      fechaFin: filtros.fechaFin,
    });
  const { data: clientes_activos } = useGetClienteActivos();
  const { data: rendimiento_mensual } = useGetRendimientoMensual();
  const { data: tendencia } = useGetTendencia();
  const { data: ingresos_totales } = useIngresosTotales({
    year: new Date().getFullYear().toString(),
    fechaInicio: filtros.fechaInicio,
    fechaFin: filtros.fechaFin,
  });

  const { data: usuarios_activos } = useGetUsuariosActivos();

  const datosRendimiento = rendimiento_mensual?.datosVentas || [];
  const datosTendencia = tendencia?.datosVentas || [];

  const datosProductosTop =
    productos_top?.map((item: TopProductosInterface) => ({
      nombre: item.producto,
      cantidad: parseInt(item.cantidad_total),
    })) || [];

  const datosServiciosTop =
    servicios_top?.map((item: TopProductosInterface) => ({
      nombre: item.producto,
      cantidad: parseInt(item.cantidad_total),
    })) || [];

  const datosSucursalesTop =
    sucursales_top?.map((item: TopSucursalesInterface) => ({
      nombre: item.sucursal,
      cantidad: parseInt(item.total_ventas),
    })) || [];

  useEffect(() => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    setFiltros((prev) => ({
      ...prev,
      fechaInicio: formatDate(firstDayOfMonth),
      fechaFin: formatDate(today),
    }));
  }, []);

  const handleFechaInicioChange = (fecha: string) => {
    setFiltros((prev) => ({ ...prev, fechaInicio: fecha }));
  };

  const handleFechaFinChange = (fecha: string) => {
    setFiltros((prev) => ({ ...prev, fechaFin: fecha }));
  };

  const handleLimpiarFiltros = () => {
    const today = new Date();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    setFiltros({
      fechaInicio: formatDate(firstDayOfMonth),
      fechaFin: formatDate(today),
    });
  };

  return (
    <div className="p-4 md:p-8">
      <div className="mb-8">
        {user && (
          <p className="text-muted-foreground">¡Bienvenido, {user.name}!</p>
        )}
      </div>

      <FiltrosDashboard
        fechaInicio={filtros.fechaInicio}
        fechaFin={filtros.fechaFin}
        onFechaInicioChange={handleFechaInicioChange}
        onFechaFinChange={handleFechaFinChange}
        onLimpiarFiltros={handleLimpiarFiltros}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8 mt-6">
        <IngresosTotales
          ingresos_totales={ingresos_totales}
          simbolo={simbolo}
        />

        <UsuariosActivos usuarios_activos={usuarios_activos} />

        <ClientesActivos clientes_activos={clientes_activos} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* <RendimientoMensual
          datosRendimiento={datosRendimiento}
          simbolo={simbolo}
        /> */}

        <TendenciaGanancias datosTendencia={datosTendencia} simbolo={simbolo} />

        <TopSucursales
          datosSucursalesTop={datosSucursalesTop}
          cargando_sucursales={cargando_sucursales}
          simbolo={simbolo}
          COLORES={COLORES}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <TopProductosServicios
          datosProductosTop={datosProductosTop}
          isLoading={isLoading}
          COLORES={COLORES}
          tipo="productos"
        />

        <TopProductosServicios
          datosProductosTop={datosServiciosTop}
          isLoading={cargando_servicios}
          COLORES={COLORES}
          tipo="servicios"
        />
      </div>
    </div>
  );
};

export default PaginaDashboard;
