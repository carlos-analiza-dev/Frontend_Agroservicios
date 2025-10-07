export interface ObtenerSubServicioDisponibleInterface {
  servicios: Servicio[];
}

export interface Servicio {
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
  servicioId: string;
  isActive: boolean;
  disponible: boolean;
  es_compra_bodega: boolean;
  compra_minima: number;
  unidad_fraccionamiento: number;
  distribucion_minima: number;
  venta_minima: number;
  createdAt: Date;
  updatedAt: Date;
  categoriaId: null;
  preciosPorPais: PreciosPorPai[];
  marca: null;
  proveedor: null;
  categoria: null;
  tax: null;
}

export interface PreciosPorPai {
  id: string;
  precio: string;
  costo: null | string;
  tiempo: number;
  cantidadMin: number;
  cantidadMax: number;
}
