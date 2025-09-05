export interface CrearCompraInsumoInterface {
  proveedorId: string;
  sucursalId: string;
  paisId: string;
  tipo_pago: string;
  detalles: Detalle[];
}

export interface Detalle {
  insumoId: string;
  costo_por_unidad: number;
  cantidad: number;
  bonificacion: number;
  descuentos: number;
  impuestos: number;
  cantidad_total: number;
  monto_total: number;
}
