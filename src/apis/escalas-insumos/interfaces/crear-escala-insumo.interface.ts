export interface CrearEscalaInsumoInterface {
  insumoId: string;
  proveedorId: string;
  paisId: string;
  cantidad_comprada: number;
  bonificacion: number;
  costo: number;
  isActive?: boolean;
}
