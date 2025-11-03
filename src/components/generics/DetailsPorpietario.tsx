import { Animale } from "@/apis/medicos/interfaces/obtener-citas-medicos.interface";
import { PhoneIcon, UserIcon } from "lucide-react";
import React from "react";

interface Props {
  primaryAnimal: Animale;
  ownerPhone: string;
  handleCall: (phoneNumber: string) => void;
}

const DetailsPorpietario = ({
  handleCall,
  ownerPhone,
  primaryAnimal,
}: Props) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <UserIcon className="h-4 w-4 text-gray-600" />
        <span className="text-sm text-gray-700">
          {primaryAnimal.propietario?.name || "No especificado"}
        </span>
      </div>
      {ownerPhone && (
        <button
          onClick={() => handleCall(ownerPhone)}
          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
        >
          <PhoneIcon className="h-4 w-4" />
          <span>{ownerPhone}</span>
        </button>
      )}
    </div>
  );
};

export default DetailsPorpietario;
