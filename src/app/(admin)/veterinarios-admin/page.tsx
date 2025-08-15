import TitlePages from "@/components/generics/TitlePages";
import { Button } from "@/components/ui/button";
import React from "react";

const VeterinariosPage = () => {
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center">
        <TitlePages title="Gestion de Veterinarios" />
        <Button>Agregar +</Button>
      </div>
    </div>
  );
};

export default VeterinariosPage;
