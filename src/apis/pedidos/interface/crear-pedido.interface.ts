export enum EstadoPedido {
  PENDIENTE = "pendiente",
  PROCESADO = "procesado",
  FACTURADO = "facturado",
  CANCELADO = "cancelado",
}

export enum TipoEntrega {
  DELIVERY = "delivery",
  RECOGER = "recoger",
}

export interface CrearPedidoInterface {
  id_cliente: string;
  id_sucursal?: string;
  total: number;
  estado: EstadoPedido;
  detalles: Detalle[];
  direccion_entrega?: string;
  latitud?: number;
  longitud?: number;
  tipo_entrega: TipoEntrega;
  costo_delivery?: number;
  nombre_finca?: string;
}

export interface Detalle {
  id_producto: string;
  cantidad: number;
  precio: number;
  total: number;
}
