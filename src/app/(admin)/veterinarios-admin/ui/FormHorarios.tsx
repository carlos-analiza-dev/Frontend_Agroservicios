import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CrearHorario } from "@/apis/horarios/accions/creae-horario-medico";

import { diasSemana } from "@/helpers/data/diasSemana";
import { Horario } from "@/apis/medicos/interfaces/obtener-medicos.interface";
import { UpdateHorario } from "@/apis/horarios/accions/editar-horario-medico";
import { CrearHoarioInterface } from "@/apis/horarios/interface/crear-horario.interface";

interface FormHorariosProps {
  medicoId: string;
  onSuccess: () => void;
  horario?: Horario | null;
  isEdit?: boolean;
}

export function FormHorarios({
  medicoId,
  onSuccess,
  horario,
  isEdit = false,
}: FormHorariosProps) {
  const queryClient = useQueryClient();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CrearHoarioInterface>();

  const [selectedDia, setSelectedDia] = useState(
    horario?.diaSemana.toString() || "0"
  );

  useEffect(() => {
    if (horario) {
      const formatHora = (hora: string) => hora.slice(0, 5);

      setValue("diaSemana", horario.diaSemana);
      setValue("horaInicio", formatHora(horario.horaInicio));
      setValue("horaFin", formatHora(horario.horaFin));
      setValue("disponible", horario.disponible);
      setSelectedDia(horario.diaSemana.toString());
    }
  }, [horario, setValue]);

  const createMutation = useMutation({
    mutationFn: (data: CrearHoarioInterface) =>
      CrearHorario({
        medicoId,
        diaSemana: Number(selectedDia),
        horaInicio: data.horaInicio,
        horaFin: data.horaFin,
        disponible: data.disponible,
      }),
    onSuccess: () => {
      toast.success("Horario agregado correctamente");
      queryClient.invalidateQueries({ queryKey: ["horario-medico", medicoId] });
      reset();
      onSuccess();
    },
    onError: (error) => {
      handleError(error, "agregar");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<CrearHoarioInterface>) =>
      UpdateHorario(horario?.id || "", {
        diaSemana: Number(selectedDia),
        horaInicio: data.horaInicio,
        horaFin: data.horaFin,
        disponible: data.disponible,
      }),
    onSuccess: () => {
      toast.success("Horario actualizado correctamente");
      queryClient.invalidateQueries({ queryKey: ["horario-medico", medicoId] });
      onSuccess();
    },
    onError: (error) => {
      handleError(error, "actualizar");
    },
  });

  const handleError = (error: any, action: string) => {
    if (isAxiosError(error)) {
      const messages = error.response?.data?.message;
      const errorMessage = Array.isArray(messages)
        ? messages[0]
        : typeof messages === "string"
          ? messages
          : `Hubo un error al ${action} el horario`;

      toast.error(errorMessage);
    } else {
      toast.error(`Error al ${action} el horario`);
    }
  };

  const onSubmit = (data: CrearHoarioInterface) => {
    if (data.horaInicio >= data.horaFin) {
      toast.error("La hora de fin debe ser mayor a la hora de inicio");
      return;
    }

    if (isEdit) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="diaSemana">Día de la semana *</Label>
        <Select
          value={selectedDia}
          onValueChange={(value) => {
            setSelectedDia(value);
            setValue("diaSemana", Number(value));
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un día" />
          </SelectTrigger>
          <SelectContent>
            {diasSemana.map((dia) => (
              <SelectItem key={dia.id} value={dia.id.toString()}>
                {dia.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="horaInicio">Hora de inicio *</Label>
          <Input
            id="horaInicio"
            type="time"
            {...register("horaInicio", { required: "Campo obligatorio" })}
          />
          {errors.horaInicio && (
            <p className="text-sm text-red-500">{errors.horaInicio.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="horaFin">Hora de fin *</Label>
          <Input
            id="horaFin"
            type="time"
            {...register("horaFin", { required: "Campo obligatorio" })}
          />
          {errors.horaFin && (
            <p className="text-sm text-red-500">{errors.horaFin.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="disponible">Disponible</Label>
        <div className="flex items-center gap-2">
          <input
            id="disponible"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            {...register("disponible")}
          />
          <span>Marcar como disponible</span>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => reset()}
          disabled={isSubmitting}
        >
          Limpiar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? isEdit
              ? "Actualizando..."
              : "Agregando..."
            : isEdit
              ? "Actualizar Horario"
              : "Agregar Horario"}
        </Button>
      </div>
    </form>
  );
}
