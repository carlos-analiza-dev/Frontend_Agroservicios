import { Insumo } from "@/apis/insumos/interfaces/response-insumos.interface";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@/interfaces/auth/user";
import React from "react";
import TableDescuentosInsumo from "./TableDescuentosInsumo";
import TableEscalaInsumo from "./TableEscalaInsumo";

interface Props {
  user: User | undefined;
  selectedInsumo: Insumo | null;
}

const OptionsInsumos = ({ user, selectedInsumo }: Props) => {
  return (
    <div className="h-full w-full">
      <Tabs defaultValue="escala" className="h-full w-full flex flex-col">
        <TabsList className="w-full">
          <TabsTrigger value="escala" className="flex-1">
            Escalas
          </TabsTrigger>
          <TabsTrigger value="descuento" className="flex-1">
            Descuentos
          </TabsTrigger>
        </TabsList>

        <TabsContent value="escala" className="flex-1 overflow-auto">
          <TableEscalaInsumo user={user} selectedInsumo={selectedInsumo} />
        </TabsContent>
        <TabsContent value="descuento" className="flex-1 overflow-auto">
          <TableDescuentosInsumo user={user} selectedInsumo={selectedInsumo} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OptionsInsumos;
