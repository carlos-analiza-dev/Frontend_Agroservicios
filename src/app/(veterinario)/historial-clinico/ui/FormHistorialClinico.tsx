"use client";
import useGetAnimalesByCita from "@/hooks/citas/useGetAnimalesByCita";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useState, useMemo, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import useGetCitasCompletadas from "@/hooks/citas/useGetCitasCompletadas";
import { CrearHistorial } from "@/apis/historial-clinico/accions/crear-historial-clinico";
import { CrearHistorialInterface } from "@/apis/historial-clinico/interface/crear-historial.interface";
import { Historial } from "@/apis/historial-clinico/interface/response-historial-veterinario.interface";
import { ActualizarHistorial } from "@/apis/historial-clinico/accions/editar-historial-clinico";

interface Props {
  onSucces: () => void;
  historialEdit?: Historial;
  isEdit?: boolean;
}

const FormHistorialClinico = ({
  onSucces,
  historialEdit,
  isEdit = false,
}: Props) => {
  const { user } = useAuthStore();
  const veterinario_id = user?.id || "";
  const queryClient = useQueryClient();
  const { data: citasCompletadasData } = useGetCitasCompletadas(veterinario_id);
  const [citaId, setCitaId] = useState<string>(historialEdit?.cita?.id || "");
  const { data: animales_cita } = useGetAnimalesByCita(citaId);
  const [busquedaCita, setBusquedaCita] = useState("");
  const [busquedaAnimal, setBusquedaAnimal] = useState("");

  const citas_completadas = citasCompletadasData?.citas || [];

  const citasFiltradas = useMemo(() => {
    if (!busquedaCita) return citas_completadas;
    return citas_completadas.filter(
      (cita) =>
        cita.codigo.toLowerCase().includes(busquedaCita.toLowerCase()) ||
        cita.subServicio.nombre
          .toLowerCase()
          .includes(busquedaCita.toLowerCase()) ||
        cita.finca.nombre_finca
          .toLowerCase()
          .includes(busquedaCita.toLowerCase())
    );
  }, [citas_completadas, busquedaCita]);

  const animalesFiltrados = useMemo(() => {
    if (!busquedaAnimal || !animales_cita) return animales_cita || [];
    return animales_cita.filter(
      (animal) =>
        animal.identificador
          .toLowerCase()
          .includes(busquedaAnimal.toLowerCase()) ||
        animal.especie.nombre
          .toLowerCase()
          .includes(busquedaAnimal.toLowerCase()) ||
        animal.razas.some((raza) =>
          raza.nombre.toLowerCase().includes(busquedaAnimal.toLowerCase())
        )
    );
  }, [animales_cita, busquedaAnimal]);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<CrearHistorialInterface>({
    defaultValues: {
      resumen: historialEdit?.resumen || "",
      detalles: historialEdit?.detalles?.map((detalle) => ({
        subServicioId: detalle.subServicio.id,
        diagnostico: detalle.diagnostico || "",
        tratamiento: detalle.tratamiento || "",
        observaciones: detalle.observaciones || "",
      })) || [
        {
          subServicioId: "",
          diagnostico: "",
          tratamiento: "",
          observaciones: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "detalles",
  });

  const citaSeleccionada = isEdit
    ? historialEdit?.cita
    : citas_completadas.find((cita) => cita.id === citaId);
  const animalIdSeleccionado = watch("animalId");
  const animalSeleccionado = isEdit
    ? historialEdit?.animal
    : animales_cita?.find((animal) => animal.id === animalIdSeleccionado);

  useEffect(() => {
    if (!isEdit && citaSeleccionada && fields.length > 0) {
      fields.forEach((_, index) => {
        setValue(
          `detalles.${index}.subServicioId`,
          citaSeleccionada.subServicio.id
        );
      });
    }
  }, [isEdit, citaSeleccionada, fields.length, setValue]);

  useEffect(() => {
    if (isEdit && historialEdit) {
      setValue("resumen", historialEdit.resumen || "");
      setValue("animalId", historialEdit.animal.id);
      setValue("citaId", historialEdit.cita.id);

      if (historialEdit.detalles && historialEdit.detalles.length > 0) {
        historialEdit.detalles.forEach((detalle, index) => {
          setValue(`detalles.${index}.subServicioId`, detalle.subServicio.id);
          setValue(`detalles.${index}.diagnostico`, detalle.diagnostico || "");
          setValue(`detalles.${index}.tratamiento`, detalle.tratamiento || "");
          setValue(
            `detalles.${index}.observaciones`,
            detalle.observaciones || ""
          );
        });
      }
    }
  }, [isEdit, historialEdit, setValue]);

  const mutationCrear = useMutation({
    mutationFn: async (data: CrearHistorialInterface) => {
      await CrearHistorial(data);
    },
    onSuccess: () => {
      toast.success("Historial clínico creado exitosamente");
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["historial-clinico"] });
      onSucces();
    },
    onError: (error) => {
      handleError(error, "crear");
    },
  });

  const mutationActualizar = useMutation({
    mutationFn: async (data: Partial<CrearHistorialInterface>) => {
      if (!historialEdit) throw new Error("No hay historial para editar");
      await ActualizarHistorial(historialEdit.id, data);
    },
    onSuccess: () => {
      toast.success("Historial clínico actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["historial-clinico"] });
      onSucces();
    },
    onError: (error) => {
      handleError(error, "actualizar");
    },
  });

  const handleError = (error: unknown, action: string) => {
    if (isAxiosError(error)) {
      const messages = error.response?.data?.message;
      const errorMessage = Array.isArray(messages)
        ? messages[0]
        : typeof messages === "string"
          ? messages
          : `Hubo un error al ${action} el historial clínico`;
      toast.error(errorMessage);
    } else {
      toast.error(
        `Hubo un error al ${action} el historial clínico. Inténtalo de nuevo.`
      );
    }
  };

  const resetForm = () => {
    reset();
    setCitaId("");
    setBusquedaCita("");
    setBusquedaAnimal("");
  };

  const onSubmit = (data: CrearHistorialInterface) => {
    if (isEdit) {
      mutationActualizar.mutate(data);
    } else {
      mutationCrear.mutate(data as CrearHistorialInterface);
    }
  };

  const handleSeleccionarCita = (citaId: string) => {
    setCitaId(citaId);
    setValue("citaId", citaId);
    setValue("animalId", "");
    setBusquedaCita("");
    setBusquedaAnimal("");
  };

  const handleSeleccionarAnimal = (animalId: string) => {
    setValue("animalId", animalId);
    setBusquedaAnimal("");
  };

  const handleLimpiarCita = () => {
    setCitaId("");
    setValue("citaId", "");
    setValue("animalId", "");
    setBusquedaCita("");
    setBusquedaAnimal("");
    if (!isEdit) {
      fields.forEach((_, index) => {
        setValue(`detalles.${index}.subServicioId`, "");
      });
    }
  };

  const handleLimpiarAnimal = () => {
    setValue("animalId", "");
    setBusquedaAnimal("");
  };

  const agregarDetalle = () => {
    const subServicioId = isEdit
      ? historialEdit?.detalles[0]?.subServicio.id || ""
      : citaSeleccionada?.subServicio.id || "";

    append({
      subServicioId,
      diagnostico: "",
      tratamiento: "",
      observaciones: "",
    });
  };

  const isSubmitting = mutationCrear.isPending || mutationActualizar.isPending;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          {isEdit ? "Editar Historial Clínico" : "Crear Historial Clínico"}
        </CardTitle>
        <CardDescription>
          {isEdit
            ? "Actualice la información del historial clínico"
            : "Complete la información del historial clínico basado en las citas completadas"}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {!isEdit && (
            <>
              <div className="space-y-3">
                <Label htmlFor="busquedaCita">Buscar Cita por Código *</Label>
                <div className="space-y-2">
                  <Input
                    id="busquedaCita"
                    placeholder="Buscar por código de cita, servicio o finca..."
                    value={busquedaCita}
                    onChange={(e) => setBusquedaCita(e.target.value)}
                    className="w-full"
                  />

                  {busquedaCita && citasFiltradas.length > 0 && (
                    <Card className="max-h-60 overflow-y-auto">
                      <CardContent className="p-3">
                        <div className="space-y-2">
                          {citasFiltradas.map((cita) => (
                            <div
                              key={cita.id}
                              className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                              onClick={() => handleSeleccionarCita(cita.id)}
                            >
                              <div className="flex justify-between items-start">
                                <div className="flex-1">
                                  <p className="font-semibold text-sm">
                                    {cita.codigo}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    {cita.subServicio.nombre} - {cita.fecha}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {cita.finca.nombre_finca}
                                  </p>
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  {cita.estado}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {busquedaCita && citasFiltradas.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No se encontraron citas que coincidan con la búsqueda
                    </p>
                  )}
                </div>

                {citaSeleccionada && (
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-800"
                            >
                              Cita seleccionada
                            </Badge>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={handleLimpiarCita}
                              className="h-6 px-2 text-xs text-muted-foreground"
                            >
                              Cambiar
                            </Button>
                          </div>
                          <p className="font-semibold">
                            {citaSeleccionada.codigo}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {citaSeleccionada.subServicio.nombre} -{" "}
                            {citaSeleccionada.fecha}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {citaSeleccionada.finca.nombre_finca}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {errors.citaId && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.citaId.message}
                  </p>
                )}
                <input
                  type="hidden"
                  {...register("citaId", {
                    required: !isEdit ? "La cita es requerida" : false,
                  })}
                />
              </div>

              {citaSeleccionada && (
                <Card className="bg-muted/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      Información de la Cita
                      <Badge variant="secondary">
                        {citaSeleccionada.estado}
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <Label className="text-muted-foreground">
                          Fecha y Hora
                        </Label>
                        <p>
                          {citaSeleccionada.fecha} -{" "}
                          {citaSeleccionada.horaInicio} a{" "}
                          {citaSeleccionada.horaFin}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">
                          Servicio
                        </Label>
                        <p>{citaSeleccionada.subServicio.nombre}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Finca</Label>
                        <p>{citaSeleccionada.finca.nombre_finca}</p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">
                          Ubicación
                        </Label>
                        <p>{citaSeleccionada.finca.ubicacion}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {citaId && (
                <div className="space-y-3">
                  <Label htmlFor="busquedaAnimal">
                    Buscar Animal por Identificador *
                  </Label>
                  <div className="space-y-2">
                    <Input
                      id="busquedaAnimal"
                      placeholder="Buscar por identificador, especie o raza..."
                      value={busquedaAnimal}
                      onChange={(e) => setBusquedaAnimal(e.target.value)}
                      className="w-full"
                    />

                    {busquedaAnimal &&
                      animalesFiltrados &&
                      animalesFiltrados.length > 0 && (
                        <Card className="max-h-60 overflow-y-auto">
                          <CardContent className="p-3">
                            <div className="space-y-2">
                              {animalesFiltrados.map((animal) => (
                                <div
                                  key={animal.id}
                                  className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                                  onClick={() =>
                                    handleSeleccionarAnimal(animal.id)
                                  }
                                >
                                  <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                      <p className="font-semibold text-sm">
                                        {animal.identificador}
                                      </p>
                                      <p className="text-sm text-muted-foreground">
                                        {animal.especie.nombre} -{" "}
                                        {animal.razas
                                          .map((r) => r.nombre)
                                          .join(", ")}
                                      </p>
                                      <p className="text-xs text-muted-foreground">
                                        {animal.sexo} - {animal.edad_promedio}{" "}
                                        años
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                    {busquedaAnimal &&
                      animalesFiltrados &&
                      animalesFiltrados.length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No se encontraron animales que coincidan con la
                          búsqueda
                        </p>
                      )}
                  </div>

                  {animalSeleccionado && (
                    <Card className="bg-green-50 border-green-200">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant="secondary"
                                className="bg-green-100 text-green-800"
                              >
                                Animal seleccionado
                              </Badge>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleLimpiarAnimal}
                                className="h-6 px-2 text-xs text-muted-foreground"
                              >
                                Cambiar
                              </Button>
                            </div>
                            <p className="font-semibold">
                              {animalSeleccionado.identificador}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {animalSeleccionado.especie.nombre} -{" "}
                              {animalSeleccionado.razas
                                .map((r) => r.nombre)
                                .join(", ")}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {errors.animalId && (
                    <p className="text-sm font-medium text-destructive">
                      {errors.animalId.message}
                    </p>
                  )}
                  <input
                    type="hidden"
                    {...register("animalId", {
                      required: !isEdit ? "El animal es requerido" : false,
                    })}
                  />
                </div>
              )}
            </>
          )}

          {animalSeleccionado && (
            <Card className="bg-muted/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">
                  Información del Animal{" "}
                  {isEdit && <Badge variant="outline">Editando</Badge>}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <Label className="text-muted-foreground">
                      Identificador
                    </Label>
                    <p className="font-medium">
                      {animalSeleccionado.identificador}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">
                      Especie/Raza
                    </Label>
                    <p>
                      {animalSeleccionado.especie.nombre} -{" "}
                      {animalSeleccionado.razas.map((r) => r.nombre).join(", ")}
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Sexo/Edad</Label>
                    <p>
                      {animalSeleccionado.sexo} -{" "}
                      {animalSeleccionado.edad_promedio} años
                    </p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Propietario</Label>
                    <p>{animalSeleccionado.propietario.nombre}</p>
                  </div>
                  <div className="md:col-span-2">
                    <Label className="text-muted-foreground">Color</Label>
                    <p>{animalSeleccionado.color}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Separator />

          <div className="space-y-2">
            <Label htmlFor="resumen">Resumen del Historial *</Label>
            <Textarea
              {...register("resumen", { required: "El resumen es requerido" })}
              placeholder="Proporcione un resumen general del historial clínico, incluyendo el motivo de la consulta y hallazgos principales..."
              className="min-h-[100px]"
            />
            {errors.resumen && (
              <p className="text-sm font-medium text-destructive">
                {errors.resumen.message}
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <Label className="text-lg">Detalles del Servicio</Label>
                <p className="text-sm text-muted-foreground">
                  Especifique los diagnósticos y tratamientos aplicados
                </p>
              </div>
              <Button
                type="button"
                onClick={agregarDetalle}
                variant="outline"
                size="sm"
                disabled={!isEdit && !citaSeleccionada}
              >
                Agregar Detalle
              </Button>
            </div>

            {fields.map((field, index) => (
              <Card key={field.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-base flex items-center gap-2">
                      Detalle #{index + 1}
                      {citaSeleccionada && (
                        <Badge variant="outline">
                          {isEdit
                            ? historialEdit?.detalles[index]?.subServicio.nombre
                            : citaSeleccionada.subServicio.nombre}
                        </Badge>
                      )}
                    </CardTitle>
                    {fields.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => remove(index)}
                        variant="destructive"
                        size="sm"
                      >
                        Eliminar
                      </Button>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <input
                    type="hidden"
                    {...register(`detalles.${index}.subServicioId` as const)}
                  />

                  <div className="space-y-2">
                    <Label htmlFor={`detalles.${index}.diagnostico`}>
                      Diagnóstico *
                    </Label>
                    <Textarea
                      {...register(`detalles.${index}.diagnostico` as const, {
                        required: "El diagnóstico es requerido",
                      })}
                      placeholder="Describa el diagnóstico encontrado..."
                      className="min-h-[80px]"
                    />
                    {errors.detalles?.[index]?.diagnostico && (
                      <p className="text-sm font-medium text-destructive">
                        {errors.detalles[index]?.diagnostico?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`detalles.${index}.tratamiento`}>
                      Tratamiento *
                    </Label>
                    <Textarea
                      {...register(`detalles.${index}.tratamiento` as const, {
                        required: "El tratamiento es requerido",
                      })}
                      placeholder="Describa el tratamiento aplicado..."
                      className="min-h-[80px]"
                    />
                    {errors.detalles?.[index]?.tratamiento && (
                      <p className="text-sm font-medium text-destructive">
                        {errors.detalles[index]?.tratamiento?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`detalles.${index}.observaciones`}>
                      Observaciones
                    </Label>
                    <Textarea
                      {...register(`detalles.${index}.observaciones` as const)}
                      placeholder="Observaciones adicionales, recomendaciones, etc..."
                      className="min-h-[60px]"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-end pt-4 gap-3">
            {isEdit && (
              <Button
                type="button"
                variant="outline"
                onClick={onSucces}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
            )}
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="min-w-[200px]"
            >
              {isSubmitting
                ? isEdit
                  ? "Actualizando..."
                  : "Creando Historial..."
                : isEdit
                  ? "Actualizar Historial Clínico"
                  : "Crear Historial Clínico"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FormHistorialClinico;
