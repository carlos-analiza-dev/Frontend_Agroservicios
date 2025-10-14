export interface CrearFacturaInterface {
  id_cliente: string;
  pais_id: string;
  sucursal_id: string;
  forma_pago: string;
  sub_total: number;
  descuentos_rebajas: number;
  descuento_id?: string | null;
  importe_exento: number;
  importe_exonerado: number;

  estado: string;
  detalles: Detalle[];
}

export interface Detalle {
  id_producto_servicio: string;
  cantidad: number;
  tiene_existencia?: boolean;
  precio: number;
}
