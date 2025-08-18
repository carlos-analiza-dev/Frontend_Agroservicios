import { ResponseMunicipios } from "@/apis/municipios/interfaces/response-municipios.interface";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface Props {
  municipios: ResponseMunicipios | undefined;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const TableMunicipios = ({ municipios, onEdit, onDelete }: Props) => {
  if (!municipios || municipios.municipios.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
        No hay municipios registrados
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-[120px]">Estado</TableHead>
            <TableHead>Municipio</TableHead>
            <TableHead className="text-right w-[150px]">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {municipios.municipios.map((municipio) => (
            <TableRow key={municipio.id}>
              <TableCell>
                <Badge
                  variant={municipio.isActive ? "default" : "destructive"}
                  className="justify-center w-full"
                >
                  {municipio.isActive ? "Activo" : "Inactivo"}
                </Badge>
              </TableCell>
              <TableCell className="font-medium">{municipio.nombre}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(municipio.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(municipio.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableMunicipios;
