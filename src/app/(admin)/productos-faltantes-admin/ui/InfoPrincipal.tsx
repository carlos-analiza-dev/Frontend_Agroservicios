import { ResponseProductosNoVendidosInterface } from "@/apis/productos-no-vendidos/interfaces/response-productos-no-vendidos.interface";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/helpers/funciones/formatCurrency";
import { AlertTriangle, Building, Package } from "lucide-react";
import React from "react";

interface Props {
  data: ResponseProductosNoVendidosInterface | undefined;
  simbolo: string;
}

const InfoPrincipal = ({ data, simbolo }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Productos
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {data?.total || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pérdida Total</p>
              <p className="text-2xl font-bold text-red-600">
                {formatCurrency(
                  data?.productos
                    ?.reduce(
                      (sum, producto) =>
                        sum + parseFloat(producto.total_perdido),
                      0
                    )
                    .toString() || "0",
                  simbolo
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Building className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Sucursales</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Set(data?.productos?.map((p) => p.sucursal_id)).size || 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InfoPrincipal;
