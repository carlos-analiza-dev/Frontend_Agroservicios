"use client";
import TitlePages from "@/components/generics/TitlePages";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import React, { useState } from "react";
import FormCompraProductos from "./ui/FormCompraProductos";

const ComprasProductosPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mt-5">
        <TitlePages title="Gestión de Compras" />
        <div className="flex items-center gap-4">
          <Button onClick={() => setIsOpen(true)}>
            <Plus /> Agregar Compra
          </Button>
        </div>
      </div>

      <div className="mt-5">
        <div className="rounded-md border"></div>
      </div>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent className="p-4 md:max-w-4xl max-h-[600px] overflow-y-auto ">
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Agregar Nueva Compra</AlertDialogTitle>
            <AlertDialogDescription>
              En esta seccion ingresaras las compras de productos
            </AlertDialogDescription>
            <div>
              <FormCompraProductos />
            </div>
          </AlertDialogHeader>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ComprasProductosPage;
