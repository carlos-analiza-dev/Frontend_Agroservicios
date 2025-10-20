export enum EstadoPedido {
  PENDIENTE = "pendiente",
  PROCESADO = "procesado",
  FACTURADO = "facturado",
  CANCELADO = "cancelado",
}

export interface CrearPedidoInterface {
  id_cliente: string;
  id_sucursal?: string;
  total: number;
  estado: EstadoPedido;
  detalles: Detalle[];
}

export interface Detalle {
  id_producto: string;
  cantidad: number;
  precio: number;
  total: number;
}
