import { Compra } from "@/apis/compras_productos/interface/response-compras.interface";
import { Badge } from "@/components/ui/badge";
import React from "react";

interface Props {
  selectedCompra: Compra;
  formatDate: (date: Date) => string;
  formatCurrency: (amount: string) => string;
}

const InfoCompra = ({ selectedCompra, formatDate, formatCurrency }: Props) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
      <div>
        <h3 className="font-semibold mb-2">Información de la Compra</h3>
        <p>
          <span className="font-medium">Proveedor:</span>{" "}
          {selectedCompra.proveedor.nombre_legal}
        </p>
        <p>
          <span className="font-medium">NIT/RTN:</span>{" "}
          {selectedCompra.proveedor.nit_rtn}
        </p>
        <p>
          <span className="font-medium">NRC:</span>{" "}
          {selectedCompra.proveedor.nrc}
        </p>
        <p>
          <span className="font-medium">Sucursal:</span>{" "}
          {selectedCompra.sucursal.nombre}
        </p>
        <p>
          <span className="font-medium">Fecha:</span>{" "}
          {formatDate(selectedCompra.fecha)}
        </p>
        <div className="flex items-center">
          <span className="font-medium">Tipo de Pago:</span>
          <Badge variant="outline" className="ml-2 capitalize">
            {selectedCompra.tipo_pago}
          </Badge>
        </div>
      </div>
      <div>
        <h3 className="font-semibold mb-2">Totales</h3>
        <p>
          <span className="font-medium">Subtotal:</span>{" "}
          {formatCurrency(selectedCompra.subtotal)}
        </p>
        <p>
          <span className="font-medium">Descuentos:</span>{" "}
          {formatCurrency(selectedCompra.descuentos)}
        </p>
        <p>
          <span className="font-medium">Impuestos:</span>{" "}
          {formatCurrency(selectedCompra.impuestos)}
        </p>
        <p>
          <span className="font-medium text-lg">Total:</span>
          <span className="text-lg font-bold ml-2">
            {formatCurrency(selectedCompra.total)}
          </span>
        </p>
      </div>
    </div>
  );
};

export default InfoCompra;
