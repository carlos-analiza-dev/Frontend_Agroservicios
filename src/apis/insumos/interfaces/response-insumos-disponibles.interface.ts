export interface InsumosDisponiblesInterface {
  insumos: InsumoDis[];
}

export interface InsumoDis {
  id: string;
  nombre: string;
  codigo: string;
  costo: string;
  unidad_venta: string;
  disponible: boolean;
  cantidad?: number;
  createdAt: Date;
  updatedAt: Date;
  pais: Pais;
  marca: Marca;
  proveedor: Proveedor;
}

export interface Marca {
  id: string;
  nombre: string;
  pais_origen: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  created_by: AtedBy;
  updated_by: AtedBy;
}

export interface AtedBy {
  id: string;
  email: string;
  name: string;
  identificacion: string;
  direccion: string;
  sexo: string;
  telefono: string;
  isActive: boolean;
  isAuthorized: boolean;
  createdAt: Date;
  role: Role;
  pais: Pais;
  departamento: Departamento;
  municipio: Departamento;
  profileImages: any[];
}

export interface Departamento {
  id: string;
  nombre: string;
  isActive: boolean;
  municipios?: Departamento[];
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
  departamentos: Departamento[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
}

export interface Proveedor {
  id: string;
  nit_rtn: string;
  nrc: string;
  nombre_legal: string;
  complemento_direccion: string;
  telefono: string;
  correo: string;
  nombre_contacto: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  pais: Pais;
  departamento: Departamento;
  municipio: Departamento;
  created_by: AtedBy;
  updated_by: AtedBy;
}
