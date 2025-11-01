import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/helpers/funciones/formatCurrency";
import React from "react";

interface StatCardProps {
  title: string;
  value: number;
  currencySymbol: string;
  className?: string;
}

const CardIsvImportes = ({
  title,
  value,
  currencySymbol,
  className,
}: StatCardProps) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Gravado 15%</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {formatCurrency(value, currencySymbol)}
        </div>
      </CardContent>
    </Card>
  );
};

export default CardIsvImportes;
