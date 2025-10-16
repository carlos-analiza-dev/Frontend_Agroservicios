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
  SendIcon,
  CarIcon,
  BriefcaseMedical,
  ExternalLinkIcon,
} from "lucide-react";
import React, { useEffect, useState } from "react";

import { Insumo } from "@/apis/insumos/interfaces/response-insumos.interface";
import { Producto } from "@/apis/productos/interfaces/response-productos.interface";
import { useAuthStore } from "@/providers/store/useAuthStore";
import {
  Cita,
  Finca,
} from "@/apis/medicos/interfaces/obtener-citas-medicos.interface";
import { toast } from "react-toastify";
import { obtenerTiempoViajeGoogleMaps } from "@/apis/google-maps/accions/obtenerTiempoViajeGoogleMaps";
import MapIframe from "@/components/generics/MapIframe";

interface Props {
  item: Cita;
  onConfirm?: () => void;
  onCancel?: () => void;
  onComplete?: () => void;
  onAddProducts?: () => void;
  selectedInsumos?: { [key: string]: { insumo: Insumo; quantity: number } };
  selectedProductos?: {
    [key: string]: { producto: Producto; quantity: number };
  };
  totalAdicional?: number;
  onRemoveProduct?: (productId: string, type: "insumo" | "producto") => void;
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

  const handleOpenMap = (finca: Finca) => {
    if (finca.latitud && finca.longitud) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${finca.latitud},${finca.longitud}`;
      window.open(url, "_blank");
    }
  };

  const handleCall = (phoneNumber: string) => {
    window.open(`tel:${phoneNumber}`);
  };

  const handleDownloadInvoice = async () => {
    try {
      /*   await ObtenerFacturaCita(item.id); */
      toast.success("La factura se ha descargado correctamente");
    } catch (error) {
      toast.error("No se pudo generar la factura");
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

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg border border-gray-200">
      <CardContent className="p-4 md:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <BriefcaseMedical className="h-5 w-5 text-blue-600" />
            <h3 className="font-semibold text-base md:text-lg text-gray-900">
              {item.subServicio.nombre}
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
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Ubicación
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleOpenMap(item.finca)}
                className="h-8 text-xs text-blue-600 hover:text-blue-700"
              >
                <ExternalLinkIcon className="h-3 w-3 mr-1" />
                Abrir en Maps
              </Button>
            </div>
            <div className="w-full h-48 rounded-lg border border-gray-300 overflow-hidden">
              <MapIframe
                lat={item.finca.latitud}
                lng={item.finca.longitud}
                className="w-full h-full"
              />
            </div>
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
            <button
              onClick={() => handleOpenMap(item.finca)}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
            >
              <MapPinIcon className="h-4 w-4" />
              <span className="text-left truncate">
                {item.finca.nombre_finca}
              </span>
            </button>
            <div className="flex items-center gap-2">
              <BuildingIcon className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-700">
                {item.finca.ubicacion.split(",").slice(1).join(",").trim() ||
                  item.finca.ubicacion}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <span className="text-sm font-semibold text-gray-700">
            {item.estado !== "completada" ? "VALOR SERVICIO:" : "TOTAL:"}
          </span>
          <span className="text-lg font-bold text-green-700">
            {user?.pais.simbolo_moneda}
            {item.estado !== "completada" ? item.totalPagar : item.totalFinal}
          </span>
        </div>

        {(Object.keys(selectedInsumos).length > 0 ||
          Object.keys(selectedProductos).length > 0) && (
          <div className="p-4 bg-gray-50 rounded-lg space-y-3">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
              Productos Agregados
            </h4>

            <div className="space-y-2">
              {Object.values(selectedProductos).map(
                ({ producto, quantity }) => (
                  <div
                    key={`producto-${producto.id}`}
                    className="flex items-center justify-between p-2 bg-white rounded border"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {producto.nombre} x {quantity}
                      </p>
                      <p className="text-xs text-gray-600">
                        {user?.pais.simbolo_moneda}
                        {producto.preciosPorPais[0].precio} c/u
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {user?.pais.simbolo_moneda}
                        {(
                          parseFloat(producto.preciosPorPais[0].precio) *
                          quantity
                        ).toFixed(2)}
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
                )
              )}
            </div>

            <div className="space-y-2 pt-2 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span>Subtotal adicional:</span>
                <span className="font-semibold text-green-700">
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
                  Agregar Productos
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

          {item.estado.toLowerCase() === "completada" && (
            <Button
              onClick={handleDownloadInvoice}
              variant="outline"
              className="flex-1"
            >
              <SendIcon className="h-4 w-4 mr-2" />
              Enviar Factura
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CardCitasMedico;
