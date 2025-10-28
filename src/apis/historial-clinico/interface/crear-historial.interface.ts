export interface CrearHistorialInterface {
  animalId: string;
  citaId: string;
  resumen: string;
  detalles: Detalle[];
}

export interface Detalle {
  subServicioId: string;
  diagnostico: string;
  tratamiento: string;
  observaciones: string;
}
