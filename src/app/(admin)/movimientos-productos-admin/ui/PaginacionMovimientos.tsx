"use client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import React from "react";

interface Props {
  paginaActual: number;
  setPaginaActual: React.Dispatch<React.SetStateAction<number>>;
  totalPaginas: number;
}

const PaginacionMovimientos = ({
  paginaActual,
  setPaginaActual,
  totalPaginas,
}: Props) => {
  const getPaginasVisibles = () => {
    const paginas: (number | string)[] = [];
    const maxVisible = 5;
    const mitad = Math.floor(maxVisible / 2);

    if (totalPaginas <= maxVisible + 2) {
      for (let i = 1; i <= totalPaginas; i++) paginas.push(i);
    } else {
      paginas.push(1);

      if (paginaActual > mitad + 2) paginas.push("...");

      const inicio = Math.max(2, paginaActual - mitad);
      const fin = Math.min(totalPaginas - 1, paginaActual + mitad);

      for (let i = inicio; i <= fin; i++) paginas.push(i);

      if (paginaActual < totalPaginas - (mitad + 1)) paginas.push("...");

      paginas.push(totalPaginas);
    }

    return paginas;
  };

  const paginas = getPaginasVisibles();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (paginaActual > 1) setPaginaActual(paginaActual - 1);
            }}
            className={
              paginaActual === 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {paginas.map((page, index) => (
          <PaginationItem key={index}>
            {page === "..." ? (
              <span className="px-3 text-gray-500 select-none">...</span>
            ) : (
              <PaginationLink
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setPaginaActual(page as number);
                }}
                isActive={page === paginaActual}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (paginaActual < totalPaginas)
                setPaginaActual(paginaActual + 1);
            }}
            className={
              paginaActual === totalPaginas
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default PaginacionMovimientos;
