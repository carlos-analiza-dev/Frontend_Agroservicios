"use client";

import { StatusMessage } from "@/components/generics/StatusMessage";
import TitlePages from "@/components/generics/TitlePages";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import usePaises from "@/hooks/paises/usePaises";
import React, { useState } from "react";
import TablePaises from "./ui/TablePaises";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import FormCrearPais from "./ui/FormCrearPais";

const PaisesPage = () => {
  const { data: paises, isLoading, isError } = usePaises();
  const [open, setOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="mt-10 p-8">
        <Skeleton />
      </div>
    );
  }

  if (isError || paises?.data.length === 0) {
    return <StatusMessage type="error" />;
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mt-5">
        <TitlePages title="Gestión de Paises" />
        <AlertDialog open={open} onOpenChange={() => setOpen(!open)}>
          <AlertDialogTrigger asChild>
            <Button>Agregar +</Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="p-4 max-h-[600px] overflow-y-auto">
            <div className="flex justify-end">
              <AlertDialogCancel>X</AlertDialogCancel>
            </div>
            <AlertDialogHeader>
              <AlertDialogTitle>Agregar Pais</AlertDialogTitle>
              <AlertDialogDescription>
                En esta seccion podras agregar nuevos paises
              </AlertDialogDescription>
              <div>
                <FormCrearPais onSucces={() => setOpen(false)} />
              </div>
            </AlertDialogHeader>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="mt-5 flex justify-center">
        <div className="rounded-md border w-full">
          <TablePaises paises={paises?.data} />
        </div>
      </div>
    </div>
  );
};

export default PaisesPage;
