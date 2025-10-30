import {
  Detalle,
  Documento,
  Historial,
} from "@/apis/historial-clinico/interface/response-historial-veterinario.interface";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Calendar,
  FileText,
  Stethoscope,
  User,
  Upload,
  X,
  Book,
  BookDown,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";
import FormHistorialClinico from "./FormHistorialClinico";
import { SubirDocumentosADetalle } from "@/apis/historial-clinico/accions/agregar-documentos";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { handleDownload } from "@/apis/historial-clinico/accions/descargar-documento";
import { eliminarDocumento } from "@/apis/historial-clinico/accions/eliminar-documento-historial";

interface HistorialCardProps {
  historial: Historial;
}

const HistorialCard = ({ historial }: HistorialCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDocumentosOpen, setIsDocumentosOpen] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [selectedDocumento, setSelectedDocumento] = useState<Documento | null>(
    null
  );
  const [selectedDetalle, setSelectedDetalle] = useState<Detalle | null>(null);
  const [archivos, setArchivos] = useState<File[]>([]);
  const [isSubiendo, setIsSubiendo] = useState(false);
  const queryClient = useQueryClient();
  const { animal, detalles, createdAt, resumen } = historial;

  const handleAbrirModalDocumentos = (detalle: Detalle) => {
    setSelectedDetalle(detalle);
    setArchivos([]);
    setIsDocumentosOpen(true);
  };

  const handleCerrarModalDocumentos = () => {
    setIsDocumentosOpen(false);
    setSelectedDetalle(null);
    setArchivos([]);
  };

  const handleModalDelete = (documento: Documento) => {
    setOpenModalDelete(true);
    setSelectedDocumento(documento);
  };

  const handleSeleccionarArchivos = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;
    if (files) {
      setArchivos((prev) => [...prev, ...Array.from(files)]);
    }
  };

  const handleEliminarArchivo = (index: number) => {
    setArchivos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubirDocumentos = async () => {
    if (!selectedDetalle || archivos.length === 0) return;

    setIsSubiendo(true);
    try {
      for (const archivo of archivos) {
        const formData = new FormData();
        formData.append("files", archivo);

        await SubirDocumentosADetalle(selectedDetalle.id, formData);
      }

      toast.success("Documentos subidos exitosamente");
      queryClient.invalidateQueries({ queryKey: ["historial-clinico"] });
      handleCerrarModalDocumentos();
    } catch (error) {
      toast.error("Error al subir el archivo");
    } finally {
      setIsSubiendo(false);
    }
  };

  return (
    <>
      <Card className="hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <Stethoscope className="h-5 w-5 text-primary" />
                {animal.identificador}
              </CardTitle>
              <CardDescription className="line-clamp-2">
                {resumen || "Sin resumen disponible"}
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">
              {detalles.length} proc.
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">
                {animal.identificador || "Sin nombre"}
              </span>
              <Badge variant="secondary" className="text-xs">
                {animal.sexo}
              </Badge>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <div
                  className="w-3 h-3 rounded-full border"
                  style={{ backgroundColor: animal.color.toLowerCase() }}
                />
                {animal.color}
              </div>
              <span>•</span>
              <span>{animal.especie.nombre}</span>
              {animal.razas?.[0] && (
                <>
                  <span>•</span>
                  <span>{animal.razas[0].nombre}</span>
                </>
              )}
            </div>

            {animal.propietario && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Prop: {animal.propietario.nombre}</span>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <div className="space-y-1 max-h-20 overflow-y-auto">
              {detalles.map((detalle) => (
                <div
                  key={detalle.id}
                  className="text-xs p-2 bg-muted/50 rounded flex justify-between items-center group"
                >
                  <div className="flex-1">
                    <div className="font-medium line-clamp-1">
                      {detalle.diagnostico || "Sin diagnóstico"}
                    </div>
                    {detalle.tratamiento && (
                      <div className="text-muted-foreground line-clamp-1 mt-1">
                        {detalle.tratamiento}
                      </div>
                    )}
                    {detalle.documentos &&
                      detalle.documentos.length > 0 &&
                      detalle.documentos.map((deta) => (
                        <div
                          key={deta.id}
                          className="group mt-2 flex items-center justify-between gap-2 rounded-md border p-2 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                          <div
                            onClick={() => handleDownload(deta.id)}
                            className="flex items-center gap-2 hover:text-blue-600 cursor-pointer"
                          >
                            <BookDown size={16} />
                            <span className="text-sm">{deta.nombre}</span>
                          </div>

                          <button
                            onClick={() => handleModalDelete(deta)}
                            className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700 transition"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleAbrirModalDocumentos(detalle)}
                    title="Agregar documentos"
                  >
                    <Upload className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              {new Date(createdAt).toLocaleDateString()}
            </div>
            <div className="space-x-2">
              <Button
                title="Editar Historial"
                onClick={() => setIsOpen(true)}
                variant={"outline"}
              >
                Editar
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="w-full md:max-w-4xl max-h-[85vh] overflow-hidden">
          <div className="sticky top-0 z-10 bg-background border-b p-6">
            <div className="flex justify-between items-center">
              <div>
                <AlertDialogTitle className="text-xl">
                  Editar Historial Clínico
                </AlertDialogTitle>
                <AlertDialogDescription className="mt-1">
                  Actualice la información médica del animal
                </AlertDialogDescription>
              </div>
              <AlertDialogCancel className="h-9 w-9 p-0 rounded-full flex items-center justify-center hover:bg-muted">
                ✕
              </AlertDialogCancel>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(85vh-120px)]">
            <div className="p-6">
              <FormHistorialClinico
                historialEdit={historial}
                isEdit={true}
                onSucces={() => setIsOpen(false)}
              />
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={isDocumentosOpen} onOpenChange={setIsDocumentosOpen}>
        <AlertDialogContent className="w-full md:max-w-2xl max-h-[80vh] overflow-hidden">
          <div className="sticky top-0 z-10 bg-background border-b p-6">
            <div className="flex justify-between items-center">
              <div>
                <AlertDialogTitle className="text-xl">
                  Agregar Documentos
                </AlertDialogTitle>
                <AlertDialogDescription className="mt-1">
                  Suba archivos para el procedimiento:{" "}
                  <strong>
                    {selectedDetalle?.diagnostico || "Sin diagnóstico"}
                  </strong>
                </AlertDialogDescription>
              </div>
              <AlertDialogCancel
                className="h-9 w-9 p-0 rounded-full flex items-center justify-center hover:bg-muted"
                onClick={handleCerrarModalDocumentos}
              >
                ✕
              </AlertDialogCancel>
            </div>
          </div>

          <div className="overflow-y-auto max-h-[calc(80vh-120px)] p-6">
            <div className="space-y-6">
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Arrastra archivos aquí o haz clic para seleccionar
                </p>
                <input
                  type="file"
                  multiple
                  onChange={handleSeleccionarArchivos}
                  className="hidden"
                  id="file-upload"
                  accept=".pdf"
                />
                <Button
                  variant="outline"
                  onClick={() =>
                    document.getElementById("file-upload")?.click()
                  }
                >
                  Seleccionar Archivos
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Formatos permitidos: PDF
                </p>
              </div>

              {archivos.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold">
                    Archivos seleccionados ({archivos.length})
                  </h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {archivos.map((archivo, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm truncate flex-1">
                            {archivo.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({(archivo.size / 1024 / 1024).toFixed(2)} MB)
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEliminarArchivo(index)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="sticky bottom-0 bg-background border-t p-6">
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={handleCerrarModalDocumentos}
                disabled={isSubiendo}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSubirDocumentos}
                disabled={archivos.length === 0 || isSubiendo}
              >
                {isSubiendo ? (
                  <>
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Subiendo...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Subir Documentos
                  </>
                )}
              </Button>
            </div>
          </div>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={openModalDelete} onOpenChange={setOpenModalDelete}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Documento</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro que deseas eliminar el documento{" "}
              <strong>{selectedDocumento?.nombre}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpenModalDelete(false)}>
              Cancelar
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={async () => {
                if (!selectedDocumento?.id) return;
                try {
                  await eliminarDocumento(selectedDocumento.id);
                  toast.success("Documento eliminado correctamente");
                  queryClient.invalidateQueries({
                    queryKey: ["historial-clinico"],
                  });
                } catch (error) {
                  toast.error("Error al eliminar el documento");
                } finally {
                  setOpenModalDelete(false);
                  setSelectedDocumento(null);
                }
              }}
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default HistorialCard;
