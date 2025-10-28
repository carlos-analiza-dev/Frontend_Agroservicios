"use client";

import { formatDate } from "@/helpers/funciones/formatDate";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  NavigationIcon,
  PhoneIcon,
  UserIcon,
  BuildingIcon,
  PawPrintIcon,
  Trash2Icon,
  CarIcon,
  BriefcaseMedical,
  PlusIcon,
  MinusIcon,
  PackageIcon,
  SyringeIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";

import { Producto } from "@/apis/productos/interfaces/response-productos.interface";
import { useAuthStore } from "@/providers/store/useAuthStore";
import {
  Cita,
  Finca,
} from "@/apis/medicos/interfaces/obtener-citas-medicos.interface";
import { toast } from "react-toastify";
import { obtenerTiempoViajeGoogleMaps } from "@/apis/google-maps/accions/obtenerTiempoViajeGoogleMaps";
import GoogleMapViewer from "@/components/generics/GoogleMapViewer";
import { InsumoDis } from "@/apis/insumos/interfaces/response-insumos-disponibles.interface";
import { ResponseExistenciaInsumosInterface } from "@/apis/existencia_insumos/interfaces/response-exsistencia-insumos.interface";
import { ResponseExistenciaProductosInterface } from "@/apis/existencia_productos/interfaces/response-existencia-productos.interface";

interface Props {
  item: Cita;
  onConfirm?: () => void;
  onCancel?: () => void;
  onComplete?: () => void;
  onAddProducts?: () => void;
  selectedInsumos?: { [key: string]: { insumo: InsumoDis; quantity: number } };
  selectedProductos?: {
    [key: string]: { producto: Producto; quantity: number };
  };
  totalAdicional?: number;
  onRemoveProduct?: (productId: string, type: "insumo" | "producto") => void;
  onUpdateQuantity?: (
    productId: string,
    quantity: number,
    type: "insumo" | "producto"
  ) => void;
  existenciaInsumos?: ResponseExistenciaInsumosInterface[];
  existenciaProductos?: ResponseExistenciaProductosInterface[];
}

