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
  inventario: Inventario | null;
}

export interface Inventario {
  id: string;
  cantidadDisponible: number;
  stockMinimo: number;
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
  email: Email;
  name: CreatedByName;
  identificacion: Identificacion;
  direccion: Direccion;
  sexo: Sexo;
  telefono: Telefono;
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
  nombre: DepartamentoNombre;
  isActive: boolean;
  municipios?: Departamento[];
}

export enum DepartamentoNombre {
  FranciscoMorazán = "Francisco Morazán",
  Tegucigalpa = "Tegucigalpa",
}

export enum Direccion {
  TegucigalpaHonduras = "Tegucigalpa, Honduras",
}

export enum Email {
  AlcerroCarlos20GmailCOM = "alcerro.carlos20@gmail.com",
}

export enum Identificacion {
  The1201200000131 = "1201-2000-00131",
}

export enum CreatedByName {
  CarlosEduardoAlcerroLainez = "Carlos Eduardo Alcerro Lainez",
}

export interface Pais {
  id: string;
  nombre: PaisNombre;
  code: Code;
  code_phone: string;
  nombre_moneda: NombreMoneda;
  simbolo_moneda: SimboloMoneda;
  nombre_documento: NombreDocumento;
  isActive: boolean;
  departamentos: Departamento[];
}

export enum Code {
  Hn = "HN",
}

export enum PaisNombre {
  Honduras = "Honduras",
}

export enum NombreDocumento {
  Dni = "DNI",
}

export enum NombreMoneda {
  Lempira = "Lempira",
}

export enum SimboloMoneda {
  L = "L",
}

export interface Role {
  id: string;
  name: RoleName;
  description: Description;
  isActive: boolean;
}

export enum Description {
  AdministradorDelSistema = "Administrador del sistema",
}

export enum RoleName {
  Administrador = "Administrador",
}

export enum Sexo {
  M = "M",
}

export enum Telefono {
  The50487709116 = "+504 8770-9116",
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
