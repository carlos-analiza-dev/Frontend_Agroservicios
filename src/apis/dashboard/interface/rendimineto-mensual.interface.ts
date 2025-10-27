export interface RendimientoMensualInterface {
  datosVentas: DatosVenta[];
  periodo: string;
}

export interface DatosVenta {
  mes: string;
  ingresos: number;
  ganancias: number;
  costo: number;
  cantidad_ventas: number;
}
