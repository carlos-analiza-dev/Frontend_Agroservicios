import { CrearFacturaInterface } from "@/apis/facturas/interfaces/crear-factura.interface";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { Calculator } from "lucide-react";
import React from "react";
import { FieldArrayWithId } from "react-hook-form";

interface Props {
  subTotal: number;
  descuentos: number;
  fields: FieldArrayWithId<
    CrearFacturaInterface & {
      cantidadAnimales?: number;
    },
    "detalles",
    "id"
  >[];
  totalGeneral: number;
}

const ResumenFactura = ({
  subTotal,
  descuentos,
  fields,
  totalGeneral,
}: Props) => {
  const { user } = useAuthStore();
  const simbolo = user?.pais.simbolo_moneda || "$";
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Resumen de la Factura
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="space-y-2">
            <Badge variant="secondary" className="w-full">
              Sub Total
            </Badge>
            <p className="text-xl font-bold">
              {simbolo} {subTotal.toFixed(2)}
            </p>
          </div>
          <div className="space-y-2">
            <Badge variant="secondary" className="w-full">
              Descuentos
            </Badge>
            <p className="text-xl font-bold text-red-600">
              -{simbolo} {descuentos.toFixed(2)}
            </p>
          </div>
          <div className="space-y-2">
            <Badge variant="secondary" className="w-full">
              Items
            </Badge>
            <p className="text-xl font-bold">{fields.length}</p>
          </div>
          <div className="space-y-2">
            <Badge variant="default" className="w-full">
              Total General
            </Badge>
            <p className="text-2xl font-bold text-green-600">
              {simbolo} {totalGeneral.toFixed(2)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumenFactura;
