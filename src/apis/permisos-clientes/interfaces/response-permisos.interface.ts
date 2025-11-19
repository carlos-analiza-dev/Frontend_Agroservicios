export interface ResponsePermisosInterface {
  total: number;
  data: PermisosClientes[];
}

export interface PermisosClientes {
  id: string;
  nombre: string;
  descripcion: string;
  url: string;
  modulo: string;
  isActive: boolean;
  createdAt: string;
}
