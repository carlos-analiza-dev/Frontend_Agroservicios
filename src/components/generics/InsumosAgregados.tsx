import { Cita } from "@/apis/medicos/interfaces/obtener-citas-medicos.interface";
import { User } from "@/interfaces/auth/user";
import { SyringeIcon } from "lucide-react";
import React from "react";

interface Props {
  item: Cita;
  user: User | undefined;
}

const InsumosAgregados = ({ item, user }: Props) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <SyringeIcon className="h-4 w-4 text-blue-600" />
        <h5 className="text-sm font-medium text-gray-700">
          Insumos ({item.insumosUsados.length})
        </h5>
      </div>
      <div className="space-y-2">
        {item.insumosUsados.map((insumo) => (
          <div
            key={insumo.id}
            className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">
                {insumo.insumo?.nombre}
              </p>
              <p className="text-xs text-gray-600">
                Cantidad: {insumo.cantidad} {insumo.insumo?.unidad_venta}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">
                {user?.pais.simbolo_moneda}
                {insumo.subtotal?.toFixed(2) || "0.00"}
              </p>
              <p className="text-xs text-gray-600">
                {user?.pais.simbolo_moneda}
                {insumo.precioUnitario} c/u
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InsumosAgregados;
