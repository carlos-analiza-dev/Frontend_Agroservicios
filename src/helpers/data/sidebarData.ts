import {
  Boxes,
  BriefcaseMedical,
  Building2,
  ChartBarStacked,
  FileText,
  Globe,
  Handbag,
  Layers3,
  LayoutDashboard,
  Locate,
  Settings,
  Tag,
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
      {
        name: "Servicios",
        href: "/servicios-admin",
        icon: ChartBarStacked,
      },
      {
        name: "Proveedores",
        href: "/proveedores-admin",
        icon: Building2,
      },
      {
        name: "Marcas",
        href: "/marcas-admin",
        icon: Tag,
      },
      { name: "Categorías", href: "/categorias-admin", icon: Layers3 },
      { name: "Sub categorías", href: "/sub-categorias-admin", icon: Boxes },
      { name: "Productos", href: "/productos-admin", icon: Handbag },
      {
        name: "Veterinarios",
        href: "/veterinarios-admin",
        icon: BriefcaseMedical,
      },
      { name: "Roles", href: "/roles-admin", icon: UserCog },
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
