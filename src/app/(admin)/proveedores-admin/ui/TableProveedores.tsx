import {
  Proveedor,
  ResponseProveedores,
} from "@/apis/proveedores/interfaces/response-proveedores.interface";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CheckCircle,
  Edit,
  MoreHorizontal,
  Pencil,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import FormProveedor from "./FormProveedor";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CrearProveedorInterface } from "@/apis/proveedores/interfaces/crear-proveedor.interface";
import { ActualizarProveedor } from "@/apis/proveedores/accions/actualizar-proveedores";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";

interface Props {
  isLoading: boolean;
  data: ResponseProveedores | undefined;
}

const TableProveedores = ({ data, isLoading }: Props) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [editProveedor, setEditProveedor] = useState<Proveedor | null>(null);
  const [proveedorEstado, setProveedorEstado] = useState<Proveedor | null>(
    null
  );
  const [isEdit, setIsEdit] = useState(false);

  const handleEditProveedor = (proveedor: Proveedor) => {
    setIsOpen(true);
    setIsEdit(true);
    setEditProveedor(proveedor);
  };

  const handleCambiarEstado = (proveedor: Proveedor) => {
    setProveedorEstado(proveedor);
    setIsOpen2(true);
  };

  const mutationUpdateEstado = useMutation({
    mutationFn: (data: { is_active: boolean }) =>
      ActualizarProveedor(proveedorEstado?.id ?? "", data),
    onSuccess: () => {
      toast.success(
        `Proveedor ${proveedorEstado?.is_active ? "desactivado" : "activado"} exitosamente`
      );
      queryClient.invalidateQueries({ queryKey: ["proveedores"] });
      setIsOpen2(false);
      setProveedorEstado(null);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al cambiar el estado del proveedor";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de cambiar el estado del proveedor. Inténtalo de nuevo."
        );
      }
      setIsOpen2(false);
      setProveedorEstado(null);
    },
  });

  const cambiarEstado = () => {
    if (proveedorEstado) {
      mutationUpdateEstado.mutate({
        is_active: !proveedorEstado.is_active,
      });
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>NIT/RTN</TableHead>
            <TableHead>NRC</TableHead>
            <TableHead>Nombre Legal</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Ubicación</TableHead>

            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-28" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-24" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
                <TableCell className="text-right">
                  <Skeleton className="h-8 w-8 ml-auto" />
                </TableCell>
              </TableRow>
            ))
          ) : data?.data && data.data.length > 0 ? (
            data.data.map((proveedor) => (
              <TableRow key={proveedor.id}>
                <TableCell className="font-medium">
                  {proveedor.nit_rtn}
                </TableCell>
                <TableCell className="font-medium">{proveedor.nrc}</TableCell>
                <TableCell>{proveedor.nombre_legal}</TableCell>
                <TableCell>{proveedor.nombre_contacto}</TableCell>
                <TableCell>{proveedor.telefono}</TableCell>
                <TableCell>{proveedor.correo}</TableCell>
                <TableCell>
                  {proveedor.pais?.nombre}, {proveedor.municipio.nombre},{" "}
                  {proveedor.departamento.nombre}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={proveedor.is_active ? "default" : "secondary"}
                    className={
                      proveedor.is_active ? "bg-green-500" : "bg-gray-500"
                    }
                  >
                    {proveedor.is_active ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-center items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEditProveedor(proveedor)}
                          >
                            <Edit className="h-4 w-4 text-blue-500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Editar Proveedor</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleCambiarEstado(proveedor)}
                            disabled={mutationUpdateEstado.isPending}
                          >
                            {proveedor.is_active ? (
                              <XCircle className="h-4 w-4 text-red-500" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {proveedor.is_active
                              ? "Desactivar Proveedor"
                              : "Activar Proveedor"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={8} className="text-center h-24">
                No se encontraron proveedores
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="h-[600px] overflow-y-auto">
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Editar Proveedor</AlertDialogTitle>
            <AlertDialogDescription>
              En esta seccion podras editar los proveedores
            </AlertDialogDescription>
          </AlertDialogHeader>
          <FormProveedor
            onSucces={() => setIsOpen(false)}
            editProveedor={editProveedor}
            isEdit={isEdit}
          />
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isOpen2} onOpenChange={setIsOpen2}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {proveedorEstado?.is_active ? "Desactivar" : "Activar"} Proveedor
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que quieres{" "}
              {proveedorEstado?.is_active ? "desactivar" : "activar"} el
              proveedor <strong>{proveedorEstado?.nombre_legal}</strong>?
              {proveedorEstado?.is_active ? (
                <span className="block mt-2 text-yellow-600">
                  ⚠️ El proveedor ya no podrá ser seleccionado en nuevas
                  operaciones.
                </span>
              ) : (
                <span className="block mt-2 text-green-600">
                  ✅ El proveedor estará disponible para ser seleccionado.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              disabled={mutationUpdateEstado.isPending}
              onClick={() => {
                setIsOpen2(false);
                setProveedorEstado(null);
              }}
            >
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={cambiarEstado}
              disabled={mutationUpdateEstado.isPending}
              className={
                proveedorEstado?.is_active
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }
            >
              {mutationUpdateEstado.isPending
                ? "Procesando..."
                : proveedorEstado?.is_active
                  ? "Desactivar"
                  : "Activar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TableProveedores;
