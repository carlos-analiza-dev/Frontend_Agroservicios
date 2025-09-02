import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InsumoElement } from "@/apis/servicios/interfaces/response-servicios.interface";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/providers/store/useAuthStore";

interface InsumosExpandibleProps {
  insumos: InsumoElement[];
}

const InsumosExpandible = ({ insumos }: InsumosExpandibleProps) => {
  const { user } = useAuthStore();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!insumos || insumos.length === 0) {
    return (
      <div className="text-sm text-muted-foreground italic">
        No hay insumos registrados
      </div>
    );
  }

  const costoTotal = insumos.reduce((total, insumo) => {
    return total + parseFloat(insumo.insumo.costo) * insumo.cantidad;
  }, 0);

  return (
    <div className="border rounded-md p-3">
      <Button
        variant="ghost"
        className="w-full justify-between p-0 h-auto font-normal"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          <span className="font-medium">Insumos ({insumos.length})</span>
          <Badge variant="outline" className="text-xs">
            Costo total: {user?.pais.simbolo_moneda} {costoTotal.toFixed(2)}
          </Badge>
        </div>
      </Button>

      {isExpanded && (
        <div className="mt-3 space-y-2">
          {insumos.map((insumo) => (
            <div
              key={insumo.id}
              className="flex items-center justify-between p-2 border rounded-md text-sm"
            >
              <div className="flex-1">
                <span className="font-medium">{insumo.insumo.nombre}</span>
                <span className="text-muted-foreground ml-2">
                  ({insumo.insumo.codigo})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {insumo.cantidad} {insumo.insumo.unidad_venta}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {user?.pais.simbolo_moneda}{" "}
                  {parseFloat(insumo.insumo.costo).toFixed(2)}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InsumosExpandible;
