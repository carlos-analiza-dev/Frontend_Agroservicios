import { UnidadMedida } from "../data/unidadMedidas";

export const getUnidadesFraccionamiento = (unidadVentaSeleccionada: string) => {
  switch (unidadVentaSeleccionada) {
    case "kilogramo":
      return UnidadMedida.filter((u) =>
        ["gramo", "libra", "onza"].includes(u.value)
      );

    case "gramo":
      return UnidadMedida.filter((u) => ["miligramo"].includes(u.value));

    case "libra":
      return UnidadMedida.filter((u) => ["onza"].includes(u.value));

    case "galon":
      return UnidadMedida.filter((u) =>
        ["litro", "mililitro"].includes(u.value)
      );

    case "litro":
      return UnidadMedida.filter((u) =>
        ["mililitro", "centilitro"].includes(u.value)
      );

    case "mililitro":
      return UnidadMedida.filter((u) => ["centilitro"].includes(u.value));

    case "metro":
      return UnidadMedida.filter((u) =>
        ["centimetro", "milimetro", "pie", "pulgada"].includes(u.value)
      );

    case "m2":
      return UnidadMedida.filter((u) => ["cm2", "pie2"].includes(u.value));

    case "m3":
      return UnidadMedida.filter((u) =>
        ["litro", "mililitro"].includes(u.value)
      );

    case "pieza":
      return UnidadMedida.filter((u) => ["unidad"].includes(u.value));

    default:
      return [];
  }
};
