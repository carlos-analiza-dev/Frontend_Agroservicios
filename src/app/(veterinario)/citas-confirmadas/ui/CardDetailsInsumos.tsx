import { Cita } from "@/apis/citas/interfaces/response-citas-confirm.interface";
import { InsumoDis } from "@/apis/insumos/interfaces/response-insumos-disponibles.interface";
import { Producto } from "@/apis/productos/interfaces/response-productos.interface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { User } from "@/interfaces/auth/user";
import { Minus, Plus } from "lucide-react";
import React from "react";

interface Props {
  insumo: InsumoDis;
  isSelected: {
    insumo: InsumoDis;
    quantity: number;
  } | null;
  disponible: boolean;
  handleProductSelection: (
    item: InsumoDis | Producto,
    type: "insumo" | "producto"
  ) => void;
  user: User | undefined;
  existenciaReal: number;
  updateProductQuantity: (
    id: string,
    quantity: number,
    type: "insumo" | "producto"
  ) => void;
  selectedInsumos: {
    [citaId: string]: {
      [insumoId: string]: {
        insumo: InsumoDis;
        quantity: number;
      };
    };
  };
  selectedCita: Cita | null;
}

const CardDetailsInsumos = ({
  insumo,
  isSelected,
  disponible,
  handleProductSelection,
  user,
  existenciaReal,
  updateProductQuantity,
  selectedInsumos,
  selectedCita,
}: Props) => {
  return (
    <Card
      className={`cursor-pointer transition-colors ${
        isSelected ? "bg-blue-50 border-blue-200" : ""
      } ${!disponible ? "opacity-50 bg-gray-100" : ""}`}
    >
      <CardContent className="p-4">
        <div
          onClick={() => {
            if (disponible) {
              handleProductSelection(insumo, "insumo");
            }
          }}
          className="space-y-2"
        >
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{insumo.nombre}</h3>
              <p className="text-sm text-muted-foreground">{insumo.codigo}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant="secondary" className="whitespace-nowrap">
                {insumo.costo} {user?.pais.simbolo_moneda}
              </Badge>
              <Badge
                variant={disponible ? "default" : "destructive"}
                className="text-xs"
              >
                {disponible
                  ? `Stock: ${existenciaReal} ${insumo.unidad_venta}`
                  : "Sin stock"}
              </Badge>
            </div>
          </div>

          {isSelected && (
            <div className="flex items-center space-x-3 mt-3">
              <Button
                variant="outline"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  updateProductQuantity(
                    insumo.id,
                    selectedInsumos[selectedCita?.id!][insumo.id].quantity - 1,
                    "insumo"
                  );
                }}
                disabled={
                  selectedInsumos[selectedCita?.id!][insumo.id].quantity <= 1
                }
              >
                <Minus className="w-4 h-4" />
              </Button>

              <span className="font-medium w-8 text-center">
                {selectedInsumos[selectedCita?.id!][insumo.id].quantity}
              </span>

              <Button
                variant="outline"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  updateProductQuantity(
                    insumo.id,
                    selectedInsumos[selectedCita?.id!][insumo.id].quantity + 1,
                    "insumo"
                  );
                }}
                disabled={
                  selectedInsumos[selectedCita?.id!][insumo.id].quantity >=
                  existenciaReal
                }
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CardDetailsInsumos;
