import { ObtenerPedidosBySucursal } from "@/apis/pedidos/accions/obtener-pedidos-cliente";
import { EstadoPedido } from "@/apis/pedidos/interface/crear-pedido.interface";
import { useQuery } from "@tanstack/react-query";

const useGetCountPedidosPorEstado = (sucursalId: string) => {
  return useQuery({
    queryKey: ["count-pedidos-por-estado", sucursalId],
    queryFn: async () => {
      const counts: Record<EstadoPedido, number> = {} as Record<
        EstadoPedido,
        number
      >;
      const estados = Object.values(EstadoPedido);
      const promises = estados.map(async (estado) => {
        try {
          const data = await ObtenerPedidosBySucursal(sucursalId, 1, 0, estado);
          counts[estado] = data.total || 0;
        } catch (error) {
          counts[estado] = 0;
        }
      });

      await Promise.all(promises);
      return counts;
    },
    retry: false,
    enabled: !!sucursalId,
  });
};

export default useGetCountPedidosPorEstado;
