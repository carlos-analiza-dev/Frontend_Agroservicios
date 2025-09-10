export interface ResponseDatosProductoInterface {
  total: number;
  datos: Dato[];
}

export interface Dato {
  id: string;
  punto_reorden: number;
  precio: string;
  descuento: string;
  created_at: Date;
  updated_at: Date;
  producto: Producto;
  sucursal: Sucursal;
}

export interface Producto {
  id: string;
  nombre: string;
  codigo: string;
  codigo_barra: string;
  atributos: string;
  tipo: string;
  unidad_venta: string;
  descripcion: string;
  servicioId: null;
  isActive: boolean;
  disponible: boolean;
  es_compra_bodega: boolean;
  createdAt: Date;
  updatedAt: Date;
  categoriaId: string;
}

export interface Sucursal {
  id: string;
  nombre: string;
  tipo: string;
  direccion_complemento: string;
  paisId: string;
  departamentoId: string;
  municipioId: string;
  gerenteId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  pais: Pais;
  departamento: Departamento;
  municipio: Departamento;
}

export interface Departamento {
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
}
