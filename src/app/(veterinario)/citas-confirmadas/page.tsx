"use client";
import { useState, useCallback, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useGetProductosDisponibles from "@/hooks/productos/useGetProductosDisponibles";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Loader2, Plus, Minus, X } from "lucide-react";
import { isAxiosError } from "axios";
import { Cita } from "@/apis/citas/interfaces/response-citas-confirm.interface";

import { Producto } from "@/apis/productos/interfaces/response-productos.interface";
import useGetCitasConfirmadasByMedico from "@/hooks/citas/useGetCitasConfirmadasByMedico";
import useGetInsumosDisponibles from "@/hooks/insumos/useGetInsumosDisponibles";
import { toast } from "react-toastify";
import { ActualizarCita } from "@/apis/citas/accions/update-cita";
import { EstadoCita } from "@/helpers/data/estadosCita";
import { MessageError } from "@/components/generics/MessageError";
import CardCitasMedico from "@/components/generics/CardCitasMedicos";
import { InsumoDis } from "@/apis/insumos/interfaces/response-insumos-disponibles.interface";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CrearCitaInsumos {
  citaId: string;
  insumoId: string;
  cantidad: number;
  precioUnitario: number;
}

interface CrearCitaProductos {
  citaId: string;
  productoId: string;
  cantidad: number;
  precioUnitario: number;
}

const CreateCitaInsumos = async (data: CrearCitaInsumos) => {
  return Promise.resolve();
};

const CreateCitaProductos = async (data: CrearCitaProductos) => {
  return Promise.resolve();
};

