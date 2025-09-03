import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Package,
  DollarSign,
  Tag,
  Box,
  Barcode,
  Percent,
  Building,
  Package2,
  Calendar,
} from "lucide-react";
import React from "react";
import { Producto } from "@/apis/productos/interfaces/response-productos.interface";

interface Props {
  productos: Producto[];
}

const CardProducts = ({ productos }: Props) => {
  return (
    <div className="space-y-4">
      {productos.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground py-8">
              <Package2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No hay productos disponibles</p>
              <p className="text-sm mt-2">
                Comienza agregando tu primer producto
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {productos.map((producto) => (
            <Card
              key={producto.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg leading-tight">
                      {producto.nombre}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {producto.codigo}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {producto.unidad_venta}
                      </Badge>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <DollarSign className="h-4 w-4 mr-2" />
                        Gestionar Precios
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Package className="h-4 w-4 mr-2" />
                        Gestionar Inventario
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Box className="h-3 w-3 text-muted-foreground" />
                    <span className="font-medium">Marca:</span>
                    <span className="text-muted-foreground ml-1 truncate">
                      {producto.marca?.nombre || "N/A"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <Tag className="h-3 w-3 text-muted-foreground" />
                    <span className="font-medium">Categoría:</span>
                    <span className="text-muted-foreground ml-1 truncate">
                      {producto.categoria?.nombre || "N/A"}
                    </span>
                  </div>

                  {producto.proveedor && (
                    <div className="flex items-center gap-1 col-span-2">
                      <Building className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">Proveedor:</span>
                      <span className="text-muted-foreground ml-1 truncate">
                        {producto.proveedor.nombre_legal}
                      </span>
                    </div>
                  )}

                  {producto.codigo_barra && (
                    <div className="flex items-center gap-1 col-span-2">
                      <Barcode className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">Cód. Barras:</span>
                      <span className="text-muted-foreground ml-1 font-mono">
                        {producto.codigo_barra}
                      </span>
                    </div>
                  )}

                  {producto.tax?.porcentaje && (
                    <div className="flex items-center gap-1">
                      <Percent className="h-3 w-3 text-muted-foreground" />
                      <span className="font-medium">Impuesto:</span>
                      <span className="text-muted-foreground ml-1">
                        {Number(producto.tax.porcentaje) * 100}%
                      </span>
                    </div>
                  )}
                </div>

                <div className="mb-3">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    <h4 className="font-medium text-sm">Precios</h4>
                  </div>

                  {producto.preciosPorPais &&
                  producto.preciosPorPais.length > 0 ? (
                    <div className="space-y-2">
                      {producto.preciosPorPais.map((precio, index) => (
                        <div key={index} className="bg-muted p-2 rounded-md">
                          <div className="flex justify-between items-center mb-1">
                            <span className="font-semibold text-green-600 text-sm">
                              {precio.pais.simbolo_moneda} {precio.precio}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {precio.pais.nombre}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Costo: {precio.pais.simbolo_moneda} {precio.costo}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-orange-600 text-xs"
                    >
                      Sin precios configurados
                    </Badge>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge
                    variant={producto.isActive ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {producto.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                  <Badge
                    variant={producto.disponible ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {producto.disponible ? "Disponible" : "No disponible"}
                  </Badge>
                </div>

                {producto.atributos && (
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <h4 className="font-medium text-sm">Atributos</h4>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {producto.atributos}
                    </p>
                  </div>
                )}

                <div className="flex items-center gap-1 text-xs text-muted-foreground pt-2 border-t">
                  <Calendar className="h-3 w-3" />
                  <span>
                    Creado: {new Date(producto.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex gap-2 mt-3 pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                  >
                    <Edit className="h-3 w-3 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 text-xs"
                  >
                    <DollarSign className="h-3 w-3 mr-1" />
                    Precios
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default CardProducts;
