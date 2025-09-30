export interface ResponseLotesInsumoInterface {
  id: string;
  cantidad: string;
  costo: string;
  costo_por_unidad: string;
  compra: Compra;
  sucursal: Sucursal;
  insumo: Insumo;
}

export interface Compra {
  id: string;
  proveedorId: string;
  sucursalId: string;
  tipo_pago: string;
  numero_factura: string;
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
  pais: Pais;
  departamento: Departamento;
  municipio: Departamento;
}

export interface Departamento {
  id: string;
  nombre: string;
  isActive: boolean;
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
