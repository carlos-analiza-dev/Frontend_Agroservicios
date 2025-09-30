import useGetLotesByInsumo from "@/hooks/insumos/useGetLotesByInsumo";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Package, Store, FileText, DollarSign, Hash } from "lucide-react";
import { StatusMessage } from "@/components/generics/StatusMessage";
import { User } from "@/interfaces/auth/user";

interface Props {
  insumoId: string;
  user: User | undefined;
}

const LotesByInsumo = ({ insumoId, user }: Props) => {
  const { data: lotes_insumo, isLoading } = useGetLotesByInsumo(insumoId);

  const simbolo_moneda = user?.pais.simbolo_moneda || "$";

  if (isLoading) {
    return <LotesSkeleton />;
  }

  if (!lotes_insumo || lotes_insumo.length === 0) {
    return (
      <div className="flex justify-center items-center">
        <StatusMessage
          type="empty"
          title="No se encontraron lotes para este insumo"
        />
      </div>
    );
  }

  const stockTotal = lotes_insumo.reduce(
    (sum, lote) => sum + parseFloat(lote.cantidad),
    0
  );
  const valorTotal = lotes_insumo.reduce((sum, lote) => {
    const costo = parseFloat(lote.costo_por_unidad || lote.costo);
    const cantidad = parseFloat(lote.cantidad);
    return sum + costo * cantidad;
  }, 0);

  const insumo = lotes_insumo[0]?.insumo;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {insumo?.nombre}
          </CardTitle>
          <CardDescription>
            Código: {insumo?.codigo} | Unidad de venta: {insumo?.unidad_venta}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg">
              <span className="text-2xl font-bold text-blue-600">
                {lotes_insumo.length}
              </span>
              <span className="text-sm text-blue-600">Total de Lotes</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-green-50 rounded-lg">
              <span className="text-2xl font-bold text-green-600">
                {stockTotal}
              </span>
              <span className="text-sm text-green-600">Stock Total</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 bg-purple-50 rounded-lg">
              <span className="text-2xl font-bold text-purple-600">
                {simbolo_moneda} {valorTotal.toFixed(2)}
              </span>
              <span className="text-sm text-purple-600">Valor Total</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detalle de Lotes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Lote ID</TableHead>
                <TableHead>Sucursal</TableHead>
                <TableHead>Factura</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead className="text-right">Costo Unitario</TableHead>
                <TableHead className="text-right">Valor Total</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lotes_insumo.map((lote) => {
                const cantidad = parseFloat(lote.cantidad);
                const costoUnitario = parseFloat(
                  lote.costo_por_unidad || lote.costo
                );
                const valorLote = cantidad * costoUnitario;
                const tieneStock = cantidad > 0;

                return (
                  <TableRow key={lote.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Hash className="h-4 w-4 text-muted-foreground" />
                        {lote.id.substring(0, 8)}...
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Store className="h-4 w-4 text-muted-foreground" />
                        {lote.sucursal?.nombre}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-mono">
                        {lote.compra?.numero_factura}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {cantidad} {insumo?.unidad_venta}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {simbolo_moneda}
                        {costoUnitario.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      <div className="flex items-center justify-end gap-1">
                        {simbolo_moneda} {valorLote.toFixed(2)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={tieneStock ? "default" : "secondary"}>
                        {tieneStock ? "En Stock" : "Sin Stock"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Información de Compras
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {lotes_insumo.map((lote) => (
              <div
                key={lote.id}
                className="border-l-4 border-blue-500 pl-3 py-1"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-sm">
                      Factura: {lote.compra?.numero_factura}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Fecha: {new Date(lote.compra?.fecha).toLocaleDateString()}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Tipo: {lote.compra?.tipo_pago}
                    </p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {parseFloat(lote.cantidad)} {insumo?.unidad_venta}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Store className="h-4 w-4" />
              Distribución por Sucursal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from(
              new Set(lotes_insumo.map((lote) => lote.sucursal?.id))
            ).map((sucursalId) => {
              const sucursal = lotes_insumo.find(
                (l) => l.sucursal?.id === sucursalId
              )?.sucursal;
              const lotesSucursal = lotes_insumo.filter(
                (l) => l.sucursal?.id === sucursalId
              );
              const stockSucursal = lotesSucursal.reduce(
                (sum, l) => sum + parseFloat(l.cantidad),
                0
              );

              return (
                <div
                  key={sucursalId}
                  className="flex justify-between items-center p-2 bg-gray-50 rounded"
                >
                  <div>
                    <p className="font-medium text-sm">{sucursal?.nombre}</p>
                    <p className="text-xs text-muted-foreground">
                      {sucursal?.municipio?.nombre},{" "}
                      {sucursal?.departamento?.nombre}
                    </p>
                  </div>
                  <Badge variant="secondary">
                    {stockSucursal} {insumo?.unidad_venta}
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const LotesSkeleton = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader className="pb-3">
        <Skeleton className="h-6 w-64" />
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-lg" />
          ))}
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex justify-between items-center">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default LotesByInsumo;
