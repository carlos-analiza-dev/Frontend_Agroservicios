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
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-2">
        {subServicio.preciosPorPais.map((precio, index) => (
          <div
            key={index}
            className="flex flex-col p-3 border rounded-lg bg-card"
          >
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs font-semibold">
                {precio.pais.nombre}
              </Badge>
              <Badge variant="default" className="text-xs">
                {precio.pais.simbolo_moneda}
                {precio.precio}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {precio.cantidadMin}-{precio.cantidadMax} animales
              </Badge>
              <Badge variant="outline" className="text-xs">
                {precio.tiempo}hrs
              </Badge>
            </div>

            <Button
              onClick={() => handleEditPrecio(precio)}
              variant={"outline"}
              size="sm"
              className="w-full sm:w-auto"
            >
              Editar
            </Button>
          </div>
        ))}
      </div>

      {subServicio.preciosPorPais.length === 0 && (
        <div className="flex justify-center py-6">
          <span className="text-sm text-muted-foreground">
            Sin precios configurados
          </span>
        </div>
      )}

      <AlertDialog open={isOpenPrecios} onOpenChange={setIsOpenPrecios}>
        <AlertDialogContent className="w-[95vw] max-w-xl mx-auto max-h-[90vh] overflow-y-auto">
          <div className="flex justify-end sticky top-0 bg-background py-2 z-10">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader className="px-1 sm:px-4">
            <AlertDialogTitle>
              Editar Paquete para {subServicio.nombre}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Modifica los detalles del paquete por país.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="px-1 sm:px-4 pb-4">
            <FormAddPrecios
              subServicioId={subServicio.id}
              paises={paises}
              editPrecio={editPrecio}
              onCancel={() => setIsOpenPrecios(false)}
              isEditing={isEditPrecio}
              onSuccess={() => setIsOpenPrecios(false)}
            />
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DetallesPais;
