import { AreasTrabajo } from "@/apis/medicos/interfaces/obtener-medicos.interface";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

interface Props {
  areasMedico: [] | AreasTrabajo[];
}

const TableEspecialidadesMedico = ({ areasMedico }: Props) => {
  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-center justify-between">
          <CardTitle>Áreas de Trabajo</CardTitle>
          <div className="flex items-center text-sm text-muted-foreground">
            <Info className="mr-2 h-4 w-4" />
            {areasMedico.length} especialidades registradas
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead className="w-[120px]">Tipo</TableHead>
              <TableHead className="w-[100px]">Estado</TableHead>
              <TableHead className="w-[150px] text-right">
                Disponibilidad
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {areasMedico.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No hay especialidades registradas
                </TableCell>
              </TableRow>
            ) : (
              areasMedico.map((area) => (
                <TableRow key={area.id}>
                  <TableCell className="font-medium">{area.nombre}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {area.descripcion || "Sin descripción"}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{area.tipo}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={area.isActive ? "default" : "destructive"}>
                      {area.isActive ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={area.disponible ? "default" : "outline"}>
                      {area.disponible ? "Disponible" : "No disponible"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TableEspecialidadesMedico;
