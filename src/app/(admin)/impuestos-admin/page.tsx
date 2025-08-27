"use client";
import useGetTaxesPais from "@/hooks/impuestos/useGetTaxesPais";
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import TableUsersSkeleton from "@/components/generics/SkeletonTable";
import TableImpuestos from "./ui/TableImpuestos";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import FormImpuestos from "./ui/FormImpuestos";

const ImpuestosPaisAdmin = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: impuestos, isLoading, isError } = useGetTaxesPais();

  if (isLoading) {
    return <TableUsersSkeleton />;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Impuestos del País</CardTitle>
          <Button onClick={() => setIsOpen(true)}>
            <Plus />
            Agregar Impuesto
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <TableImpuestos impuestos={impuestos} />
      </CardContent>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Agregar Impuesto</AlertDialogTitle>
            <AlertDialogDescription>
              En esta seccion podras agregar los diferentes tipos de impuesto
            </AlertDialogDescription>
          </AlertDialogHeader>
          <FormImpuestos onSuccess={() => setIsOpen(false)} />
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default ImpuestosPaisAdmin;
