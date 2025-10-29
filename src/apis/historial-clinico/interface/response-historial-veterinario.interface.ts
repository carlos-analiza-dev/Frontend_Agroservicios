export interface ResponseHistorialVetInterface {
  historial: Historial[];
  total: number;
}

export interface Historial {
  id: string;
  resumen: string;
  createdAt: Date;
  updatedAt: Date;
  cita: Cita;
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
  porcentaje_comprado?: number;
  porcentaje_producido?: number;
}

export interface Cita {
  id: string;
  codigo: string;
  horaInicio: string;
  horaFin: string;
  fecha: string;
  cantidadAnimales: number;
  totalPagar: string;
  totalFinal: string;
  duracion: number;
  estado: string;
  created_at: Date;
  updated_at: Date;
  finca: Finca;
  subServicio: SubServicio;
}

export interface Finca {
  id: string;
  nombre_finca: string;
  cantidad_animales: number;
  ubicacion: string;
  latitud: number;
  longitud: number;
  abreviatura: string;
  tamaño_total: string;
  area_ganaderia: string;
  medida_finca: string;
  tipo_explotacion: TipoExplotacion[];
  especies_maneja: EspeciesManeja[];
  fecha_registro: Date;
  isActive: boolean;
}

export interface EspeciesManeja {
  especie: string;
  cantidad: number;
}

export interface TipoExplotacion {
  tipo_explotacion: string;
}

export interface SubServicio {
  id: string;
  nombre: string;
  codigo: string;
  codigo_barra: string;
  atributos: string;
  tipo: string;
  unidad_venta: string;
  tipo_fraccionamiento: null;
  contenido: number;
  descripcion: string;
  servicioId: string;
  isActive: boolean;
  disponible: boolean;
  es_compra_bodega: boolean;
  compra_minima: number;
  unidad_fraccionamiento: number;
  distribucion_minima: number;
  venta_minima: number;
  createdAt: Date;
  updatedAt: Date;
  categoriaId: null;
}

export interface Detalle {
  id: string;
  diagnostico: string;
  tratamiento: string;
  observaciones: string;
  createdAt: Date;
  updatedAt: Date;
  subServicio: SubServicio;
  documentos: Documento[];
}

export interface Documento {
  id: string;
  nombre: string;
  url: string;
  key: string;
  mimeType: string;
  createdAt: Date;
}
