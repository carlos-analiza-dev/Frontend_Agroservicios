export interface ResponseCitasInterface {
  total: number;
  citas: Cita[];
}

export interface Cita {
  id: string;
  horaInicio: string;
  horaFin: string;
  fecha: Date;
  estado: string;
  totalPagar: string;
  medico: Medico;
  animales: Animale[];
  finca: Finca;
  subServicio: SubServicio;
}

export interface Animale {
  id: string;
  identificador: string;
  especie: string;
  razas: string[];
}

export interface Finca {
  id: string;
  nombre: string;
  ubicacion: string;
}

export interface Medico {
  id: string;
  nombre: string;
  especialidad: string;
}

export interface SubServicio {
  id: string;
  nombre: string;
  precio: string;
}
