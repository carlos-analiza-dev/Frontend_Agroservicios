import React from "react";
import { Button } from "../ui/button";
import { LogOut, Menu, User } from "lucide-react";
import { navItems, navItemsVete } from "@/helpers/data/sidebarData";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/providers/store/useAuthStore";

interface Props {
  setMobileSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogout: () => Promise<void>;
}

const NavBar = ({ handleLogout, setMobileSidebarOpen }: Props) => {
  const { user } = useAuthStore();

  let menuItems = navItems;
  if (user?.role?.name === "Veterinario") {
    menuItems = navItemsVete;
  }
  const pathname = usePathname();

  return (
    <header className="flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      <div className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>
        <h2 className="ml-4 text-lg font-medium text-gray-900">
          {menuItems
            .flatMap((category) => category.items)
            .find((item) => item.href === pathname)?.name || "Dashboard"}
        </h2>
      </div>
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                {user && user?.profileImages?.length > 0 ? (
                  <AvatarImage
                    src={user.profileImages[0].url}
                    alt={`Perfil ${user.name}`}
                  />
                ) : (
                  <>
                    <AvatarImage src="/avatars/user.png" alt="Usuario" />
                    <AvatarFallback>
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.role.name}
                </p>
                <p className="text-xs leading-none text-gray-500">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default NavBar;
