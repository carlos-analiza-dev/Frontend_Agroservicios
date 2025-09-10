export interface ResponseDescuentoInterface {
  id: string;
  cantidad_comprada: number;
  descuentos: number;
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
