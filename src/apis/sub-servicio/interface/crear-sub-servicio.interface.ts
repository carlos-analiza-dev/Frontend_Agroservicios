export interface CrearSubServicio {
  nombre: string;
  tipo: string;
  codigo?: string;
  unidad_venta: string;
  codigo_barra?: string;
  atributos?: string;
  tax_rate?: number;
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
}
