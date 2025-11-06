export interface ResponseFincasInterface {
  fincas: Finca[];
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
  departamento: Departamento;
  municipio: Departamento;
  propietario: Propietario;
  pais_id: PaisID;
}

export interface Departamento {
  id: string;
  nombre: string;
  isActive: boolean;
}

export interface EspeciesManeja {
  especie: string;
  cantidad: number;
}

export interface PaisID {
  id: string;
  nombre: string;
  code: string;
  code_phone: string;
  nombre_moneda: string;
  simbolo_moneda: string;
  nombre_documento: string;
  isActive: boolean;
}

export interface Propietario {
  id: string;
  nombre: string;
  identificacion: string;
  telefono: string;
  email: string;
  direccion: string;
  sexo: string;
  isActive: boolean;
  createdAt: Date;
}

export interface TipoExplotacion {
  tipo_explotacion: string;
}
