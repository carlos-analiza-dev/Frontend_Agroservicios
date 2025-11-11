import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";

interface SessionExpiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SessionExpiredModal = ({
  isOpen,
  onClose,
}: SessionExpiredModalProps) => {
  const handleRedirectToLogin = () => {
    onClose();
    window.location.href = "/";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
            <DialogTitle>Sesión Expirada</DialogTitle>
          </div>
          <DialogDescription>
            Tu sesión ha expirado por seguridad. Por favor, inicia sesión
            nuevamente para continuar.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 mt-4">
          <Button onClick={handleRedirectToLogin} className="w-full">
            Ir a Iniciar Sesión
          </Button>
          <Button variant="outline" onClick={onClose} className="w-full">
            Cerrar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
