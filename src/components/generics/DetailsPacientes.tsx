import { Animale } from "@/apis/medicos/interfaces/obtener-citas-medicos.interface";
import {
  PawPrintIcon,
  Calendar,
  User,
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
  Filter,
  X,
} from "lucide-react";
import React, { useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import useGetHistorialAnimal from "@/hooks/historial-clinico/useGetHistorialAnimal";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface Props {
  animal: Animale;
}

const DetailsPacientes = ({ animal }: Props) => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [limit] = useState(5);
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");

  const { data: historial_animal, isLoading } = useGetHistorialAnimal({
    animalId: animal.id,
    limit,
    offset: currentPage * limit,
    fechaInicio: fechaInicio || undefined,
    fechaFin: fechaFin || undefined,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleDownloadDocument = (url: string, nombre: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = nombre;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalPages = historial_animal?.total
    ? Math.ceil(historial_animal.total / limit)
    : 0;

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleApplyFilters = () => {
    setCurrentPage(0);
  };

  const handleClearFilters = () => {
    setFechaInicio("");
    setFechaFin("");
    setCurrentPage(0);
  };

  const handleCloseModal = () => {
    setIsOpenModal(false);
    setCurrentPage(0);
    setFechaInicio("");
    setFechaFin("");
  };

  return (
    <div className="flex items-center gap-2">
      <PawPrintIcon className="h-4 w-4 text-gray-600 flex-shrink-0" />
      <div className="min-w-0">
        <p
          className="text-sm hover:underline hover:text-blue-700 cursor-pointer font-medium text-gray-900 truncate"
          onClick={() => setIsOpenModal(true)}
        >
          {animal.identificador} - {animal.especie}
        </p>
        <p className="text-xs text-gray-600">
          {animal.razas.length === 1
            ? animal.razas[0]
            : animal.razas.length > 1
              ? "Encaste"
              : "Sin raza"}
        </p>
      </div>

      <AlertDialog open={isOpenModal} onOpenChange={handleCloseModal}>
        <AlertDialogContent className="max-w-4xl w-[95vw] h-[90vh] flex flex-col p-0 overflow-hidden">
          <div className="flex-shrink-0 p-6 border-b bg-white">
            <div className="flex justify-between items-center mb-4">
              <AlertDialogTitle className="text-xl m-0">
                Historial Clínico - {animal.identificador}
              </AlertDialogTitle>
              <AlertDialogCancel className="mt-0 static">X</AlertDialogCancel>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              <div>
                <p className="font-semibold text-sm">Especie:</p>
                <p className="text-sm">{animal.especie}</p>
              </div>
              <div>
                <p className="font-semibold text-sm">Raza(s):</p>
                <p className="text-sm">{animal.razas.join(", ")}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 space-y-1">
                <Label htmlFor="fechaInicio" className="text-sm">
                  Fecha Inicio
                </Label>
                <Input
                  id="fechaInicio"
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="flex-1 space-y-1">
                <Label htmlFor="fechaFin" className="text-sm">
                  Fecha Fin
                </Label>
                <Input
                  id="fechaFin"
                  type="date"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  className="h-9"
                />
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={handleApplyFilters} size="sm" className="h-9">
                  <Filter className="h-3 w-3 mr-1" />
                  Filtrar
                </Button>
                <Button
                  onClick={handleClearFilters}
                  variant="outline"
                  size="sm"
                  disabled={!fechaInicio && !fechaFin}
                  className="h-9"
                >
                  <X className="h-3 w-3 mr-1" />
                  Limpiar
                </Button>
              </div>
            </div>
          </div>

          {historial_animal && historial_animal.total > 0 && (
            <div className="flex-shrink-0 flex justify-between items-center p-4 border-b bg-gray-50">
              <div className="text-sm text-gray-600">
                Mostrando {currentPage * limit + 1} -{" "}
                {Math.min((currentPage + 1) * limit, historial_animal.total)} de{" "}
                {historial_animal.total} registros
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm min-w-[80px] text-center">
                  Página {currentPage + 1} de {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <ScrollArea className="flex-1 p-6">
            <AlertDialogDescription asChild>
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-8">
                    <p>Cargando historial...</p>
                  </div>
                ) : historial_animal?.historial &&
                  historial_animal.historial.length > 0 ? (
                  <div className="space-y-4">
                    {historial_animal.historial.map((registro) => (
                      <div
                        key={registro.id}
                        className="border rounded-lg p-4 bg-white"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-3">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <Calendar className="h-4 w-4 text-gray-500 flex-shrink-0" />
                              <span className="font-semibold text-sm sm:text-base">
                                {formatDate(registro.cita.fecha)}
                              </span>
                              <Badge
                                variant={
                                  registro.cita.estado === "completada"
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-xs"
                              >
                                {registro.cita.estado}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <User className="h-4 w-4 flex-shrink-0" />
                              <span className="break-words">
                                Dr. {registro.veterinario.name}
                              </span>
                            </div>
                          </div>
                          <div className="text-sm text-gray-500 text-right sm:text-left">
                            Código: {registro.cita.codigo}
                          </div>
                        </div>

                        <div className="mb-3 p-3 bg-blue-50 rounded">
                          <p className="font-semibold text-blue-900 text-sm sm:text-base">
                            Servicio: {registro.cita.subServicio.nombre}
                          </p>
                          {registro.resumen && (
                            <p className="text-sm text-blue-800 mt-1 break-words">
                              {registro.resumen}
                            </p>
                          )}
                        </div>

                        {registro.detalles && registro.detalles.length > 0 && (
                          <div className="space-y-3">
                            <p className="font-semibold text-sm">
                              Detalles del tratamiento:
                            </p>
                            {registro.detalles.map((detalle) => (
                              <div
                                key={detalle.id}
                                className="border-l-4 border-green-500 pl-3"
                              >
                                <p className="font-medium text-sm break-words">
                                  {detalle.subServicio.nombre}
                                </p>
                                {detalle.diagnostico && (
                                  <div className="mt-1">
                                    <p className="text-xs font-semibold text-gray-700">
                                      Diagnóstico:
                                    </p>
                                    <p className="text-sm break-words">
                                      {detalle.diagnostico}
                                    </p>
                                  </div>
                                )}
                                {detalle.tratamiento && (
                                  <div className="mt-1">
                                    <p className="text-xs font-semibold text-gray-700">
                                      Tratamiento:
                                    </p>
                                    <p className="text-sm break-words">
                                      {detalle.tratamiento}
                                    </p>
                                  </div>
                                )}
                                {detalle.observaciones && (
                                  <div className="mt-1">
                                    <p className="text-xs font-semibold text-gray-700">
                                      Observaciones:
                                    </p>
                                    <p className="text-sm break-words">
                                      {detalle.observaciones}
                                    </p>
                                  </div>
                                )}

                                {detalle.documentos &&
                                  detalle.documentos.length > 0 && (
                                    <div className="mt-2">
                                      <p className="text-xs font-semibold text-gray-700">
                                        Documentos:
                                      </p>
                                      <div className="space-y-1 mt-1">
                                        {detalle.documentos.map((documento) => (
                                          <div
                                            key={documento.id}
                                            className="flex flex-col sm:flex-row sm:items-center gap-2 py-1"
                                          >
                                            <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
                                            <span className="text-sm flex-1 break-all">
                                              {documento.nombre}
                                            </span>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() =>
                                                handleDownloadDocument(
                                                  documento.url,
                                                  documento.nombre
                                                )
                                              }
                                              className="h-7 px-2 flex-shrink-0"
                                            >
                                              <Download className="h-3 w-3" />
                                            </Button>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No hay registros en el historial clínico</p>
                    {(fechaInicio || fechaFin) && (
                      <p className="text-sm mt-2">
                        Intenta ajustar los filtros de fecha
                      </p>
                    )}
                  </div>
                )}
              </div>
            </AlertDialogDescription>
          </ScrollArea>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DetailsPacientes;
