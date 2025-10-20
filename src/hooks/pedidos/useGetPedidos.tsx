import { ObtenerPedidosBySucursal } from "@/apis/pedidos/accions/obtener-pedidos-cliente";
import { EstadoPedido } from "@/apis/pedidos/interface/crear-pedido.interface";
import { useQuery } from "@tanstack/react-query";

const useGetPedidos = (
  sucursalId: string,
  limit: number = 10,
  offset: number = 0,
  estado: EstadoPedido
) => {
  return useQuery({
    queryKey: ["pedidos-user", sucursalId, limit, offset, estado],
    queryFn: () => ObtenerPedidosBySucursal(sucursalId, limit, offset, estado),
    retry: false,
    enabled: !!sucursalId,
  });
};

export default useGetPedidos;
