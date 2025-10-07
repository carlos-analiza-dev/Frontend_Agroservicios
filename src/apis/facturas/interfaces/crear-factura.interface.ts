export interface CrearFacturaInterface {
  id_cliente: string;
  pais_id: string;
  forma_pago: string;
  sub_total: number;
  descuentos_rebajas: number;
  importe_exento: number;
  importe_exonerado: number;

  detalles: Detalle[];
}

export interface Detalle {
  id_producto_servicio: string;
  cantidad: number;
  tiene_existencia?: boolean;
  precio: number;
}
