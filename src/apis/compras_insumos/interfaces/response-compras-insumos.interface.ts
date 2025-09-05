export interface ResponseInsumosinteface {
  compras: Compra[];
  total: number;
}

export interface Compra {
  id: string;
  proveedorId: string;
  sucursalId: string;
  tipo_pago: string;
  subtotal: string;
  impuestos: string;
  descuentos: string;
  total: string;
  fecha: Date;
  created_at: Date;
  updated_at: Date;
  paisId: string;
  createdById: string;
  updatedById: string;
  detalles: Detalle[];
  lotes: Lote[];
  proveedor: Proveedor;
  sucursal: Sucursal;
  pais: Pais;
  created_by: AtedBy;
  updated_by: AtedBy;
}

export interface AtedBy {
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

export interface Detalle {
  id: string;
  compraId: string;
  insumoId: string;
  costo_por_unidad: string;
  cantidad: string;
  bonificacion: string;
  cantidad_total: string;
  descuentos: string;
  impuestos: string;
  monto_total: string;
}

export interface Lote {
  id: string;
  compraId: string;
  sucursalId: string;
  insumoId: string;
  cantidad: string;
  costo: string;
  costo_por_unidad: string;
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

export interface Proveedor {
  id: string;
  nit_rtn: string;
  nrc: string;
  nombre_legal: string;
  complemento_direccion: string;
  telefono: string;
  correo: string;
  nombre_contacto: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Sucursal {
  id: string;
  nombre: string;
  tipo: string;
  direccion_complemento: string;
  paisId: string;
  departamentoId: string;
  municipioId: string;
  gerenteId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