const CardCitasMedico = ({
  item,
  onConfirm,
  onCancel,
  onComplete,
  onAddProducts,
  selectedInsumos = {},
  selectedProductos = {},
  totalAdicional = 0,
  onRemoveProduct,
  onUpdateQuantity,
  existenciaInsumos = [],
  existenciaProductos = [],
}: Props) => {
  const { user } = useAuthStore();

  const [distance, setDistance] = useState<number | null>(null);
  const [travelTime, setTravelTime] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        if (!navigator.geolocation) {
          setLoadingLocation(false);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          async (position) => {
            if (item.finca.latitud && item.finca.longitud) {
              try {
                const resultado = await obtenerTiempoViajeGoogleMaps(
                  position.coords.latitude,
                  position.coords.longitude,
                  item.finca.latitud,
                  item.finca.longitud
                );

                if (
                  resultado &&
                  resultado.distanciaMetros !== null &&
                  resultado.tiempoTexto !== null
                ) {
                  setDistance(resultado.distanciaMetros / 1000);
                  setTravelTime(resultado.tiempoTexto);
                }
              } catch (error) {
                console.error("Error calculating distance:", error);
              }
            }
            setLoadingLocation(false);
          },
          (error) => {
            console.error("Error getting location:", error);
            setLoadingLocation(false);
          },
          { enableHighAccuracy: true, timeout: 10000 }
        );
      } catch (error) {
        console.error("Error fetching location:", error);
        setLoadingLocation(false);
      }
    };

    fetchLocationData();
  }, [item.finca.latitud, item.finca.longitud]);

  const getExistenciaInsumo = (insumoId: string): number => {
    const existencia = existenciaInsumos.find(
      (item: any) => item.insumoId === insumoId
    );
    return Number(existencia?.existenciaTotal) || 0;
  };

  const getExistenciaProducto = (productoId: string): number => {
    const existencia = existenciaProductos.find(
      (item: any) => item.productoId === productoId
    );
    return Number(existencia?.existenciaTotal) || 0;
  };

  const handleCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`);
  };

  const handleQuantityChange = (
    id: string,
    newQuantity: number,
    type: "insumo" | "producto"
  ) => {
    if (newQuantity < 1) return;

    let maxStock = 0;
    if (type === "insumo") {
      maxStock = getExistenciaInsumo(id);
    } else {
      maxStock = getExistenciaProducto(id);
    }

    if (newQuantity > maxStock) {
      toast.warning(`No hay suficiente stock. Máximo disponible: ${maxStock}`);
      return;
    }

    if (onUpdateQuantity) {
      onUpdateQuantity(id, newQuantity, type);
    }
  };

  const primaryAnimal = item.animales[0] || {};
  const ownerPhone = primaryAnimal.propietario?.telefono;

  const statusVariant =
    item.estado.toLowerCase() === "completada"
      ? "default"
      : item.estado.toLowerCase() === "confirmada"
        ? "secondary"
        : item.estado.toLowerCase() === "cancelada"
          ? "destructive"
          : "outline";

  const hasSelectedItems =
    Object.keys(selectedInsumos).length > 0 ||
    Object.keys(selectedProductos).length > 0;

  const totalInsumosUsados =
    item.insumosUsados?.reduce(
      (total, insumo) => total + (insumo.subtotal || 0),
      0
    ) || 0;

  const totalProductosUsados =
    item.productosUsados?.reduce(
      (total, producto) => total + (producto.subtotal || 0),
      0
    ) || 0;

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border border-gray-200">
      <CardContent className="p-4 md:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <BriefcaseMedical className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-base md:text-lg text-gray-900">
              {item.subServicio.nombre} - {item.codigo}
            </h3>
          </div>
          <Badge variant={statusVariant} className="capitalize">
            {item.estado}
          </Badge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {formatDate(item.fecha)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <ClockIcon className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700">
              {item.horaInicio.substring(0, 5)} - {item.horaFin.substring(0, 5)}
            </span>
          </div>
        </div>

        {item.finca.latitud && item.finca.longitud && (
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Ubicación de la Finca
              </h4>
            </div>
            <GoogleMapViewer
              latitud={item.finca.latitud}
              longitud={item.finca.longitud}
              titulo={item.finca.nombre_finca}
              direccion={item.finca.ubicacion}
              height="h-56"
              showDirectionsButton={true}
              className="w-full rounded-lg border border-gray-300"
            />
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <NavigationIcon className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">
              {loadingLocation
                ? "Calculando..."
                : distance
                  ? `${distance.toFixed(1)} km`
                  : "Distancia no disponible"}
            </span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <CarIcon className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">
              {loadingLocation
                ? "Calculando..."
                : travelTime
                  ? `${travelTime} en auto`
                  : "Tiempo no disponible"}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Paciente(s)
          </h4>
          <div className="space-y-2">
            {item.animales.map((animal, index) => (
              <div
                key={`${animal.id}-${index}`}
                className="flex items-center gap-2"
              >
                <PawPrintIcon className="h-4 w-4 text-gray-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
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
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Propietario
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-700">
                {primaryAnimal.propietario?.name || "No especificado"}
              </span>
            </div>
            {ownerPhone && (
              <button
                onClick={() => handleCall(ownerPhone)}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
              >
                <PhoneIcon className="h-4 w-4" />
                <span>{ownerPhone}</span>
              </button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Finca
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MapPinIcon className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-700">
                {item.finca.nombre_finca}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BuildingIcon className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-700">
                {item.finca.ubicacion.split(",").slice(1).join(",").trim() ||
                  item.finca.ubicacion}
              </span>
            </div>
          </div>
        </div>

        {(item.productosUsados?.length > 0 ||
          item.insumosUsados?.length > 0) && (
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Productos e Insumos Agregados
            </h4>

            {item.productosUsados?.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <PackageIcon className="h-4 w-4 text-green-600" />
                  <h5 className="text-sm font-medium text-gray-700">
                    Productos ({item.productosUsados.length})
                  </h5>
                </div>
                <div className="space-y-2">
                  {item.productosUsados.map((producto) => (
                    <div
                      key={producto.id}
                      className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {producto.producto?.nombre}
                        </p>
                        <p className="text-xs text-gray-600">
                          Cantidad: {producto.cantidad}{" "}
                          {producto.producto?.unidad_venta}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {user?.pais.simbolo_moneda}
                          {producto.subtotal?.toFixed(2) || "0.00"}
                        </p>
                        <p className="text-xs text-gray-600">
                          {user?.pais.simbolo_moneda}
                          {producto.precioUnitario} c/u
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {item.insumosUsados?.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <SyringeIcon className="h-4 w-4 text-blue-600" />
                  <h5 className="text-sm font-medium text-gray-700">
                    Insumos ({item.insumosUsados.length})
                  </h5>
                </div>
                <div className="space-y-2">
                  {item.insumosUsados.map((insumo) => (
                    <div
                      key={insumo.id}
                      className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {insumo.insumo?.nombre}
                        </p>
                        <p className="text-xs text-gray-600">
                          Cantidad: {insumo.cantidad}{" "}
                          {insumo.insumo?.unidad_venta}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {user?.pais.simbolo_moneda}
                          {insumo.subtotal?.toFixed(2) || "0.00"}
                        </p>
                        <p className="text-xs text-gray-600">
                          {user?.pais.simbolo_moneda}
                          {insumo.precioUnitario} c/u
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(item.productosUsados?.length > 0 ||
              item.insumosUsados?.length > 0) && (
              <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                {item.productosUsados?.length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Total Productos:</span>
                    <span className="font-semibold text-green-700">
                      {user?.pais.simbolo_moneda}
                      {totalProductosUsados.toFixed(2)}
                    </span>
                  </div>
                )}
                {item.insumosUsados?.length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span>Total Insumos:</span>
                    <span className="font-semibold text-blue-700">
                      {user?.pais.simbolo_moneda}
                      {totalInsumosUsados.toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <span className="text-sm font-semibold text-gray-700">
            {item.estado !== "completada" ? "VALOR SERVICIO:" : "TOTAL:"}
          </span>
          <span className="text-lg font-bold text-green-700">
            {user?.pais.simbolo_moneda}
            {item.estado !== "completada" ? item.totalPagar : item.totalFinal}
          </span>
        </div>

        {hasSelectedItems && (
          <div className="p-4 bg-orange-50 rounded-lg space-y-3 border border-orange-200">
            <h4 className="text-xs font-semibold text-orange-600 uppercase tracking-wide">
              Productos e Insumos Seleccionados
            </h4>

            {Object.values(selectedProductos).length > 0 && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-orange-700">
                  Productos:
                </h5>
                {Object.values(selectedProductos).map(
                  ({ producto, quantity }) => {
                    const precio = producto.preciosPorPais[0]?.precio || "0";
                    const existenciaReal = getExistenciaProducto(producto.id);
                    const subtotal = parseFloat(precio) * quantity;

                    return (
                      <div
                        key={`producto-${producto.id}`}
                        className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900">
                            {producto.nombre}
                          </p>
                          <p className="text-xs text-gray-600">
                            {user?.pais.simbolo_moneda}
                            {precio} c/u | Stock: {existenciaReal}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                handleQuantityChange(
                                  producto.id,
                                  quantity - 1,
                                  "producto"
                                )
                              }
                              disabled={quantity <= 1}
                              className="h-8 w-8 border-orange-300"
                            >
                              <MinusIcon className="h-3 w-3" />
                            </Button>

                            <span className="text-sm font-medium w-8 text-center">
                              {quantity}
                            </span>

                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() =>
                                handleQuantityChange(
                                  producto.id,
                                  quantity + 1,
                                  "producto"
                                )
                              }
                              disabled={quantity >= existenciaReal}
                              className="h-8 w-8 border-orange-300"
                            >
                              <PlusIcon className="h-3 w-3" />
                            </Button>
                          </div>

                          <span className="text-sm font-semibold text-gray-900 min-w-16 text-right">
                            {user?.pais.simbolo_moneda}
                            {subtotal.toFixed(2)}
                          </span>

                          {onRemoveProduct && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                onRemoveProduct(producto.id, "producto")
                              }
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2Icon className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}

            {Object.values(selectedInsumos).length > 0 && (
              <div className="space-y-2 pt-2 border-t border-orange-200">
                <h5 className="text-sm font-medium text-orange-700">
                  Insumos:
                </h5>
                {Object.values(selectedInsumos).map(({ insumo, quantity }) => {
                  const existenciaReal = getExistenciaInsumo(insumo.id);
                  const subtotal = parseFloat(insumo.costo) * quantity;

                  return (
                    <div
                      key={`insumo-${insumo.id}`}
                      className="flex items-center justify-between p-3 bg-white rounded-lg border border-orange-200"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {insumo.nombre}
                        </p>
                        <p className="text-xs text-gray-600">
                          {user?.pais.simbolo_moneda}
                          {insumo.costo} c/u | Stock: {existenciaReal}{" "}
                          {insumo.unidad_venta}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              handleQuantityChange(
                                insumo.id,
                                quantity - 1,
                                "insumo"
                              )
                            }
                            disabled={quantity <= 1}
                            className="h-8 w-8 border-orange-300"
                          >
                            <MinusIcon className="h-3 w-3" />
                          </Button>

                          <span className="text-sm font-medium w-8 text-center">
                            {quantity}
                          </span>

                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              handleQuantityChange(
                                insumo.id,
                                quantity + 1,
                                "insumo"
                              )
                            }
                            disabled={quantity >= existenciaReal}
                            className="h-8 w-8 border-orange-300"
                          >
                            <PlusIcon className="h-3 w-3" />
                          </Button>
                        </div>

                        <span className="text-sm font-semibold text-gray-900 min-w-16 text-right">
                          {user?.pais.simbolo_moneda}
                          {subtotal.toFixed(2)}
                        </span>

                        {onRemoveProduct && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onRemoveProduct(insumo.id, "insumo")}
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="space-y-2 pt-3 border-t border-orange-200">
              <div className="flex justify-between text-sm">
                <span>Subtotal adicional:</span>
                <span className="font-semibold text-orange-700">
                  {user?.pais.simbolo_moneda}
                  {totalAdicional.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-base font-bold">
                <span>VALOR TOTAL:</span>
                <span className="text-green-700">
                  {user?.pais.simbolo_moneda}
                  {(parseFloat(item.totalPagar) + totalAdicional).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2 pt-3">
          {item.estado.toLowerCase() === "pendiente" && onConfirm && (
            <Button
              onClick={onConfirm}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              Confirmar
            </Button>
          )}

          {item.estado.toLowerCase() === "confirmada" && (
            <>
              {onAddProducts && (
                <Button
                  onClick={onAddProducts}
                  variant="outline"
                  className="flex-1 border-orange-600 text-orange-600 hover:bg-orange-50"
                >
                  {hasSelectedItems
                    ? "Modificar Productos"
                    : "Agregar Productos"}
                </Button>
              )}
              {onComplete && (
                <Button
                  onClick={onComplete}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  Completar
                </Button>
              )}
            </>
          )}

          {(item.estado.toLowerCase() === "pendiente" ||
            item.estado.toLowerCase() === "confirmada") &&
            onCancel && (
              <Button
                onClick={onCancel}
                variant="destructive"
                className="flex-1"
              >
                Cancelar
              </Button>
            )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CardCitasMedico;
