"use client";
import { useState, useCallback, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import useGetProductosDisponibles from "@/hooks/productos/useGetProductosDisponibles";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
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
import useGetExistenciaInsumos from "@/hooks/existencias/useGetExistenciaInsumos";
import useGetExistenciaProductos from "@/hooks/existencias/useGetExistenciaProductos";
import { ResponseExistenciaInsumosInterface } from "@/apis/existencia_insumos/interfaces/response-exsistencia-insumos.interface";
import { ResponseExistenciaProductosInterface } from "@/apis/existencia_productos/interfaces/response-existencia-productos.interface";
import CardDetailsInsumos from "./ui/CardDetailsInsumos";
import CardDetailsProductos from "./ui/CardDetailsProductos";
import ResumenCita from "./ui/ResumenCita";
import { CreateCitaInsumo } from "@/apis/cita-insumos/accions/crear-cita-insumo";
import { CreateCitaProducto } from "@/apis/cita-producto/accions/crear-cita-producto";

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

const CitasConfirmadasVeterinario = () => {
  const { user } = useAuthStore();
  const sucursalId = user?.sucursal.id || "";
  const queryClient = useQueryClient();

  const userId = user?.id || "";
  const limit = 10;

  const [activeTab, setActiveTab] = useState<"insumos" | "productos">(
    "insumos"
  );
  const [selectedCita, setSelectedCita] = useState<Cita | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);

  /* const [selectedInsumos, setSelectedInsumos] = useState<{
    [citaId: string]: {
      [insumoId: string]: { insumo: InsumoDis; quantity: number };
    };
  }>({}); */

  const [selectedProductos, setSelectedProductos] = useState<{
    [citaId: string]: {
      [productoId: string]: { producto: Producto; quantity: number };
    };
  }>({});

  const [totalAdicional, setTotalAdicional] = useState<{
    [citaId: string]: number;
  }>({});

  const { data: existenciaInsumos } = useGetExistenciaInsumos(
    undefined,
    sucursalId
  );
  const { data: existenciaProductos } = useGetExistenciaProductos(
    undefined,
    sucursalId
  );

  const getExistenciaInsumo = useCallback(
    (insumoId: string): number => {
      if (!existenciaInsumos) return 0;

      const existencia = existenciaInsumos.find(
        (item: ResponseExistenciaInsumosInterface) => item.insumoId === insumoId
      );

      return Number(existencia?.existenciaTotal) || 0;
    },
    [existenciaInsumos]
  );

  const getExistenciaProducto = useCallback(
    (productoId: string): number => {
      if (!existenciaProductos) return 0;

      const existencia = existenciaProductos.find(
        (item: ResponseExistenciaProductosInterface) =>
          item.productoId === productoId
      );

      return Number(existencia?.existenciaTotal) || 0;
    },
    [existenciaProductos]
  );

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
      /* setSelectedInsumos((prev) => {
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
      }); */
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
      /*   const insumo = item as InsumoDis;
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
      }); */
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
      /*  setSelectedInsumos((prev) => {
        const currentCitaProducts = prev[selectedCita.id] || {};
        const product = currentCitaProducts[id]?.insumo;

        const existenciaReal = getExistenciaInsumo(id);
        if (!product || quantity > existenciaReal) return prev;

        const updated = {
          ...prev,
          [selectedCita.id]: {
            ...currentCitaProducts,
            [id]: { ...currentCitaProducts[id], quantity },
          },
        };

        setTimeout(() => {
          const newTotal = calculateTotal(selectedCita.id);
          setTotalAdicional((prevTotal) => ({
            ...prevTotal,
            [selectedCita.id]: newTotal,
          }));
        }, 0);

        return updated;
      }); */
    } else {
      setSelectedProductos((prev) => {
        const currentCitaProducts = prev[selectedCita.id] || {};
        const product = currentCitaProducts[id]?.producto;

        const existenciaReal = getExistenciaProducto(id);
        if (!product || quantity > existenciaReal) return prev;

        const updated = {
          ...prev,
          [selectedCita.id]: {
            ...currentCitaProducts,
            [id]: { ...currentCitaProducts[id], quantity },
          },
        };

        setTimeout(() => {
          const newTotal = calculateTotal(selectedCita.id);
          setTotalAdicional((prevTotal) => ({
            ...prevTotal,
            [selectedCita.id]: newTotal,
          }));
        }, 0);

        return updated;
      });
    }
  };

  const calculateTotal = useCallback(
    (citaId: string) => {
      /* const insumosTotal = selectedInsumos[citaId]
        ? Object.values(selectedInsumos[citaId]).reduce(
            (total, { insumo, quantity }) =>
              total + parseFloat(insumo.costo) * quantity,
            0
          )
        : 0; */

      const productosTotal = selectedProductos[citaId]
        ? Object.values(selectedProductos[citaId]).reduce(
            (total, { producto, quantity }) => {
              const precio = producto.preciosPorPais?.[0]?.precio || "0";
              return total + parseFloat(precio) * quantity;
            },
            0
          )
        : 0;

      return /* insumosTotal + */ productosTotal;
    },
    [/* selectedInsumos */ selectedProductos]
  );

  useEffect(() => {
    if (!selectedCita) return;

    const newTotal = calculateTotal(selectedCita.id);
    setTotalAdicional((prev) => ({
      ...prev,
      [selectedCita.id]: newTotal,
    }));
  }, [/* selectedInsumos, */ selectedProductos, selectedCita, calculateTotal]);

  const handleSaveProducts = async () => {
    if (!selectedCita) return;

    try {
      /* if (selectedInsumos[selectedCita.id]) {
        const insumosPromises = Object.values(
          selectedInsumos[selectedCita.id]
        ).map(async ({ insumo, quantity }) => {
          const insumoData: CrearCitaInsumos = {
            citaId: selectedCita.id,
            insumoId: insumo.id,
            cantidad: quantity,
            precioUnitario: parseFloat(insumo.costo),
          };

          return { success: true, insumoId: insumo.id };
        });

        await Promise.all(insumosPromises);
      } */

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
      /*  setSelectedInsumos({}); */
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
      /*  if (selectedInsumos[id]) {
        const sinStock = Object.values(selectedInsumos[id]).filter(
          ({ insumo, quantity }) => quantity > getExistenciaInsumo(insumo.id)
        );
        if (sinStock.length > 0) {
          throw new Error(
            `No hay suficiente stock para: ${sinStock
              .map(({ insumo }) => insumo.nombre)
              .join(", ")}`
          );
        }
      } */

      if (selectedProductos[id]) {
        const sinStock = Object.values(selectedProductos[id]).filter(
          ({ producto, quantity }) =>
            quantity > getExistenciaProducto(producto.id)
        );
        if (sinStock.length > 0) {
          throw new Error(
            `No hay suficiente stock para: ${sinStock
              .map(({ producto }) => producto.nombre)
              .join(", ")}`
          );
        }
      }

      /*  if (selectedInsumos[id]) {
        const insumosPromises = Object.values(selectedInsumos[id]).map(
          async ({ insumo, quantity }) => {
            const data = {
              citaId: id,
              insumoId: insumo.id,
              cantidad: quantity,
              precioUnitario: parseFloat(insumo.costo),
            };
            await CreateCitaInsumo(data);
          }
        );
        await Promise.all(insumosPromises);
      } */

      if (selectedProductos[id]) {
        const productosPromises = Object.values(selectedProductos[id]).map(
          async ({ producto, quantity }) => {
            const precio = producto.preciosPorPais?.[0]?.precio || "0";
            const data = {
              citaId: id,
              productoId: producto.id,
              cantidad: quantity,
              precioUnitario: parseFloat(precio),
            };
            await CreateCitaProducto(data);
          }
        );
        await Promise.all(productosPromises);
      }

      await updateCitaMutation.mutateAsync({
        id,
        estado: EstadoCita.COMPLETADA,
        totalFinal,
      });

      toast.success(
        `Cita completada correctamente (${user?.pais.simbolo_moneda}${totalFinal.toFixed(2)})`
      );
    } catch (error) {
      if (isAxiosError(error)) {
        const msg = error.response?.data?.message;
        toast.error(
          Array.isArray(msg) ? msg[0] : msg || "Error al completar la cita"
        );
      } else {
        toast.error((error as Error).message || "Error al completar la cita");
      }
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
                  /* selectedInsumos={selectedInsumos[item.id] || {}} */
                  selectedProductos={selectedProductos[item.id] || {}}
                  totalAdicional={totalAdicional[item.id] || 0}
                  onRemoveProduct={(productId, type) => {
                    setSelectedCita(item);
                    handleRemoveProduct(productId, type);
                  }}
                  onUpdateQuantity={(productId, quantity, type) => {
                    setSelectedCita(item);
                    updateProductQuantity(productId, quantity, type);
                  }}
                  existenciaInsumos={existenciaInsumos || []}
                  existenciaProductos={existenciaProductos || []}
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
        <DialogContent className="max-w-6xl h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="flex items-center justify-between">
              <span>Seleccionar Productos</span>
              <Badge variant="outline" className="ml-2">
                Sucursal: {user?.sucursal.nombre}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "productos")}
            className="flex-shrink-0"
          >
            <TabsList className="grid w-full grid-cols-1">
              {/* <TabsTrigger value="insumos">Insumos</TabsTrigger> */}
              <TabsTrigger value="productos">Productos</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="flex flex-1 gap-4 min-h-0">
            <div className="flex-1 min-w-0">
              <ScrollArea className="h-full border rounded-lg">
                <div className="space-y-3 p-4">
                  {/* activeTab === "insumos"
                    ? insumos_disponibles?.insumos.map((insumo) => {
                        const isSelected =
                          selectedCita &&
                          selectedInsumos[selectedCita.id]?.[insumo.id];
                        const existenciaReal = getExistenciaInsumo(insumo.id);
                        const disponible = existenciaReal > 0;

                        return (
                          <CardDetailsInsumos
                            key={insumo.id}
                            insumo={insumo}
                            isSelected={isSelected}
                            disponible={disponible}
                            handleProductSelection={handleProductSelection}
                            user={user}
                            existenciaReal={existenciaReal}
                            updateProductQuantity={updateProductQuantity}
                            selectedInsumos={selectedInsumos}
                            selectedCita={selectedCita}
                          />
                        );
                      })
                    : */ productos_disponibles?.data.productos.map(
                    (producto) => {
                      const isSelected =
                        selectedCita &&
                        selectedProductos[selectedCita.id]?.[producto.id];
                      const precio =
                        producto.preciosPorPais?.[0]?.precio || "0";
                      const existenciaReal = getExistenciaProducto(producto.id);
                      const disponible = existenciaReal > 0;

                      return (
                        <CardDetailsProductos
                          key={producto.id}
                          producto={producto}
                          isSelected={isSelected}
                          disponible={disponible}
                          handleProductSelection={handleProductSelection}
                          user={user}
                          existenciaReal={existenciaReal}
                          updateProductQuantity={updateProductQuantity}
                          selectedProductos={selectedProductos}
                          selectedCita={selectedCita}
                          precio={precio}
                        />
                      );
                    }
                  )}
                </div>
              </ScrollArea>
            </div>

            <div className="w-80 flex-shrink-0">
              <ResumenCita
                selectedCita={selectedCita}
                selectedProductos={selectedProductos}
                /* selectedInsumos={selectedInsumos} */
                totalAdicional={totalAdicional}
                user={user}
              />
            </div>
          </div>
          <div className="flex-shrink-0 pt-4 border-t">
            <Button
              onClick={handleSaveProducts}
              disabled={
                !selectedCita /* (!selectedInsumos[selectedCita.id] ||
                  Object.keys(selectedInsumos[selectedCita.id]).length === 0) && */ ||
                !selectedProductos[selectedCita.id] ||
                Object.keys(selectedProductos[selectedCita.id]).length === 0
              }
              className="w-full"
            >
              {selectedCita /* (selectedInsumos[selectedCita.id] &&
                Object.keys(selectedInsumos[selectedCita.id]).length > 0) || */ &&
              selectedProductos[selectedCita.id] &&
              Object.keys(selectedProductos[selectedCita.id]).length > 0
                ? `Agregar a la cita`
                : "Selecciona al menos un insumo o producto"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CitasConfirmadasVeterinario;
