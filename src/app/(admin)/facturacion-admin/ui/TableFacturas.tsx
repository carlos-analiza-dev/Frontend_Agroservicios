import { descargarFacturaPDFConAxios } from "@/apis/facturas/accions/descargar-factura";
import { handlePreviewFactura } from "@/apis/facturas/accions/preview-factura";
import {
  Factura,
  ResponseFacturasInterface,
} from "@/apis/facturas/interfaces/response-facturas.interface";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/helpers/funciones/formatCurrency";
import { Calendar, Download, Edit, Eye, FileText, User } from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";
import FormEditFactura from "./FormEditFactura";

interface Props {
  facturas: ResponseFacturasInterface | undefined;
}

const TableFacturas = ({ facturas }: Props) => {
  const [descargandoId, setDescargandoId] = useState<string | null>(null);
  const [facturaPreview, setFacturaPreview] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [facturaEditando, setFacturaEditando] = useState<Factura | null>(null);

  const handlePreviewFactura = (factura: Factura) => {
    const url = `${process.env.NEXT_PUBLIC_API_URL}/facturas/${factura.id}/preview`;
    setFacturaPreview(url);
  };

  const handleDescargarFactura = async (factura: Factura) => {
    setDescargandoId(factura.id);
    try {
      const result = await descargarFacturaPDFConAxios(factura.id, factura);

      if (result.success) {
        toast.success("Factura descargada exitosamente");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Error inesperado al descargar la factura");
    } finally {
      setDescargandoId(null);
    }
  };

  const handleEditFactura = (factura: Factura) => {
    setFacturaEditando(factura);
    setIsOpen(true);
  };

  const handleEditSuccess = () => {
    setIsOpen(false);
    setFacturaEditando(null);
    // Aquí podrías recargar las facturas si es necesario
    toast.success("Factura actualizada exitosamente");
  };

  const handleCancelEdit = () => {
    setIsOpen(false);
    setFacturaEditando(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES");
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">N° Factura</TableHead>
            <TableHead className="text-center">Cliente</TableHead>
            <TableHead className="text-center">Fecha Recepción</TableHead>
            <TableHead className="text-center">Fecha Límite</TableHead>
            <TableHead className="text-center">Sub Total</TableHead>
            <TableHead className="text-center">Total</TableHead>
            <TableHead className="text-center">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {facturas?.data?.map((factura) => (
            <TableRow key={factura.id}>
              <TableCell className="font-medium">
                <div className="flex justify-center items-center gap-2">
                  <FileText className="h-4 w-4 text-blue-500" />
                  {factura.numero_factura}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex justify-center  items-center gap-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="font-medium">{factura.cliente.nombre}</p>
                    <p className="text-sm text-gray-500">
                      {factura.cliente.identificacion}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex justify-center  items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  {formatDate(factura.fecha_recepcion)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex justify-center  items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  {formatDate(factura.fecha_limite_emision)}
                </div>
              </TableCell>
              <TableCell className="text-center">
                {formatCurrency(factura.sub_total, factura.pais.simbolo_moneda)}
              </TableCell>
              <TableCell className="text-center font-semibold">
                {formatCurrency(factura.total, factura.pais.simbolo_moneda)}
              </TableCell>

              <TableCell>
                <div className="flex gap-2">
                  {factura.estado === "Emitida" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditFactura(factura)}
                      className="flex items-center gap-1"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePreviewFactura(factura)}
                    className="flex items-center gap-1"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDescargarFactura(factura)}
                    disabled={descargandoId === factura.id}
                    className="flex items-center gap-1"
                  >
                    {descargandoId === factura.id ? (
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
      {facturaPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-4xl h-5/6 flex flex-col">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">
                Vista Previa de la Factura
              </h2>
              <Button variant="ghost" onClick={() => setFacturaPreview(null)}>
                Cerrar
              </Button>
            </div>
            <iframe
              src={facturaPreview}
              className="w-full h-full"
              title="Vista previa de la factura"
            />
          </div>
        </div>
      )}

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="p-4 md:max-w-5xl h-full overflow-y-auto">
          <div className="flex justify-end">
            <AlertDialogCancel onClick={handleCancelEdit}>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Edición de Factura {facturaEditando?.numero_factura}
            </AlertDialogTitle>
            <AlertDialogDescription>
              Aquí puede editar las facturas que aún no están procesadas
            </AlertDialogDescription>
          </AlertDialogHeader>
          {facturaEditando && (
            <FormEditFactura
              factura={facturaEditando}
              onSuccess={handleEditSuccess}
              onCancel={handleCancelEdit}
            />
          )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TableFacturas;
