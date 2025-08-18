import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CrearMedicoInterface } from "@/apis/medicos/interfaces/crear-medico.interface";
import { toast } from "react-toastify";
import useGetVeterinarios from "@/hooks/users/useGetVeterinarios";
import useGetServiciosActivos from "@/hooks/servicios/useGetServiciosActivos";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CrearMedico } from "@/apis/medicos/accions/crear-medico";
import { isAxiosError } from "axios";
import { Medico } from "@/apis/medicos/interfaces/obtener-medicos.interface";
import { ActualizarMedico } from "@/apis/medicos/accions/update-medico";

interface Props {
  medico?: Medico | null;
  isEdit?: boolean;
  onSuccess: () => void;
}
const FormVeterinarios = ({ onSuccess, medico, isEdit }: Props) => {
  const { data: veterinarios } = useGetVeterinarios();
  const { data: categorias } = useGetServiciosActivos();
  const [selectedSubservices, setSelectedSubservices] = useState<string[]>([]);
  const [selectedUsuario, setSelectedUsuario] = useState("");
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CrearMedicoInterface>({
    defaultValues: {
      numero_colegiado: medico?.numero_colegiado,
      especialidad: medico?.especialidad,
      universidad_formacion: medico?.universidad_formacion,
      anios_experiencia: medico?.anios_experiencia,
      isActive: medico?.isActive,

      areas_trabajo: medico?.areas_trabajo.map((area) => area.id),
    },
  });

  useEffect(() => {
    if (medico) {
      reset({
        numero_colegiado: medico.numero_colegiado,
        especialidad: medico.especialidad,
        universidad_formacion: medico.universidad_formacion,
        anios_experiencia: medico.anios_experiencia,

        isActive: medico.isActive,
      });
      setSelectedSubservices(medico.areas_trabajo.map((area) => area.id));
      setSelectedUsuario(medico.usuario.id);
    }
  }, [medico, reset]);

  const createMutation = useMutation({
    mutationFn: (data: CrearMedicoInterface) => CrearMedico(data),
    onSuccess: () => {
      toast.success("Medico creado exitosamente");
      reset();
      setSelectedSubservices([]);
      setSelectedUsuario("");
      queryClient.invalidateQueries({ queryKey: ["medicos"] });
      queryClient.invalidateQueries({ queryKey: ["users-veterinarios"] });
      onSuccess();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al crear el medico";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de crear el medico. Inténtalo de nuevo."
        );
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<CrearMedicoInterface>) =>
      ActualizarMedico(medico?.id ?? "", data),
    onSuccess: () => {
      toast.success("Medico actualizado exitosamente");
      reset();
      setSelectedSubservices([]);
      setSelectedUsuario("");
      queryClient.invalidateQueries({ queryKey: ["medicos"] });
      queryClient.invalidateQueries({ queryKey: ["users-veterinarios"] });
      onSuccess();
    },
    onError: (error) => {
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
          "Hubo un error al momento de crear el actualizar. Inténtalo de nuevo."
        );
      }
    },
  });

  const resetForm = () => {
    reset();
    setSelectedSubservices([]);
    setSelectedUsuario("");
  };

  const onSubmit = (data: CrearMedicoInterface) => {
    if (!isEdit && !selectedUsuario) {
      toast.error("Debes seleccionar un usuario");
      return;
    }

    if (selectedSubservices.length === 0) {
      toast.error("Debes seleccionar al menos un área de trabajo");
      return;
    }

    const medicoData: CrearMedicoInterface = {
      ...data,
      ...(!isEdit && { usuarioId: selectedUsuario }),
      areas_trabajo: selectedSubservices,
    };

    if (isEdit) {
      updateMutation.mutate(medicoData);
    } else {
      createMutation.mutate(medicoData);
    }
  };

  const handleSubserviceToggle = (subserviceId: string) => {
    setSelectedSubservices((prev) => {
      const newSubservices = prev.includes(subserviceId)
        ? prev.filter((id) => id !== subserviceId)
        : [...prev, subserviceId];

      setValue("areas_trabajo", newSubservices);
      return newSubservices;
    });
  };

  const handleUsuarioChange = (value: string) => {
    setSelectedUsuario(value);
    setValue("usuarioId", value);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
      <div className="space-y-2">
        <Label htmlFor="numero_colegiado">Número de Colegiado *</Label>
        <Input
          id="numero_colegiado"
          {...register("numero_colegiado", { required: "Campo obligatorio" })}
        />
        {errors.numero_colegiado && (
          <p className="text-sm text-red-500">
            {errors.numero_colegiado.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="especialidad">Especialidad *</Label>
        <Input
          id="especialidad"
          {...register("especialidad", { required: "Campo obligatorio" })}
        />
        {errors.especialidad && (
          <p className="text-sm text-red-500">{errors.especialidad.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="universidad_formacion">
          Universidad de Formación *
        </Label>
        <Input
          id="universidad_formacion"
          {...register("universidad_formacion", {
            required: "Campo obligatorio",
          })}
        />
        {errors.universidad_formacion && (
          <p className="text-sm text-red-500">
            {errors.universidad_formacion.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="anios_experiencia">Años de Experiencia *</Label>
        <Input
          id="anios_experiencia"
          type="number"
          {...register("anios_experiencia", {
            required: "Campo obligatorio",
            min: { value: 0, message: "Debe ser mayor o igual a 0" },
            valueAsNumber: true,
          })}
        />
        {errors.anios_experiencia && (
          <p className="text-sm text-red-500">
            {errors.anios_experiencia.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Áreas de Trabajo *</Label>
        <div className="border rounded-md p-4 space-y-4">
          <Accordion type="multiple" className="w-full">
            {categorias?.map((categoria) => (
              <AccordionItem value={categoria.id} key={categoria.id}>
                <div className="flex items-center">
                  <Checkbox
                    checked={categoria.subServicios.every((sub) =>
                      selectedSubservices.includes(sub.id)
                    )}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        const newSubs = [
                          ...selectedSubservices,
                          ...categoria.subServicios
                            .map((sub) => sub.id)
                            .filter((id) => !selectedSubservices.includes(id)),
                        ];
                        setSelectedSubservices(newSubs);
                        setValue("areas_trabajo", newSubs);
                      } else {
                        const newSubs = selectedSubservices.filter(
                          (id) =>
                            !categoria.subServicios.some((sub) => sub.id === id)
                        );
                        setSelectedSubservices(newSubs);
                        setValue("areas_trabajo", newSubs);
                      }
                    }}
                    className="mr-2"
                  />
                  <AccordionTrigger className="hover:no-underline flex-1 text-left">
                    {categoria.nombre}
                  </AccordionTrigger>
                </div>
                <AccordionContent className="pl-8 space-y-2">
                  {categoria.subServicios.map((subservicio) => (
                    <div
                      key={subservicio.id}
                      className="flex items-center gap-2"
                    >
                      <Checkbox
                        id={`subservice-${subservicio.id}`}
                        checked={selectedSubservices.includes(subservicio.id)}
                        onCheckedChange={() =>
                          handleSubserviceToggle(subservicio.id)
                        }
                      />
                      <Label
                        htmlFor={`subservice-${subservicio.id}`}
                        className="font-normal"
                      >
                        {subservicio.nombre}
                      </Label>
                    </div>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
        {errors.areas_trabajo && (
          <p className="text-sm text-red-500">{errors.areas_trabajo.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="usuarioId">Usuario *</Label>
        <Select value={selectedUsuario} onValueChange={handleUsuarioChange}>
          <SelectTrigger>
            <SelectValue
              placeholder={
                isEdit ? medico?.usuario.name : "Selecciona un usuario"
              }
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Veterinarios</SelectLabel>
              {veterinarios?.map((vet) => (
                <SelectItem value={vet.id} key={vet.id}>
                  {vet.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.usuarioId && (
          <p className="text-sm text-red-500">{errors.usuarioId.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-4 pt-6">
        {!isEdit && (
          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            disabled={isSubmitting}
          >
            {isEdit ? "Restablecer" : "Limpiar"}
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? isEdit
              ? "Actualizando..."
              : "Registrando..."
            : isEdit
              ? "Actualizar Médico"
              : "Registrar Médico"}
        </Button>
      </div>
    </form>
  );
};

export default FormVeterinarios;
