export interface CrearServicioInterface {
  nombre: string;
  descripcion: string;
  servicioId: string;
  unidad_venta: string;
  disponible?: boolean;
  insumos: Insumo[];
}

export interface Insumo {
  insumoId: string;
  cantidad: number;
}
