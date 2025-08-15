import { navItems } from "@/helpers/data/sidebarData";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { Separator } from "../ui/separator";
import { LogOut } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

interface Props {
  handleLogout: () => Promise<void>;
}

const SidebarAdmin = ({ handleLogout }: Props) => {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex w-64 flex-col border-r border-gray-200 bg-white">
        <div className="flex h-16 flex-shrink-0 items-center px-6">
          <h1 className="text-xl font-bold text-gray-900">AdminPanel</h1>
        </div>
        <div className="flex flex-1 flex-col overflow-y-auto">
          <nav className="flex-1 space-y-1 px-4 py-4">
            <Accordion type="multiple" className="w-full">
              {navItems.map((category) => (
                <AccordionItem
                  key={category.category}
                  value={category.category}
                  className="border-b-0"
                >
                  {category.items.length > 1 ? (
                    <>
                      <AccordionTrigger className="px-4 py-3 text-sm font-medium text-gray-600 hover:no-underline hover:bg-gray-50 hover:text-gray-900 rounded-lg">
                        <span className="flex items-center">
                          {/* Puedes añadir un icono para la categoría si lo deseas */}
                          {category.category}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pb-0">
                        <div className="space-y-1 pl-4">
                          {category.items.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                                pathname === item.href
                                  ? "bg-gray-100 text-gray-900"
                                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                              }`}
                            >
                              <item.icon className="mr-3 h-5 w-5" />
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </AccordionContent>
                    </>
                  ) : (
                    <Link
                      href={category.items[0].href}
                      className={`flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
                        pathname === category.items[0].href
                          ? "bg-gray-100 text-gray-900"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {category.items[0].name}
                    </Link>
                  )}
                </AccordionItem>
              ))}
            </Accordion>
          </nav>
          <div className="p-4">
            <Separator className="my-4" />
            <button
              onClick={handleLogout}
              className="flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SidebarAdmin;
