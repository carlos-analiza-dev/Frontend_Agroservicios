import { User } from "@/interfaces/auth/user";
import React from "react";

interface Props {
  user: User | undefined;
  descuentoProducto: number;
  subtotalProducto: number;
  bonificacion: number;
  cantidadPagada: number;
  impuestoProducto: number;
  totalProducto: number;
}

const ResumenCompra = ({
  descuentoProducto,
  cantidadPagada,
  subtotalProducto,
  bonificacion,
  user,
  impuestoProducto,
  totalProducto,
}: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-3 bg-green-50 rounded-lg text-sm">
      <div>
        <span className="font-semibold">Cant. Pagada: </span>
        {cantidadPagada}
      </div>
      <div>
        <span className="font-semibold">Bonificación: </span>
        {bonificacion}
      </div>
      <div>
        <span className="font-semibold">Subtotal: </span>
        {user?.pais.simbolo_moneda} {subtotalProducto.toFixed(2)}
      </div>
      <div>
        <span className="font-semibold">Descuento: </span>
        {user?.pais.simbolo_moneda} {descuentoProducto.toFixed(2)}
      </div>
      <div>
        <span className="font-semibold">Impuesto: </span>
        {user?.pais.simbolo_moneda} {impuestoProducto.toFixed(2)}
      </div>
      <div>
        <span className="font-semibold">Total Producto: </span>
        {user?.pais.simbolo_moneda} {totalProducto.toFixed(2)}
      </div>
    </div>
  );
};

export default ResumenCompra;
