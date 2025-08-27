export interface ResponseServicios {
  servicios: Servicio[];
  total: number;
}

export interface Servicio {
  id: string;
  nombre: string;
  descripcion: string;
  isActive: boolean;
  createdAt: Date;
  updateAt: Date;
  subServicios: SubServicio[];
}

export interface SubServicio {
  id: string;
  nombre: string;
  codigo: null | string;
  codigo_barra: null;
  atributos: null;
  tax_rate: null;
  tipo: string;
  unidad_venta: string;
  descripcion: string;
  servicioId: string;
  isActive: boolean;
  disponible: boolean;
  createdAt: Date;
  updatedAt: Date;
  marcaId: null;
  proveedorId: null;
  categoriaId: null;
  preciosPorPais: PreciosPorPai[];
  marca: null;
  proveedor: null;
  categoria: null;
  insumos: Insumo[];
}

export interface Insumo {
  id: string;
  servicioId: string;
  insumoId: string;
  cantidad: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PreciosPorPai {
  id: string;
  precio: string;
  costo: null;
  tiempo: number;
  cantidadMin: number;
  cantidadMax: number;
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
