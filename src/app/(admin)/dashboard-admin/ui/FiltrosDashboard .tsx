// components/dashboard/FiltrosDashboard.tsx
"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Filter, Calendar, X } from "lucide-react";
import { useAuthStore } from "@/providers/store/useAuthStore";

interface FiltrosDashboardProps {
  fechaInicio: string;
  fechaFin: string;

  onFechaInicioChange: (fecha: string) => void;
  onFechaFinChange: (fecha: string) => void;

  onLimpiarFiltros: () => void;
}

const FiltrosDashboard = ({
  fechaInicio,
  fechaFin,
  onFechaInicioChange,
  onFechaFinChange,
  onLimpiarFiltros,
}: FiltrosDashboardProps) => {
  const { user } = useAuthStore();
  const sucursalUsuario = user?.sucursal?.id || "default";

  const hayFiltrosActivos = fechaInicio || fechaFin;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtros del Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fechaInicio" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Fecha Inicio:
            </Label>
            <Input
              type="date"
              value={fechaInicio}
              onChange={(e) => onFechaInicioChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fechaFin" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Fecha Fin:
            </Label>
            <Input
              type="date"
              value={fechaFin}
              onChange={(e) => onFechaFinChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label className="invisible">Acciones</Label>
            <Button
              variant="outline"
              onClick={onLimpiarFiltros}
              disabled={!hayFiltrosActivos}
              className="w-full"
            >
              <X className="h-4 w-4 mr-2" />
              Limpiar Filtros
            </Button>
          </div>
        </div>

        {hayFiltrosActivos && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              Filtros aplicados:{" "}
              {fechaInicio && (
                <span className="ml-2">
                  desde <span className="font-medium">{fechaInicio}</span>
                </span>
              )}
              {fechaFin && (
                <span className="ml-2">
                  hasta <span className="font-medium">{fechaFin}</span>
                </span>
              )}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FiltrosDashboard;
