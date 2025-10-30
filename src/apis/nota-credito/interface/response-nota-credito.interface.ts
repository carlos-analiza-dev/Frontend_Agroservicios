export interface ResponseNotaCreditoInterface {
  total: number;
  notas: Nota[];
}

export interface Nota {
  id: string;
  factura_id: string;
  monto: string;
  motivo: string;
  usuario_id: string;
  pais_id: string;
  createdAt: string;
  updatedAt: string;
  usuario: Usuario;
  pais: Pais;
  factura: Factura;
  detalles: Detalle[];
}

export interface Detalle {
  id: string;
  nota_id: string;
  producto_id: string;
  cantidad: number;
  montoDevuelto: string;
}

export interface Factura {
  id: string;
  id_cliente: string;
  pais_id: string;
  usuario_id: string;
  sucursal_id: string;
  forma_pago: string;
  estado: string;
  numero_factura: string;
  fecha_limite_emision: Date;
  fecha_recepcion: Date;
  rango_autorizado: string;
  cai: string;
  autorizada_cancelacion: boolean;
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
  fecha_autorizacion_cancelacion: null;
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

export interface Usuario {
  id: string;
  email: string;
  name: string;
  identificacion: string;
  direccion: string;
  sexo: string;
  telefono: string;
  isActive: boolean;
  isAuthorized: boolean;
  createdAt: Date;
}
