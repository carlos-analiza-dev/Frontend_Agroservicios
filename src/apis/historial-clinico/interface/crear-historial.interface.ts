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

export interface Documento {
  nombre: string;
  url: string;
  key: string;
  mimeType: string;
}
