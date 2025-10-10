export enum Motivo {
  SIN_STOCK = "Sin_Stock",
  VENTA_INCOMPLETA = "Venta_Incompleta",
}

export interface CreateProductosNoVendido {
  producto_id: string;
  sucursal_id: string;
  nombre_producto: string;

  cantidad_no_vendida: number;

  precio_unitario: number;

  total_perdido: number;

  existencia_actual: number;

  cantidad_solicitada: number;

  motivo: Motivo;

  observaciones?: string;

  fue_reabastecido?: boolean;

  fecha_reabastecimiento?: Date;
}
