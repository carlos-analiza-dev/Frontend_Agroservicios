export interface ResponseProductos {
  servicios: Servicio[];
  total: number;
}

export interface Servicio {
  id: string;
  nombre: string;
  codigo: string;
  tipo: string;
  unidad_venta: string;
  descripcion: string;
  servicioId: null;
  isActive: boolean;
  disponible: boolean;
  createdAt: Date;
  updatedAt: Date;
  servicio: null;
  preciosPorPais: PreciosPorPai[];
}

export interface PreciosPorPai {
  id: string;
  precio: string;
  tiempo: null;
  cantidadMin: null;
  cantidadMax: null;
  pais: Pais;
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

export interface Departamento {
  id: string;
  nombre: string;
  isActive: boolean;
  municipios?: Departamento[];
}
