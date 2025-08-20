import { Servicio } from "@/apis/productos/interfaces/response-productos.interface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";

interface Props {
  productos: Servicio[];
}

const CardProducts = ({ productos }: Props) => {
  return (
    <div className="space-y-4">
      {productos.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground py-8">
              No hay productos disponibles
            </div>
          </CardContent>
        </Card>
      ) : (
        productos.map((producto) => (
          <Card key={producto.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-xl">{producto.nombre}</CardTitle>
                  <CardDescription>Código: {producto.codigo}</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Badge variant={producto.isActive ? "default" : "secondary"}>
                    {producto.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                  <Badge
                    variant={producto.disponible ? "default" : "secondary"}
                  >
                    {producto.disponible ? "Disponible" : "No disponible"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {producto.descripcion || "Sin descripción"}
                </p>

                <div className="flex items-center gap-2">
                  <Badge variant="outline">{producto.tipo}</Badge>
                  <Badge variant="outline">{producto.unidad_venta}</Badge>
                  {producto.servicio && (
                    <Badge variant="secondary">
                      Categoría: {producto.nombre}
                    </Badge>
                  )}
                </div>

                <div>
                  <h4 className="font-medium text-sm mb-2">Precios</h4>
                  <div className="flex flex-wrap gap-2">
                    {producto.preciosPorPais.map((precio, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {precio.pais.simbolo_moneda} {precio.precio} -{" "}
                        {precio.pais.nombre}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                  <Button variant="outline" size="sm">
                    Gestionar Inventario
                  </Button>
                  <Button variant="outline" size="sm">
                    Ver Detalles
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};

export default CardProducts;
