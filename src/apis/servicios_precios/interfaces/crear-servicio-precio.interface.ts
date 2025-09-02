export interface CrearServicePrecio {
  sub_servicio_id: string;
  paisId: string;
  precio: number;
  costo?: number;
  tiempo: number;
  cantidadMin: number;
  cantidadMax: number;
}

export interface ServicioPrecio extends CrearServicePrecio {
  id: string;
  pais: {
    id: string;
    nombre: string;
    simbolo_moneda: string;
  };
}

export interface PaisOption {
  value: string;
  label: string;
}
