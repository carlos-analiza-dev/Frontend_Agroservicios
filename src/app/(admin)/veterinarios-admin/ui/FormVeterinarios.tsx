import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
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

const FormVeterinarios = () => {
  const { data: veterinarios } = useGetVeterinarios();
  const { data: categorias } = useGetServiciosActivos();
  const [selectedSubservices, setSelectedSubservices] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<CrearMedicoInterface>({
    defaultValues: {
      isActive: true,
      areas_trabajo: [],
    },
  });

  const onSubmit = (data: CrearMedicoInterface) => {
    data.areas_trabajo = selectedSubservices;
    toast.success("Los datos del médico han sido guardados correctamente.");
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
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center space-x-2">
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
                              .filter(
                                (id) => !selectedSubservices.includes(id)
                              ),
                          ];
                          setSelectedSubservices(newSubs);
                          setValue("areas_trabajo", newSubs);
                        } else {
                          const newSubs = selectedSubservices.filter(
                            (id) =>
                              !categoria.subServicios.some(
                                (sub) => sub.id === id
                              )
                          );
                          setSelectedSubservices(newSubs);
                          setValue("areas_trabajo", newSubs);
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span>{categoria.nombre}</span>
                  </div>
                </AccordionTrigger>
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
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un veterinario" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Veterinario</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {errors.usuarioId && (
          <p className="text-sm text-red-500">{errors.usuarioId.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-4 pt-6">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            reset();
            setSelectedSubservices([]);
          }}
        >
          Limpiar
        </Button>
        <Button type="submit">Registrar Médico</Button>
      </div>
    </form>
  );
};

export default FormVeterinarios;
