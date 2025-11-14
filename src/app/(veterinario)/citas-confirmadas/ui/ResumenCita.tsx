import { Cita } from "@/apis/citas/interfaces/response-citas-confirm.interface";
import { InsumoDis } from "@/apis/insumos/interfaces/response-insumos-disponibles.interface";
import { Producto } from "@/apis/productos/interfaces/response-productos.interface";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User } from "@/interfaces/auth/user";
import React from "react";

interface Props {
  selectedCita: Cita | null;
  selectedProductos: {
    [citaId: string]: {
      [productoId: string]: {
        producto: Producto;
        quantity: number;
      };
    };
  };
  /* selectedInsumos: {
    [citaId: string]: {
      [insumoId: string]: {
        insumo: InsumoDis;
        quantity: number;
      };
    };
  }; */
  totalAdicional: {
    [citaId: string]: number;
  };
  user: User | undefined;
}

const ResumenCita = ({
  selectedCita,
  selectedProductos,
  /*  selectedInsumos, */
  totalAdicional,
  user,
}: Props) => {
  return (
    <Card className="mt-4 ">
      <CardContent className="p-4">
        <h4 className="font-semibold mb-3">Resumen</h4>

        {/*  {selectedCita && selectedInsumos[selectedCita.id] && (
          <>
            <h5 className="font-medium mb-2">Insumos:</h5>
            {Object.values(selectedInsumos[selectedCita.id]).map(
              ({ insumo, quantity }) => (
                <div
                  key={insumo.id}
                  className="flex justify-between ml-4 text-sm"
                >
                  <span>
                    {insumo.nombre} x {quantity}
                  </span>
                  <span>
                    {(parseFloat(insumo.costo) * quantity).toFixed(2)}{" "}
                    {user?.pais.simbolo_moneda}
                  </span>
                </div>
              )
            )}
          </>
        )} */}

        {selectedCita && selectedProductos[selectedCita.id] && (
          <>
            <h5 className="font-medium mt-3 mb-2">Productos:</h5>
            {Object.values(selectedProductos[selectedCita.id]).map(
              ({ producto, quantity }) => {
                const precio = producto.preciosPorPais?.[0]?.precio || "0";
                return (
                  <div
                    key={producto.id}
                    className="flex justify-between ml-4 text-sm"
                  >
                    <span>
                      {producto.nombre} x {quantity}
                    </span>
                    <span>
                      {(parseFloat(precio) * quantity).toFixed(2)}{" "}
                      {user?.pais.simbolo_moneda}
                    </span>
                  </div>
                );
              }
            )}
          </>
        )}

        <Separator className="my-3" />
        <div className="font-semibold text-lg">
          Total adicional:{" "}
          {selectedCita
            ? totalAdicional[selectedCita.id]?.toFixed(2) || "0.00"
            : "0.00"}{" "}
          {user?.pais.simbolo_moneda}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumenCita;
