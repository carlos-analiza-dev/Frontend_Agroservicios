import { EditarPedido } from "@/apis/pedidos/accions/editar-pedido";
import {
  CrearPedidoInterface,
  EstadoPedido,
} from "@/apis/pedidos/interface/crear-pedido.interface";
import { Pedido } from "@/apis/pedidos/interface/response-pedidos.interface";
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
import { formatCurrency } from "@/helpers/funciones/formatCurrency";
import { formatDate } from "@/helpers/funciones/formatDate";
import { User } from "@/interfaces/auth/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import {
  Calendar,
  MapPin,
  Package,
  CheckCircle,
  FileText,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "react-toastify";

interface Props {
  pedido: Pedido;
  user: User | undefined;
}

type DialogType = "procesar" | "facturar" | "cancelar" | null;

const PedidoCard = ({ pedido, user }: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState<DialogType>(null);
  const queryClient = useQueryClient();
  const simbolo = user?.pais.simbolo_moneda || "$";

  const getEstadoBadge = (estado: string) => {
    const estados = {
      pendiente: { label: "Pendiente", variant: "secondary" as const },
      procesado: { label: "Procesado", variant: "default" as const },
      facturado: { label: "Facturado", variant: "default" as const },
      cancelado: { label: "Cancelado", variant: "destructive" as const },
    };

    const estadoConfig =
      estados[estado as keyof typeof estados] || estados.pendiente;

    return <Badge variant={estadoConfig.variant}>{estadoConfig.label}</Badge>;
  };

  const mutationEdit = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CrearPedidoInterface>;
    }) => EditarPedido(id, data),
  });

  const openDialog = (type: DialogType) => {
    setDialogType(type);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setDialogType(null);
  };

  const handleCambiarEstado = () => {
    if (!pedido.id) return;

    let nuevoEstado: EstadoPedido;
    let mensajeExito = "";

    switch (dialogType) {
      case "procesar":
        nuevoEstado = EstadoPedido.PROCESADO;
        mensajeExito = "Pedido procesado correctamente";
        break;
      case "facturar":
        nuevoEstado = EstadoPedido.FACTURADO;
        mensajeExito = "Pedido facturado correctamente";
        break;
      case "cancelar":
        nuevoEstado = EstadoPedido.CANCELADO;
        mensajeExito = "Pedido cancelado correctamente";
        break;
      default:
        return;
    }

    mutationEdit.mutate(
      { id: pedido.id, data: { estado: nuevoEstado } },
      {
        onSuccess: () => {
          toast.success(mensajeExito);
          closeDialog();

          setTimeout(() => {
            window.location.reload();
          }, 500);
        },
        onError: (error) => {
          if (isAxiosError(error)) {
            toast.error(
              error?.response?.data?.message ||
                `Error al ${dialogType} el pedido`
            );
          }
        },
      }
    );
  };

  const getDialogConfig = () => {
    const configs = {
      procesar: {
        title: "¿Procesar pedido?",
        description:
          "El pedido pasará a estado 'Procesado'. ¿Deseas continuar?",
        icon: <CheckCircle className="h-6 w-6 text-blue-600" />,
        buttonText: "Sí, procesar",
        variant: "default" as const,
      },
      facturar: {
        title: "¿Facturar pedido?",
        description:
          "El pedido pasará a estado 'Facturado'. ¿Deseas continuar?",
        icon: <FileText className="h-6 w-6 text-green-600" />,
        buttonText: "Sí, facturar",
        variant: "default" as const,
      },
      cancelar: {
        title: "¿Cancelar pedido?",
        description:
          "Esta acción no se puede deshacer. Si cancelas este pedido, se perderán todos los detalles asociados. ¿Deseas continuar?",
        icon: <XCircle className="h-6 w-6 text-red-600" />,
        buttonText: "Sí, cancelar",
        variant: "destructive" as const,
      },
    };

    return dialogType ? configs[dialogType] : configs.cancelar;
  };

  const dialogConfig = getDialogConfig();

  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
        <CardHeader className="bg-gray-50 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg">
                  Pedido #{pedido.id.slice(-8)}
                </CardTitle>
                {getEstadoBadge(pedido.estado)}
              </div>
              <CardDescription className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(pedido.created_at)}
              </CardDescription>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(pedido.total, simbolo)}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-gray-900">Sucursal</h3>
                  <p className="text-sm text-gray-600">
                    {pedido.sucursal.nombre}
                  </p>
                  <p className="text-sm text-gray-500">
                    {pedido.sucursal.direccion_complemento}
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Package className="h-5 w-5" />
                Productos ({pedido.detalles.length})
              </h3>

              <div className="space-y-3">
                {pedido.detalles.map((detalle: any) => (
                  <div
                    key={detalle.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">
                        {detalle.producto.nombre}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {detalle.producto.atributos && (
                          <span className="block text-xs">
                            {detalle.producto.atributos}
                          </span>
                        )}
                        <span>Código: {detalle.producto.codigo}</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-gray-600">
                          {detalle.cantidad} x{" "}
                          {formatCurrency(detalle.precio, simbolo)}
                        </div>
                        <div className="font-semibold text-gray-900">
                          {formatCurrency(detalle.total, simbolo)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    {formatCurrency(pedido.total, simbolo)}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-600">Total</span>
                  <span className="text-lg font-bold text-green-600">
                    {formatCurrency(pedido.total, simbolo)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
            {pedido.estado === "pendiente" && (
              <>
                <Button
                  onClick={() => openDialog("procesar")}
                  variant="default"
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Procesar Pedido
                </Button>
                <Button
                  onClick={() => openDialog("cancelar")}
                  variant="destructive"
                  size="sm"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancelar Pedido
                </Button>
              </>
            )}

            {pedido.estado === "procesado" && (
              <>
                <Button
                  onClick={() => openDialog("facturar")}
                  variant="default"
                  size="sm"
                  className="bg-green-600 hover:bg-green-700"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Marcar como Facturado
                </Button>
                <Button
                  onClick={() => openDialog("cancelar")}
                  variant="destructive"
                  size="sm"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancelar Pedido
                </Button>
              </>
            )}

            {pedido.estado === "facturado" && (
              <div className="text-sm text-gray-500 italic">
                Este pedido ya ha sido facturado
              </div>
            )}

            {pedido.estado === "cancelado" && (
              <div className="text-sm text-red-500 italic">
                Este pedido ha sido cancelado
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <div className="flex justify-end">
            <AlertDialogCancel
              className="rounded-full p-1 hover:bg-muted"
              onClick={closeDialog}
            >
              ✕
            </AlertDialogCancel>
          </div>

          <AlertDialogHeader>
            <div className="flex items-center gap-3 mb-2">
              {dialogConfig.icon}
              <AlertDialogTitle
                className={`text-xl font-semibold ${
                  dialogType === "cancelar"
                    ? "text-destructive"
                    : "text-foreground"
                }`}
              >
                {dialogConfig.title}
              </AlertDialogTitle>
            </div>
            <AlertDialogDescription className="text-muted-foreground">
              {dialogConfig.description}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter className="mt-4 flex justify-end gap-3">
            <AlertDialogCancel
              className="px-4 py-2 rounded-md bg-muted hover:bg-muted/80 transition"
              onClick={closeDialog}
            >
              No, volver
            </AlertDialogCancel>
            <AlertDialogAction
              className={`px-4 py-2 rounded-md transition ${
                dialogType === "cancelar"
                  ? "bg-destructive text-white hover:bg-destructive/90"
                  : dialogType === "procesar"
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-green-600 text-white hover:bg-green-700"
              }`}
              onClick={handleCambiarEstado}
              disabled={mutationEdit.isPending}
            >
              {mutationEdit.isPending
                ? "Procesando..."
                : dialogConfig.buttonText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default PedidoCard;
