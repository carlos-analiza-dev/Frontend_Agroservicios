import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import React from "react";
import TableDatosProducto from "./TableDatosProducto";
import TableEscalasProducto from "./TableEscalasProducto";
import { User } from "@/interfaces/auth/user";
import TableDescuentoProductos from "./TableDescuentoProductos";
import { Producto } from "@/apis/productos/interfaces/response-productos.interface";

interface Props {
  user: User | undefined;
  selectedProducto: Producto | null;
}

const OptionsProducto = ({ user, selectedProducto }: Props) => {
  return (
    <div className="h-full w-full">
      <Tabs defaultValue="datos" className="h-full w-full flex flex-col">
        <TabsList className="w-full">
          <TabsTrigger value="datos" className="flex-1">
            Datos
          </TabsTrigger>
          <TabsTrigger value="escala" className="flex-1">
            Escalas
          </TabsTrigger>
          <TabsTrigger value="descuento" className="flex-1">
            Descuentos
          </TabsTrigger>
        </TabsList>
        <TabsContent value="datos" className="flex-1 overflow-auto">
          <TableDatosProducto user={user} selectedProducto={selectedProducto} />
        </TabsContent>
        <TabsContent value="escala" className="flex-1 overflow-auto">
          <TableEscalasProducto
            user={user}
            selectedProducto={selectedProducto}
          />
        </TabsContent>
        <TabsContent value="descuento" className="flex-1 overflow-auto">
          <TableDescuentoProductos
            selectedProducto={selectedProducto}
            user={user}
          />{" "}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default OptionsProducto;
