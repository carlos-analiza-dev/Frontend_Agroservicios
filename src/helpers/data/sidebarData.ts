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
  Package,
  PackageOpen,
  ClipboardList,
  Warehouse,
  Droplet,
  FlaskConical,
  HousePlus,
  ShoppingBag,
  TicketPercent,
  UsersIcon,
  ChartColumnStacked,
  ChartNoAxesGantt,
  ShoppingBagIcon,
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
      { name: "Clientes", href: "/clientes-admin", icon: UsersIcon },
      { name: "Paises", href: "/paises-admin", icon: Globe },
      { name: "Departamentos", href: "/deptos-admin", icon: Locate },
      { name: "Sucursales", href: "/sucursales-admin", icon: HousePlus },
      {
        name: "Datos Empresa",
        href: "/datos-empresa",
        icon: ChartColumnStacked,
      },
      {
        name: "Rangos Factura",
        href: "/rangos-facturas",
        icon: ChartNoAxesGantt,
      },
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
      { name: "Insumos", href: "/insumos-admin", icon: FlaskConical },
      {
        name: "Veterinarios",
        href: "/veterinarios-admin",
        icon: BriefcaseMedical,
      },
      { name: "Roles", href: "/roles-admin", icon: UserCog },
    ],
  },
  {
    category: "Compras",
    items: [
      {
        name: "Productos",
        href: "/compras-productos-admin",
        icon: ShoppingBag,
      },
      {
        name: "Insumos",
        href: "/compras-insumos-admin",
        icon: TicketPercent,
      },
    ],
  },
  {
    category: "Inventarios",
    items: [
      /*  {
        name: "Insumos",
        href: "/insumos-inventario-admin",
        icon: ClipboardList,
      },
      {
        name: "Productos",
        href: "/productos-inventario-admin",
        icon: Package,
      }, */
      {
        name: "Existencias Productos",
        href: "/existencias-inventario-admin",
        icon: Warehouse,
      },
      {
        name: "Existencias Insumos",
        href: "/existencias-inventario-insumos-admin",
        icon: Warehouse,
      },
      {
        name: "Movimientos",
        href: "/movimientos-inventario-admin",
        icon: PackageOpen,
      },
    ],
  },
  {
    category: "Faltantes",
    items: [
      {
        name: "Productos",
        href: "/productos-faltantes-admin",
        icon: ShoppingBagIcon,
      },
      {
        name: "Insumos",
        href: "/insumos-faltantes-admin",
        icon: Warehouse,
      },
    ],
  },
  {
    category: "Facturacion",
    items: [
      {
        name: "Facturacion",
        href: "/facturacion-admin",
        icon: Warehouse,
      },
    ],
  },

  {
    category: "Impuestos",
    items: [
      { name: "Impuestos", href: "/impuestos-admin", icon: FileText },

      {
        name: "Descuentos Clientes",
        href: "/descuentos-clientes-admin",
        icon: FileText,
      },
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