const CitasConfirmadasVeterinario = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const userId = user?.id || "";
  const limit = 10;

  const [activeTab, setActiveTab] = useState<"insumos" | "productos">(
    "insumos"
  );
  const [selectedCita, setSelectedCita] = useState<Cita | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);

  const [selectedInsumos, setSelectedInsumos] = useState<{
    [citaId: string]: {
      [insumoId: string]: { insumo: InsumoDis; quantity: number };
    };
  }>({});

  const [selectedProductos, setSelectedProductos] = useState<{
    [citaId: string]: {
      [productoId: string]: { producto: Producto; quantity: number };
    };
  }>({});

  const [totalAdicional, setTotalAdicional] = useState<{
    [citaId: string]: number;
  }>({});

  const {
    data: citas,
    isLoading,
    refetch,
    isRefetching,
    fetchNextPage,
    isError,
    hasNextPage,
    isFetchingNextPage,
  } = useGetCitasConfirmadasByMedico(userId, limit);

  const { data: insumos_disponibles, refetch: refresh_insumos } =
    useGetInsumosDisponibles();
  const { data: productos_disponibles, refetch: refresh_products } =
    useGetProductosDisponibles();

  const handleAddProducts = (cita: Cita) => {
    setSelectedCita(cita);
    setShowProductModal(true);
  };

  const handleRemoveProduct = (
    productId: string,
    type: "insumo" | "producto"
  ) => {
    if (!selectedCita) return;

    if (type === "insumo") {
      setSelectedInsumos((prev) => {
        const newProducts = { ...prev };
        if (
          newProducts[selectedCita.id] &&
          newProducts[selectedCita.id][productId]
        ) {
          const { [productId]: _, ...rest } = newProducts[selectedCita.id];
          newProducts[selectedCita.id] = rest;

          if (Object.keys(newProducts[selectedCita.id]).length === 0) {
            delete newProducts[selectedCita.id];
          }
        }
        return newProducts;
      });
    } else {
      setSelectedProductos((prev) => {
        const newProducts = { ...prev };
        if (
          newProducts[selectedCita.id] &&
          newProducts[selectedCita.id][productId]
        ) {
          const { [productId]: _, ...rest } = newProducts[selectedCita.id];
          newProducts[selectedCita.id] = rest;

          if (Object.keys(newProducts[selectedCita.id]).length === 0) {
            delete newProducts[selectedCita.id];
          }
        }
        return newProducts;
      });
    }
  };

  const handleProductSelection = (
    item: InsumoDis | Producto,
    type: "insumo" | "producto"
  ) => {
    if (!selectedCita) return;

    if (type === "insumo") {
      const insumo = item as InsumoDis;
      setSelectedInsumos((prev) => {
        const currentCitaProducts = prev[selectedCita.id] || {};
        const newSelection = { ...prev };

        if (currentCitaProducts[insumo.id]) {
          const { [insumo.id]: _, ...rest } = currentCitaProducts;
          newSelection[selectedCita.id] = rest;
        } else {
          newSelection[selectedCita.id] = {
            ...currentCitaProducts,
            [insumo.id]: { insumo, quantity: 1 },
          };
        }

        return newSelection;
      });
    } else {
      const producto = item as Producto;
      setSelectedProductos((prev) => {
        const currentCitaProducts = prev[selectedCita.id] || {};
        const newSelection = { ...prev };

        if (currentCitaProducts[producto.id]) {
          const { [producto.id]: _, ...rest } = currentCitaProducts;
          newSelection[selectedCita.id] = rest;
        } else {
          newSelection[selectedCita.id] = {
            ...currentCitaProducts,
            [producto.id]: { producto, quantity: 1 },
          };
        }

        return newSelection;
      });
    }
  };

  const updateProductQuantity = (
    id: string,
    quantity: number,
    type: "insumo" | "producto"
  ) => {
    if (!selectedCita || quantity < 1) return;

    if (type === "insumo") {
      setSelectedInsumos((prev) => {
        const currentCitaProducts = prev[selectedCita.id] || {};
        const product = currentCitaProducts[id]?.insumo;

        // Para insumos, usamos la propiedad 'cantidad' en lugar de 'inventario.cantidadDisponible'
        if (!product || quantity > (product.cantidad || 0)) return prev;

        return {
          ...prev,
          [selectedCita.id]: {
            ...currentCitaProducts,
            [id]: { ...currentCitaProducts[id], quantity },
          },
        };
      });
    } else {
      setSelectedProductos((prev) => {
        const currentCitaProducts = prev[selectedCita.id] || {};
        const product = currentCitaProducts[id]?.producto;

        // Para productos, verificamos la disponibilidad según tu interfaz
        if (!product || !product.disponible) return prev;

        return {
          ...prev,
          [selectedCita.id]: {
            ...currentCitaProducts,
            [id]: { ...currentCitaProducts[id], quantity },
          },
        };
      });
    }
  };

  const calculateTotal = useCallback(
    (citaId: string) => {
      const insumosTotal = selectedInsumos[citaId]
        ? Object.values(selectedInsumos[citaId]).reduce(
            (total, { insumo, quantity }) =>
              total + parseFloat(insumo.costo) * quantity,
            0
          )
        : 0;

      const productosTotal = selectedProductos[citaId]
        ? Object.values(selectedProductos[citaId]).reduce(
            (total, { producto, quantity }) => {
              // Usamos el precio del primer país o un valor por defecto
              const precio = producto.preciosPorPais?.[0]?.precio || "0";
              return total + parseFloat(precio) * quantity;
            },
            0
          )
        : 0;

      return insumosTotal + productosTotal;
    },
    [selectedInsumos, selectedProductos]
  );

  useEffect(() => {
    if (!selectedCita) return;

    const newTotal = calculateTotal(selectedCita.id);
    setTotalAdicional((prev) => ({
      ...prev,
      [selectedCita.id]: newTotal,
    }));
  }, [selectedInsumos, selectedProductos, selectedCita, calculateTotal]);

  const handleSaveProducts = async () => {
    if (!selectedCita) return;

    try {
      if (selectedInsumos[selectedCita.id]) {
        const insumosPromises = Object.values(
          selectedInsumos[selectedCita.id]
        ).map(async ({ insumo, quantity }) => {
          const insumoData: CrearCitaInsumos = {
            citaId: selectedCita.id,
            insumoId: insumo.id,
            cantidad: quantity,
            precioUnitario: parseFloat(insumo.costo),
          };

          await CreateCitaInsumos(insumoData);
          return { success: true, insumoId: insumo.id };
        });

        await Promise.all(insumosPromises);
      }

      if (selectedProductos[selectedCita.id]) {
        const productosPromises = Object.values(
          selectedProductos[selectedCita.id]
        ).map(async ({ producto, quantity }) => {
          const precio = producto.preciosPorPais?.[0]?.precio || "0";
          const productoData: CrearCitaProductos = {
            citaId: selectedCita.id,
            productoId: producto.id,
            cantidad: quantity,
            precioUnitario: parseFloat(precio),
          };

          await CreateCitaProductos(productoData);
          return { success: true, productoId: producto.id };
        });

        await Promise.all(productosPromises);
      }

      queryClient.invalidateQueries({
        queryKey: ["obtener-citas-confirmadas", userId, limit],
      });

      toast.success(
        `Se agregaron productos por un valor de ${user?.pais.simbolo_moneda}${selectedCita ? totalAdicional[selectedCita.id]?.toFixed(2) || "0.00" : "0.00"}`
      );

      setShowProductModal(false);
    } catch (error) {
      toast.error("No se pudieron guardar los productos");
    }
  };

  const onRefresh = useCallback(async () => {
    await refetch();
    await refresh_products();
    await refresh_insumos();
  }, [refetch, refresh_products, refresh_insumos]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const updateCitaMutation = useMutation({
    mutationFn: ({
      id,
      estado,
      totalFinal,
    }: {
      id: string;
      estado: string;
      totalFinal: number;
    }) => ActualizarCita(id, { estado, totalFinal }),
    onSuccess: async () => {
      toast.success("Cita completada exitosamente con todos los productos");

      queryClient.invalidateQueries({
        queryKey: ["obtener-citas-confirmadas", userId, limit],
      });
      queryClient.invalidateQueries({
        queryKey: ["obtener-citas-completadas"],
      });

      setSelectedCita(null);
      setSelectedInsumos({});
      setSelectedProductos({});
      setTotalAdicional({});
      await refetch();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al actualizar la cita";

        toast.error(errorMessage);
      } else {
        toast.error("Contacte al administrador");
      }
    },
  });

  const handleCompleteCita = async (id: string) => {
    const cita = allCitas.find((c) => c.id === id);
    if (!cita) return;

    const totalServicio = parseFloat(cita.totalPagar);
    const totalInsumos = totalAdicional[id] || 0;
    const totalFinal = totalServicio + totalInsumos;

    try {
      if (selectedInsumos[id]) {
        const insumosSinStock = Object.values(selectedInsumos[id]).filter(
          ({ insumo, quantity }) => quantity > (insumo.cantidad || 0)
        );

        if (insumosSinStock.length > 0) {
          const nombresInsumos = insumosSinStock
            .map(({ insumo }) => insumo.nombre)
            .join(", ");
          throw new Error(`No hay suficiente stock para: ${nombresInsumos}`);
        }
      }

      if (selectedProductos[id]) {
        const productosSinStock = Object.values(selectedProductos[id]).filter(
          ({ producto, quantity }) => !producto.disponible
        );

        if (productosSinStock.length > 0) {
          const nombresProductos = productosSinStock
            .map(({ producto }) => producto.nombre)
            .join(", ");
          throw new Error(`Productos no disponibles: ${nombresProductos}`);
        }
      }

      await updateCitaMutation.mutateAsync({
        id,
        estado: EstadoCita.COMPLETADA,
        totalFinal: totalFinal,
      });
    } catch (error) {
      let errorMessage = "Error al completar la cita";

      if (error instanceof Error) {
        errorMessage = error.message;
      } else if (isAxiosError(error)) {
        errorMessage = error.response?.data?.message || error.message;
      }

      toast.error(errorMessage);
    }
  };

  if (isLoading || updateCitaMutation.isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <MessageError
          titulo="No se encontraron citas"
          descripcion="No se encontraron citas para este modulo en este momento."
          onPress={() => onRefresh()}
        />
      </div>
    );
  }

  const allCitas = citas?.pages.flatMap((page) => page.citas) || [];

  return (
    <>
      <div className="container mx-auto p-4 md:p-6">
        <ScrollArea className="h-screen">
          <div className="space-y-4">
            {allCitas.map((item) => (
              <div key={item.id} className="max-w-4xl mx-auto">
                <CardCitasMedico
                  item={item}
                  onComplete={() => handleCompleteCita(item.id)}
                  onAddProducts={() => handleAddProducts(item)}
                  selectedInsumos={selectedInsumos[item.id] || {}}
                  selectedProductos={selectedProductos[item.id] || {}}
                  totalAdicional={totalAdicional[item.id] || 0}
                  onRemoveProduct={(productId, type) => {
                    setSelectedCita(item);
                    handleRemoveProduct(productId, type);
                  }}
                />
              </div>
            ))}
          </div>

          {isFetchingNextPage && (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          )}

          {allCitas.length === 0 && (
            <div className="flex items-center justify-center py-12">
              <MessageError
                titulo="No se encontraron citas"
                descripcion="Haz clic para recargar"
                onPress={() => onRefresh()}
              />
            </div>
          )}
        </ScrollArea>
      </div>

      <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Seleccionar Insumos/Productos</span>
            </DialogTitle>
          </DialogHeader>

          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as "insumos" | "productos")
            }
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="insumos">Insumos</TabsTrigger>
              <TabsTrigger value="productos">Productos</TabsTrigger>
            </TabsList>
          </Tabs>

          <ScrollArea className="flex-1">
            <div className="space-y-3 p-1">
              {activeTab === "insumos"
                ? insumos_disponibles?.insumos.map((insumo) => {
                    const isSelected =
                      selectedCita &&
                      selectedInsumos[selectedCita.id]?.[insumo.id];
                    return (
                      <Card
                        key={insumo.id}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? "bg-blue-50 border-blue-200" : ""
                        }`}
                      >
                        <CardContent className="p-4">
                          <div
                            onClick={() =>
                              handleProductSelection(insumo, "insumo")
                            }
                            className="space-y-2"
                          >
                            <div className="flex justify-between items-start">
                              <h3 className="font-semibold text-lg">
                                {insumo.nombre}
                              </h3>
                              <Badge variant="secondary">
                                {insumo.costo} {user?.pais.simbolo_moneda}
                              </Badge>
                            </div>

                            <p className="text-sm">
                              Disponibles: {insumo.cantidad || 0}{" "}
                              {insumo.unidad_venta}
                            </p>

                            {isSelected && (
                              <div className="flex items-center space-x-3 mt-3">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateProductQuantity(
                                      insumo.id,
                                      selectedInsumos[selectedCita.id!][
                                        insumo.id
                                      ].quantity - 1,
                                      "insumo"
                                    );
                                  }}
                                  disabled={
                                    selectedInsumos[selectedCita.id!][insumo.id]
                                      .quantity <= 1
                                  }
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>

                                <span className="font-medium w-8 text-center">
                                  {
                                    selectedInsumos[selectedCita.id!][insumo.id]
                                      .quantity
                                  }
                                </span>

                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateProductQuantity(
                                      insumo.id,
                                      selectedInsumos[selectedCita.id!][
                                        insumo.id
                                      ].quantity + 1,
                                      "insumo"
                                    );
                                  }}
                                  disabled={
                                    selectedInsumos[selectedCita.id!][insumo.id]
                                      .quantity >= (insumo.cantidad || 0)
                                  }
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })
                : productos_disponibles?.data.productos.map((producto) => {
                    const isSelected =
                      selectedCita &&
                      selectedProductos[selectedCita.id]?.[producto.id];
                    const precio = producto.preciosPorPais?.[0]?.precio || "0";
                    return (
                      <Card
                        key={producto.id}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? "bg-blue-50 border-blue-200" : ""
                        }`}
                      >
                        <CardContent className="p-4">
                          <div
                            onClick={() =>
                              handleProductSelection(producto, "producto")
                            }
                            className="space-y-2"
                          >
                            <div className="flex justify-between items-start">
                              <h3 className="font-semibold text-lg">
                                {producto.nombre}
                              </h3>
                              <Badge variant="secondary">
                                {precio} {user?.pais.simbolo_moneda}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {producto.descripcion}
                            </p>
                            <p className="text-sm">
                              Disponible: {producto.disponible ? "Sí" : "No"} |{" "}
                              {producto.unidad_venta}
                            </p>

                            {isSelected && (
                              <div className="flex items-center space-x-3 mt-3">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateProductQuantity(
                                      producto.id,
                                      selectedProductos[selectedCita.id!][
                                        producto.id
                                      ].quantity - 1,
                                      "producto"
                                    );
                                  }}
                                  disabled={
                                    selectedProductos[selectedCita.id!][
                                      producto.id
                                    ].quantity <= 1
                                  }
                                >
                                  <Minus className="w-4 h-4" />
                                </Button>

                                <span className="font-medium w-8 text-center">
                                  {
                                    selectedProductos[selectedCita.id!][
                                      producto.id
                                    ].quantity
                                  }
                                </span>

                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    updateProductQuantity(
                                      producto.id,
                                      selectedProductos[selectedCita.id!][
                                        producto.id
                                      ].quantity + 1,
                                      "producto"
                                    );
                                  }}
                                  disabled={!producto.disponible}
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
            </div>
          </ScrollArea>

          <Card className="mt-4">
            <CardContent className="p-4">
              <h4 className="font-semibold mb-3">Resumen</h4>

              {selectedCita && selectedInsumos[selectedCita.id] && (
                <>
                  <h5 className="font-medium mb-2">Insumos:</h5>
                  {Object.values(selectedInsumos[selectedCita.id]).map(
                    ({ insumo, quantity }) => (
                      <div
                        key={insumo.id}
                        className="flex justify-between ml-4 text-sm"
                      >
                        <span>
                          {insumo.nombre} x {quantity}
                        </span>
                        <span>
                          {(parseFloat(insumo.costo) * quantity).toFixed(2)}{" "}
                          {user?.pais.simbolo_moneda}
                        </span>
                      </div>
                    )
                  )}
                </>
              )}

              {selectedCita && selectedProductos[selectedCita.id] && (
                <>
                  <h5 className="font-medium mt-3 mb-2">Productos:</h5>
                  {Object.values(selectedProductos[selectedCita.id]).map(
                    ({ producto, quantity }) => {
                      const precio =
                        producto.preciosPorPais?.[0]?.precio || "0";
                      return (
                        <div
                          key={producto.id}
                          className="flex justify-between ml-4 text-sm"
                        >
                          <span>
                            {producto.nombre} x {quantity}
                          </span>
                          <span>
                            {(parseFloat(precio) * quantity).toFixed(2)}{" "}
                            {user?.pais.simbolo_moneda}
                          </span>
                        </div>
                      );
                    }
                  )}
                </>
              )}

              <Separator className="my-3" />
              <div className="font-semibold text-lg">
                Total adicional:{" "}
                {selectedCita
                  ? totalAdicional[selectedCita.id]?.toFixed(2) || "0.00"
                  : "0.00"}{" "}
                {user?.pais.simbolo_moneda}
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleSaveProducts}
            disabled={
              !selectedCita ||
              ((!selectedInsumos[selectedCita.id] ||
                Object.keys(selectedInsumos[selectedCita.id]).length === 0) &&
                (!selectedProductos[selectedCita.id] ||
                  Object.keys(selectedProductos[selectedCita.id]).length === 0))
            }
            className="mt-4"
          >
            {selectedCita &&
            ((selectedInsumos[selectedCita.id] &&
              Object.keys(selectedInsumos[selectedCita.id]).length > 0) ||
              (selectedProductos[selectedCita.id] &&
                Object.keys(selectedProductos[selectedCita.id]).length > 0))
              ? `Agregar a la cita`
              : "Selecciona al menos un insumo o producto"}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CitasConfirmadasVeterinario;
