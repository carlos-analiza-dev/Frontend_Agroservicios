export const getTipoBadgeVariant = (tipo: string) => {
  switch (tipo) {
    case "casa_matriz":
      return "default";
    case "sucursal":
      return "secondary";
    case "punto_venta":
      return "outline";
    default:
      return "secondary";
  }
};

export const getTipoLabel = (tipo: string) => {
  switch (tipo) {
    case "casa_matriz":
      return "Casa Matriz";
    case "sucursal":
      return "Sucursal";
    case "punto_venta":
      return "Punto de Venta";
    default:
      return tipo;
  }
};
