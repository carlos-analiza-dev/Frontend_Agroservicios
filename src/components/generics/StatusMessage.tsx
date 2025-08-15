import { AlertCircle, Frown, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StatusMessageProps {
  type: "error" | "empty" | "loading";
  title?: string;
  message?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
}

export const StatusMessage = ({
  type,
  title,
  message,
  actionText,
  onAction,
  className = "",
}: StatusMessageProps) => {
  const config = {
    error: {
      icon: <AlertCircle className="h-12 w-12 text-red-500" />,
      defaultTitle: "Ocurrió un error",
      defaultMessage:
        "No se pudieron cargar los datos. Por favor intenta nuevamente.",
    },
    empty: {
      icon: <Frown className="h-12 w-12 text-yellow-500" />,
      defaultTitle: "Sin resultados",
      defaultMessage: "No se encontraron datos para mostrar.",
    },
    loading: {
      icon: <Loader2 className="h-12 w-12 animate-spin text-blue-500" />,
      defaultTitle: "Cargando...",
      defaultMessage: "Por favor espera mientras cargamos la información.",
    },
  };

  return (
    <div className="flex h-full items-center justify-center">
      <div
        className={`flex flex-col items-center justify-center p-8 ${className}`}
      >
        <div className="mb-4">{config[type].icon}</div>
        <h3 className="text-lg font-medium mb-2">
          {title || config[type].defaultTitle}
        </h3>
        <p className="text-muted-foreground text-center mb-4">
          {message || config[type].defaultMessage}
        </p>
        {onAction && actionText && (
          <Button variant="outline" onClick={onAction}>
            {actionText}
          </Button>
        )}
      </div>
    </div>
  );
};
