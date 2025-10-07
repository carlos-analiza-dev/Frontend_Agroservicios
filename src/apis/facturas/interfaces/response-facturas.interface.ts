export interface ResponseFacturasInterface {
  total: number;
  data: Factura[];
}

export interface Factura {
  id: string;
  id_cliente: string;
  pais_id: string;
  forma_pago: string;
  estado: string;
  numero_factura: string;
  fecha_limite_emision: string;
  fecha_recepcion: string;
  rango_autorizado: string;
  cai: string;
  rango_factura_id: string;
  sub_total: string;
  descuentos_rebajas: string;
  importe_exento: string;
  importe_exonerado: string;
  importe_gravado_15: string;
  importe_gravado_18: string;
  isv_15: string;
  isv_18: string;
  total: string;
  total_letras: string;
  created_at: Date;
  updated_at: Date;
  cliente: Cliente;
  rango_factura: RangoFactura;
  pais: Pais;
  detalles: Detalle[];
}

export interface Cliente {
  id: string;
  nombre: string;
  identificacion: string;
  telefono: string;
  email: string;
  direccion: string;
  sexo: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Detalle {
  id: string;
  id_factura: string;
  id_producto_servicio: string;
  cantidad: number;
  precio: string;
  total: string;
  created_at: Date;
  updated_at: Date;
}

export interface Pais {
  id: string;
  nombre: string;
  code: string;
  code_phone: string;
  nombre_moneda: string;
  simbolo_moneda: string;
  nombre_documento: string;
  isActive: boolean;
}

export interface RangoFactura {
  id: string;
  cai: string;
  prefijo: string;
  rango_inicial: number;
  rango_final: number;
  correlativo_actual: number;
  fecha_recepcion: Date;
  fecha_limite_emision: Date;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}
