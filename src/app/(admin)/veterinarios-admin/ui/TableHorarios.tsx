import { UpdateHorario } from "@/apis/horarios/accions/editar-horario-medico";
import { Horario } from "@/apis/medicos/interfaces/obtener-medicos.interface";
import TableUsersSkeleton from "@/components/generics/SkeletonTable";
import { StatusMessage } from "@/components/generics/StatusMessage";
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
import {
  Table,
  TableBody,
  TableCaption,
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
import { formatTime } from "@/helpers/funciones/formatTime";
import { getDayName } from "@/helpers/funciones/obtenerDias";
import useGetHorariosByMedico from "@/hooks/horarios/useGetHorariosByMedico";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { CheckCircle, Edit, XCircle } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { FormHorarios } from "./FormHorarios";

interface Props {
  medicoId: string;
}

const TableHorarios = ({ medicoId }: Props) => {
  const { data: horarios, isLoading } = useGetHorariosByMedico(medicoId);
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [horarioId, setHorarioId] = useState("");
  const [horario, setHorario] = useState<Horario | null>(null);
  const [isEdit, setIsEdit] = useState(false);

  const handleEditDisponibilidad = (horario: string, activo: boolean) => {
    setIsOpen(true);
    setHorarioId(horario);
    setIsActive(!activo);
  };

  const handleEditHorario = (horario: Horario) => {
    setIsOpen2(true);
    setIsEdit(true);
    setHorario(horario);
  };

  const handleEditStatusHorario = async () => {
    try {
      await UpdateHorario(horarioId, { disponible: isActive });
      toast.success("Estado de horario actualizado con exito");
      queryClient.invalidateQueries({ queryKey: ["horario-medico"] });
      setIsOpen(false);
      setIsActive(false);
      setHorarioId("");
    } catch (error) {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al actualizar el horario";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de actualizar el horario. Inténtalo de nuevo."
        );
      }
    }
  };

  if (isLoading) {
    return <TableUsersSkeleton />;
  }

  if (horarios?.length === 0) {
    <StatusMessage type="error" />;
  }

  return (
    <>
      <Table>
        <TableCaption>Lista de horarios del medico</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center font-bold">Dia</TableHead>
            <TableHead className="text-center font-bold">
              Hora inicial
            </TableHead>
            <TableHead className="text-center font-bold">Hora final</TableHead>
            <TableHead className="text-center font-bold">Disponible</TableHead>
            <TableHead className="text-center font-bold">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {horarios?.map((horario) => (
            <TableRow key={horario.id}>
              <TableCell className="text-center">
                {" "}
                {getDayName(horario.diaSemana)}
              </TableCell>
              <TableCell className="text-center">
                {" "}
                {formatTime(horario.horaInicio)}
              </TableCell>
              <TableCell className="text-center">
                {formatTime(horario.horaFin)}
              </TableCell>
              <TableCell className="text-center">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    horario.disponible
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {horario.disponible ? "Sí" : "No"}
                </span>
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
                          onClick={() => handleEditHorario(horario)}
                        >
                          <Edit className="h-4 w-4 text-blue-500" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Editar Horario</p>
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            handleEditDisponibilidad(
                              horario.id,
                              horario.disponible
                            )
                          }
                        >
                          {horario.disponible ? (
                            <XCircle className="h-4 w-4 text-red-500" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {horario.disponible
                            ? "Desactivar Horario"
                            : "Activar Horario"}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Quieres {isActive ? "Activar" : "Desactivar"} el horario?
            </AlertDialogTitle>
            <AlertDialogDescription>
              En esta seccion podras activar y desactivar los horarios de un
              medico
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleEditStatusHorario}>
              {isActive ? "Activar" : "Desactivar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isOpen2} onOpenChange={setIsOpen2}>
        <AlertDialogContent>
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Quieres editar el horario?</AlertDialogTitle>
            <AlertDialogDescription>
              En esta seccion podras editar el horario de un medico
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="p-4">
            <FormHorarios
              medicoId={medicoId}
              onSuccess={() => setIsOpen2(false)}
              horario={horario}
              isEdit={isEdit}
            />
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TableHorarios;
