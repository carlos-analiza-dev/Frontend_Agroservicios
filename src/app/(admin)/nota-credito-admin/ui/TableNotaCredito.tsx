import { descargarNotaPDF } from "@/apis/nota-credito/accions/descargar-nota-credito";
import {
  Nota,
  ResponseNotaCreditoInterface,
} from "@/apis/nota-credito/interface/response-nota-credito.interface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { veterinariaAPI } from "@/helpers/api/veterinariaAPI";
import { formatCurrency } from "@/helpers/funciones/formatCurrency";
import { formatDate } from "@/helpers/funciones/formatDate";
import {
  Calendar,
  DollarSign,
  Download,
  Eye,
  FileText,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

interface Props {
  notas_credito: ResponseNotaCreditoInterface;
}

const TableNotaCredito = ({ notas_credito }: Props) => {
  const [descargandoId, setDescargandoId] = useState<string | null>(null);
  const [previewNota, setPreviewNota] = useState<string | null>(null);

  const handlePreviewNota = async (nota: Nota) => {
    try {
      const url = `/nota-credito-pdf/${nota.id}/preview`;

      const response = await veterinariaAPI.get(url, {
        responseType: "blob",
      });

      if (!response.data) {
        throw new Error("No se pudo obtener la vista previa de la nota.");
      }

      const blob = new Blob([response.data], { type: "application/pdf" });
      const objectUrl = URL.createObjectURL(blob);

      setPreviewNota(objectUrl);
    } catch (error) {
      console.error("Error al obtener la vista previa de la nota:", error);
    }
  };

  const handleDescargarNota = async (nota: Nota) => {
    setDescargandoId(nota.id);
    try {
      const result = await descargarNotaPDF(nota.id, nota);

      if (result.success) {
        toast.success("Nota descargada exitosamente");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Error inesperado al descargar la nota");
    } finally {
      setDescargandoId(null);
    }
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">N° de Nota</TableHead>
            <TableHead className="text-center">Factura</TableHead>
            <TableHead className="text-center">Monto</TableHead>
            <TableHead className="text-center">Motivo</TableHead>
            <TableHead className="text-center">Fecha</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notas_credito.notas.map((nota) => (
            <TableRow key={nota.id}>
              <TableCell className="font-medium text-center">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  {nota.id.slice(0, 8)}...
                </div>
              </TableCell>
              <TableCell className="text-center">
                <div className="space-y-1">
                  <div className="font-medium">
                    {nota.factura.numero_factura}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {nota.factura.estado}
                  </Badge>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center justify-center  gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <span className="font-semibold">
                    {formatCurrency(nota.monto, nota.pais.simbolo_moneda)}
                  </span>
                </div>
              </TableCell>

              <TableCell className="max-w-[200px] text-center truncate">
                {nota.motivo}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  {formatDate(nota.createdAt)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex justify-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreviewNota(nota)}
                    title="Ver Factura"
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDescargarNota(nota)}
                    title="Descargar Nota"
                    disabled={descargandoId === nota.id}
                    className="flex items-center gap-1"
                  >
                    {descargandoId === nota.id ? (
                      <>
                        <div className="h-3 w-3 animate-spin rounded-full border border-gray-300 border-t-gray-900" />
                        <span>Descargando...</span>
                      </>
                    ) : (
                      <>
                        <Download className="h-4 w-4" />
                        <span>PDF</span>
                      </>
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {previewNota && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-5/6 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">
                Vista Previa de la Factura
              </h2>
              <Button variant="ghost" onClick={() => setPreviewNota(null)}>
                Cerrar
              </Button>
            </div>
            <iframe
              src={previewNota}
              className="w-full h-full"
              title="Vista previa de la factura"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TableNotaCredito;
