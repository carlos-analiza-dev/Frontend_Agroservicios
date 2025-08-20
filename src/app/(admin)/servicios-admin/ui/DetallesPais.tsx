import {
  PreciosPorPai,
  SubServicio,
} from "@/apis/servicios/interfaces/response-servicios.interface";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import FormAddPrecios from "./FormAddPrecios";
import usePaises from "@/hooks/paises/usePaises";
import { PaisOption } from "@/apis/servicios_precios/interfaces/crear-servicio-precio.interface";

interface Props {
  subServicio: SubServicio;
}

const DetallesPais = ({ subServicio }: Props) => {
  const { data: paisesData, isLoading: isLoadingPaises } = usePaises();
  const paises: PaisOption[] =
    paisesData?.data.map((pais) => ({
      value: pais.id,
      label: pais.nombre,
      simbolo_moneda: pais.simbolo_moneda,
    })) || [];
  const [isOpenPrecios, setIsOpenPrecios] = useState(false);
  const [isEditPrecio, setIsEditPrecio] = useState(false);
  const [editPrecio, setEditPrecio] = useState<PreciosPorPai | null>(null);

  const handleEditPrecio = (precio: PreciosPorPai) => {
    setIsEditPrecio(true);
    setIsOpenPrecios(true);
    setEditPrecio(precio);
  };

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {subServicio.preciosPorPais.map((precio, index) => (
        <div key={index} className="flex items-center gap-1 p-2 border rounded">
          <Badge variant="outline" className="text-xs font-semibold">
            {precio.pais.nombre}
          </Badge>
          <Badge variant="default" className="text-xs">
            {precio.pais.simbolo_moneda}
            {precio.precio}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {precio.cantidadMin}-{precio.cantidadMax} animales
          </Badge>
          <Badge variant="outline" className="text-xs">
            {precio.tiempo}hrs
          </Badge>
          <Button onClick={() => handleEditPrecio(precio)} variant={"link"}>
            Editar
          </Button>
        </div>
      ))}

      {subServicio.preciosPorPais.length === 0 && (
        <span className="text-sm text-muted-foreground">
          Sin precios configurados
        </span>
      )}

      <AlertDialog open={isOpenPrecios} onOpenChange={setIsOpenPrecios}>
        <AlertDialogContent className="w-full md:max-w-xl">
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isEditPrecio ? "Editar Precio" : "Agregar Precio"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isEditPrecio
                ? "Modifica los detalles del precio por país."
                : "Completa los campos para agregar un nuevo precio para este servicio."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <FormAddPrecios
            subServicioId={subServicio.id}
            paises={paises}
            editPrecio={editPrecio}
            onCancel={() => setIsOpenPrecios(false)}
            isEditing={isEditPrecio}
            onSuccess={() => setIsOpenPrecios(false)}
          />
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DetallesPais;
