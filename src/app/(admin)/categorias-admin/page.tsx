"use client";
import useGetCategorias from "@/hooks/categorias/useGetCategorias";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus } from "lucide-react";
import TitlePages from "@/components/generics/TitlePages";
import CardCategorias from "./ui/CardCategorias";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import FormCategorias from "./ui/FormCategorias";
import SkeletonCategorias from "@/components/generics/SkeletonCategorias";

const CategoriasPageAdmin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: categorias, isLoading } = useGetCategorias();

  if (isLoading) {
    return <SkeletonCategorias />;
  }

  return (
    <div className="p-3  mx-auto">
      <div className="flex justify-between items-center mb-8">
        <TitlePages title="Administrar Categorías" />
        <Button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Nueva Categoría
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categorias && categorias.length > 0 ? (
          categorias.map((categoria) => (
            <CardCategorias key={categoria.id} categoria={categoria} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-muted-foreground mb-4">
              No hay categorías registradas
            </div>
          </div>
        )}
      </div>
      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Agregar Categoria</AlertDialogTitle>
            <AlertDialogDescription>
              En esta seccion podras agrear nuevas categorias
            </AlertDialogDescription>
          </AlertDialogHeader>
          <FormCategorias onSucces={() => setIsOpen(false)} />
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CategoriasPageAdmin;
