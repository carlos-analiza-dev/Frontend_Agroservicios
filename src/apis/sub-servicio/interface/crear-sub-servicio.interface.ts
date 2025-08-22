export interface CrearSubServicio {
  nombre: string;
  tipo: string;
  unidad_venta: string;
  descripcion: string;
  disponible: boolean;
  servicioId?: string;
  marcaId?: string;
  proveedorId?: string;
}
