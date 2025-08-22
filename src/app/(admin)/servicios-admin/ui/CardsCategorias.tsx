import {
  Servicio,
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";
import FormCategorias from "./FormCategorias";
import FormServicios from "./FormServicios";
import FormAddPrecios from "./FormAddPrecios";
import usePaises from "@/hooks/paises/usePaises";
import { PaisOption } from "@/apis/servicios_precios/interfaces/crear-servicio-precio.interface";
import DetallesPais from "./DetallesPais";

interface Props {
  servicios: Servicio[];
}

const CardsCategorias = ({ servicios }: Props) => {
  const [isOpenCategoria, setIsOpenCategoria] = useState(false);
  const [isOpenSubServicio, setIsOpenSubServicio] = useState(false);
  const [isOpenPrecios, setIsOpenPrecios] = useState(false);
  const [editServicio, setEditServicio] = useState<Servicio | null>(null);
  const [editSubServicio, setEditSubServicio] = useState<SubServicio | null>(
    null
  );
  const [editPrecio, setEditPrecio] = useState<any | null>(null);
  const [isEditCategoria, setIsEditCategoria] = useState(false);
  const [isEditSubServicio, setIsEditSubServicio] = useState(false);
  const [isEditPrecio, setIsEditPrecio] = useState(false);
  const [selectedServicioId, setSelectedServicioId] = useState<string>("");
  const [selectedSubServicioId, setSelectedSubServicioId] =
    useState<string>("");
  const [servicioSelected, setServicioSelected] = useState<SubServicio | null>(
    null
  );
  const [selectedCat, setSelectedCat] = useState<Servicio | null>(null);

  const { data: paisesData } = usePaises();
  const paises: PaisOption[] =
    paisesData?.data.map((pais) => ({
      value: pais.id,
      label: pais.nombre,
      simbolo_moneda: pais.simbolo_moneda,
    })) || [];

  const handleEditCategoria = (servicio: Servicio) => {
    setIsEditCategoria(true);
    setIsOpenCategoria(true);
    setEditServicio(servicio);
  };

  const handleAddSubServicio = (servicio: Servicio) => {
    setIsEditSubServicio(false);
    setIsOpenSubServicio(true);
    setSelectedServicioId(servicio.id);
    setSelectedCat(servicio);
    setEditSubServicio(null);
  };

  const handleEditSubServicio = (subServicio: any, servicioId: string) => {
    setIsEditSubServicio(true);
    setIsOpenSubServicio(true);
    setSelectedServicioId(servicioId);
    setEditSubServicio(subServicio);
  };

  const handleAddPrecio = (subServicio: SubServicio) => {
    setIsEditPrecio(false);
    setIsOpenPrecios(true);
    setSelectedSubServicioId(subServicio.id);
    setServicioSelected(subServicio);
    setEditPrecio(null);
  };

  return (
    <div className="space-y-4">
      {servicios.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground py-8">
              No hay categorias ni servicios disponibles
            </div>
          </CardContent>
        </Card>
      ) : (
        servicios.map((servicio) => (
          <Card key={servicio.id} className="w-full overflow-hidden">
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                <div className="flex flex-col xs:flex-row xs:items-center gap-3">
                  <CardTitle className="text-lg sm:text-xl">
                    {servicio.nombre}
                  </CardTitle>
                  <Button
                    onClick={() => handleEditCategoria(servicio)}
                    variant={"outline"}
                    size="sm"
                    className="w-full xs:w-auto"
                  >
                    Editar Categoría
                  </Button>
                </div>
                <Badge
                  variant={servicio.isActive ? "default" : "secondary"}
                  className="self-start sm:self-center"
                >
                  {servicio.isActive ? "Activo" : "Inactivo"}
                </Badge>
              </div>
              <CardDescription className="mt-2">
                {servicio.descripcion}
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 sm:p-6">
              <Separator className="mb-4" />

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
                <h3 className="font-medium text-base sm:text-lg">
                  Servicios de la categoria{" "}
                  <span className="font-bold">{servicio.nombre}</span>:
                </h3>
                <Button
                  onClick={() => handleAddSubServicio(servicio)}
                  size="sm"
                  className="w-full sm:w-auto"
                >
                  Agregar Servicio
                </Button>
              </div>

              <div className="space-y-3 ml-0 sm:ml-2">
                {servicio.subServicios && servicio.subServicios.length > 0 ? (
                  servicio.subServicios.map((subServicio, index) => (
                    <div
                      key={subServicio.id}
                      className="border-l-2 border-r-2 border-t-2 border-b-2 border-primary p-3 sm:pl-3 sm:py-2"
                    >
                      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-3 md:px-4">
                        <div className="flex flex-col xs:flex-row xs:items-center gap-3">
                          <div className="h-6 w-6 text-xs rounded-full bg-black text-white flex justify-center items-center flex-shrink-0 self-start">
                            {index + 1}
                          </div>
                          <div className="font-medium text-sm sm:text-base">
                            {subServicio.nombre}
                          </div>
                          <Button
                            onClick={() => handleAddPrecio(subServicio)}
                            variant={"outline"}
                            size={"sm"}
                            className="w-full xs:w-auto"
                          >
                            Agregar Paquete
                          </Button>
                        </div>
                        <Button
                          variant={"outline"}
                          size={"sm"}
                          onClick={() =>
                            handleEditSubServicio(subServicio, servicio.id)
                          }
                          className="w-full md:w-auto"
                        >
                          Editar Servicio
                        </Button>
                      </div>

                      <p className="text-sm text-muted-foreground mt-2">
                        {subServicio.descripcion}
                      </p>

                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {subServicio.unidad_venta}
                        </Badge>
                        <Badge
                          variant={
                            subServicio.disponible ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          {subServicio.disponible
                            ? "Disponible"
                            : "No disponible"}
                        </Badge>
                      </div>

                      <div className="mt-3">
                        <h1 className="font-bold text-sm sm:text-base">
                          Paquetes por Pais
                        </h1>
                        <DetallesPais subServicio={subServicio} />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground py-6 sm:py-8">
                    No hay servicios disponibles
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      )}

      <AlertDialog open={isOpenCategoria} onOpenChange={setIsOpenCategoria}>
        <AlertDialogContent className="max-w-2xl">
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isEditCategoria ? "Editar Categoría" : "Crear Categoría"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isEditCategoria
                ? "Modifica los detalles de la categoría de servicios."
                : "Completa los campos para crear una nueva categoría de servicios."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <FormCategorias
            onSuccess={() => setIsOpenCategoria(false)}
            editServicio={editServicio}
            isEdit={isEditCategoria}
          />
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isOpenSubServicio} onOpenChange={setIsOpenSubServicio}>
        <AlertDialogContent className="w-full md:max-w-2xl h-[600px] overflow-y-auto">
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {isEditSubServicio
                ? `Editar Servicio - ${editSubServicio?.nombre}
                `
                : `Crear Servicio para ${selectedCat?.nombre}`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isEditSubServicio
                ? "Modifica los detalles del servicio."
                : "Completa los campos para crear un nuevo servicio."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <FormServicios
            servicioId={selectedServicioId}
            onSuccess={() => setIsOpenSubServicio(false)}
            editSubServicio={editSubServicio}
            isEdit={isEditSubServicio}
            isOpen={isOpenSubServicio}
            onOpenChange={setIsOpenSubServicio}
          />
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isOpenPrecios} onOpenChange={setIsOpenPrecios}>
        <AlertDialogContent className="w-full md:max-w-xl">
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Agregar Paquete para {servicioSelected?.nombre}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Completa los campos para agregar un nuevo paquete para este
              servicio.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <FormAddPrecios
            subServicioId={selectedSubServicioId}
            paises={paises}
            onCancel={() => setIsOpenPrecios(false)}
            isEditing={isEditPrecio}
            onSuccess={() => setIsOpenPrecios(false)}
          />
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CardsCategorias;
