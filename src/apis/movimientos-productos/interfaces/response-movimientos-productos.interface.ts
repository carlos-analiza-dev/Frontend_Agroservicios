export interface ResponseMovimientosProductosInterface {
  total: number;
  data: Movimiento[];
}

export interface Movimiento {
  id: string;
  lote_id: string;
  factura_id: string;
  producto_id: string;
  cantidad: string;
  tipo: string;
  descripcion: string;
  fecha: string;
  cantidad_anterior: string;
  cantidad_nueva: string;
  lote: Lote;
  factura: Factura;
  producto: Producto;
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
}

export interface Lote {
  id: string;
  id_compra: string;
  id_sucursal: string;
  id_producto: string;
  cantidad: string;
  costo: string;
  costo_por_unidad: string;
  created_at: Date;
  updated_at: Date;
}

export interface Producto {
  id: string;
  nombre: string;
  codigo: string;
  codigo_barra: string;
  atributos: string;
  tipo: string;
  unidad_venta: string;
  tipo_fraccionamiento: null;
  contenido: number;
  descripcion: string;
  servicioId: null;
  isActive: boolean;
  disponible: boolean;
  es_compra_bodega: boolean;
  compra_minima: number;
  unidad_fraccionamiento: number;
  distribucion_minima: number;
  venta_minima: number;
  createdAt: Date;
  updatedAt: Date;
  categoriaId: string;
}
