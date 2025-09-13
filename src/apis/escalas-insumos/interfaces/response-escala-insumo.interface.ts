export interface ResponseEscalaInsumos {
  data: Escala[];
  total: number;
}

export interface Escala {
  id: string;
  cantidad_comprada: number;
  bonificacion: number;
  costo: number;
  isActive: boolean;
  insumo: Insumo;
  proveedor: Proveedor;
  pais: Pais;
}

export interface Insumo {
  id: string;
  nombre: string;
  codigo: string;
  costo: string;
  unidad_venta: string;
  disponible: boolean;
  createdAt: Date;
  updatedAt: Date;
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
  departamentos: Departamento[];
}

export interface Departamento {
  id: string;
  nombre: string;
  isActive: boolean;
}

export interface Proveedor {
  id: string;
  nit_rtn: string;
  nrc: string;
  nombre_legal: string;
  complemento_direccion: string;
  telefono: string;
  correo: string;
  nombre_contacto: string;
  plazo: number;
  tipo_escala: string;
  is_active: boolean;
  tipo_pago_default: string;
  created_at: Date;
  updated_at: Date;
}
