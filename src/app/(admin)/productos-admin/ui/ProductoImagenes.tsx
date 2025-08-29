"use client";

import { ImageneProductos } from "@/apis/productos/interfaces/response-productos.interface";
import Image from "next/image";
import React, { useState } from "react";
import { ImageIcon, Plus, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SubirImagenProductos } from "@/apis/upload-images-products/accions/subir-imagen-producto";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { EliminarImagenProducto } from "@/apis/upload-images-products/accions/eliminar-imagen-producto";
import { Button } from "@/components/ui/button";

interface Props {
  imagenes?: ImageneProductos[];
  productoId: string;
  onUploadSuccess?: () => void;
}

type FormValues = {
  file: FileList;
};

const ProductoImagenes = ({ imagenes, productoId, onUploadSuccess }: Props) => {
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const { register, handleSubmit, reset, watch } = useForm<FormValues>();

  const fileWatch = watch("file");

  React.useEffect(() => {
    if (fileWatch && fileWatch.length > 0) {
      const file = fileWatch[0];
      const url = URL.createObjectURL(file);
      setPreview(url);

      return () => URL.revokeObjectURL(url);
    } else {
      setPreview(null);
    }
  }, [fileWatch]);

  const uploadMutation = useMutation({
    mutationFn: (formData: FormData) =>
      SubirImagenProductos(productoId, formData),
    onSuccess: () => {
      toast.success("Imagen del producto subida");
      queryClient.invalidateQueries({ queryKey: ["productos-admin"] });
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al subir la imagen";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de subir la imagen. Inténtalo de nuevo."
        );
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => EliminarImagenProducto(id),
    onSuccess: () => {
      toast.success("Imagen eliminada con éxito");
      queryClient.invalidateQueries({ queryKey: ["productos-admin"] });
      setIsDeleteDialogOpen(false);
      setImageToDelete(null);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al eliminar la imagen";

        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al momento de eliminar la imagen. Inténtalo de nuevo."
        );
      }
      setIsDeleteDialogOpen(false);
      setImageToDelete(null);
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (!data.file || data.file.length === 0) return;

    const formData = new FormData();
    formData.append("file", data.file[0]);

    try {
      uploadMutation.mutate(formData);

      if (onUploadSuccess) onUploadSuccess();
      reset();
      setPreview(null);
      setIsOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteClick = (id: string) => {
    setImageToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (imageToDelete) {
      deleteMutation.mutate(imageToDelete);
    }
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setImageToDelete(null);
  };

  return (
    <div className="relative flex justify-center">
      {imagenes && imagenes.length > 0 ? (
        <Carousel className="w-full max-w-xs">
          <CarouselContent>
            {imagenes.map((imagen, index) => (
              <CarouselItem key={imagen.id || index}>
                <div className="p-1 relative">
                  <Card>
                    <CardContent className="flex aspect-square items-center justify-center p-2 relative group">
                      <Image
                        src={imagen.url || "/placeholder.png"}
                        alt={`Imagen del producto ${index + 1}`}
                        width={150}
                        height={150}
                        className="w-full h-full object-cover rounded-md"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          e.currentTarget.parentElement!.innerHTML =
                            '<div class="w-full h-full flex items-center justify-center bg-muted">' +
                            '<ImageIcon class="h-10 w-10 text-muted-foreground" />' +
                            "</div>";
                        }}
                      />
                      <button
                        onClick={() => handleDeleteClick(imagen.id!)}
                        disabled={deleteMutation.isPending}
                        className="absolute top-0 right-0 bg-destructive text-destructive-foreground rounded-bl-md rounded-tr-md p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Eliminar imagen"
                      >
                        {deleteMutation.isPending &&
                        imageToDelete === imagen.id ? (
                          <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                        ) : (
                          <Trash2 size={10} />
                        )}
                      </button>
                    </CardContent>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      ) : (
        <div className="w-12 h-12 bg-muted rounded-md flex items-center justify-center">
          <ImageIcon className="h-6 w-6 text-muted-foreground" />
        </div>
      )}

      <div
        className="absolute -top-2 -right-2 bg-primary rounded-full p-1 cursor-pointer shadow z-10"
        onClick={() => setIsOpen(true)}
      >
        <Plus size={14} className="text-white" />
      </div>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <AlertDialogHeader>
              <AlertDialogTitle>Agregar Imagen</AlertDialogTitle>
              <AlertDialogDescription>
                Selecciona una imagen para este producto
              </AlertDialogDescription>
            </AlertDialogHeader>

            <input
              type="file"
              accept="image/*"
              {...register("file", { required: true })}
              className="mt-4"
            />

            {preview && (
              <div className="mt-4 flex justify-center">
                <Image
                  src={preview}
                  alt="Vista previa"
                  width={120}
                  height={120}
                  className="rounded-md border object-cover"
                />
              </div>
            )}

            <AlertDialogFooter>
              <AlertDialogCancel
                onClick={() => {
                  setPreview(null);
                  reset();
                }}
              >
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                type="submit"
                disabled={uploadMutation.isPending}
              >
                {uploadMutation.isPending ? "Subiendo..." : "Subir"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </form>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente la imagen del producto. No
              podrás deshacer esta acción.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelDelete}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Eliminando..." : "Eliminar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProductoImagenes;
