export interface ResponseDeptos {
  departamentos: Departamento[];
  total: number;
}

export interface Departamento {
  id: string;
  nombre: string;
  isActive: boolean;
  pais: Pais;
  municipios: Municipio[];
}

export interface Municipio {
  id: string;
  nombre: string;
  isActive: boolean;
}

export interface Pais {
  id: string;
  nombre: string;
  code: string;
  code_phone: string;
  nombre_moneda: string;
  simbolo_moneda: string;
  nombre_documento: string;
  isActive: boolean;
  departamentos: Municipio[];
}
