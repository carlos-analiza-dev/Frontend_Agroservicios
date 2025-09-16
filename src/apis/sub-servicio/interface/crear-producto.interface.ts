export interface CrearSubServicio {
  nombre: string;
  tipo: string;
  codigo?: string;
  unidad_venta: string;
  codigo_barra?: string;
  atributos?: string;
  taxId?: string;
  precio?: number;
  costo?: number;
  descripcion?: string;
  disponible?: boolean;
  isActive?: boolean;
  servicioId?: string;
  marcaId?: string;
  proveedorId?: string;
  categoriaId?: string;
  paisId?: string;
  compra_minima?: number;
  distribucion_minima?: number;
  venta_minima?: number;
  es_compra_bodega?: boolean;
}
