import { Servicio } from "@/apis/productos/interfaces/response-productos.interface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { MoreHorizontal, Eye, Edit, Package } from "lucide-react";
import React from "react";

interface Props {
  productos: Servicio[];
}

const TableProducts = ({ productos }: Props) => {
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
        <>
          <div className="hidden md:block rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center font-bold">
                    Producto
                  </TableHead>
                  <TableHead className="text-center font-bold">
                    Código
                  </TableHead>

                  <TableHead className="text-center font-bold">
                    Unidad
                  </TableHead>
                  <TableHead className="text-center font-bold">
                    Estado
                  </TableHead>
                  <TableHead className="text-center font-bold">
                    Disponible
                  </TableHead>
                  <TableHead className="text-center font-bold">
                    Precios
                  </TableHead>
                  <TableHead className="text-center font-bold">
                    Acciones
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productos.map((producto) => (
                  <TableRow key={producto.id}>
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-semibold">{producto.nombre}</div>
                        <div className="text-sm text-muted-foreground line-clamp-1">
                          {producto.descripcion || "Sin descripción"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {producto.codigo}
                    </TableCell>

                    <TableCell className="text-center">
                      <Badge variant="outline">{producto.unidad_venta}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <Badge
                          variant={producto.isActive ? "default" : "secondary"}
                          className="w-fit"
                        >
                          {producto.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <Badge
                          variant={
                            producto.disponible ? "default" : "secondary"
                          }
                          className="w-fit"
                        >
                          {producto.disponible ? "Si" : "No"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="flex justify-center">
                      <Button variant={"link"}>Ver</Button>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex justify-center gap-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="space-y-4 md:hidden">
            {productos.map((producto) => (
              <Card key={producto.id}>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">
                          {producto.nombre}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Código: {producto.codigo}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
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
                            <Package className="h-4 w-4 mr-2" />
                            Gestionar Inventario
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      {producto.descripcion || "Sin descripción"}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{producto.tipo}</Badge>
                      <Badge variant="outline">{producto.unidad_venta}</Badge>
                      <Badge
                        variant={producto.isActive ? "default" : "secondary"}
                      >
                        {producto.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                      <Badge
                        variant={producto.disponible ? "default" : "secondary"}
                      >
                        {producto.disponible ? "Disponible" : "No disponible"}
                      </Badge>
                    </div>

                    <div>
                      <h4 className="font-medium text-sm mb-2">Precios</h4>
                      <div className="flex flex-wrap gap-2">
                        {producto.preciosPorPais.map((precio, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {precio.pais.simbolo_moneda} {precio.precio} -{" "}
                            {precio.pais.nombre}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TableProducts;
