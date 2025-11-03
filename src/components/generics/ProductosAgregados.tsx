import { Cita } from "@/apis/medicos/interfaces/obtener-citas-medicos.interface";
import { User } from "@/interfaces/auth/user";
import { PackageIcon } from "lucide-react";
import React from "react";

interface Props {
  item: Cita;
  user: User | undefined;
}

const ProductosAgregados = ({ item, user }: Props) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <PackageIcon className="h-4 w-4 text-green-600" />
        <h5 className="text-sm font-medium text-gray-700">
          Productos ({item.productosUsados.length})
        </h5>
      </div>
      <div className="space-y-2">
        {item.productosUsados.map((producto) => (
          <div
            key={producto.id}
            className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {producto.producto?.nombre}
              </p>
              <p className="text-xs text-gray-600">
                Cantidad: {producto.cantidad} {producto.producto?.unidad_venta}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">
                {user?.pais.simbolo_moneda}
                {producto.subtotal?.toFixed(2) || "0.00"}
              </p>
              <p className="text-xs text-gray-600">
                {user?.pais.simbolo_moneda}
                {producto.precioUnitario} c/u
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductosAgregados;
