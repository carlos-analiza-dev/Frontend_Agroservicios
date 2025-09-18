export interface CrearClienteInterface {
  email: string;
  password: string;
  nombre: string;
  identificacion: string;
  direccion: string;
  telefono: string;
  pais: string;
  departamento: string;
  municipio: string;
  sexo: string;
  isActive?: boolean;
}
