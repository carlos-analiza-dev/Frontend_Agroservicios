export interface ResponseHistorialVetInterface {
  historial: Historial[];
  total: number;
}

export interface Historial {
  id: string;
  resumen: string;
  createdAt: Date;
  updatedAt: Date;
  animal: Animal;
  veterinario: Ario;
  detalles: Detalle[];
}

export interface Animal {
  id: string;
  sexo: string;
  color: string;
  identificador: string;
  tipo_reproduccion: string;
  pureza: string;
  edad_promedio: number;
  fecha_nacimiento: Date;
  observaciones: string;
  tipo_alimentacion: TipoAlimentacion[];
  complementos: Complemento[];
  medicamento: string;
  produccion: string;
  tipo_produccion: string;
  animal_muerte: boolean;
  razon_muerte: string;
  compra_animal: boolean;
  nombre_criador_origen_animal: string;
  nombre_padre: string;
  arete_padre: string;
  pureza_padre: string;
  nombre_criador_padre: string;
  nombre_propietario_padre: string;
  nombre_finca_origen_padre: string;
  nombre_madre: string;
  arete_madre: string;
  pureza_madre: string;
  nombre_criador_madre: string;
  nombre_propietario_madre: string;
  nombre_finca_origen_madre: string;
  numero_parto_madre: number;
  fecha_registro: Date;
  castrado: boolean;
  esterelizado: boolean;
  especie: Especie;
  razas: Especie[];
  propietario: Ario;
}

export interface Complemento {
  complemento: string;
}

export interface Especie {
  id: string;
  nombre: string;
  isActive: boolean;
  abreviatura?: string;
}

export interface Ario {
  id: string;
  nombre?: string;
  identificacion: string;
  telefono: string;
  email: string;
  direccion: string;
  sexo: string;
  isActive: boolean;
  createdAt: Date;
  name?: string;
  isAuthorized?: boolean;
}

export interface TipoAlimentacion {
  origen: string;
  alimento: string;
}

export interface Detalle {
  id: string;
  diagnostico: string;
  tratamiento: string;
  observaciones: string;
  createdAt: Date;
  updatedAt: Date;
}
