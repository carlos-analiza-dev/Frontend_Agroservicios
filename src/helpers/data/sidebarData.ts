import {
  FileText,
  Globe,
  LayoutDashboard,
  Locate,
  LocateFixed,
  Microscope,
  Settings,
  UserCog,
  Users,
} from "lucide-react";

export const navItems = [
  {
    category: "Principal",
    items: [
      { name: "Dashboard", href: "/dashboard-admin", icon: LayoutDashboard },
    ],
  },
  {
    category: "Gestión",
    items: [
      { name: "Usuarios", href: "/users-admin", icon: Users },
      { name: "Paises", href: "/paises-admin", icon: Globe },
      { name: "Departamentos", href: "/deptos-admin", icon: Locate },

      { name: "Roles", href: "/roles-admin", icon: UserCog },
      { name: "Veterinarios", href: "/veterinarios-admin", icon: Microscope },
    ],
  },
  {
    category: "Administración",
    items: [
      { name: "Reportes", href: "/admin/reports", icon: FileText },
      { name: "Configuración", href: "/admin/settings", icon: Settings },
    ],
  },
];
