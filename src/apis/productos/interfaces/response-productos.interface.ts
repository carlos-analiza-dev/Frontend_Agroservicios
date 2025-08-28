export interface ResponseProductos {
  servicios: Servicio[];
  total: number;
}

export interface Servicio {
  id: string;
  nombre: string;
  codigo: string;
  codigo_barra: string;
  atributos: string;
  tipo: string;
  unidad_venta: string;
  descripcion: null | string;
  servicioId: null;
  isActive: boolean;
  disponible: boolean;
  createdAt: Date;
  updatedAt: Date;

  servicio: null;
  preciosPorPais: PreciosPorPai[];
  marca: Categoria;
  proveedor: Proveedor;
  categoria: Categoria;
  tax: Tax | null;
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  pais_origen?: string;
}

export interface PreciosPorPai {
  id: string;
  precio: string;
  costo: string;
  tiempo: null;
  cantidadMin: null;
  cantidadMax: null;
  pais: Pais;
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

export interface Tax {
  id: string;
  nombre: string;
  porcentaje: string;
}
