import {
  AreasTrabajo,
  Medico,
} from "@/apis/medicos/interfaces/obtener-medicos.interface";
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
import React, { useState } from "react";
import TableHorarios from "./TableHorarios";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CheckCircle, Edit, XCircle } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { ActualizarMedico } from "@/apis/medicos/accions/update-medico";
import dynamic from "next/dynamic";
import TableUsersSkeleton from "@/components/generics/SkeletonTable";
import LoaderComponents from "@/components/generics/LoaderComponents";

interface Props {
  isLoading: boolean;
  isError: boolean;
  veterinarios: Medico[] | undefined;
}

const TableEspecialidadesMedico = dynamic(
  () => import("./TableEspecialidadesMedico"),
  { loading: () => <TableUsersSkeleton /> }
);

const FormVeterinarios = dynamic(() => import("./FormVeterinarios"), {
  loading: () => <LoaderComponents />,
});

const FormHorarios = dynamic(() => import("./FormHorarios"), {
  loading: () => <LoaderComponents />,
});

const TableMedicos = ({ isError, isLoading, veterinarios }: Props) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [medicoId, setmedicoId] = useState("");
  const [isOpen3, setIsOpen3] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isMedico, setisMedico] = useState<Medico | null>(null);
  const [isOpen4, setIsOpen4] = useState(false);
  const [isOpen5, setIsOpen5] = useState(false);
  const [areasMedico, setAreasMedico] = useState<AreasTrabajo[] | []>([]);

  const handleEditActividad = (medico: string, activo: boolean) => {
    setIsOpen(true);
    setmedicoId(medico);
    setIsActive(!activo);
  };

  const viewEspecialidadesMedico = (especialidades: AreasTrabajo[]) => {
    setIsOpen5(true);
    setAreasMedico(especialidades);
  };

  const handleEditMedico = (medico: Medico) => {
    setIsOpen4(true);
    setIsEdit(true);
    setisMedico(medico);
  };

  const handleIsOpen2 = (medicoId: string) => {
    setIsOpen2(true);
    setmedicoId(medicoId);
  };

  const handleEditStatusMedico = async () => {
    try {
      await ActualizarMedico(medicoId, { isActive: isActive });
      toast.success("Estado del medico actualizado con exito");
      queryClient.invalidateQueries({ queryKey: ["medicos"] });
      setIsOpen(false);
      setIsActive(false);
      setmedicoId("");
    } catch (error) {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al actualizar el medico";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de actualizar el medico. Inténtalo de nuevo."
        );
      }
    }
  };
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center font-bold">Nombre</TableHead>
            <TableHead className="text-center font-bold">
              Especialidad
            </TableHead>
            <TableHead className="text-center font-bold">Teléfono</TableHead>
            <TableHead className="text-center font-bold">Experiencia</TableHead>
            <TableHead className="text-center font-bold"># Colegiado</TableHead>
            <TableHead className="text-center font-bold">Formacion</TableHead>
            <TableHead className="text-center font-bold">Activo</TableHead>
            <TableHead className="text-center font-bold">Horarios</TableHead>
            <TableHead className="text-center font-bold">
              Especialidades
            </TableHead>
            <TableHead className="text-center font-bold">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <TableRow key={`skeleton-${index}`}>
                <TableCell>
                  <Skeleton className="h-4 w-12" />
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
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-20" />
                </TableCell>
                <TableCell>
                  <Skeleton className="h-4 w-16" />
                </TableCell>
              </TableRow>
            ))
          ) : isError ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-red-500">
                Error al cargar los veterinarios
              </TableCell>
            </TableRow>
          ) : veterinarios && veterinarios.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                No se encontraron veterinarios
              </TableCell>
            </TableRow>
          ) : (
            veterinarios?.map((medico) => (
              <TableRow key={medico.id}>
                <TableCell className="text-center">
                  {medico.usuario.name}
                </TableCell>
                <TableCell className="text-center">
                  {medico.especialidad}
                </TableCell>
                <TableCell className="text-center">
                  {medico.usuario.telefono}
                </TableCell>
                <TableCell className="text-center">
                  {medico.anios_experiencia} años
                </TableCell>
                <TableCell className="text-center">
                  {medico.numero_colegiado}
                </TableCell>
                <TableCell className="text-center">
                  {medico.universidad_formacion}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      medico.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {medico.isActive ? "Sí" : "No"}
                  </span>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    onClick={() => handleIsOpen2(medico.id)}
                    variant={"link"}
                  >
                    Ver
                  </Button>
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    onClick={() =>
                      viewEspecialidadesMedico(medico.areas_trabajo)
                    }
                    variant={"link"}
                  >
                    Ver
                  </Button>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleEditMedico(medico)}
                          >
                            <Edit className="h-4 w-4 text-blue-500" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Editar Medico</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              handleEditActividad(medico.id, medico.isActive)
                            }
                          >
                            {medico.isActive ? (
                              <XCircle className="h-4 w-4 text-red-500" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            {medico.isActive
                              ? "Desactivar Medico"
                              : "Activar Medico"}
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

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Quieres {isActive ? "Activar" : "Desactivar"} el medico?
            </AlertDialogTitle>
            <AlertDialogDescription>
              En esta seccion podras activar y desactivar los medicos
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleEditStatusMedico}>
              {isActive ? "Activar" : "Desactivar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isOpen2} onOpenChange={setIsOpen2}>
        <AlertDialogContent className="w-full md:max-w-3xl max-h-[600px] overflow-y-auto">
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Horarios del medico</AlertDialogTitle>
            <AlertDialogDescription>
              Seccion para poder observar los horarios del medico
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex justify-end">
            <Button onClick={() => setIsOpen3(true)}>Agregar +</Button>
          </div>
          <div className="rounded-md border">
            <TableHorarios medicoId={medicoId} />
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isOpen3} onOpenChange={setIsOpen3}>
        <AlertDialogContent>
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Agregar Horario</AlertDialogTitle>
            <AlertDialogDescription>
              Complete los datos para agregar un nuevo horario
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="p-4">
            <FormHorarios
              medicoId={medicoId}
              onSuccess={() => setIsOpen3(false)}
            />
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isOpen4} onOpenChange={setIsOpen4}>
        <AlertDialogContent className=" max-h-[600px] overflow-y-auto">
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Editar Medico</AlertDialogTitle>
            <AlertDialogDescription>
              En esta seccion podras editar a los medicos
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="p-4">
            <FormVeterinarios
              onSuccess={() => setIsOpen4(false)}
              medico={isMedico}
              isEdit={isEdit}
            />
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isOpen5} onOpenChange={setIsOpen5}>
        <AlertDialogContent className="w-full md:max-w-3xl max-h-[600px] overflow-y-auto">
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Especialidades del Medico</AlertDialogTitle>
            <AlertDialogDescription>
              En esta seccion podras observar las especialidades del medico
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div>
            <TableEspecialidadesMedico areasMedico={areasMedico} />
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TableMedicos;
