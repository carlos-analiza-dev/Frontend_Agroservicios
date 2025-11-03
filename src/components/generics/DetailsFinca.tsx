import { Cita } from "@/apis/medicos/interfaces/obtener-citas-medicos.interface";
import { BuildingIcon, MapPinIcon } from "lucide-react";
import React from "react";

interface Props {
  item: Cita;
}

const DetailsFinca = ({ item }: Props) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <MapPinIcon className="h-4 w-4 text-gray-600" />
        <span className="text-sm text-gray-700">{item.finca.nombre_finca}</span>
      </div>
      <div className="flex items-center gap-2">
        <BuildingIcon className="h-4 w-4 text-gray-600" />
        <span className="text-sm text-gray-700">
          {item.finca.ubicacion.split(",").slice(1).join(",").trim() ||
            item.finca.ubicacion}
        </span>
      </div>
    </div>
  );
};

export default DetailsFinca;
