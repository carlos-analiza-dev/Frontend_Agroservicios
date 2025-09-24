export interface ResponseRangosFacturaInterface {
  data: RangoFactura[];
  total: number;
  limit: number;
  offset: number;
  totalPages: number;
}

export interface RangoFactura {
  id: string;
  cai: string;
  prefijo: string;
  rango_inicial: number;
  rango_final: number;
  correlativo_actual: number;
  fecha_recepcion: string;
  fecha_limite_emision: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
