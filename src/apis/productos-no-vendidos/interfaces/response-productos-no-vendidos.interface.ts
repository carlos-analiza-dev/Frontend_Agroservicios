import { Sucursal } from "@/apis/sucursales/interfaces/response-sucursales.interface";
import { Motivo } from "./producto-no-vendido.interface";

export interface ResponseProductosNoVendidosInterface {
  productos: ProductoNoVendido[];
  total: number;
}

export interface ProductoNoVendido {
  id: string;
  producto_id: string;
  sucursal_id: string;
  nombre_producto: string;
  cantidad_no_vendida: number;
  precio_unitario: string;
  total_perdido: string;
  existencia_actual: number;
  cantidad_solicitada: number;
  motivo: Motivo;
  observaciones: string;
  fue_reabastecido: boolean;
  fecha_reabastecimiento: null;
  created_at: string;
  updated_at: Date;
  producto: ProductoProducto;
  sucursal: Sucursal;
}

export interface ProductoProducto {
  id: string;
  nombre: string;
  codigo: string;
  codigo_barra: string;
  atributos: string;
  tipo: string;
  unidad_venta: string;
  tipo_fraccionamiento: null;
  contenido: number;
  descripcion: string;
  servicioId: null;
  isActive: boolean;
  disponible: boolean;
  es_compra_bodega: boolean;
  compra_minima: number;
  unidad_fraccionamiento: number;
  distribucion_minima: number;
  venta_minima: number;
  createdAt: Date;
  updatedAt: Date;
  categoriaId: string;
}
