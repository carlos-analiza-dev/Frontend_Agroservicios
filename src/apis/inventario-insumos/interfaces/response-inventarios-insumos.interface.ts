export interface ResponseInventariosInsumos {
  inventario: Inventario[];
  total: number;
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
  marca: Marca;
  proveedor: Proveedor;
  pais: Pais;
  inventario: Inventario;
}

export interface Inventario {
  id: string;
  cantidadDisponible: number;
  stockMinimo: number;
  insumo?: Insumo;
}

export interface Marca {
  id: string;
  nombre: string;
  pais_origen: string;
  is_active: boolean;
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
