import { Label } from "@/components/ui/label";
import { User } from "@/interfaces/auth/user";
import React from "react";

interface Props {
  user: User | undefined;
  subtotal: number;
  totalDescuentos: number;
  totalImpuestos: number;
  total: number;
}

const DetailsCompra = ({
  subtotal,
  total,
  totalDescuentos,
  totalImpuestos,
  user,
}: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-blue-50 rounded-lg">
      <div className="space-y-1">
        <Label className="font-bold">Subtotal</Label>
        <p className="text-lg font-semibold">
          {user?.pais.simbolo_moneda} {subtotal.toFixed(2)}
        </p>
      </div>

      <div className="space-y-1">
        <Label className="font-bold">Descuentos</Label>
        <p className="text-lg font-semibold text-red-500">
          {user?.pais.simbolo_moneda} {totalDescuentos.toFixed(2)}
        </p>
      </div>

      <div className="space-y-1">
        <Label className="font-bold">Impuestos</Label>
        <p className="text-lg font-semibold">
          {user?.pais.simbolo_moneda} {totalImpuestos.toFixed(2)}
        </p>
      </div>

      <div className="space-y-1">
        <Label className="font-bold text-blue-600">Total</Label>
        <p className="text-2xl font-bold text-blue-600">
          {user?.pais.simbolo_moneda} {total.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default DetailsCompra;
