export interface ResponseEscalasProductoInterface {
  data: Escala[];
  total: number;
}

export interface Escala {
  id: string;
  cantidad_comprada: number;
  bonificacion: number;
  costo: number;
  producto: Producto;
}

export interface Producto {
  id: string;
  nombre: string;
  codigo: string;
  codigo_barra: string;
  atributos: string;
  tipo: string;
  unidad_venta: string;
  descripcion: string;
  servicioId: null;
  isActive: boolean;
  disponible: boolean;
  es_compra_bodega: boolean;
  createdAt: Date;
  updatedAt: Date;
  categoriaId: string;
}
