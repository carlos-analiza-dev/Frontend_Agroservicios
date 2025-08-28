export interface CrearSucursaleInterface {
  nombre: string;
  tipo: string;
  direccion_complemento: string;
  municipioId: string;
  departamentoId: string;
  paisId: string;
  gerenteId: string;
  isActive?: boolean;
}
