import { ResponseUsers } from "@/apis/users/interfaces/users-response.interface";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle, Edit, ShieldCheck, ShieldX, XCircle } from "lucide-react";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import LoaderComponents from "@/components/generics/LoaderComponents";
import { actualizarUsuario } from "@/apis/users/accions/update-user";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  data: { pages: { data: ResponseUsers | undefined }[]; pageParams: number[] };
  isLoading: boolean;
}

const FormUsers = dynamic(() => import("./FormUsers"), {
  loading: () => <LoaderComponents />,
});

const TableUsers = ({ data, isLoading }: Props) => {
  const queryClient = useQueryClient();
  const [userId, setUserId] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [activo, setActivo] = useState(false);
  const [autorizado, setAutorizado] = useState(false);
  const [open3, setOpen3] = useState(false);

  const handleEditUser = (userId: string) => {
    setUserId(userId);
    setOpen(true);
  };

  const handleToggleActive = async (isActive: boolean) => {
    try {
      await actualizarUsuario(userId, { isActive });
      queryClient.invalidateQueries({ queryKey: ["usuarios-admin"] });
      toast.success("Estado del usuario actualizado");
      setUserId("");
    } catch (error) {
      toast.error(
        "Ocurrio un error al momento de actualizar el estado del usuario"
      );
    }
  };

  const handleActiveUser = (actividad: boolean, usuarioId: string) => {
    setOpen2(true);
    setActivo(actividad);
    setUserId(usuarioId);
  };

  const handleToggleAuthorization = async (isAuthorized: boolean) => {
    try {
      await actualizarUsuario(userId, { isAuthorized });
      queryClient.invalidateQueries({ queryKey: ["usuarios-admin"] });
      toast.success("Estado del usuario actualizado");
      setUserId("");
    } catch (error) {
      toast.error(
        "Ocurrio un error al momento de actualizar el estado del usuario"
      );
    }
  };

  const handleAthorizedUser = (atorizacion: boolean, usuarioId: string) => {
    setOpen3(true);
    setAutorizado(atorizacion);
    setUserId(usuarioId);
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Nombre</TableHead>
            <TableHead className="text-center">Email</TableHead>
            <TableHead className="text-center">Identificación</TableHead>
            <TableHead className="text-center">Dirección</TableHead>
            <TableHead className="text-center">Rol</TableHead>
            <TableHead className="text-center">Activo</TableHead>
            <TableHead className="text-center">Autorizado</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={`skeleton-cell-${i}-${j}`}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : data?.pages?.flatMap((page, i) =>
                page.data?.users?.map((user) => (
                  <TableRow key={`${user.id}-${i}`}>
                    <TableCell className="text-center">{user.name}</TableCell>
                    <TableCell className="text-center">{user.email}</TableCell>
                    <TableCell className="text-center">
                      {user.identificacion}
                    </TableCell>
                    <TableCell className="text-center">
                      {user.direccion}
                    </TableCell>
                    <TableCell className="text-center">
                      {user.role?.name || "Usuario"}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.isActive ? "Sí" : "No"}
                      </span>
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isAuthorized
                            ? "bg-purple-100 text-purple-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {user.isAuthorized ? "Sí" : "No"}
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center items-center gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleEditUser(user.id)}
                              >
                                <Edit className="h-4 w-4 text-blue-500" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Editar Usuario</p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  handleActiveUser(user.isActive, user.id)
                                }
                              >
                                {user.isActive ? (
                                  <XCircle className="h-4 w-4 text-red-500" />
                                ) : (
                                  <CheckCircle className="h-4 w-4 text-green-500" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {user.isActive
                                  ? "Desactivar Usuario"
                                  : "Activar Usuario"}
                              </p>
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  handleAthorizedUser(
                                    user.isAuthorized,
                                    user.id
                                  )
                                }
                              >
                                {user.isAuthorized ? (
                                  <ShieldX className="h-4 w-4 text-yellow-500" />
                                ) : (
                                  <ShieldCheck className="h-4 w-4 text-purple-500" />
                                )}
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>
                                {user.isAuthorized
                                  ? "Revocar autorización"
                                  : "Autorizar usuario"}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
        </TableBody>
      </Table>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent className="w-full md:max-w-3xl h-[600px] overflow-y-auto">
          <div className="flex justify-end">
            <AlertDialogCancel onClick={() => setOpen(false)}>
              X
            </AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Editar Usuario</AlertDialogTitle>
            <AlertDialogDescription>
              Aquí puedes editar los datos del usuario
            </AlertDialogDescription>
          </AlertDialogHeader>

          <FormUsers
            userId={userId}
            onSuccess={() => {
              setOpen(false);
            }}
          />
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={open2} onOpenChange={setOpen2}>
        <AlertDialogContent>
          <div className="flex justify-end">
            <AlertDialogCancel onClick={() => setOpen2(false)}>
              X
            </AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Editar Actividad Usuario</AlertDialogTitle>
            <AlertDialogDescription>
              Aquí puedes editar el estado activo del usuario
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogAction onClick={() => handleToggleActive(!activo)}>
              {!activo ? "Activar" : "Desactivar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={open3} onOpenChange={setOpen3}>
        <AlertDialogContent>
          <div className="flex justify-end">
            <AlertDialogCancel onClick={() => setOpen3(false)}>
              X
            </AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Editar Autorizacion Usuario</AlertDialogTitle>
            <AlertDialogDescription>
              Aquí puedes editar el estado de autorizacion del usuario
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => handleToggleAuthorization(!autorizado)}
            >
              {!autorizado ? "Autorizar" : "Desautorizar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TableUsers;
