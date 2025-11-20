import { actualizarCliente } from "@/apis/clientes/accions/actualizar-cliente";
import { CreateCliente } from "@/apis/clientes/accions/crear-cliente";
import { CrearClienteInterface } from "@/apis/clientes/interfaces/crear-cliente.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { sexos } from "@/helpers/data/sexos";
import useGetClienteById from "@/hooks/clientes/useGetClienteById";
import useGetDepartamentosByPais from "@/hooks/departamentos/useGetDepartamentosByPais";
import useGetMunicipiosByDepto from "@/hooks/municipios/useGetMunicipiosByDepto";
import useGetPaisesActivos from "@/hooks/paises/useGetPaisesActivos";
import usePaisesById from "@/hooks/paises/usePaisesById";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface Props {
  clienteId?: string;
  onSuccess: () => void;
}

const FormClientes = ({ clienteId, onSuccess }: Props) => {
  const [prefijoNumber, setPrefijoNumber] = useState("");
  const { data: cliente } = useGetClienteById(clienteId ?? "");

  const queryClient = useQueryClient();
  const [codigoPais, setCodigoPais] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<CrearClienteInterface>();

  useEffect(() => {
    if (cliente?.data) {
      const extractTelefonoNumber = (telefono: string | undefined): string => {
        if (!telefono) return "";

        const parts = telefono.split(" ");
        return parts.length > 1 ? parts[1] : telefono;
      };

      reset({
        email: cliente.data.email || "",
        nombre: cliente.data.nombre || "",
        identificacion: cliente.data.identificacion || "",
        direccion: cliente.data.direccion || "",
        telefono: extractTelefonoNumber(cliente.data.telefono),
        pais: cliente.data.pais?.id || "",
        sexo: cliente.data.sexo || "",
        departamento: cliente.data.departamento?.id || "",
        municipio: cliente.data.municipio?.id || "",
        isActive: cliente.data.isActive ?? true,
      });

      setCodigoPais(cliente.data.pais?.code || "");
      setPrefijoNumber(cliente.data.pais?.code_phone || "");

      if (cliente.data.departamento?.id) {
        setValue("departamento", cliente.data.departamento.id, {
          shouldValidate: true,
        });
      }

      if (cliente.data.municipio?.id) {
        setValue("municipio", cliente.data.municipio.id, {
          shouldValidate: true,
        });
      }
    }
  }, [cliente, reset, setValue]);

  const ID_REGEX = {
    HN: {
      regex: /^\d{4}-\d{4}-\d{5}$/,
      message: "Formato inválido. Use: xxxx-xxxx-xxxxx",
      example: "Ejemplo: 0801-1999-01234",
    },
    SV: {
      regex: /^\d{8}-\d{1}$/,
      message: "Formato inválido. Use: xxxxxxxx-x",
      example: "Ejemplo: 04210000-5",
    },
    GT: {
      regex: /^\d{4}-\d{5}-\d{4}$/,
      message: "Formato inválido. Use: xxxx-xxxxx-xxxx",
      example: "Ejemplo: 1234-56789-0123",
    },
    PASSPORT: {
      regex: /^[A-Za-z0-9]{6,20}$/,
      message: "Formato inválido. Use 6-20 caracteres alfanuméricos",
      example: "Ejemplo: AB123456",
    },
  };

  const { data: paises } = useGetPaisesActivos();
  const paisId = watch("pais");
  const { data: departamentos } = useGetDepartamentosByPais(paisId);
  const departamentoId = watch("departamento");
  const { data: municipios } = useGetMunicipiosByDepto(departamentoId);
  const { data: pais } = usePaisesById(paisId);

  useEffect(() => {
    if (pais?.data) {
      setCodigoPais(pais.data.code);
      setPrefijoNumber(pais.data.code_phone);
    }
  }, [pais]);

  const validateIdentification = (value: string, codigoPais: string) => {
    if (!value) return "La identificación es requerida";

    switch (codigoPais) {
      case "HN":
        return ID_REGEX.HN.regex.test(value) || ID_REGEX.HN.message;
      case "SV":
        return ID_REGEX.SV.regex.test(value) || ID_REGEX.SV.message;
      case "GT":
        return ID_REGEX.GT.regex.test(value) || ID_REGEX.GT.message;
      default:
        return true;
    }
  };

  const mutation = useMutation({
    mutationFn: CreateCliente,
    onSuccess: () => {
      toast.success("Cliente creado correctamente");
      reset({
        email: "",
        password: "",
        nombre: "",
        identificacion: "",
        direccion: "",
        telefono: "",
        pais: "",
        departamento: "",
        municipio: "",
        sexo: "",
      });
      queryClient.invalidateQueries({ queryKey: ["clientes-admin"] });
      queryClient.invalidateQueries({ queryKey: ["cliente"] });
      onSuccess();
      setCodigoPais("");
      setPrefijoNumber("");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al crear el cliente";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de crear el cliente. Inténtalo de nuevo."
        );
      }
    },
  });

  const mutationUpdate = useMutation({
    mutationFn: (data: CrearClienteInterface) =>
      actualizarCliente(clienteId!, {
        ...data,
        telefono: `${prefijoNumber} ${data.telefono}`,
      }),
    onSuccess: () => {
      toast.success("Cliente actualizado correctamente");
      queryClient.invalidateQueries({ queryKey: ["clientes-admin"] });
      queryClient.invalidateQueries({ queryKey: ["cliente"] });
      onSuccess();
    },

    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al actualizar el cliente";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de actualizar el cliente. Inténtalo de nuevo."
        );
      }
    },
  });

  const validateEmail = (email: string) => {
    const re =
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
    return re.test(email) || "El correo electrónico no tiene formato adecuado";
  };

  const validatePassword = (password: string) => {
    const re = /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/;
    return (
      re.test(password) ||
      "La contraseña debe tener entre 8 y 16 caracteres, al menos un dígito, una minúscula y una mayúscula"
    );
  };

  const onSubmit = (data: CrearClienteInterface) => {
    if (clienteId) {
      mutationUpdate.mutate(data);
    } else {
      const telefonoConPrefijo = `${prefijoNumber} ${data.telefono}`;
      const payload: CrearClienteInterface = {
        ...data,
        telefono: telefonoConPrefijo,
      };

      mutation.mutate(payload);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Correo Electrónico*</Label>
          <Input
            id="email"
            type="email"
            placeholder="tu@correo.com"
            {...register("email", {
              required: "El correo es requerido",
              validate: validateEmail,
            })}
          />
          {errors.email && (
            <p className="text-sm font-medium text-red-500">
              {errors.email.message as string}
            </p>
          )}
        </div>

        {!clienteId && (
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña*</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                {...register("password", {
                  required: "La contraseña es requerida",
                  validate: validatePassword,
                })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-sm font-medium text-red-500">
                {errors.password.message as string}
              </p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="nombre">Nombre Completo*</Label>
          <Input
            id="nombre"
            placeholder="Juan Pérez"
            {...register("nombre", {
              required: "El nombre es requerido",
              minLength: {
                value: 3,
                message: "El nombre debe tener al menos 3 caracteres",
              },
            })}
          />
          {errors.nombre && (
            <p className="text-sm font-medium text-red-500">
              {errors.nombre.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="pais">País*</Label>
          <Select
            value={watch("pais")}
            onValueChange={(value) => {
              setValue("pais", value);
              setValue("departamento", "");
              setValue("municipio", "");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un país" />
            </SelectTrigger>
            <SelectContent>
              {paises?.data.map((pais) => (
                <SelectItem key={pais.id} value={pais.id}>
                  {pais.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.pais && (
            <p className="text-sm font-medium text-red-500">
              {errors.pais.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="departamento">Departamento*</Label>
          <Select
            value={watch("departamento") || cliente?.data?.departamento?.id}
            onValueChange={(value) => {
              setValue("departamento", value);
              setValue("municipio", "");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un departamento" />
            </SelectTrigger>
            <SelectContent>
              {departamentos &&
              departamentos?.data?.departamentos?.length > 0 ? (
                departamentos.data.departamentos.map((depto) => (
                  <SelectItem key={depto.id} value={depto.id}>
                    {depto.nombre}
                  </SelectItem>
                ))
              ) : (
                <div className="px-2 py-1.5 text-sm text-gray-500 text-center">
                  No hay departamentos disponibles
                </div>
              )}
            </SelectContent>
          </Select>
          {errors.departamento && (
            <p className="text-sm font-medium text-red-500">
              {errors.departamento.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="municipio">Municipio*</Label>
          <Select
            value={watch("municipio") || cliente?.data?.municipio?.id}
            onValueChange={(value) => {
              setValue("municipio", value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un municipio" />
            </SelectTrigger>
            <SelectContent>
              {municipios && municipios?.data?.municipios?.length > 0 ? (
                municipios.data.municipios.map((mun) => (
                  <SelectItem key={mun.id} value={mun.id}>
                    {mun.nombre}
                  </SelectItem>
                ))
              ) : (
                <div className="px-2 py-1.5 text-sm text-gray-500 text-center">
                  No hay municipios disponibles
                </div>
              )}
            </SelectContent>
          </Select>
          {errors.municipio && (
            <p className="text-sm font-medium text-red-500">
              {errors.municipio.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="identificacion">Identificación*</Label>
          <Input
            id="identificacion"
            placeholder="Número de documento"
            {...register("identificacion", {
              required: "La identificación es requerida",
              validate: (value) => validateIdentification(value, codigoPais),
            })}
          />
          {errors.identificacion && (
            <p className="text-sm font-medium text-red-500">
              {errors.identificacion.message as string}
              {codigoPais &&
                ID_REGEX[codigoPais as keyof typeof ID_REGEX]?.example && (
                  <span className="block text-xs text-gray-500">
                    {ID_REGEX[codigoPais as keyof typeof ID_REGEX]?.example}
                  </span>
                )}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="direccion">Dirección*</Label>
          <Input
            id="direccion"
            placeholder="Calle 123 # 45-67"
            {...register("direccion", {
              required: "La dirección es requerida",
              minLength: {
                value: 10,
                message: "La dirección debe tener al menos 10 caracteres",
              },
            })}
          />
          {errors.direccion && (
            <p className="text-sm font-medium text-red-500">
              {errors.direccion.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="telefono">Teléfono*</Label>
          <Input
            id="telefono"
            placeholder="0000-0000"
            {...register("telefono", {
              required: "El teléfono es requerido",
              pattern: {
                value: /^\d{4}-\d{4}$/,
                message: "El formato debe ser xxxx-xxxx",
              },
            })}
          />

          {errors.telefono && (
            <p className="text-sm font-medium text-red-500">
              {errors.telefono.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="sexo">Sexo*</Label>
          <Select
            onValueChange={(value) => {
              setValue("sexo", value);
            }}
            value={watch("sexo")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una opción" />
            </SelectTrigger>
            <SelectContent>
              {sexos.map((sexo) => (
                <SelectItem key={sexo.id} value={sexo.value}>
                  {sexo.sexo}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.sexo && (
            <p className="text-sm font-medium text-red-500">
              {errors.sexo.message as string}
            </p>
          )}
        </div>

        {clienteId && (
          <div className="space-y-2">
            <Label htmlFor="isActive">Estado</Label>
            <Select
              onValueChange={(value) => {
                setValue("isActive", value === "true");
              }}
              value={watch("isActive")?.toString() || "true"}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="true">Activo</SelectItem>
                <SelectItem value="false">Inactivo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <Button type="submit">
          {clienteId ? "Editar Cliente" : "Crear Cliente"}
        </Button>
      </div>
    </form>
  );
};

export default FormClientes;
