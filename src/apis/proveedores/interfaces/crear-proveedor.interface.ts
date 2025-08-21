export interface CrearProveedorInterface {
  nit_rtn: string;
  nrc: string;
  nombre_legal: string;
  complemento_direccion: string;
  telefono: string;
  correo: string;
  nombre_contacto: string;
  departamentoId: string;
  municipioId: string;
  is_active?: boolean;
}
