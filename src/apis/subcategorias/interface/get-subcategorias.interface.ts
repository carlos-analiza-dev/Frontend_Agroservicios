export interface ResponseSubcategorias {
  id: string;
  nombre: string;
  descripcion: string;
  codigo?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  categoria?: Categoria;
}

export interface Categoria {
  id: string;
  nombre: string;
  descripcion: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
