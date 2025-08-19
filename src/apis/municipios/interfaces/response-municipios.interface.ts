export interface ResponseMunicipios {
  municipios: Municipio[];
  total: number;
}

export interface Municipio {
  id: string;
  nombre: string;
  isActive: boolean;
  departamento: Departamento;
}

export interface Departamento {
  id: string;
  nombre: string;
  isActive: boolean;
}
