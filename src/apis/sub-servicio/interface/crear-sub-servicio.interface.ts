export interface CrearSubServicio {
  nombre: string;
  tipo: "servicio" | "producto";
  unidad_venta: string;
  descripcion: string;
  disponible: boolean;
  servicioId: string;
}
