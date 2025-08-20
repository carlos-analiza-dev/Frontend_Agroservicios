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

  const { data: paisesData, isLoading: isLoadingPaises } = usePaises();
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

  const handleAddSubServicio = (servicioId: string) => {
    setIsEditSubServicio(false);
    setIsOpenSubServicio(true);
    setSelectedServicioId(servicioId);
    setEditSubServicio(null);
  };

  const handleEditSubServicio = (subServicio: any, servicioId: string) => {
    setIsEditSubServicio(true);
    setIsOpenSubServicio(true);
    setSelectedServicioId(servicioId);
    setEditSubServicio(subServicio);
  };

  const handleAddPrecio = (subServicioId: string) => {
    setIsEditPrecio(false);
    setIsOpenPrecios(true);
    setSelectedSubServicioId(subServicioId);
    setEditPrecio(null);
  };

  return (
    <div className="space-y-4">
      {servicios.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground py-8">
              No hay servicios disponibles
            </div>
          </CardContent>
        </Card>
      ) : (
        servicios.map((servicio) => (
          <Card key={servicio.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-5">
                  <CardTitle className="text-xl">{servicio.nombre}</CardTitle>
                  <Button
                    onClick={() => handleEditCategoria(servicio)}
                    variant={"outline"}
                    size="sm"
                  >
                    Editar Categoría
                  </Button>
                </div>
                <Badge variant={servicio.isActive ? "default" : "secondary"}>
                  {servicio.isActive ? "Activo" : "Inactivo"}
                </Badge>
              </div>
              <CardDescription>{servicio.descripcion}</CardDescription>
            </CardHeader>
            <CardContent>
              <Separator className="mb-4" />
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-medium text-lg">
                  Servicios de la categoria{" "}
                  <span className="font-bold">{servicio.nombre}</span>:
                </h3>
                <Button
                  onClick={() => handleAddSubServicio(servicio.id)}
                  size="sm"
                >
                  Agregar Servicio
                </Button>
              </div>
              <div className="space-y-3 ml-2">
                {servicio.subServicios.map((subServicio) => (
                  <div
                    key={subServicio.id}
                    className="border-l-2 border-primary pl-3 py-2"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex gap-5 items-center">
                        <div className="font-medium">{subServicio.nombre}</div>
                        <Button
                          onClick={() => handleAddPrecio(subServicio.id)}
                          variant={"link"}
                        >
                          Agregar Precio
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleEditSubServicio(subServicio, servicio.id)
                        }
                      >
                        Editar Servicio
                      </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {subServicio.descripcion}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
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
                    <div className="mt-2">
                      <h1 className="font-bold">Paquetes por Pais</h1>
                      <DetallesPais subServicio={subServicio} />
                    </div>
                  </div>
                ))}
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
              {isEditSubServicio ? "Editar Servicio" : "Crear Servicio"}
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
              {isEditPrecio ? "Editar Precio" : "Agregar Precio"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {isEditPrecio
                ? "Modifica los detalles del precio por país."
                : "Completa los campos para agregar un nuevo precio para este servicio."}
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
