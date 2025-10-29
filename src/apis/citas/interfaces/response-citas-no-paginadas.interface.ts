export interface ResponseCitasCompletadasInterface {
  citas: Cita[];
}

export interface Cita {
  id: string;
  fecha: string;
  horaInicio: string;
  horaFin: string;
  codigo: string;
  duracion: number;
  estado: string;
  totalPagar: string;
  totalFinal: string;
  cantidadAnimales: number;
  medico: Medico;
  animales: Animale[];
  finca: Finca;
  subServicio: SubServicio;
  insumosUsados: OSUsado[];
  productosUsados: OSUsado[];
}

export interface Animale {
  id: string;
  identificador: string;
  especie: string;
  razas: string[];
  propietario: Propietario;
}

export interface Propietario {
  name: string;
  telefono: string;
}

export interface Finca {
  id: string;
  nombre_finca: string;
  ubicacion: string;
  latitud: number;
  longitud: number;
}

export interface OSUsado {
  id: string;
  insumo?: SubServicio;
  cantidad: number;
  precioUnitario: string;
  subtotal: number;
  producto?: SubServicio;
}

export interface SubServicio {
  id: string;
  nombre: string;
  codigo?: string;
  unidad_venta?: string;
  descripcion?: string;
}

export interface Medico {
  id: string;
  nombre: string;
  especialidad: string;
  telefono: string;
}
